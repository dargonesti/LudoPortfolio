import React, { useEffect, useState, useRef } from "react";
import impoHOC from "HoC/impoHOC.js";
//config.default, gentle, wobbly, stiff, slow, molasses

import FadingHeader from "../MyComponents/FadingHeader.jsx";

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

  let imgWedding = ["3_XT034714.jpg", "2_XT034657.jpg", "3_XT034770 (1).jpg", "3_XT034778.jpg", "4_XT033079 (2).jpg", "5_XT033095 (2).jpg"]
  let getWD = (i) => ("url(img/Wedding/" + imgWedding[i % imgWedding.length] + ")")//linear-gradient(to right bottom, rgba(0,200,123, 0.3), rgba(223,234,94,0.2)),

  let imgPortrait = ["4_XT201199 (1).jpg", "5_DSCF5764 (1).jpg", "5_DSCF5807.jpg", "3_XT032214.webp"]
  let getP = (i) => (" url(img/Portraits/" + imgPortrait[i % imgPortrait.length] + ")")//linear-gradient(to right bottom, rgba(200,0,1, 0.2), rgba(123,0,234,0.2)),

  let imgNature = ["0_XT035256.jpg", "4_XT032371 (1).webp", "4_XT032376.webp", "5_XT032153.jpg", "DSCF9114_4.jpg"]
  let getN = (i) => ("url(img/Nature/" + imgNature[i % imgNature.length] + ")")//linear-gradient(to right bottom, rgba(0,200,123, 0.3), rgba(223,234,94,0.2)),

  let selfPortrait = ["4_XT031878.jpg", "3_XT031397.webp", "3_XT031376.jpg", "redBlueBall.jpg"]
  let getSP = (i) => ("url(img/PortraitsMoi/" + selfPortrait[i % selfPortrait.length] + ")")//linear-gradient(to right bottom, rgba(234,234,234, 0.3), rgba(234,234,99,0.3)),


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
            <h1 className={"initialName"}>
              {titre}
            </h1>
            <MainMenu />
          </FadingHeader>

          <div class="spacer" />

          <div id="disciplines" >
            <div id="iPhoto" style={{ backgroundImage: getP(2) }}>
              Photographie
              </div>
            <div id="iVideo" style={{ backgroundImage: getWD(1) }}>
            <div></div> <div>Vidéo</div>             
              </div>
            <div id="iCode" style={{ backgroundImage: getSP(2) }}>
              <div>Code</div> <div></div>    
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