import React from "react";

import workStyle from "assets/jss/material-kit-react/views/landingPageSections/workStyle.jsx";

import translatedTxt from 'texts/localization';
 
import ShadertoyReact from 'shadertoy-react';

////// TODO : MBTI
//    Rational / feeling
//    Introverted -> Being deliberate on every impact on others
//    Extravert -> Lettign everything out as it comes
//    Organized vs Chaotic
//    Long term vs Short term
// 

const fs = `
void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
  vec2 uv = fragCoord.xy/iResolution.xy;
  vec3 col = 0.5 + 0.5*cos(iTime+uv.xyx+vec3(0,2,4));
  fragColor = vec4(col,1.0);
}`

const Section1 = (props) => {

  let { classes } = props;
  if (classes == null) classes = {};
  return (
    <div className={classes.section}>
      <h2 className={classes.title}>{translatedTxt.landingWorkWithUs}</h2>
      <h4 className={classes.description}>
        {translatedTxt.landingDesc}
      </h4>
    <ShadertoyReact fs={fs}/>
    </div>
  );
}

export default (Section1);
