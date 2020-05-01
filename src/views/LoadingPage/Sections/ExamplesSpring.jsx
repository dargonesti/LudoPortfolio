import React from "react";
 import {useSpring, useSprings, animated, interpolate, config} from 'react-spring';

import translatedTxt from 'texts/localization';

const ExamplesSpring = (props) => {
  const headerAnimation = useSpring({config: config.default, onRest: ()=> {console.log("onRest")},
     from :{opacity:0, color:"red"},
     to: async next =>{
       while(1){
        await next({opacity:1, color:"white"})
        await next({opacity:0, color:"white"})
       }
     }, })

  let { classes } = props;
  if (classes == null) classes = {};
  return (
    <div className={classes.section}>
      <animated.h2 className={classes.title} style={headerAnimation}>Examples Spring</animated.h2>
      <h4 className={classes.description}>
        {translatedTxt.landingDesc}
      </h4>
    </div>
  );
}

export default ExamplesSpring;
