import React from "react";
import { Redirect } from 'react-router-dom';
// @material-ui/core components 
import WrapingImpotPage from "HoC/WrapingImpotPage.jsx";
import impoHOC from "HoC/impoHOC.js";

import withStyles from "@material-ui/core/styles/withStyles";
import { Typography } from '@material-ui/core';

import SectionAdmin from "views/Admin/SectionAdminHook.jsx";
import QuestionTabs from "views/QuestionsPage/QuestionTabs.jsx";
import DocList from "views/DocsPage/DocList.jsx";
import MessageSummary from "views/Messages/MessageSummary.jsx";

import CollapsableSection from "views/ImpoCompo/CollapsableSection.jsx";

import DAL from "utils/DataAccess/DALimpotx.js";
import auth from "utils/auth.js";
import localData from "utils/DataAccess/localData";
import utils from "utils/utils.js";
import impoTxt from 'texts/localization';

import profilePageStyle from "assets/jss/material-kit-react/views/adminPages.jsx";

import { scroller } from 'react-scroll'

class UserSummaryPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: localData.getStorage("selectedUser"),
      questions: [],
      files: [],
      notifications: [],
      allNotifs: [],
      qstPreOpen: localData.getStorage("admSumQstOpen"),
      docPreOpen: localData.getStorage("admSumDocOpen"),
      msgPreOpen: localData.getStorage("admSumMsgOpen")
    };

    //this._debouncedState = {};

    utils.callEvent("registerToChat");
  }


  componentDidMount() {

    DAL.getAdminNotifications() ///// TODO : Improve Performances 
      .then(res => {
        utils.throttledSetState.call(this, { notifications: res });
      });

    var target = auth.getScrollTarget();

    DAL.getQuestions().then(resp => {
      // ERROR : Sometime already unmounted?
      utils.throttledSetState.call(this, { questions: Object.values(resp), openMessages: true });

      if (target && target.question) {
        setTimeout(() => {
          scroller.scrollTo(this[target.question], {
            duration: 800,
            delay: 0,
            smooth: 'easeInOutQuart'
          });
          auth.setScrollTarget(null);
        }, 99);
      }
    });


    DAL.getFiles().then(resp => {
      utils.throttledSetState.call(this, { files: resp });

      if (target && target.doc) {
        setTimeout(() => { ///// TODO : Improve Performances 
          utils.throttledSetState.call(this, { targetId: target.doc, openMessages: true });

          scroller.scrollTo(this[target.doc], {
            duration: 800,
            delay: 0,
            smooth: 'easeInOutQuart'
          });
          auth.setScrollTarget(null);
        }, 99);
      }
    });


    DAL.getUserNotifications(true)
      .then(allNotif => {
        var newNotif = allNotif
          .filter(notifList => notifList[0].admin && !notifList[0].repondu);

        utils.throttledSetState.call(this, {
          notifications: newNotif, allNotifs: allNotif
            .sort((n1, n2) => n1[0].createdAt < n2[0].createdAt ? 1 : -1)
        });

      });

  }

  render() {
    /*
      qstPreOpen: localData.getStorage("usrSumQstOpen"),
      docPreOpen: localData.getStorage("usrSumDocOpen"),
      msgPreOpen: localData.getStorage("usrSumMsgOpen")*/
    var { firebaseData } = this.props;
    var target = auth.getScrollTarget();
    if (auth.getToken() && this.state.user)
      return (
        <WrapingImpotPage firebaseData={firebaseData}>

          <h2 style={{ padding: 10 }}>{impoTxt.sumTitre} <b>{this.state.user.username}</b></h2>
          <CollapsableSection startOpen={utils.isProd()} titre={impoTxt.sumSectInfos} >
            {this.state.user &&
              (
                <div style={{ marginLeft: 50 }}>
                  { // INFOS D'OBJET USER
                    ["username", "email", "createdAt", "lastActivity", "repCount", "docCount"]
                      .map(prop => (
                        <p key={prop}><b>{prop}</b> : {this.state.user[prop]}</p>
                      ))}

                  { // INFOS DE QUESTIONS D'IDENTITÉ
                    utils.filtreOnlyIdentityQuestion(this.state.questions)
                      .map(question =>
                        <p key={question._id}><b>{question.titre}</b> : {question.repString}</p>)
                  }
                </div>
              )}
          </CollapsableSection>

          <CollapsableSection titre={impoTxt.sumSectAdmin} >
            <SectionAdmin user={this.state.user} />
          </CollapsableSection>

          <CollapsableSection titre={impoTxt.sumSectQuestion} >
            {this.state.questions.length <= 0 ?
              <p>{impoTxt.sumNoAns}</p>
              :
              <QuestionTabs user={this.state.user} notifications={this.state.notifications} />}
          </CollapsableSection>

          {utils.isDocsActive() &&
            (<CollapsableSection titre={impoTxt.sumSectDocs} >
              <DocList />
            </CollapsableSection>)}

          {utils.isDocsActive() &&
            (<CollapsableSection titre={impoTxt.sumSectDocsAdmin}
              startOpen={target && !(target.question || target.doc)}  >
              <DocList adminDocs />
            </CollapsableSection>)}

          <CollapsableSection titre={impoTxt.sumSectMsg}
            startOpen={target && (target.question || target.doc)} >
            <MessageSummary messages={this.state.allNotifs} notifications={this.state.notifications} />

            {this.state.allNotifs.length <= 0 &&
              <Typography variant="body1"> {impoTxt.sumAucunMsg} </Typography>}
          </CollapsableSection>

        </WrapingImpotPage>
      );
    else
      return <Redirect to="/" />;
  }
}

export default withStyles(profilePageStyle)(impoHOC(UserSummaryPage, "UserSummary"));
