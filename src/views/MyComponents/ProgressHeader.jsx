/*eslint eqeqeq:0*/
/*eslint no-mixed-operators:0*/
import React from "react";
import PropTypes from "prop-types";
 

import useAnimation from './use-animation';

const HeaderH = 50;

const gradientInactive = "linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.05), rgba(0,0,0,0.25), rgba(0,0,0,0.5))";
const gradientActive = "linear-gradient(rgba(0,0,0,0), rgba(254,254,254,0.5))";
const HeadTxtRad = "0px 0px 6px 6px";
const progressHeaderStyle = {
    skip: {
        color: "#f44336",
        "&:hover": {
            backgroundColor: "rgba(250, 0, 0, 0.08)"
        }
    },
    nextPrev: {
        "&:hover": {
            backgroundColor: "rgba(0, 250, 0, 0.2)"
        }
    },
    done: {
        color: "#4caf50",
        "&:hover": {
            backgroundColor: "rgba(0, 250, 0, 0.2)"
        }
    },

    topProgressBar: {
        position: "relative", top: 0, left: -50, height: HeaderH, width: "calc(100% + 200px)",
        margin: 0, padding: 0, borderRadius: 4,
        backgroundColor: "#2c2",
        backgroundImage: "linear-gradient(45deg, rgba(255, 255, 255, 0.2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.2) 75%, transparent 75%, transparent)",
        backgroundSize: "64px 64px",
        animation: "pace-theme-barber-shop-motion 2500ms ease-in-out infinite",
    },

    progressCover: {
        position: "absolute", top: 0, right: 0, height: HeaderH, background: gradientInactive,  //backgroundColor: "rgba(255,255,255, 0.7)", 
        borderRadius: "0px 4px 4px 0px"
    },

    progressText: {
        position: "absolute", top: 0, left: 0, height: HeaderH + 2, width: "33%", textAlign: "center", paddingTop: 11, border: "2px grey solid", borderRadius: HeadTxtRad, background: gradientActive //"rgba(0,0,0,0.05)"
    },

    progressTextLeft: {
        position: "absolute", top: 0, left: 0, height: HeaderH + 2, width: "33%", textAlign: "center", paddingTop: 11, border: "2px grey solid", borderRadius: HeadTxtRad, background: gradientActive //"rgba(0,0,0,0.05)"
    },
    progressTextCenter: {
        position: "absolute", top: 0, left: "calc(33% - 2px)", height: HeaderH + 2, width: "calc(34% + 4px)", textAlign: "center", paddingTop: 11, border: "2px grey solid", borderRadius: HeadTxtRad, background: gradientInactive
    },
    progressTextRight: {
        position: "absolute", top: 0, left: "67%", height: HeaderH + 2, width: "33%", textAlign: "center", paddingTop: 11, border: "2px grey solid", borderRadius: HeadTxtRad, background: gradientInactive
    },

    HeaderFont: {
        color: "#3c4858",
        fontSize: "1rem",
        fontFamily: "Roboto,Helvetica,Arial,sans-serif",
        fontWeight: 300,
        lineHeight: "1.5em",
        cursor: "pointer"
    }
};


const ProgressHeader = ({ headerTexts, onClickHeader, curSectionInd, stepCountPerSection, stepNo, animateDelay = 0, animateDuration, color, resetAnimation, classes }) => {
    const count = headerTexts.length;
    var curProgress = (stepNo + 1);
    var progressAnim = useAnimation('easeInOut', animateDuration || 1000, animateDelay, resetAnimation);
    if (animateDuration != 0 || animateDelay != 0) {
        curProgress = curProgress - 1 + progressAnim;
    }
    var bgColor = {};
    if (color) {
        bgColor.backgroundColor = color;
    }
    var progressPercent = 100 - 100 * ((curProgress / stepCountPerSection[curSectionInd]) / count + curSectionInd / count);

    return (
        <>
            <div className={classes.topProgressBar} style={bgColor} />
            <div className={classes.progressCover} style={{ width: progressPercent + "%" }} />

            {headerTexts.map((hTxt, ind) => (
                <button key={"headText" + ind} className={classes.progressText + " " + classes.HeaderFont}
                    onClick={() => { if (onClickHeader) onClickHeader(ind); }}
                    style={{
                        background: ind === curSectionInd ? gradientActive : "",
                        left: 100 * ind / count + "%",
                        width: 100 / count + "%",

                    }}>
                    <b>{hTxt}</b>
                </button>
            ))}
        </>
    );
};


ProgressHeader.propTypes = {
    classes: PropTypes.object,
    headerTexts: PropTypes.array.isRequired,
    curSectionInd: PropTypes.number.isRequired,
    stepCountPerSection: PropTypes.array.isRequired,
    stepNo: PropTypes.number.isRequired,
    animateDelay: PropTypes.number,
    animateDuration: PropTypes.number,
    resetAnimation: PropTypes.number,
    color: PropTypes.string,
};

export default (ProgressHeader);