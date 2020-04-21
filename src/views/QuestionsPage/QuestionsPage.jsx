import React from "react";
import { Redirect } from 'react-router-dom';
import impoHOC from "HoC/impoHOC.js";
import WrapingImpotPage from "HoC/WrapingImpotPage.jsx";
import withStyles from "@material-ui/core/styles/withStyles";
import { PulseLoader } from 'halogenium';


import QuestionTabs from "./QuestionTabs.jsx";
import auth from "utils/auth.js";
import utils from "utils/utils.js";
import DAL from "utils/DataAccess/DALimpotx.js";

import profilePageStyle from "assets/jss/material-kit-react/views/profilePage.jsx";

class QuestionsPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      notifications: [],
      questions: null
    };

    DAL.getQuestions()
      .then(res => {
        utils.throttledSetState.call(this, { questions: res });
      });

    (auth.isAdmin() ?
      DAL.getAdminNotifications() :
      DAL.getUserNotifications())
      .then(res => {
        utils.throttledSetState.call(this, { notifications: res });
      });
  }

  render() {
    var { firebaseData } = this.props;
    return (
      <WrapingImpotPage firebaseData={firebaseData}>
        {auth.getToken() ?
          (this.state.questions ?
             <QuestionTabs notifications={this.state.notifications.filter(notif => notif[0].question)} /> 
          :
            <div style={{width:"100%", minHeight:150, height:"calc( 100vh - 305px )"}}>
              <PulseLoader color="#26A65B" size="16px" margin="4px" style={{
                position: "absolute",
                left: "50%",
                top: "50%"
              }}/>
            </div>)
          :
          <Redirect to="/" />}
      </WrapingImpotPage>
    );
  }
}

export default withStyles(profilePageStyle)(impoHOC(QuestionsPage));