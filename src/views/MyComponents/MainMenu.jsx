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
                <li><a target="_blank" href="https://www.facebook.com/ludovic.migneault" >Facebook</a></li>
                <li><a target="_blank" href="https://instagram.com/ludovicmigneault" >Instagram</a></li>
                <li><a target="_blank" href="https://unsplash.com/@dargonesti" >Unsplash</a></li>
                <li><a target="_blank" href="https://medium.com/@ludovic.migneault" >Medium</a></li>
                <li><a target="_blank" href="https://www.youtube.com/user/migneault62/" >Youtube</a></li>
                <li><a target="_blank" href="https://dashboard.twitch.tv/u/dargonesti" >Twitch</a></li>
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