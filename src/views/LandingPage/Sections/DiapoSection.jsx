import React from "react";
// nodejs library that concatenates classes
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// @material-ui/icons

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx"; 
import Card from "components/Card/Card.jsx"; 


// react component for creating beautiful carousel
import Carousel from "react-slick";
// @material-ui/icons
import LocationOn from "@material-ui/icons/LocationOn";
// core components 
import carouselStyle from "assets/jss/material-kit-react/views/componentsSections/carouselStyle.jsx";

import utils from "utils/utils";
import image1 from "assets/img/impotx/camionneur.jpg";
import image2 from "assets/img/impotx/hairdresser1.jpg";
import image3 from "assets/img/impotx/surprised-woman.jpg";

import wimage1 from "assets/img/impotx/camionneur.webp";
import wimage2 from "assets/img/impotx/hairdresser1.webp";
import wimage3 from "assets/img/impotx/surprised-woman.webp";


import Fade from '@material-ui/core/Fade';

class DiapoSection extends React.Component {
  constructor(props){
    super(props);

    this.state={
      ind:0
    };

    this.onBeforeChange = this.onBeforeChange.bind(this);
  }
  onBeforeChange(oldInd, newInd) {
    this.setState({ind: newInd});
  }

  render() {
    const { classes } = this.props; 

    /// TODO : Check Slider Doc : https://react-slick.neostack.com/docs/example/as-nav-for
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: false,
      beforeChange: this.onBeforeChange,
      adaptiveHeight: false,
      height:333,
      afterChange: (a,b)=>{
        //console.log(a);
        //console.log(b);
      }
    };
    var canWebP = utils.canUseWebP();

    return (
      <div className={classes.section} style={{marginTop:120}}>
        <h2 className={classes.title}>Titre optionel</h2>
        <div>
          <GridContainer>
            <GridItem xs={12} sm={12} md={8} className={classes.marginAuto}>
              <Card carousel>
                <Carousel {...settings}>
                  <div className={classes.divSlider} >
                    <img
                      src={canWebP ? wimage1 : image1}
                      alt="First slide"
                      className={"slick-image " + classes.imgSlider}
                    />
                    <Fade timeout={2000} in={this.state.ind === 0}>
                    <div className="slick-caption">
                      <h4>
                        <LocationOn className="slick-icons" />Yellowstone
                        National Park, United States
                      </h4>
                    </div>
                    </Fade>
                  </div>
                  <div className={classes.divSlider} >
                    <img
                      src={canWebP ? wimage2 : image2}
                      alt="Second slide"
                      className={"slick-image " + classes.imgSlider}
                    />
                    <Fade timeout={2000} in={this.state.ind === 1}>
                    <div className="slick-caption">
                      <h4>
                        <LocationOn className="slick-icons" />Somewhere Beyond,
                        United States
                      </h4>
                    </div>
                    </Fade>
                  </div>
                  <div className={classes.divSlider} >
                    <img
                      src={canWebP ? wimage3 : image3}
                      alt="Third slide"
                      className={"slick-image " + classes.imgSlider}
                    />
                    <Fade timeout={2000} in={this.state.ind === 2}>
                    <div className="slick-caption">
                      <h4>
                        <LocationOn className="slick-icons" />Yellowstone
                        National Park, United States
                      </h4>
                    </div>
                    </Fade>
                  </div>
                </Carousel>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
      </div>
    );
  }
}

export default withStyles(carouselStyle)(DiapoSection);
