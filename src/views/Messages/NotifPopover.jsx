import React, { Fragment, useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import impoHOC from "HoC/impoHOC.js";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";

// core components  
import { Popover, withWidth } from '@material-ui/core';

import { OpenInNew, } from "@material-ui/icons";
import DAL from "utils/DataAccess/DALimpotx.js";
import auth from "utils/auth.js";
import utils from "utils/utils.js";
import impoTxt from 'texts/localization';
import localData from "utils/DataAccess/localData";
import { values, map, filter, compose } from "rambda";

import messagesPageStyle from "assets/jss/material-kit-react/views/messagesPage.jsx";

import 'react-block-ui/style.css';

const mapComp = compose(values, map);

const NotifPopover = ({ classes, setRedirect, open, onClose }) => {
  const [notifications, setNotifications] = useState({});
  const [etatTests, setIsTest] = useState({});
  let notifPopoRef = useRef();

  useEffect(() => {
    DAL.getFormatedNotifications().then(setNotifications);
    if (auth.isAdmin()) {
      DAL.getAdminValPerKey("isTest").then(setIsTest);
    }
  }, []);

  function IsTest(userId) {
    let usrIsTest = etatTests && etatTests[userId];
    usrIsTest = usrIsTest && usrIsTest.isTest;
    return !!(usrIsTest && usrIsTest.val);
  }


  function onNotifClick(notif) {
    auth.setScrollTarget(notif);
    if (auth.isAdmin()) {
      DAL.getUser(auth.isAdmin() ? notif.user : "me")
        .then((res) => {
          localData.setStorage("currentUserId", res._id);
          localData.setStorage("selectedUser", res);
          setRedirect("/user-summary-page");
        })
        .catch(ex => {
          auth.showToast(impoTxt.toastErrFindUser);
        });
    }
    else {
      //setRedirect(notif[0].question || notif[0].doc ? "/user-profile-page" : "/docs-page");
      setRedirect("/user-profile-page");
    }
  }

  function LstNotifs({ notifs }) {
    return mapComp((notif, user) => {
      if (notif[0]) notif = notif[0];
      if (notif[0]) notif = notif[0];
      if (notif.ouinon && notif.annee) { // Prêt à processing
        return (<Fragment key={user + "notif"}>
          <a href="user-summary-page" onClick={(e) => {
            e.preventDefault();
            onNotifClick(notif);
          }} className={[classes.notif, (notif.admin && auth.isAdmin() ? classes.notifSeen : classes.notifNew)].join(" ")}>
            {getIntroMessageProcessing(user)} {notif.annee}.
</a>
          <br />
        </Fragment>);
      } else {
        return (<Fragment key={user + "notif"}>
          <a href="user-summary-page" onClick={(e) => {
            e.preventDefault();
            onNotifClick(notif);
          }} className={[classes.notif, (notif.admin && auth.isAdmin() ? classes.notifSeen : classes.notifNew)].join(" ")}>
            {getIntroMessage(user)} {notif.length} message{getDetails(notif)}.
</a>
          <br />
        </Fragment>);
      }
    }, notifs);
  }

  return (
    <Popover
      ref={notifPopoRef}
      classes={{
        paper: classes.popover
      }}
      open={open}
      onClose={() => onClose("notifOpen")}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right"
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center"
      }}
      style={{ marginTop: 74 }/*To adjust to the header */}
    >
      {auth.isAdmin() && (
        <Link to="/messages-page" className={[classes.notif, classes.notifSeen].join(" ")}>
          <h4 className={classes.popoverHeader}><OpenInNew /> Notifications</h4>
        </Link>)}
      {!auth.isAdmin() &&
        (<span className={[classes.notif, classes.notifSeen].join(" ")}>
          <h4 className={classes.popoverHeader}><OpenInNew /> Notifications</h4>
        </span>)}

      <div className={classes.popoverBody}>

        {auth.isAdmin() ? (<>
          <LstNotifs notifs={filter(n => !IsTest(n[0][0].user), notifications.notifsProcessing)} />
          <LstNotifs notifs={filter(n => !IsTest(n[0][0].user), notifications.byUser)} />
          <i>{impoTxt.notifsComptesTest}</i><br />
          <LstNotifs notifs={filter(n => IsTest(n[0][0].user), notifications.notifsProcessing)} />
          <LstNotifs notifs={filter(n => IsTest(n[0][0].user), notifications.byUser)} />
        </>) : (<>
          <LstNotifs notifs={notifications.notifs} />
        </>)
        }

      </div>

    </Popover>
  );
};

NotifPopover.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool
};

function getIntroMessage(user) {
  if (auth.isAdmin()) {
    return (<Fragment>
      <b>{getUserName(user)}</b> {impoTxt.notifsSent}
    </Fragment>);
  } else {
    return (<Fragment>
      {impoTxt.notifsReceived}
    </Fragment>);
  }
}

function getIntroMessageProcessing(user) {
  if (auth.isAdmin()) {
    return (<Fragment>
      <b>{getUserName(user)}</b> {impoTxt.notifsCompleted}
    </Fragment>);
  } else {
    return null;
  }
}

function getUserName(user) {
  if (auth.isAdmin()) {
    var ret = DAL.getCachedUser(user);
    return ret ? ret.username : "";
  } else {
    return auth.getUserInfo().username;
  }
}

function getDetails(notif) {
  if (notif.question) {
    var qst = DAL.getQuestionById(notif.question);
    return qst ? (<Fragment> regardant la <b>Question</b> <i>{qst.titre}</i></Fragment>) : <i> question non trouvée</i>;
  }
  else if (notif.doc) {
    var usr = (auth.isAdmin() ? DAL.getCachedUser(notif.user) : auth.getUserInfo());
    var doc = usr ? usr.fileuploads.find(file => file._id === notif.doc) : null;
    if (doc) {
      return (<Fragment> regardant le <b>Document</b> <i>{doc.titre}</i></Fragment>);
    } else {
      return (<Fragment> regardant un <b>Document</b></Fragment>);
    }
  } else
    return null;
}

// TODO : utiliser HOC pour demander les notifs de Notifications
// TODO : Ajouter directement les données à Notifications plutôt qu'utiliser DAL içi.
export default withWidth()(withStyles(messagesPageStyle)(impoHOC(NotifPopover)));
