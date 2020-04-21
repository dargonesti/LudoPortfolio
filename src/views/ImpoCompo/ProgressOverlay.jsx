/*eslint eqeqeq:0*/
/*eslint no-mixed-operators:0*/
import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles"; 
import useAnimation from './use-animation'; 

const HeaderH = 50;

const gradientInactive = "linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.05), rgba(0,0,0,0.25), rgba(0,0,0,0.5))";
 
const progressHeaderStyle = {
 
    progressCover: {
        position: "absolute", top: 0, background: gradientInactive,  //height: HeaderH, backgroundColor: "rgba(255,255,255, 0.7)", 
        borderRadius: "0px 4px 4px 0px",
    }, 
};


const ProgressOverlay = ({ curStep=0, totalSteps=1, fromLeft, height, animateDelay = 0, animateDuration, color, resetAnimation, classes }) => {
    var animate = (animateDuration != 0 || animateDelay != 0);
     var curProgress = (curStep + (!animate?1:0));
    var progressAnim = useAnimation('easeInOut', animateDuration || 1000, animateDelay, resetAnimation);
    if (animate) {
        curProgress = curProgress - 1 + progressAnim;
    }
    var dynamicStyle = {};
    if (color) {
        dynamicStyle.backgroundColor = color;
    }
    dynamicStyle.height = height || HeaderH;
    if(fromLeft){
        dynamicStyle.left=0;
    }else{
        dynamicStyle.right=0;
    }

    var progressPercent = 100 - 100 * (curProgress/totalSteps);
 
    return  <div className={classes.progressCover} style={{ width: progressPercent + "%", ...dynamicStyle}} /> ;
     
};


ProgressOverlay.propTypes = {
    classes: PropTypes.object, 
    curStep: PropTypes.number,
    totalSteps: PropTypes.number,
    animateDelay: PropTypes.number,
    animateDuration: PropTypes.number,
    resetAnimation: PropTypes.number,
    color: PropTypes.string,
};

export default withStyles(progressHeaderStyle)(ProgressOverlay);