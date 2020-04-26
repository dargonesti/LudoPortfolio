import React from "react";

import workStyle from "assets/jss/material-kit-react/views/landingPageSections/workStyle.jsx";

import translatedTxt from 'texts/localization';

const Section1 = (props) => {

  let { classes } = props;
  if (classes == null) classes = {};
  return (
    <div className={classes.section}>
      <h2 className={classes.title}>{translatedTxt.landingWorkWithUs}</h2>
      <h4 className={classes.description}>
        {translatedTxt.landingDesc}
      </h4>
    </div>
  );
}

export default (Section1);
