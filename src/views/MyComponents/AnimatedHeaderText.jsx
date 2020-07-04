/*eslint eqeqeq:0*/
/*eslint no-mixed-operators:0*/
import React from "react";
import PropTypes from "prop-types";
 
import { useSpring, useSprings, animated, interpolate, config} from 'react-spring';

import useAnimation from './use-animation';

// INTERPOLATIONS
const eInOut = t => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t

const fromTitre = i => ({ opacity: 0, rot: 90 })
const toTitre = i => ({
  opacity: 1,
  rot: 0,
  delay: Math.log2(i+1) * 250 + 200,
})
const transTitre = (rot) => `perspective(123px) rotateY(${rot}deg)`

const AnimatedHeaderText = ({ text, startDelay, style }) => {
    let [lettresTitre, setTitres] = useSprings(text.length, i => ({ ...toTitre(i), from: fromTitre(i), config:{duration: 500, easing: eInOut }}))

    return (
        <>
           {lettresTitre.map(({ opacity, rot }, i) => (
              <animated.span key={i} style={{
                opacity: opacity,
                transform: interpolate([rot], transTitre)
              }}>
                {text.split("")[i]}
              </animated.span>
            ))}
        </>
    );
};


AnimatedHeaderText.propTypes = {
    classes: PropTypes.object,
    text: PropTypes.string.isRequired,
    startDealy: PropTypes.number,
    style: PropTypes.object
};

export default (AnimatedHeaderText);