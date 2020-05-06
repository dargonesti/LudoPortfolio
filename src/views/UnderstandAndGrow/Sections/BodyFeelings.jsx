import React from "react";

import {useSpring, useSprings, animated, interpolate, config} from 'react-spring';

import translatedTxt from 'texts/localization';

import redBlueBall from "assets/img/PortraitsMoi/redBlueBall.jpg";

////// TODO : Mind over Matter vs. Mindfullness ( Yoga/meditation )

const ExamplesSpring = (props) => {
  const headerAnimation = useSpring({config: config.default, onRest: ()=> {console.log("onRest")},
     from :{opacity:0, color:"red"},
     to: async next =>{
       while(1){
        await next({opacity:1, color:"white"})
        await next({opacity:0, color:"white"})
       }
     }, })

  const img1Anim = useSpring({config: {mass:25, tension:30, friction:45}, 
  delay: 1500, onRest: ()=>{console.log("rest")},
  from: {height: 4160/1.25, width:6000/1.25, xy: [-6, -49]},
  to:  {height: 600, width:6000 * 600 / 4160, xy: [0,0]}
})

  let { classes } = props;
  if (classes == null) classes = {};
  return (
    <div className={classes.section} 
    style={{overflow:"hidden", display: "flex", flexFlow:"column", alignItems:"center", justifyContent:"center"}}>
      <animated.h2 className={classes.title} style={headerAnimation}>Animation Images</animated.h2>
      
      <animated.img style={{ mixBlendMode: "lighten",
        height: img1Anim.height, width: img1Anim.width, 
      transform: img1Anim.xy.interpolate((x,y)=>`translate(${x}%,${y}%)`) }} 
      src={redBlueBall} alt="portrait through ball 1"/>
    </div>
  );
}

export default ExamplesSpring;
