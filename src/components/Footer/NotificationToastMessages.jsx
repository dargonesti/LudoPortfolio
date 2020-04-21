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

import SecuredPagesRedirect from "components/SecuredPagesRedirect/SecuredPagesRedirect.jsx";

import uuidv4 from 'uuid/v4';

import debounce from "lodash.debounce";

import auth from 'utils/auth';
import utils from "utils/utils";
import impoTxt from 'texts/localization';
import DAL from "utils/DataAccess/DALimpotx";
import localData from "utils/DataAccess/localData";

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
});

/////////////TODO : Have 2 toasts that alternate to make messages in a queue alternate smoothly?
class NotificationToastMessages extends React.Component {

  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      toast: null,
      text: "",
      type: "success", // danger, success, info?, ....
      open: auth.isAdmin(),
      startTime: 0,
      id: "",
      alreadyPrompted: false
    };

    ["handleClose", "handleYes", "handleNo", "onNeedPrompt", "onHasAnswer",
      "onRepAdded", "onDocAdded", "onMsgAdded", "permissionChanged",
      "promptNotificationsDebounded"]
      .forEach((fnName => {
        this[fnName] = this[fnName].bind(this)
      }).bind(this));
  }

  permissionChanged(ev) {
    utils.log("Permission changed for Notifications");
    utils.log(ev);
  }

  onNeedPrompt() {
    utils.addListener("repAdded", "NotifToast", this.onRepAdded);
    utils.addListener("docAdded", "NotifToast", this.onDocAdded);
    utils.addListener("msgAdded", "NotifToast", this.onMsgAdded);
  }

  onHasAnswer() {
    this.setState({ alreadyPrompted: true });
  }

  onRepAdded() {
    if (auth.getUserInfo().reponses.length >= 17 && utils.lateEnoughAfterNo()) {
      this.promptNotificationsDebounded("rep");
    }
  }
  onDocAdded() {
    if (auth.getUserInfo().files.length >= 5 && utils.lateEnoughAfterNo()) {
      this.promptNotificationsDebounded("doc");
    }
  }
  onMsgAdded() {
    if (utils.lateEnoughAfterNo()) {
      this.promptNotificationsDebounded("message");
    }
  }

  promptNotificationsDebounded = debounce((value) => {
    if (this.myMounted) {
      this.setState({ open: value });
    }
  }, 5000, { leading: false, trailing: true })


  componentWillMount() {
    this.myMounted = true;

    if (utils.lateEnoughAfterNo()) {
      registerPermissionChange(this.permissionChanged);

      utils.testPermission(this.onNeedPrompt, this.onHasAnswer, this.onHasAnswer);
    }
    else {
      utils.log("did not register notifs because last said no = " + localData.getStorage("saidNoNotif"));
    }
  }

  componentWillUnmount() {
    this.myMounted = false;
    registerPermissionChange(null);
    utils.removeListener("repAdded", "NotifToast");
    utils.removeListener("docAdded", "NotifToast");
    utils.removeListener("msgAdded", "NotifToast");
  }

  handleClose(event, reason) {
    if (reason === 'clickaway') return;

    if (this.state.toast)
      auth.removeToast(this.state.toast.id);
    if (this.state.open)
      this.setState({ open: false });
  }

  handleNo(event, reason) {
    if (reason === 'clickaway') return;

    auth.showToast(impoTxt.toastSaidNoNotifs);

    localData.setStorage("saidNoNotif", Date.now());

    if (this.state.open)
      this.setState({ open: false });
  }

  handleYes(event, reason) {
    if (reason === 'clickaway') return;

    auth.showToast(impoTxt.toastSaidYesNotifs);

    if (this.state.open)
      this.setState({ open: false });
    const publicVapidKey = "BJthRQ5myDgc7OSXzPCMftGw-n16F7zQBEN7EUD6XxcfTTvrLGWSIG7y_JxiWtVlCFua0S8MTB5rPziBqNx1qIo";
    //TODO : User Process env
    utils.log("Registering service worker...");
    if (navigator &&
      navigator.serviceWorker &&
      navigator.serviceWorker.ready) {
      navigator.serviceWorker
        /*  .register("/worker.js", {
              scope: "/"
          })*/
        .ready
        .then(register => {
          utils.log("Service Worker Registered...");

          // Register Push
          utils.log("Registering Push...");
          register.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: utils.urlBase64ToUint8Array(publicVapidKey)
          })
            .then(subscription => {

              utils.log("Push Registered... with obj = ");
              utils.log(subscription);

              utils.log("Now registering to Strapi");
              DAL.registerPush(subscription);
            });

        });
    } else {
      utils.log("Service worker not in the right state");
    }
  }


  render() {
    if (this.state.alreadyPrompted || !open) return null;

    const { classes, whiteFont } = this.props;
    var text = "";

    if (this.state.open === "message") {
      text = impoTxt.toastNotificationProcess;
    } else if (this.state.open === "rep") {
      text = impoTxt.toastNotificationRep
    } else if (this.state.open === "doc") {
      text = impoTxt.toastNotificationProcess;
    }

    return (
      <MuiThemeProvider theme={themeAnchor}>
        <Snackbar
          key={uuidv4()}
          className={classes.toastDiv}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={this.state.open ? true : false}
          autoHideDuration={30000}
          onClose={this.handleClose}
          onExited={this.handleClose}
        >
          <SnackbarContent
            message={
              <Fragment>
                <p className={classes.messageText}>
                  {
                    text
                  }
                </p>

                <Button className={classes.YesButton}
                  onClick={(ev) => this.handleNo()}>
                  {impoTxt.Non}
                </Button>

                <Button className={classes.YesButton}
                  onClick={(ev) => this.handleYes()}>
                  {impoTxt.Oui}
                </Button>
              </Fragment>
            }
            color="primary"
          />
        </Snackbar>
      </MuiThemeProvider>
    );
  }
}

function registerPermissionChange(cbOnChange) {
  if (navigator &&
    navigator.permissions &&
    navigator.permissions.query)
    navigator.permissions
      .query({ name: "notifications" })
      .then(res => {
        res.onChange = cbOnChange;
      });
}

export default withStyles(toastStyle)(NotificationToastMessages);