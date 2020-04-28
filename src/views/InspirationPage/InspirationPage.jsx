import React from "react";
import impoHOC from "HoC/impoHOC.js";
// nodejs library that concatenates classes
import classNames from "classnames"; 

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
       

        <div className={classNames(classes.main, classes.mainRaised)}>
          <ul>

            <li><a href="https://www.akufen.ca/">Akufen.ca, minimalist, good mobile </a></li>
            <li><a href="https://fwa100.jam3.com/">FWA100, Minimalist, animated Intro with Gradient ( but just a 3js demo )</a></li>
            <li><a href="https://www.madeleinedalla.com/">Madeleine Dalla by Marvin Schwaibold ( Photo protfolio )</a></li>


          </ul>
        </div> 

      </div>
    );
  }
}

export default (impoHOC(Components, "Components"));
