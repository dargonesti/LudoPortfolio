import { container, title } from "assets/jss/material-kit-react.jsx";
import impotStyle from "assets/jss/material-kit-react/impotXYZ.jsx";

const landingPageStyle = {
  ...impotStyle,
  
  container: {
    zIndex: "12",
    color: "#FFFFFF",
    ...container
  },
  title: {
    ...title,
    display: "inline-block",
    position: "relative",
    marginTop: "30px",
    minHeight: "32px",
    color: "#FFFFFF",
    textDecoration: "none"
  },
  subtitle: {
    fontSize: "1.313rem",
    maxWidth: "500px",
    margin: "10px auto 0"
  },
  main: {
    background: "#FFFFFF",
    position: "relative",
    zIndex: "3"
  },

};

export default landingPageStyle;
