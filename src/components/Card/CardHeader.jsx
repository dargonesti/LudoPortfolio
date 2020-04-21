import React, { useState, useEffect } from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// @material-ui/icons

// core components
import cardHeaderStyle from "assets/jss/material-kit-react/components/cardHeaderStyle.jsx";

import { useStore } from 'utils/mobx/ConfigStore';

function CardHeader({ ...props }) {
  const [isSticky, setIsSticky] = useState(false)
  const ref = React.createRef()
  const refBot = React.createRef()
  const store = useStore()

  const { classes, className, innerRef, children, color, plain, ...rest } = props;

  const cardHeaderClasses = classNames({
    [classes.cardHeader]: true,
    [classes[color + "CardHeader"]]: color,
    [classes.cardHeaderPlain]: plain,
    [className]: className !== undefined
  });

  //On Create
  useEffect(() => {
    const cachedRef = ref.current

    const observer = new IntersectionObserver(
      ([e]) => {
        console.log("TestLudovic sticky : ", e.intersectionRatio)
        setIsSticky(e.intersectionRatio < 1)
        store.replaceSticky(e.intersectionRatio < 1 && e.intersectionRatio > 0)
      },
      {
        //root: container.ref,
        threshold: [0, 1]
      }// [1]}
    )
    observer.observe(cachedRef);

    //On Destroy
    return () => {
      observer.unobserve(cachedRef);
    }
  }, [])

  let ifStycky = isSticky ? " "+classes.isSticky : "";

  return (
    <div className={cardHeaderClasses + ifStycky} {...rest}>
      <div ref={ref} className={classes.headerSentinel + " " + classes.headerSentinelTop} />
      {children}
      {false &&
        <div ref={refBot} className={classes.headerSentinel + " " + classes.headerSentinelBottom} />}
    </div>
  );
}

CardHeader.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  color: PropTypes.oneOf(["warning", "success", "danger", "info", "primary"]),
  plain: PropTypes.bool
};

export default withStyles(cardHeaderStyle)(CardHeader);
