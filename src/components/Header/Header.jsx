import React, { useState } from "react";
import { Link } from "react-router-dom";
// nodejs library that concatenates classes
import classNames from "classnames";
// nodejs library to set properties for components
import PropTypes from "prop-types"; 

//Image Logo 
import HeaderLinks from "components/Header/HeaderLinks.jsx";

import utils from "utils/utils";
import { useStore } from 'utils/mobx/ConfigStore';
import { observer } from 'mobx-react-lite';
//TODO Ludovic : Ajouter MobX pour que Qst List lui dise quand se cacher 

import throttle from 'lodash.throttle';
import { useEffect } from "react";

const WithMobx = observer((props) => {
  const store = useStore()
  useEffect(() => {
    console.log(store.replacesStickyHeader)
  }, [store.replacesStickyHeader])

  return <Header {...props} stickyReplace={store.replacesStickyHeader} />
})

const Header = (props) => {

  const {
    classes,
    color,
    leftLinks,
    //brand,
    fixed,
    absolute,
    stickyReplace
  } = props;
  const rightLinks = props.rightLinks || <HeaderLinks onLogout={()=>{}} />; 
  let ifSticky = stickyReplace ? " " + classes.stickyHidden : "";

  return (
    <div>
      TODO : My header
    </div>
  );

}

Header.defaultProp = {
  color: "white"
};

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  color: PropTypes.oneOf([
    "primary",
    "info",
    "success",
    "warning",
    "danger",
    "transparent",
    "white",
    "rose",
    "dark"
  ]),
  rightLinks: PropTypes.node,
  leftLinks: PropTypes.node,
  brand: PropTypes.string,
  fixed: PropTypes.bool,
  absolute: PropTypes.bool, 
  changeColorOnScroll: PropTypes.shape({
    height: PropTypes.number.isRequired,
    color: PropTypes.oneOf([
      "primary",
      "info",
      "success",
      "warning",
      "danger",
      "transparent",
      "white",
      "rose",
      "dark"
    ]).isRequired
  })
};

export default  (WithMobx);
