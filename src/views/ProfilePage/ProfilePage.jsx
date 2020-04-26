import React from "react";
import WrapingImpotPage from "HoC/WrapingImpotPage.jsx";
// nodejs library that concatenates classes
import classNames from "classnames";   
 
import profilePageStyle from "assets/jss/material-kit-react/views/profilePage.jsx";

const ProfilePage = ({classes})=>{
    const imageClasses = classNames(
      classes.imgRaised,
      classes.imgRoundedCircle,
      classes.imgFluid
    );
    const navImageClasses = classNames(classes.imgRounded, classes.imgGallery);
    return (      
      <WrapingImpotPage >
            <div className={classes.container}>
              <div className={classes.description}>
                <p>
                  An artist of considerable range, Chet Faker — the name taken
                  by Melbourne-raised, Brooklyn-based Nick Murphy — writes,
                  performs and records all of his own music, giving it a warm,
                  intimate feel with a solid groove structure.{" "}
                </p>
              </div>
              
            </div>
      </WrapingImpotPage>
    );
  }

export default (ProfilePage);
