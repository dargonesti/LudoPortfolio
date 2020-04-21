/*eslint-disable*/
import React, { Fragment } from "react";
// react components for routing our app without refresh
import { Link, Redirect } from "react-router-dom";
import impoHOC from "HoC/impoHOC.js";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Tooltip from "@material-ui/core/Tooltip";

import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent"; 

// @material-ui/icons
import { CloudDownload, Notifications} from "@material-ui/icons";
import People from "@material-ui/icons/People";

// core components
import CustomDropdown from "components/CustomDropdown/CustomDropdown.jsx";
import Button from "components/CustomButtons/Button.jsx";

import headerLinksStyle from "assets/jss/material-kit-react/components/headerLinksStyle.jsx";

import LoginForm from "views/LoginPage/LoginForm.jsx";
import NotifPopover from "views/Messages/NotifPopover.jsx";
import NotificationBadge from 'react-notification-badge';

// Utils
import auth from 'utils/auth';
import utils from 'utils/utils';
import DAL from "utils/DataAccess/DALimpotx";
import impoTxt from 'texts/localization';
import {getRecentChatNotifications} from "utils/chatSocket.js";
import { values, keys, map, filter, compose } from "rambda";

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

function isUser() {
  // console.log(auth.getUserInfo());
  return auth.getToken() && !auth.isAdmin();
  //return auth.getToken() && !auth.getUserInfo().role.name.match(/(Administrator|Comptable)/i);
}

class NotificationMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notifCount: 0,
      notifOpen: false,
      notifications: []
    };
  }

   componentDidMount() {
    DAL.getFormatedNotifications()
    .then(res=>{this.setState({
      notifCount: auth.isAdmin() ? res.userCount : res.count, 
      notifications: res.notifs})});
  }

  handleClose(modal) {
    var x = [];
    x[modal] = false;
    this.setState(x);
  }

  render() {
    const { classes } = this.props;
    var {notifCount,notifications, notifOpen} = this.state;

    return (<Fragment>
      <Button
        disabled={notifCount <= 0}
        color="transparent"
        target="_blank"
        className={classes.navLink}
        onClick={() => {
          this.setState({ notifOpen: !this.state.notifOpen })
        }}
      >
        <Notifications />

      </Button>
      <NotifPopover notifications={notifications} open={notifOpen} onClose={this.handleClose.bind(this)} />
      {this.state.notifCount > 0 &&
        <NotificationBadge count={notifCount}
          // top={-45} 
          //effect={Effect.SCALE}
          effect={[null, null, { top: '-44px', right: "5px" }, {}]}
          frameLength={45.0} />}
    </Fragment>)
  }
}

class HeaderLinks extends React.Component {
  constructor(props) {
    super(props);

    // const { classes } = props;

    this.state = {
      classicModal: false,
      redirect: null,
      notifOpen: false,
      notifCount: 1,
      usersOnline: 0,
      chatNotifs: getRecentChatNotifications()
    };

    this.getLoginModal = this.getLoginModal.bind(this);
    this.renderRedirects = this.renderRedirects.bind(this);
  }

  handleClickOpen(modal) {
    if (auth.getToken()) {
      utils.callEvent("Logout");
      auth.clearAppStorage();
      var loc = this.props.Location || this.props.location || window.location.href;
      loc = loc.split(".com").pop().split(":3000").pop();
      if (loc.length > 1) {
        this.setState({ redirect: "/" });
      }
      else {
        if(this.props.onLogout)
          {
            utils.callEvent("Logout");
            this.props.onLogout();
          }
      }
      auth.showToast(impoTxt.toastBye, null, "info");
    } else {
      var x = [];
      x[modal] = true;
      this.setState(x);
    }
  }

  handleClose(modal) {
    var x = [];
    x[modal] = false;
    this.setState(x);
  }

  handleCloseModal() {
    if (!this._isClosing) {
      this.setState({ classicModal: false });
    }
  }
  componentDidMount(){
    utils.addListener("userSentMessage", "headerLinks", ()=>{
      this.setState({chatNotifs:getRecentChatNotifications()});
    });
  }
  componentWillUnmount() {
    this._isClosing = true;
    utils.removeListener("userSentMessage", "headerLinks");
  }

  renderRedirects() {
    if (this.state.redirectTarget) {
      return <Redirect to={"/" + this.state.redirectTarget} />;
    }
    return null;
  }

  getLoginModal(classes) {
    return (
      <div>
        {this.renderRedirects()}
        <Button
          color="primary"
          block
          onClick={() => this.handleClickOpen("classicModal")}
        >
          <People />
          {auth.getToken() ? impoTxt.headLogout : impoTxt.headLogin}
        </Button>
        <Dialog
          classes={{
            root: classes.center,
            paper: classes.modal
          }}
          open={this.state.classicModal}
          TransitionComponent={Transition}
          keepMounted
          onClose={() => this.handleClose("classicModal")}
          aria-labelledby="classic-modal-slide-title"
          aria-describedby="classic-modal-slide-description"
        >

          <DialogContent
            id="classic-modal-slide-description"
            className={classes.modalBody}
          >
            <LoginForm isOpen={this.state.classicModal} onClose={this.handleCloseModal} />
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  render() {
    const { classes } = this.props;
    if (this.state.redirect) return <Redirect to={this.state.redirect} />;

    var isDev =  /^dev.*/gi.test(process.env.NODE_ENV);
    var styleDisableTwitter = isDev ? {} : { pointerEvents: 'none', color:"#aaa" };
    
    utils.log(styleDisableTwitter);
    
    return (
      <List className={classes.list}>

       {/* } <ListItem className={classes.listItem}>

          <CustomDropdown
            noLiPadding
            buttonText="Download App"
            buttonProps={{
              className: classes.navLink,
              color: "transparent"
            }}
            buttonIcon={CloudDownload}
            dropdownList={[
              <Link to="/component-page" className={classes.dropdownLink}
                style={{ textDecoration: 'none' }}
                onClick={(e) => {
                  alert("Page et app Android en construction.");
                  //Todo : Ouvrir light box pour choix Android ou ios
                  e.preventDefault();
                }}>
                Android
              </Link>,
              <a
                href="https://creativetimofficial.github.io/material-kit-react/#/documentation"
                target="_blank"
                className={classes.dropdownLink}
                onClick={(e) => {
                  alert("Page et app Android en construction.");
                  //Todo : Ouvrir light box pour choix Android ou ios
                  e.preventDefault();
                }}
              >
                ios
              </a>
            ]}
          />
          </ListItem> */}

        {(isUser() && utils.isDocsActive())&& (
          <ListItem className={classes.listItem}>
            <Link to="/docs-page"
              className={classes.navLink}
              style={{ textDecoration: 'none' }}>
              Documents
            </Link>
          </ListItem>)}

        {isUser() && (
          <ListItem className={classes.listItem}>
            <Link to="/questions-page"
              className={classes.navLink}
              style={{ textDecoration: 'none' }}>
              Questions
            </Link>
          </ListItem>)}

        {auth.isAdmin() && (
          <ListItem className={classes.listItem}>
            <Link to="/push-notification-page"
              className={classes.navLink}
              style={{ textDecoration: 'none' }}>
              {impoTxt.headPushNotification}
            </Link>
          </ListItem>)}
        {auth.isAdmin() && (
          <ListItem className={classes.listItem}>
            <Link to="/chat-page"
              className={classes.navLink}
              style={{ textDecoration: 'none' }}>
              {impoTxt.chatHead}
            </Link>  
        <NotificationBadge count={keys(this.state.chatNotifs).length}
          // top={-45} 
          //effect={Effect.SCALE}
          effect={[null, null, { top: '-44px', right: "5px" }, {}]}
          frameLength={45.0} />
        
          </ListItem>    
          )}

        {auth.isAdmin() && (
          <ListItem className={classes.listItem}>
            <Link to="/find-user-page"
              className={classes.navLink}
              style={{ textDecoration: 'none' }}>
              {impoTxt.headFindUser}
            </Link>
          </ListItem>)}

        {isUser() && (
          <ListItem className={classes.listItem}>
            <Link to="/user-profile-page"
              className={classes.navLink}
              style={{ textDecoration: 'none' }}>
              {impoTxt.headmonProfile}
            </Link>
          </ListItem>)}

        <ListItem className={classes.listItem}>
          {this.getLoginModal(classes)}
        </ListItem>

{isDev && 
        <ListItem className={classes.listItem}>
          <Tooltip
            id="instagram-twitter"
            title="Follow us on twitter"
            placement={window.innerWidth > 959 ? "top" : "left"}
            classes={{ tooltip: classes.tooltip }}
          >
            <Link
              to="/component-page"
              color="transparent"
              className={classes.navLink}
              aria-label="tweeter"
              style={styleDisableTwitter}
            >
              <i className={classes.socialIcons + " fab fa-twitter"} />
            </Link>
          </Tooltip>
        </ListItem>}
        {auth.getUserInfo() && (
          <Fragment>
            <ListItem className={classes.listItem}>
              <Tooltip
                id="notification-tooltip"
                title="Notifications"
                placement={window.innerWidth > 959 ? "top" : "left"}
                classes={{ tooltip: classes.tooltip }}
              >
                <NotificationMenu classes={classes} />
              </Tooltip>
            </ListItem>
          </Fragment>
        )}
        {isDev && 
        <ListItem className={classes.listItem}>
          <Tooltip
            id="instagram-facebook"
            title="Follow us on facebook"
            placement={window.innerWidth > 959 ? "top" : "left"}
            classes={{ tooltip: classes.tooltip }}
          >
            <Button
              color="transparent"
              href="https://www.facebook.com/CreativeTim"
              target="_blank"
              className={classes.navLink}
              disabled
              aria-label="Facebook"
            >
              <i className={classes.socialIcons + " fab fa-facebook"} />
            </Button>
          </Tooltip>
        </ListItem>}
      </List>
    );
  }

}

export default withStyles(headerLinksStyle)(HeaderLinks);
