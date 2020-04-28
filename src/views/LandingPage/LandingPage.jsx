import React from "react";
import { Link } from "react-router-dom";
// nodejs library that concatenates classes
import classNames from "classnames";
import impoHOC from "HoC/impoHOC.js";

// @material-ui/icons
 
import landingPageStyle from "assets/jss/material-kit-react/views/landingPage.jsx";


// Sections for this page
import Section1 from "./Sections/Section1.jsx";

import bg1 from "assets/img/impotx/background1.jpg"; 

import translatedTxt from 'texts/localization';  
 
const LandingPage = ({loaded, ...props}) => { 
  //const classes = useStyles({...props, theme})
  let { classes, ...rest } = props;
  if (classes == null) classes = {};

  return (
    <div style={{margin: 20}}>
      <div className={classes.container}>
        <h1 className={classes.title}>{translatedTxt.landingTitre}</h1>
        <h4>
          {translatedTxt.landingFirstDesc}</h4>
        <br />

      </div>
      <div className={classNames(classes.main, classes.mainRaised)}>
        <div className={classes.container}>
          <h2>Components : </h2>
          <Link to="/components">See them <u>here</u></Link>

          <h2>Inspiration : </h2>
          <i>( Mostly from Awwwards.com )</i> <br/>
          <Link to="/inspirations">See them <u>here</u></Link>

          {false && <Section1 />}

        </div>
      </div>
    </div>);
}


export default (impoHOC(LandingPage, "Landing"));