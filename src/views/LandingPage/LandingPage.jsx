import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import impoHOC from "HoC/impoHOC.js";
import { useSpring, useSprings, animated, interpolate, config } from 'react-spring';
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

// TODO: Paralax from : https://codesandbox.io/s/nwq4j1j6lm?from-embed

// ANIMATION CONSTANTS
const delayPassingImages = 2000;
const stoppedDelay = 500;

// INTERPOLATIONS
const eInOut = t => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t

const PausingAnim1 = ({ cb }) => Keyframes.Spring({
  default: async (next, cancel, ownProps) => {
    await next({
      from: { top: "-100%" },
      to: { top: "20%" },
      delay: delayPassingImages + stoppedDelay, config: { duration: 1400, easing: eInOut }
    })
    cb()
    console.log("IN THE PAUSE!!!")
    await delay(1000)
    await next({
      to: { top: "-100%" }, config: { duration: 1400, easing: eInOut }
    })
  }
})

const PausingAnim2 = ({ cb }) => Keyframes.Spring(async (next, cancel, ownProps) => {
    await next({
      from: { top: "-100%" },
      to: { top: "20%" },
      delay: delayPassingImages + stoppedDelay, config: { duration: 1400, easing: eInOut }
    })
    cb()
    console.log("IN THE PAUSE!!!")
    await delay(1000)
    await next({
      to: { top: "-100%" }, config: { duration: 1400, easing: eInOut }
    })  
})

//anim - Titre
const fromTitre = i => ({ opacity: 0, rot: 90 })
const toTitre = i => ({
  opacity: 1,
  rot: 0,
  delay: Math.log2(i + 1) * 250 + 200,
})
const transTitre = (rot) => `perspective(123px) rotateY(${rot}deg)`

// These two are just helpers, they curate spring data, values that are later being interpolated into css
const to = i => ({
  x: 0, y: 0, scale: 1, rot: 0,//-10 + Math.random() * 20, 
  delay: Math.log2(i + 1.5) * 500 + 1300//i * 250 + 555
})
const from = i => ({ x: -1430 * (i % 2 == 0 ? 1 : -1), rot: -40 + Math.random() * 80, scale: 1.5, y: 0 })
// This is being used down there in the view, it interpolates rotation and scale into a css transform
const trans = (r, s, x, y) => `translate3d(${x}px,${y}px,0) scale(${s})` //  rotateY(${r / 10}deg) rotateZ(${r}deg)   perspective(1500px) rotateX(30deg) 

const LandingPage = ({ loaded, showTests, ...props }) => {
  const paralaxRef = useRef();
  //const classes = useStyles({...props, theme})
  let { classes, ...rest } = props;
  if (classes == null) classes = {};

  let [showHeader1, setHeader1Shown] = useState(true)

  let titre = translatedTxt.landingTitre;

  let passingAnim1 = useSpring({
    from: { ratio: 0, left: "0%", top: "20%", transform: "translate(-100%,0)" },
    to: { ratio: 1, left: "100%", top: "20%", transform: "translate(0,0)" },
    delay: delayPassingImages, config: { duration: 1900, easing: eInOut },
    onFrame: ({ ratio }) => {
      if (showHeader1 && ratio > 0.4) {
        setHeader1Shown(false);
      }
    }
  })
  let passingAnim2 = useSpring({
    from: { bottom: "20%", right: "0%", transform: "translate(100%,0)" },
    to: { bottom: "20%", right: "100%", transform: "translate(0%,0)" },
    delay: delayPassingImages, config: { duration: 1900, easing: eInOut }
  })
  let stoppedAnim1 = useSpring({
    from: { top: "-100%", },
    to: { top: "20%" },
    delay: delayPassingImages + stoppedDelay, config: { duration: 1400, easing: eInOut }
  })
  let stoppedAnim2 = useSpring({
    from: { bottom: "-100%" },
    to: { bottom: "20%" },
    delay: delayPassingImages + stoppedDelay, config: { duration: 1400, easing: eInOut }
  })

  useEffect(() => {
    window.onscroll = () => {

    }

    return () => {

    }
  }, [])

  const imgLoaded = false;//useProgressiveImage(bg1)

  console.log(bg1)
  /*  <SectionSprings />
  ,backgroundSize:"cover", backgroundPosition:"center", minHeight:"100vh", display: "flex", justifyContent: "center", alignItems:"center", flexFlow:"column"
  #mainHeader: style={{ backgroundImage: imgLoaded ? `url(${imgLoaded})` : "linear-gradient(to bottom, #eef2f3, #8e9eab)" }} 
  */

  return (
    <div id="mainContainer" offset={0} speed={0.8}
      style={{ background: "var( --bg-color2 )" }}>
      <header className={"accueil1"} style={{ margin: 0 }}>
        <div id="mainHeader" className={classes.container} >

          <FadingHeader>
            <h2 style={{ color: "white" }}>test</h2>
            {showHeader1 &&
              <h1 className={"initialName"} style={{ top: "50%", left: "50%", marginLeft: 0, transform: `translate( -50%, -50%)`, position: "fixed" }}>
                <AnimatedHeaderText text={titre} startDelay={1234} />
              </h1>
            }
          </FadingHeader>

          <div id="firstPassingImages">
            <animated.img src={passingImg1} alt="demo image 1" className="passingImages"
              style={{ ...passingAnim1 }} />
            <animated.img src={passingImg2} alt="demo image 2" className="passingImages"
              style={{ ...passingAnim2 }} />

            <PausingAnim2 cb={()=>console.log("My cb")} state="default">
              {styles => <img src={stoppingImg1} alt="demo image 3" className="passingImages"
                style={{ left: "10%", ...styles }} />}
            </PausingAnim2>

            <animated.img src={stoppingImg1} alt="demo image 3" className="passingImages"
              style={{ left: "10%", ...stoppedAnim1 }} />
            <animated.img src={stoppingImg2} alt="demo image 4" className="passingImages"
              style={{ right: "10%", ...stoppedAnim2 }} />

          </div>

        </div>

      </header>
    </div>);
}



export default (impoHOC(LandingPage, "Landing"));