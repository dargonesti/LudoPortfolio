import React from "react";
import impoHOC from "HoC/impoHOC.js";
// nodejs library that concatenates classes
import classNames from "classnames";
// react components for routing our app without refresh
import { Link } from "react-router-dom";  
// core components
import Header from "components/Header/Header.jsx";
import Footer from "components/Footer/Footer.jsx"; 
import Button from "components/CustomButtons/Button.jsx";
import Parallax from "components/Parallax/Parallax.jsx";
import SectionImmaterial from "./Sections/SectionImmaterial.jsx";

import componentsStyle from "assets/jss/material-kit-react/views/components.jsx";

import auth from 'utils/auth';
import utils from "utils/utils.js";
import DAL from 'utils/DataAccess/DALimpotx';
  
import bg from "assets/img/fromJoe/herosliderwavebackground.png";
import wbg from "assets/img/fromJoe/herosliderwavebackground.webp";

class Components extends React.Component {
 
  render() {
    let { classes, ...rest } = this.props; 
    classes = {};
    /*Header Prop : changeColorOnScroll={{
            height: 400,
            color: "white"
          }}*/
    return (
      <div>
        {false && <Header
          brand="Gnitic" 
          fixed
          color="white"
          
          {...rest}
        />}
      
        <div className={classNames(classes.main, classes.mainRaised)}>
          <SectionImmaterial />
        </div>
        {false && <Footer />}
      </div>
    );
  }
}

export default  (impoHOC(Components,"Components"));
