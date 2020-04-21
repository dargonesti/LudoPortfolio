import React from "react";
import impoHOC from "HoC/impoHOC.js";
// nodejs library that concatenates classes
import classNames from "classnames";
// react components for routing our app without refresh
import { Link } from "react-router-dom";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// @material-ui/icons
// core components
import Header from "components/Header/Header.jsx";
import Footer from "components/Footer/Footer.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Parallax from "components/Parallax/Parallax.jsx";
import SectionBasics from "./Sections/SectionBasics.jsx";
import SectionNavbars from "./Sections/SectionNavbars.jsx";
import SectionTabs from "./Sections/SectionTabs.jsx";
import SectionPills from "./Sections/SectionPills.jsx";
import SectionNotifications from "./Sections/SectionNotifications.jsx";
import SectionTypography from "./Sections/SectionTypography.jsx";
import SectionJavascript from "./Sections/SectionJavascript.jsx";
import SectionCarousel from "./Sections/SectionCarousel.jsx";
import SectionCompletedExamples from "./Sections/SectionCompletedExamples.jsx";
import SectionLogin from "./Sections/SectionLogin.jsx";
import SectionExamples from "./Sections/SectionExamples.jsx";
import SectionDownload from "./Sections/SectionDownload.jsx";

import SectionSuperAdminImpotX from "./Sections/SectionSuperAdminImpotX.jsx";

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
            <GridContainer>
              <GridItem>
                <div className={classes.brand}>
                  <h1 className={classes.title}>Material Kit React.</h1>
                  <h3 className={classes.subtitle}>
                    A Badass Material-UI Kit based on Material Design.
                  </h3>
                </div>
              </GridItem>
            </GridContainer>
          </div>
        </Parallax>

        <div className={classNames(classes.main, classes.mainRaised)}>

          <Button onClick={() => {
            for (var i = 0; i < 5; i++)
              auth.showToast("Test Toasts!!!", 5000, Date.now() % 1000 > 500 ? "info" : "primary");
          }} >Test Toasts</Button>


          <Button onClick={() => {
            DAL.getAdminNotifications()
              .then(res => {
                utils.log( notifs);
                utils.log( notifs.map(notifArray => {
                  var usr = "usr:" + notifArray[0].username + " - ";
                  usr += "created:" + notifArray[0].createdAt + " - ";
                  usr += "len:" + notifArray.length + " - ";
                  usr += "admin:" + (notifArray[0].admin ? "yes" : "no") + " - ";

                  var typeMsg = "";

                  if (notifArray[0].question) {
                    typeMsg = "qst-" + notifArray[0].question;
                  } else if (notifArray[0].doc) {
                    typeMsg = "doc-" + notifArray[0].doc;
                  }
                  else {
                    typeMsg = "global";
                  }

                  return usr + typeMsg + " - msg:" + notifArray[0].titre + "-" + notifArray[0].texte;
                })); 
              });
          }} >Notifications Test</Button>

          <SectionSuperAdminImpotX />

          <SectionImmaterial />
          <SectionBasics />
          <SectionNavbars />
          <SectionTabs />
          <SectionPills />
          <SectionNotifications />
          <SectionTypography />
          <SectionJavascript />
          <SectionCarousel />
          <SectionCompletedExamples />
          <SectionLogin />
          <GridItem md={12} className={classes.textCenter}>
            <Link to={"/sign-in-page"} className={classes.link}>
              <Button color="primary" size="lg" simple>
                View Login Page
              </Button>
            </Link>
          </GridItem>
          <SectionExamples />
          <SectionDownload />
        </div>
        <Footer />
      </div>
    );
  }
}

export default withStyles(componentsStyle)(impoHOC(Components,"Components"));
