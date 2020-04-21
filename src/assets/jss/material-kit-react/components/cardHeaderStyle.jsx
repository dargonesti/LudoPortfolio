import {
  warningCardHeader,
  successCardHeader,
  dangerCardHeader,
  infoCardHeader,
  primaryCardHeader
} from "assets/jss/material-kit-react.jsx";

const sentinelHeight = 100;
const headerTopPos = 86;
const headerTopPosMobile = 80;

const cardHeaderStyle = {
  cardHeader: {
    borderRadius: "3px",
    padding: "1rem 15px",
    marginLeft: "15px",
    marginRight: "15px",
    marginTop: "-30px",
    border: "0",
    marginBottom: "0",

    //For sticky observer 
    //top:-1
  },
  cardHeaderPlain: {
    marginLeft: "0px",
    marginRight: "0px"
  },
  headerSentinel:{
    position: "absolute", 
    left:0,
    width: "100%",
    height: sentinelHeight,
    pointerEvents:"none",

    backgroundColor:"white",
    opacity:0
  },
  headerSentinelTop:{
    top: -(headerTopPos+1)
  },
  headerSentinelBottom:{
    bottom: "-80vh"
  },

  "@media (max-width: 500px)": { 
    isSticky:{
      top: "0px !important"
    }
  },
  warningCardHeader,
  successCardHeader,
  dangerCardHeader,
  infoCardHeader,
  primaryCardHeader
};

export default cardHeaderStyle;
