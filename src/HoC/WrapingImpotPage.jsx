import React, {useEffect, useState} from "react";

// nodejs library that concatenates classes
import classNames from "classnames"; 
 
// core components 
import Header from "components/Header/Header.jsx";
import Footer from "components/Footer/Footer.jsx";
import Parallax from "components/Parallax/Parallax.jsx";
 

import bg2 from "assets/img/impotx/background2.jpg";
import wbg2 from "assets/img/impotx/background2.webp";

import utils from "utils/utils.js";
import auth from "utils/auth.js";
import localData from "utils/DataAccess/localData.js";

import profilePageStyle from "assets/jss/material-kit-react/views/adminPages.jsx";


const WrapingImpotPage = (props) => {
  const { classes, blurred, firebaseData, ...rest } = props; 
  const [randomNum, setNum] = useState(0);
  const update=()=>setNum(Math.random());

  useEffect(()=>{    
    utils.addListener("openChatWithUser", "WrapingImpotPage", update);

    return()=>{
        utils.removeListener("openChatWithUser", "WrapingImpotPage");
    };
  })

  function shouldShowChat() {
    return utils.isChatActive() //&& !localData.get("chatWindowClosed");
  }
 

  var style = {};
  if (blurred) {
    style = {
      animationName: "blurIn",
      animationDuration: "2s",
      animationFillMode: "both",
      animationDelay: "0.33s",
      overflowY: "hidden",
      height: "100vh"
      //pointerEvents: "none" // doesn't wortk
      // animationTimingFunction: "ease-in-out"
      //animationDirection: "alternate"
    }
    //style.filter = "blur(6px) brightness(0.6)";
  }
  return (
    <> 
      <div style={style}>
        <Header
          color="transparent"
          brand="Gnitic"
          fixed
          changeColorOnScroll={{
            height: 10,
            color: "dark"
          }}
          {...rest}
        />

        <Parallax xsmall filter image={utils.canUseWebP() ? wbg2 : bg2} />

        <div className={classNames(classes.main, classes.mainRaised)}>
          <div className={classes.mainContentMargin}>
            {props.children}
 
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default (WrapingImpotPage);
