import React, {useState, useEffect} from "react";
// nodejs library that concatenates classes
import classNames from "classnames";

// Sections for this page
import Section1 from "./Sections/Section1.jsx";
import ExamplesSpring from "./Sections/ExamplesSpring.jsx"; 

/*function App() {
  const props = useSpring({opacity: 1, from: {opacity: 0}})
  return <animated.div style={props}>I will fade in</animated.div>
}*/

//import wbg1 from "assets/img/impotx/background1.webp";

//import utils from "utils/utils.js"; 
//import translatedTxt from 'texts/localization';  
 

const LoadingPage = ({loaded, ...props}) => { 
  //const classes = useStyles({...props, theme})
  let { classes, ...rest } = props;
  if (classes == null) classes = {};

  if(loaded) return null;

  return ( 
    <div style={{margin: 20}} className={loaded ? "hide":""}>
      <div className={classes.container}>
        <h1 className={classes.title}>LOADING Intro!</h1>
        <h4>
         Here lay a nice animation with some welcome text to occupy you while you wait.
         </h4>
        <br />
    <p>... <br/>
    ... Eventually it'll be animated...</p>
      </div>
      <div className={classNames(classes.main, classes.mainRaised)}>

        <div>
        <ExamplesSpring />
        </div>

        <div className={classes.container}>
          <Section1 />
        </div>
      </div>
    </div>
 );
}


export default LoadingPage;