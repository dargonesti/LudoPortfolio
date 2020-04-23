import React from "react";
import impoHOC from "HoC/impoHOC.js";
// nodejs library that concatenates classes
import classNames from "classnames";
// react components for routing our app without refresh
import { Link } from "react-router-dom";  
// core components
import Header from "components/Header/Header.jsx";
import Footer from "components/Footer/Footer.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
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
    const { classes, ...rest } = this.props;
    var notifs = DAL.getAdminNotifications();
    /*Header Prop : changeColorOnScroll={{
            height: 400,
            color: "white"
          }}*/
    return (
      <div>
        <Header
          brand="Gnitic" 
          fixed
          color="white"
          
          {...rest}
        />
        <Parallax image={utils.canUseWebP() ? wbg : bg} withGreen style={{
          //backgroundColor: "#129019",
          backgroundColor:"linear-gradient(rgba(99,250,99,1), rgba(0,200,0,1))", zIndex:2, backgroundSize:"cover", backgroundRepeat: "no-repeat",
          boxSizing: "content-box"
          }}>
          <div className={classes.container}>
           header?
          </div>
        </Parallax>

        <div className={classNames(classes.main, classes.mainRaised)}>


          <SectionImmaterial />
        </div>
        <Footer />
      </div>
    );
  }
}

export default  (impoHOC(Components,"Components"));
