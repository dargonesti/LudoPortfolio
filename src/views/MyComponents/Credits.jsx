/*eslint eqeqeq:0*/
/*eslint no-mixed-operators:0*/
import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";

import { useInView } from 'react-intersection-observer'
import { useSpring, useSprings, animated, interpolate, config } from 'react-spring';

import useAnimation from './use-animation';

// INTERPOLATIONS
const eInOut = t => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t

const FadingHeader = ({ style }) => {

    return (
        <div style={style}>
            Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
        </div>
    );
};


FadingHeader.propTypes = {
    classes: PropTypes.object,
    style: PropTypes.object
};

export default (FadingHeader);