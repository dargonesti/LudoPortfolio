/*eslint eqeqeq:0*/
/*eslint no-mixed-operators:0*/
import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";

import { useInView } from 'react-intersection-observer'
import { useSpring, useSprings, animated, interpolate, config } from 'react-spring';

import useAnimation from './use-animation';
import "./scss/MainMenu.scss";

// INTERPOLATIONS
const eInOut = t => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t

const FadingHeader = ({ children, startDelay, style }) => {

    const [ref, inView, entry] = useInView({
        /* Optional options */
        threshold: [0, 1]//[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.8, 1],
    })

    /* useEffect(() => {
         if(entry){
           console.log(entry.intersectionRatio)
         }
     }, [entry.intersectionRatio, inView])*/

    return (
        <div className="navigation">
            <input type="checkbox" id="navi-toggle" />

            <label htmlFor="navi-toggle" >
                <span className="icon">&nbsp;</span>
            </label>

            <div className="background">&nbsp;</div>

            <nav className="nav">
                <ul >
                    <li ><a href="#"><span>01</span>About Natous</a></li>
                    <li ><a href="#" ><span>02</span>Your benfits</a></li>
                    <li ><a href="#" ><span>03</span>Popular tours</a></li>
                    <li ><a href="#" ><span>04</span>Stories</a></li>
                    <li ><a href="#" ><span>05</span>Book now</a></li>
                </ul>
            </nav>
        </div>
    );
};


FadingHeader.propTypes = {
    classes: PropTypes.object,
    style: PropTypes.object
};

export default (FadingHeader);