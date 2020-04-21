import { container } from "assets/jss/material-kit-react.jsx";

const carouselStyle = {
  section: {
    padding: "70px 0"
  },
  container,
  marginAuto: {
    marginLeft: "auto !important",
    marginRight: "auto !important"
  },
  divSlider: {
    height: 333,
     overflowY:"hidden" 
  },
   // Permet de centrer verticalement une image qui est plus grosse que son parent
  imgSlider:{    
    position: "absolute",
    top: "-100%",
    left:0,
    right: 0,
    bottom:"-100%",
    margin: "auto",
    width: "100%",
    height:"auto"
  }
};

export default carouselStyle;
