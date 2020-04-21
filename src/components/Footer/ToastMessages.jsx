/*eslint-disable*/
import React, { Fragment } from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// nodejs library that concatenates classes
import classNames from "classnames";
import { List, ListItem, withStyles, Button, IconButton } from "@material-ui/core";
import { Check, Warning } from "@material-ui/icons";

import CloseIcon from '@material-ui/icons/Close';

import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from "components/Snackbar/SnackbarContent.jsx";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';


// @material-ui/icons
//import Favorite from "@material-ui/icons/Favorite";

import toastStyle from "assets/jss/material-kit-react/components/toastStyle.jsx";

import debounce from "lodash.debounce";

import uuidv4 from 'uuid/v4';

import auth from 'utils/auth';
import impoTxt from 'texts/localization';
import utils from "utils/utils";

const iconPerType = {
  "success": Check,
  "danger": Warning
};

const themeAnchor = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  overrides: {
    MuiSnackbar: {
      anchorOriginBottomRight: {
        bottom: 1,
        right: 1,

        "@media (min-width: 960px)": {
          right: 2,
          bottom: 2
        }
      }
    }
  },
  
  info: {
    backgroundColor: "#aa0",
  },
});


/////////////TODO : Have 2 toasts that alternate to make messages in a queue alternate smoothly?
class ToastMessages extends React.Component {

  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      toast: null,
      text: "",
      type: "success", // danger, success, info?, ....
      open: false,
      startTime: 0,
      id: ""
    };

    this.handleClose = this.handleClose.bind(this);
    this.getIcon = this.getIcon.bind(this);
    this.tick = this.tick.bind(this);
    this.getTime = this.getTime.bind(this);
    this.debouncedNewToast = this.debouncedNewToast.bind(this);
  }


  componentWillMount() { 

    this.timerID = setInterval(
      () => this.tick(),
      200
    );

    var toast = auth.getToast();
    if (toast && toast.length > 0 && toast.id != this.state.toast.id) {
      this.setState({
        toast: toast,
        open: true,
        startTime: Date.now()
      });
    }
    else if (this.state.open) {
      this.setState(
        {
          toast: null,
          open: false
        });
    }
  }

  tick() {

    var toast = auth.getToast();
    var prevToast = this.state.toast;

    if (toast && (prevToast == null || toast.id != prevToast.id)) {
     // if (prevToast) console.log("There was a Toast and it has changed : " + prevToast.id + " to " + toast.id);
     this.debouncedNewToast(toast);
    } 

  }
  
  debouncedNewToast = debounce((newToast) => {
    this.setState({
      open: true,
      toast: newToast,
      startTime: Date.now()
    });
    utils.log("Open Toast : " + newToast.id);
  }, 500, { leading: true, trailing: true })

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  handleClose(event, reason) {
    if (reason === 'clickaway') return;

    utils.log("Close Toast : " + this.state.toast.id);
    auth.removeToast(this.state.toast.id);
    if (this.state.open)
      this.setState({ open: false });
  }

  getIcon() {
    if (this.state.toast && this.state.toast.type in iconPerType)
      return iconPerType[this.state.toast.type];
    else
      return null
  }

  getRemainingMessages() {
    var allToasts = auth.getAllToasts().length - 1;
    if (allToasts > 0)
      return <div className={this.props.classes.msgCount}>{allToasts} {impoTxt.toastMsgComming}</div>;
    else
      return null;
  }

  getTime() {
    if (this.state.toast && this.state.toast.time)
      return this.state.toast.time;
    else
      return 2000;
  }

  render() {
    const { classes, whiteFont } = this.props;

    var text = "";
    var id = uuidv4();
    var type = "primary";

    if (this.state.toast) {
      text = this.state.toast.text;
      id = this.state.toast.id;
      type = this.state.toast.type;
    }
   // console.log("rendering Snack : " + id);
    //onClose={this.handleClose}
    return (
      <MuiThemeProvider theme={themeAnchor}>
        <Snackbar
          key={id}
          className={classes.toastDiv}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          open={this.state.open}
          autoHideDuration={this.getTime()}
          onClose={this.handleClose}
          onExited={this.handleClose}
        >
          <SnackbarContent
            message={
              <Fragment>
                {this.getRemainingMessages()}
                <p className={classes.messageText}>
                  {
                    text //+ " (id : " + id + " )"
                  }
                </p>
                <Button className={classes.closeBtn}
                  onClick={(ev) => this.handleClose(null, "closeBtn")}>
                  <CloseIcon />
                </Button>
              </Fragment>
            }
            color={type}
            icon={this.getIcon()}
          />
        </Snackbar>
      </MuiThemeProvider>
    );
  }
}

/*ToastMessages.propTypes = {
  classes: PropTypes.object.isRequired,
  whiteFont: PropTypes.bool
};*/

export default withStyles(toastStyle)(ToastMessages);