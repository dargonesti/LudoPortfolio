import { container, title } from "assets/jss/material-kit-react.jsx";

import imagesStyle from "assets/jss/material-kit-react/imagesStyles.jsx";

const messagesStyle = {
  container,

  flexGroup: {
    justifyContent: "space-between",
    alignItems: "flex-start",
    display:"flex",
    flexFlow: "row wrap"
  },
  flexColumn: {
    flexGrow: 1,
    marginRight: 10,
    marginLeft:10,
    //width: "calc(33% - 25px)",
    minWidth:300,
    maxWidth:500
  },
  flexItem: {
    //boxShadow: "inset 0px 0px 9px 0px rgba(0,0,0,0.22)"
    borderStyle:"dashed",
    borderWidth:"1px 0px 0px 1px",
    borderRadius: "5px 0px 0px 0px",
    marginTop:20
  },
  unseenMessage: {
    borderWidth:"1.5px 0px 0px 1.5px",
    borderColor: "#090",
  },

  tagType: {
    float: "left",
    //margin: "0px 10px",
    margin: "-10px 10px 0px -6px",
    backgroundColor:"#fff",
    padding:"0px 2px",
  },
  mbSummary: {
    // float:"none",
    // clear: "none",
    marginLeft: 45,
  },
  expandIcon: {
    float: "left",
    margin: "5px 10px",
    cursor: "pointer"
  },
  qstTitre: {
    display: "inline-flex",
    //marginTop:-12,
    backgroundColor:"#fff",
    //textDecoration: "underline",
    cursor: "pointer",
    position:"relative",
    top:-13,
    padding:"0px 5px",

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

  messageBlock: {
    maxWidth: 300,
    minWidth: 50,
    textAlign: "right",
    margin: 3,
    padding: "5px 15px",
    border: "black",
    display: "block",
    clear: "both",
  },

  mbMe: {
    borderRadius: "15px 15px 3px 15px",
    background: "#4080F0",
    float: "right",
    color: "white"
  },
  mbNotMe: {
    borderRadius: "15px 15px 15px 3px",
    background: "#E5E5E5",
    float: "left",
    color: "black"
  },

  textInBubble: {
    color: "inherit"
  },

  collapseContainer: {
    display: "block",
    width: "auto",
    float: "right",
    clear: "both",
    color: "grey !important"
  },

  ccNotMe: {
    float: "left"
  }

};

export default messagesStyle;