import { container, title } from "assets/jss/material-kit-react.jsx";

import imagesStyle from "assets/jss/material-kit-react/imagesStyles.jsx";

const docsPageStyle = {
  container,
  docGrid:{
    width:"100%"
  },
  profile: {
    textAlign: "center",
    "& img": {
      maxWidth: "160px",
      width: "100%",
      margin: "0 auto",
      transform: "translate3d(0, -50%, 0)"
    }
  },
  description: {
    margin: "1.071rem auto 0",
    maxWidth: "600px",
    color: "#999",
    textAlign: "center !important"
  },
  name: {
    marginTop: "-80px"
  },
  ...imagesStyle,
  main: {
    background: "#FFFFFF",
    position: "relative",
    zIndex: "3"
  },
  mainLowered: {
    margin: "100px 10px 0px",
    borderRadius: "6px",
    boxShadow:
      "0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)"
  },
  title: {
    ...title,
    display: "inline-block",
    position: "relative",
    marginTop: "30px",
    minHeight: "32px",
    textDecoration: "none"
  },
  socials: {
    marginTop: "0",
    width: "100%",
    transform: "none",
    left: "0",
    top: "0",
    height: "100%",
    lineHeight: "41px",
    fontSize: "20px",
    color: "#999"
  },
  navWrapper: {
    margin: "20px auto 50px auto",
    textAlign: "center"
  },


  /// Dialog Détails
  detailModalRoot: {
    // maxWidth: "auto !important",

  },

  detailModalContent: {
    display: "grid",
    gridGap: "10px 0px",
    
    gridAutoRows: "min-content",
    gridTemplateColumns: "repeat(auto-fit)",//"75% 25%",
    gridTemplateAreas:  `"docImg titre" "docImg newMsg" "hist hist"`,
     /* `"docImg titre" 
"docImg hist" 
"hist hist" 
"newMsg newMsg"`,*/
//"docImg titre" "docImg hist" "newMsg newMsg"
//"docImg titre" "docImg hist" "hist hist" "newMsg newMsg"
    "@media (max-width: 700px)": {
      gridTemplateColumns: "100%",
      gridTemplateAreas:
        `"docImg"
        "titre" 
        "hist" 
        "newMsg"`,

        maxHeight: "calc( 100vh - 45px)",
        overflowY:"auto"
    },

    //maxWidth: 666,
    background: "#FAFAFA"
  },

  imgDetails: {
    gridArea: "docImg",
    width: "100%",
    height: "auto",
    //minHeight: "50vh",
    //width: "100%",
    /*gridColumnStart: "1",
    gridColumnEnd: "3",
    gridRowStart: "1",
    gridRowEnd: "3"*/
    //width:"auto"
  },

  titreDetailsModal: {
    marginTop: 10,
    marginLeft: 10,
    gridArea: "titre"
    /* gridColumnStart: "3",
     gridColumnEnd: "4",
     gridRowStart: "1",
     gridRowEnd: "3"*/
  },

  msgHistory: {
    marginTop: 10,
    marginLeft: 10,
    gridArea: "hist",
    /*
    gridColumnStart: "1",
    gridColumnEnd: "2",
    gridRowStart: "3",*/

    overflowX: "visible",
    overflowY: "auto"
  },

  newMessage: {
    marginTop: 10,
    marginLeft: 10,
    gridArea: "newMsg",/*
    gridColumnStart: "2",
    gridColumnEnd: "4",
    gridRowStart: "3",*/

    overflowX: "visible",
    overflowY: "auto"
  }
};

export default docsPageStyle;
