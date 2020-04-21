

const toastStyle = {
 /* toastDiv:{
    backgroundColor:"#01a54e !important",
    div:{
      backgroundColor:"#01a54e !important"
    }
  },*/

    
  msgCount:{
    display: "absolute",
    top:0,
    right:0,
    textAlign:"right",
    marginRight:15,
    color:"inherit",
    fontStyle: "italic",
    opacity: 0.5
  },
  messageText:{
    //marginTop:3,
    marginBottom:0,
    marginRight:10
  },
  closeBtn:{    
    position: "absolute",
    top: -20,
    right: -15,
    margin: 0,
    padding: 0,
    minWidth: 36,
    borderBottomRightRadius:0 ,
    borderTopRightRadius:10 // matching the toast
  },



/*

  block: {
    color: "inherit",
    padding: "0.9375rem",
    fontWeight: "500",
    fontSize: "12px",
    textTransform: "uppercase",
    borderRadius: "3px",
    textDecoration: "none",
    position: "relative",
    display: "block"
  },
  left: {
    float: "left!important",
    display: "block"
  },
  right: {
    padding: "15px 0",
    margin: "0",
    float: "right!important"
  }, 
  a: {
    color: primaryColor,
    textDecoration: "none",
    backgroundColor: "transparent"
  },
  footerWhiteFont: {
    "&,&:hover,&:focus": {
      color: "#FFFFFF"
    }
  },
  container,
  list: {
    marginBottom: "0",
    padding: "0",
    marginTop: "0"
  },
  inlineBlock: {
    display: "inline-block",
    padding: "0px",
    width: "auto"
  },
  icon: {
    width: "18px",
    height: "18px",
    position: "relative",
    top: "3px"
  }//*/
};
export default toastStyle;
