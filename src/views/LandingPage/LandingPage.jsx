import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; 
import impoHOC from "HoC/impoHOC.js";
import { useSpring, useSprings, animated, interpolate, config } from 'react-spring';

// @material-ui/icons
 


// Sections for this page
import SectionTests from "./Sections/SectionTests.jsx"; 

//import bg1 from "assets/img/DSCF9114_4.jpg"; 
import bg1 from "assets/img/3_XT208535.webp";

import translatedTxt from 'texts/localization';
//import myStyle from "assets/scss/index.scss";  
import "../../main.scss"

// TODO: Paralax from : https://codesandbox.io/s/nwq4j1j6lm?from-embed

const useProgressiveImage = src => {
  const [sourceLoaded, setSourceLoaded] = useState(null)

  useEffect(() => {
    const img = new Image()
    img.src = src
    img.onload = () => setSourceLoaded(src)
  }, [src])

  return sourceLoaded
}

const socials = [
  { href: "https://www.facebook.com/ludovic.migneault", name: "Facebook" },
  { href: "https://instagram.com/ludovicmigneault", name: "Instagram" },
  { href: "https://unsplash.com/@dargonesti", name: "Unsplash" },
  { href: "https://medium.com/@ludovic.migneault", name: "Medium" },
  { href: "https://www.youtube.com/user/migneault62/", name: "Youtube" },
  { href: "https://dashboard.twitch.tv/u/dargonesti", name: "Twitch" }
]

// These two are just helpers, they curate spring data, values that are later being interpolated into css
const to = i => ({ x: 0, y: 0, scale: 1, rot: 0,//-10 + Math.random() * 20, 
  delay: i * 250 + 555 })
const from = i => ({ x: -1430 * (i%2==0?1:-1), rot: -40 + Math.random() * 80, scale: 1.5, y: 0 })
// This is being used down there in the view, it interpolates rotation and scale into a css transform
const trans = (r, s,x,y) => `translate3d(${x}px,${y}px,0) scale(${s})` //  rotateY(${r / 10}deg) rotateZ(${r}deg)   perspective(1500px) rotateX(30deg) 

const LandingPage = ({ loaded, showTests, ...props }) => {
  //const classes = useStyles({...props, theme})
  let { classes, ...rest } = props;
  if (classes == null) classes = {};

  let [socialProps, set] = useSprings(socials.length, i => ({ ...to(i), from: from(i), config: {mass:1, tension:15, friction:6} }))

  const imgLoaded = false;//useProgressiveImage(bg1)

  console.log(bg1)
  /*  <SectionSprings />
  ,backgroundSize:"cover", backgroundPosition:"center", minHeight:"100vh", display: "flex", justifyContent: "center", alignItems:"center", flexFlow:"column"
  #mainHeader: style={{ backgroundImage: imgLoaded ? `url(${imgLoaded})` : "linear-gradient(to bottom, #eef2f3, #8e9eab)" }} 
  */
 
  return (
    <header className={"accueil1"} style={{ margin: 0 }}>

      <div id="mainHeader" className={classes.container}
        >
        {false && 
        <div className="overlay" style={{ backgroundColor: "rgba(255,255,255,0.5)" }} />}

        <h1 className={classes.title}>{translatedTxt.landingTitre}</h1>
        <h4>Come back next week for more stuff!</h4>
        <div className="links">
          {socialProps.map(({ x, y, rot, scale }, i) => (
            <animated.a key={i} style={{ transform: interpolate([rot, scale,x,y], trans) }} href={socials[i].href}>
              {socials[i].name}
            </animated.a>
          ))}
          {false && <>
            <a href="https://www.facebook.com/ludovic.migneault" >Facebook</a>
            <a href="https://instagram.com/ludovicmigneault" >Instagram</a>
            <a href="https://unsplash.com/@dargonesti" >Unsplash</a>
            <a href="https://medium.com/@ludovic.migneault" >Medium</a>
            <a href="https://www.youtube.com/user/migneault62/" >Youtube</a>
            <a href="https://dashboard.twitch.tv/u/dargonesti" >Twitch</a>
          </>}
        </div>
      </div>

{showTests && (<>
  <div className="contentTest">
        <div className={classes.container}>
          <h2>Components : </h2>
          <Link to="/components">See them <u>here</u></Link>

          <h2>Inspiration : </h2>
          <i>( Mostly from Awwwards.com )</i> <br />
          <Link to="/inspirations">See them <u>here</u></Link>

          {true &&
            <SectionTests />}

        </div>
      </div>
</>)}
    </header>);
}


export default (impoHOC(LandingPage, "Landing"));