import React, { Fragment } from "react";
import { Redirect } from 'react-router-dom';
import impoHOC from "HoC/impoHOC.js";
import WrapingImpotPage from "HoC/WrapingImpotPage.jsx";


import withStyles from "@material-ui/core/styles/withStyles";
import GridContainer from "components/Grid/GridContainer.jsx";
import { Typography, Button } from '@material-ui/core';

import QuestionTabs from "views/QuestionsPage/QuestionTabs.jsx";
import DocList from "views/DocsPage/DocList.jsx";
import MessageSummary from "views/Messages/MessageSummary.jsx";

import CollapsableSection from "views/ImpoCompo/CollapsableSection.jsx";
import IntroPage from "./IntroPage";

import DAL from "utils/DataAccess/DALimpotx.js";
import auth from "utils/auth.js";
import localData from "utils/DataAccess/localData.js";
import utils from "utils/utils.js";
import impoTxt from 'texts/localization';

import profilePageStyle from "assets/jss/material-kit-react/views/adminPages.jsx";

import { scroller } from 'react-scroll'

//TODO Ludovic : Mettre les étatis "Open" en useLocalStorage
// Pour  collapsables et qst Tabs

class UserProfilePage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: auth.getUserInfo(),
      questions: [],
      files: [],
      notifications: [],
      allNotifs: [],
      qstPreOpen: localData.getStorage("usrSumQstOpen"),
      docPreOpen: localData.getStorage("usrSumDocOpen"),
      msgPreOpen: localData.getStorage("usrSumMsgOpen")
    };

    this.onMsgAdded = this.onMsgAdded.bind(this);
    this.updateNotifications = this.updateNotifications.bind(this);
    this.onClicSubscribePush = this.onClicSubscribePush.bind(this);

    utils.addListener("msgAdded", "UserProfilePage", this.onMsgAdded);
    utils.addListener("changeIntroStep", "UserProfilePage", () => { this.forceUpdate() });

    utils.callEvent("registerToChat");
    //this._debouncedState = {};
  }

  handleClose(modal) {
    this.setState({ openedFile: null });
  }

  componentDidMount() {
    DAL.getUser("me")
      .then(res => {
        auth.setUserInfo(res, true);
        utils.throttledSetState.call(this, { forceUpdate: Math.random() });
      });

    utils.testPermission((ev) => {
      utils.throttledSetState.call(this, { needNotif: true });
    });

    this.updateNotifications();

    var target = auth.getScrollTarget();

    DAL.getQuestions().then(resp => {
      utils.throttledSetState.call(this, { questions: Object.values(resp) });

      utils.refreshReponses();

      if (target) {
        scroller.scrollTo(1234);
      }
    });
  }
  updateNotifications() {
    DAL.getUserNotifications(true)
      .then(allNotif => {
        var newNotif = allNotif
          .filter(notifList => notifList[0].admin && !notifList[0].repondu);

        this.setState({
          notifications: newNotif, allNotifs: allNotif
            .sort((n1, n2) => n1[0].createdAt < n2[0].createdAt ? 1 : -1)
        });
      });
  }

  componentWillUnmount() {
    this._unmounted = true;
    utils.removeListener("msgAdded", "UserProfilePage");
    utils.removeListener("changeIntroStep", "UserProfilePage");
  }

  onMsgAdded(ev) {
    this.updateNotifications();
  }

  onClicSubscribePush() {
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
    const { classes, firebaseData } = this.props;

    utils.log("user profile state : ");
    utils.log(this.state);

    var target = auth.getScrollTarget();

    if (auth.getToken() && this.state.user)
      return (<Fragment>
        <WrapingImpotPage blurred={isFTUE()} firebaseData={firebaseData}>

          <h2 style={{ padding: 10 }}>{impoTxt.Bonjour} : <b>{this.state.user.username}</b></h2>

          <h3>{impoTxt.sumSectInfos} </h3>

          {this.state.user &&
            (
              <div style={{ marginLeft: 50 }}>
                <i>{impoTxt.sumSectInfos}  </i>
                { // INFOS D'OBJET USER
                  ["username", "email"//, "createdAt", "lastActivity"
                  ]
                    .map(prop => (
                      <p key={prop}><b>{prop}</b> : {this.state.user[prop]}</p>
                    ))}


                {/* Enlevé car information redondante : 
                <i>{impoTxt.sumModifiable}</i>
                { // INFOS DE QUESTIONS D'IDENTITÉ
                  utils.filtreOnlyIdentityQuestion(this.state.questions)
                    .map(question =>
                      <p key={question._id}><b>{question.titre}</b> : {question.repString}</p>)
                } */}
              </div>
            )}

          {utils.lateEnoughAfterNo() && this.state.needNotif &&
            <Button color="primary" onClick={this.onClicSubscribePush} >{impoTxt.sumClicPush}</Button>
          }

          {/*   SECTION COLLAPSABLES   */}


          <CollapsableSection startOpen={this.state.qstPreOpen}
              onOpen={(open)=>localStorage.setItem("usrSumQstOpen", open)}
               titre={impoTxt.sumSectRep} classes={classes}>
            {
              this.state.questions.length <= 0 ?
                <p>{impoTxt.sumNoAns}</p>
                :
                <QuestionTabs notifications={this.state.notifications.filter(notif => notif[0].question)} />
            }
          </CollapsableSection>

          {utils.isDocsActive() &&
            (<CollapsableSection  startOpen={this.state.docPreOpen}
              onOpen={(open)=>localStorage.setItem("usrSumDocOpen", open)}
               titre={impoTxt.sumSectDocs} classes={classes}>
              <GridContainer style={{ width: "100%", marginLeft: 0 }} justify="center">
                <DocList onSave={() => utils.log("onSave")} />
              </GridContainer>
            </CollapsableSection>)}

          {/*   Nouvelle section (12-fev) Docs uploadé/Admin   */}
          {utils.isDocsActive() &&
            (<CollapsableSection startOpen={target && !(target.question || target.doc)} 
            titre={impoTxt.sumSectDocsAdmin} classes={classes}>
              <GridContainer justify="center" style={{ width: "100%", marginLeft: 0 }} >
                <DocList adminDocs onSave={() => utils.log("onSave")} />
              </GridContainer>
            </CollapsableSection>)}

          <CollapsableSection startOpen={ this.state.msgPreOpen || (target && (target.question || target.doc))} 
          onOpen={(open)=>localStorage.setItem("usrSumMsgOpen", open)}
          titre={impoTxt.sumSectMsg} classes={classes}>
            <MessageSummary messages={this.state.allNotifs} notifications={this.state.notifications} />
            {/*this.state.allNotifs.map(
              notif => {
                return <MessageSummary key={notif[0]._id} notif={notif} />;
              }
            )*/}

            {this.state.allNotifs.length <= 0 &&
              <Typography variant="body1">
                {impoTxt.sumAucunMsg} </Typography>}
          </CollapsableSection>

        </WrapingImpotPage>
        {isFTUE() && <IntroPage />}
      </Fragment>
      );
    else
      return <Redirect to="/" />;
  }
}

function isFTUE() {
  return !localData.getStorage("skipIntro") && (auth.getUserInfo().reponses || []).length <= 1; // reponses.length == 0 && docs.length == 0
}

export default withStyles(profilePageStyle)(impoHOC(UserProfilePage, "UserProfile"));
