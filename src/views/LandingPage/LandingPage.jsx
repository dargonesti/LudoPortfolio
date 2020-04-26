import React, {Redirect} from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
import impoHOC from "HoC/impoHOC.js";

// @material-ui/icons

// core components
import Header from "components/Header/Header.jsx";
import Footer from "components/Footer/Footer.jsx"; 
import Parallax from "components/Parallax/Parallax.jsx";

import landingPageStyle from "assets/jss/material-kit-react/views/landingPage.jsx";
 
  
// Sections for this page
import Section1 from "./Sections/Section1.jsx";

import bg1 from "assets/img/impotx/background1.jpg";
import wbg1 from "assets/img/impotx/background1.webp";

import utils from "utils/utils.js";
import auth from "utils/auth.js";
import translatedTxt from 'texts/localization';
 

const dashboardRoutes = [];

/**
 * For those time the window is innactive for days and the local state becomes invalid
 */
function resetIfLocalDataInvalid(){ 
  if(auth.getToken() && !(auth.getUserInfo() && auth.getActiveUserId())){
   auth.clearAppStorage();
  }
}

class LandingPage extends React.Component {
  componentDidMount(){     
    resetIfLocalDataInvalid();  
  }
  render() {
    let { classes, ...rest } = this.props;
    if (classes == null ) classes = {};     

    return (<> 
      <div>
          <div className={classes.container}> 
                <h1 className={classes.title}>{translatedTxt.landingTitre}</h1>
                <h4>
                  {translatedTxt.landingFirstDesc}</h4>
                <br />
              
          </div>
        <div className={classNames(classes.main, classes.mainRaised)}>
          <div className={classes.container}>
            <Section1 />
          </div>
        </div>
      </div>
    </>);
  }
}

export default (impoHOC(LandingPage, "Landing"));