import React, {Redirect} from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
import impoHOC from "HoC/impoHOC.js";

// @material-ui/icons

// core components
import Header from "components/Header/Header.jsx";
import Footer from "components/Footer/Footer.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx"; 
import Parallax from "components/Parallax/Parallax.jsx";

import landingPageStyle from "assets/jss/material-kit-react/views/landingPage.jsx";

import ToastMessages from "components/Footer/ToastMessages";
import NotificationToastMessages from "components/Footer/NotificationToastMessages";
  
// Sections for this page
import WorkSection from "./Sections/WorkSection.jsx";

import bg1 from "assets/img/impotx/background1.jpg";
import wbg1 from "assets/img/impotx/background1.webp";

import utils from "utils/utils.js";
import auth from "utils/auth.js";
import impoTxt from 'texts/localization';
 

const dashboardRoutes = [];

/**
 * For those time the window is innactive for days and the local state becomes invalid
 */
function resetIfLocalDataInvalid(){
  //"FirebaseJwtToken", "jwtToken", "selectedUser", "currentUserId", "userInfo"
  //Client : userInfo, currentUserId, jwtToken, FirebaseJwtToken, selectedUser
  //Admin  : userInfo, currentUserId, jwtToken, FirebaseJwtToken, 
  if(auth.getToken() && !(auth.getUserInfo() && auth.getActiveUserId())){
   auth.clearAppStorage();
  }
}

class LandingPage extends React.Component {
  componentDidMount(){    
    var urlRedirect = "";
    resetIfLocalDataInvalid();

    if (auth.getUserInfo()) {
      if (auth.isAdmin()) { 
        urlRedirect ="/find-user-page";
      } else {
        urlRedirect ="/user-profile-page" ; 
      }
    }else {  
      urlRedirect ="/login-page" ; 
    } 
    this.props.setRedirect(urlRedirect);
  }
  render() {
    const { classes, ...rest } = this.props;
     

    return (<>
      <ToastMessages />
      <NotificationToastMessages />
      <div>
        <Header
          color="transparent"
          routes={dashboardRoutes}
          brand="Gnitic"
          fixed
          changeColorOnScroll={{
            height: 10,
            color: "white"
          }}
          {...rest}
        />
        <Parallax filter image={utils.canUseWebP() ? wbg1 : bg1}>
          <div className={classes.container}>
            <GridContainer>
              <GridItem xs={12} sm={12} md={6}>
                <h1 className={classes.title}>{impoTxt.landingTitre}</h1>
                <h4>
                  {impoTxt.landingFirstDesc}</h4>
                <br />
                {/*<Button
                  color="danger"
                  size="lg"
                  href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fas fa-play" />Regarder le vidéo
                </Button> */}
              </GridItem>
            </GridContainer>
          </div>
        </Parallax>
        <div className={classNames(classes.main, classes.mainRaised)}>
          <div className={classes.container}>
            <WorkSection />
          </div>
        </div>
        <Footer />
      </div>
    </>);
  }
}

export default (impoHOC(LandingPage, "Landing"));

