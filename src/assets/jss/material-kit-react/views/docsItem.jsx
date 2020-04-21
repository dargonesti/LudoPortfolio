
import popoverStyles from "assets/jss/material-kit-react/popoverStyles.jsx";

const docItemStyle = ({
  ...popoverStyles,
  card: {
    width: "100%",
    display: 'flex',
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 5
  },
  titreDoc:  {
    minWidth: "calc( 100% - 500px )",
    maxWidth: 500
  },
  details: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
    justifyContent: "space-between",
    alignItems: "center"
  },
  content: {
    flex: 'auto 1 1',
    marginRight: 10,
    marginLeft: 10,
    flexGrow: 1
  },
  cover: {
    width: 151,
    //height: 151,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    //paddingLeft: theme.spacing.unit,
    //paddingBottom: theme.spacing.unit,
  },
  playIcon: {
    height: 38,
    width: 38,
  },
  myTextField: {
    padding: 0,
    margin: 0,

  },

  defaultPaper: {
    //boxShadow : ""
  },
  SelectedPaper: {
    //backgroundColor: "#acffc6",
    boxShadow: "0px 2px 5px 6px rgba(0, 222, 0, 0.2), 0px 2px 2px 0px rgba(0, 123, 0, 0.14), 0px 3px 1px -2px rgba(0, 123, 0, 0.12)"
    //boxShadow : ""
  },
  NotificationPaper: {
    // backgroundColor: "#6696ff",
    boxShadow: "0px 2px 5px 6px rgba(0, 0, 222, 0.2), 0px 2px 2px 0px rgba(0, 0, 123, 0.14), 0px 3px 1px -2px rgba(0, 0, 123, 0.12)"
    //boxShadow : ""
  },
  CompletedPaper: {
    backgroundColor: "#dadada",
    //boxShadow : ""
  },

  cardImg: {
    "@media (max-width: 500px)": {
      //display: "none",
    },
  }
});

export default docItemStyle;
