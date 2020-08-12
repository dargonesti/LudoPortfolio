import React, { useEffect, useState, useRef } from "react";
import impoHOC from "HoC/impoHOC.js";
//config.default, gentle, wobbly, stiff, slow, molasses

import FadingHeader from "../MyComponents/FadingHeader.jsx";
import HeaderTriangle from "../MyComponents/HeaderTriangle.jsx";

// Sections for this page

import MainMenu from "../MyComponents/MainMenu.jsx";
import SectionTests from "./Sections/SectionTests.jsx";

//import bg1 from "assets/img/DSCF9114_4.jpg"; 
import passingImg1 from "assets/img/PortraitsMoi/500/manoir.webp";
import passingImg2 from "assets/img/PortraitsMoi/500/choice.webp";
import stoppingImg1 from "assets/img/PortraitsMoi/500/potatoCrossed.webp";
import stoppingImg2 from "assets/img/PortraitsMoi/500/cote1.webp";

import translatedTxt from 'texts/localization';
//import myStyle from "assets/scss/index.scss";  
import "scss/mainNoAnim.scss"
import "./landingNoAnim.scss"

////////////USE Palette : https://coolors.co/30bced-303036-fffaff-fc5130-050401

// TODO: Paralax from : https://codesandbox.io/s/nwq4j1j6lm?from-embed

// ANIMATION CONSTANTS
const delayPassingImages = 1000;
const stoppedDelay = 500;

// INTERPOLATIONS
const eInOut = t => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t
const eInOut2 = t => eInOut(eInOut(t))

const LandingPage = ({ loaded, showTests, ...props }) => {
  const paralaxRef = useRef();
  //const classes = useStyles({...props, theme})
  let { classes, ...rest } = props;
  if (classes == null) classes = {};


  let titre = translatedTxt.landingTitre;

  useEffect(() => {
    window.onscroll = () => {

    }

    return () => {

    }
  }, [])

  return (
    <div id="mainContainer" offset={0} speed={0.8}>
      <header className={"accueil1"} style={{ margin: 0 }}>
        <div id="mainHeader" className={classes.container}  >

         {false && <div className="spacer" />}

  <HeaderTriangle 
  contentPhoto={<div>ok photo </div>}
  contentVideo={<div>ok video </div>}
  contentCode={<div>ok code</div>}
  />

<FadingHeader>
            <h1 className={"initialName"}>
              {titre}
            </h1>
            <MainMenu />
          </FadingHeader>
        </div>

      </header>
    </div>);
}

export default (impoHOC(LandingPage, "Landing"));