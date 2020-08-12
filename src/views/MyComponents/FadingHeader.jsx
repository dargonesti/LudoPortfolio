/*eslint eqeqeq:0*/
/*eslint no-mixed-operators:0*/
import React , { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";

import { useInView } from 'react-intersection-observer'
import { useSpring, useSprings, animated, interpolate, config } from 'react-spring';

import useAnimation from './use-animation';

// INTERPOLATIONS
const eInOut = t => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t

const FadingHeader = ({ children, startDelay, style }) => {

    const [ref, inView, entry] = useInView({
        /* Optional options */
        threshold: [0,1]//[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.8, 1],
      })

     /* useEffect(() => {
          if(entry){
            console.log(entry.intersectionRatio)
          }
      }, [entry.intersectionRatio, inView])*/

    return (
        <>         
                <div ref={ref}
                    style={{ position: "absolute", height: 50, top: 0, left: 0, width: 1, zIndex:5, 
                    opacity: 0 }} />
            <div style={{position:"fixed", top: 0, right: 0, 
            transition: "opacity 0.3s", opacity: (inView ? 1 : 0)}} >
                {children}
            </div>
        </>
    );
};


FadingHeader.propTypes = {
    classes: PropTypes.object,
    style: PropTypes.object
};

export default (FadingHeader);