import { container } from "assets/jss/material-kit-react.jsx";


const docsPageStyle = {
  container,
  popover: {
    padding: "0px 5px 5px 5px"
  },

  notif: {
    cursor: "pointer"
  },

  notifNew: {
    color: "#2a2",
    "&:hover": {
      color: "#4f4 !important"
    }
  },
  notifSeen: {
    color: "#666",
    "&:hover": {
      color: "#aaa !important"
    }
  }
  ,

  card: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 5
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    justifyContent: "space-evenly"
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

};

export default docsPageStyle;
