import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import impoHOC from "HoC/impoHOC.js";
//config.default, gentle, wobbly, stiff, slow, molasses
import { useSpring, useTransition, animated, interpolate, config } from 'react-spring';
import { Keyframes } from 'react-spring/renderprops'
// @material-ui/icons

import AnimatedHeaderText from "../MyComponents/AnimatedHeaderText.jsx";
import FadingHeader from "../MyComponents/FadingHeader.jsx";

// Sections for this page
import SectionTests from "./Sections/SectionTests.jsx";

//import bg1 from "assets/img/DSCF9114_4.jpg"; 
import bg1 from "assets/img/3_XT208535.webp";
import passingImg1 from "assets/img/PortraitsMoi/500/manoir.webp";
import passingImg2 from "assets/img/PortraitsMoi/500/choice.webp";
import stoppingImg1 from "assets/img/PortraitsMoi/500/potatoCrossed.webp";
import stoppingImg2 from "assets/img/PortraitsMoi/500/cote1.webp";

import delay from 'delay'
import translatedTxt from 'texts/localization';
//import myStyle from "assets/scss/index.scss";  
import "../../main.scss"
import "./landing.scss"

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

  let [showHeader1, setHeader1Shown] = useState(true)
  let [introDone, setIntroDone] = useState(false)

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

          <FadingHeader>
            <h2 style={{ color: "white" }}>test</h2>
            {showHeader1 &&
              <h1 className={"initialName"} style={{ top: "50%", left: "50%", marginLeft: 0, transform: `translate( -50%, -50%)`, position: "fixed" }}>
                <h1>{titre}</h1>
              </h1>
            }
          </FadingHeader>

          <div id="main-">
            <div id="iPhoto">
              Photographie
              </div>
            <div id="iVideo">
              Vidéo
              </div>
            <div id="iCode">
              Code
              </div>
          </div>

        </div>

        <div id="Content1-photo">
          <h2>Photographie</h2>
          <div id="firstPassingImages">
            <img src={passingImg1} alt="demo image 1" className="passingImages" />
            <img src={passingImg2} alt="demo image 2" className="passingImages" />

            <img src={stoppingImg1} alt="demo image 3" className="passingImages" />
            <img src={stoppingImg2} alt="demo image 4" className="passingImages" />
          </div>

        </div>

        <div id="Content1-video">
          <h2>Vidéographie</h2>

        </div>

        <div id="Content1-code">
          <h2>Programmation</h2>

        </div>

      </header>
    </div>);
}

export default (impoHOC(LandingPage, "Landing"));