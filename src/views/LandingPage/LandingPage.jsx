import React from "react";
import { Link } from "react-router-dom";
// nodejs library that concatenates classes
import classNames from "classnames";
import impoHOC from "HoC/impoHOC.js";

// @material-ui/icons
 
import landingPageStyle from "assets/jss/material-kit-react/views/landingPage.jsx";


// Sections for this page
import Section1 from "./Sections/Section1.jsx";
import SectionSprings from "./Sections/LandingSprings.jsx";

//import bg1 from "assets/img/DSCF9114_4.jpg"; 
import bg1 from "assets/img/3_XT208535.webp"; 

import translatedTxt from 'texts/localization';  
//import myStyle from "assets/scss/index.scss";  
import "../../main.scss"
 
const LandingPage = ({loaded, ...props}) => { 
  //const classes = useStyles({...props, theme})
  let { classes, ...rest } = props;
  if (classes == null) classes = {};

  console.log(bg1)
  /*  <SectionSprings />
  ,backgroundSize:"cover", backgroundPosition:"center", minHeight:"100vh", display: "flex", justifyContent: "center", alignItems:"center", flexFlow:"column"
  */
  return (
    <header className={"accueil1"} style={{margin: 0}}>
      
      <div id="mainHeader" className={classes.container}  
      style={{backgroundImage: `url(${bg1}` }}>
      <div class="overlay" style={{backgroundColor: "rgba(255,255,255,0.5)"}} />
        
        <h1 className={classes.title}>{translatedTxt.landingTitre}</h1>
        <h4>Come back next week for more stuff!</h4>
          <a href="https://medium.com/@ludovic.migneault" >Medium</a>
          <a href="https://unsplash.com/@dargonesti" >Unsplash</a>
          <a href="https://www.facebook.com/ludovic.migneault" >Facebook</a>
          <a href="https://www.youtube.com/user/migneault62/" >Youtube</a>
          <a href="https://dashboard.twitch.tv/u/dargonesti" >Twitch</a>
          <a href="https://instagram.com/ludovicmigneault" >Instagram</a>
          
      </div>

      <div className="contentTest">
        <div className={classes.container}>
          <h2>Components : </h2>
          <Link to="/components">See them <u>here</u></Link>

          <h2>Inspiration : </h2>
          <i>( Mostly from Awwwards.com )</i> <br/>
          <Link to="/inspirations">See them <u>here</u></Link>

          <Section1 />

        </div>
      </div>
    </header>);
}


export default (impoHOC(LandingPage, "Landing"));