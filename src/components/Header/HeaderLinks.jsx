/*eslint-disable*/
import React, { Fragment } from "react";
// react components for routing our app without refresh
import { Link, Redirect } from "react-router-dom";
import impoHOC from "HoC/impoHOC.js";
 

// core components 
import Button from "components/CustomButtons/Button.jsx";

import headerLinksStyle from "assets/jss/material-kit-react/components/headerLinksStyle.jsx";
 
// Utils
import auth from 'utils/auth';
import utils from 'utils/utils';
import DAL from "utils/DataAccess/DALimpotx";
import translatedTxt from 'texts/localization';  

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

function isUser() {
  // console.log(auth.getUserInfo());
  return auth.getToken() && !auth.isAdmin();
  //return auth.getToken() && !auth.getUserInfo().role.name.match(/(Administrator|Comptable)/i);
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
      auth.showToast(translatedTxt.toastBye, null, "info");
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
          {auth.getToken() ? translatedTxt.headLogout : translatedTxt.headLogin}
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
            <Link to="/find-user-page"
              className={classes.navLink}
              style={{ textDecoration: 'none' }}>
              {translatedTxt.headFindUser}
            </Link>
          </ListItem>)}

        {isUser() && (
          <ListItem className={classes.listItem}>
            <Link to="/user-profile-page"
              className={classes.navLink}
              style={{ textDecoration: 'none' }}>
              {translatedTxt.headmonProfile}
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

export default (HeaderLinks);
