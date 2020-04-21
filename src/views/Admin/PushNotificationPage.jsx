import React from "react";
import impoHOC from "HoC/impoHOC.js";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components 
import { Button, Dialog, DialogContent, DialogActions, Slide} from '@material-ui/core';

import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";

import { WarningOutlined } from "@material-ui/icons";

import TextField from '@material-ui/core/TextField';
import ThrottledTextField from "views/ImpoCompo/ThrottledTextField";

import withStyles from "@material-ui/core/styles/withStyles";
// core components
import Header from "components/Header/Header.jsx";
import Footer from "components/Footer/Footer.jsx";
import Parallax from "components/Parallax/Parallax.jsx";

import DAL from "utils/DataAccess/DALimpotx.js";
import auth from "utils/auth.js";
import impoTxt from 'texts/localization';


const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 500,
  },
  tablePagination: {
    backgroundColor: theme.palette.secondary.light
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
});


const rows = [
  { id: 'username', numeric: false, disablePadding: true, label: impoTxt.findUserName },
  { id: 'email', numeric: true, disablePadding: false, label: impoTxt.findEmail },
  { id: 'createdAt', numeric: true, disablePadding: false, label: impoTxt.findCreated },
  { id: 'lastActivity', numeric: true, disablePadding: false, label: impoTxt.findLastActivity },
  { id: 'repCount', numeric: true, disablePadding: false, label: impoTxt.findRepCount },
  { id: 'isComplete', numeric: false, disablePadding: false, label: impoTxt.findIsComplete },
  { id: 'etatCompte', numeric: true, disablePadding: false, label: impoTxt.findState },
];

function filtrerUsers(user) {
  var regFiltre = RegExp(".*(" + this.state.filtre + ").*", "i");
  return rows.some((col) => user[col.id]
    && user[col.id].toString().match(regFiltre))
}


const SendNotifToUser = ({ user, message, titre }) => (
  <GridItem xs={12} sm={6} md={4} lg={3} ><Button onClick={() => {
    if (message) {
      DAL.sendNotification(user._id, message, titre || impoTxt.adminNotificationTitle);
    }
    else {
      auth.showToast(impoTxt.toastMessageVide, 5000, "danger");
    }
  }}>{impoTxt.adminSend}</Button>{user.email}</GridItem>
);

function Transition(props) {
  return <Slide direction="down" {...props} />;
}
const ConfirmAction = ({ onConfirm, onDecline }) => {
  return (
    <Dialog
      open={true}
      TransitionComponent={Transition}
      keepMounted
      onClose={onDecline}
      aria-labelledby="classic-modal-slide-title"
      aria-describedby="classic-modal-slide-description"
    >
      <DialogContent
        id="classic-modal-slide-description"
        style={{ paddingBottom: 0 }}
      >
        <WarningOutlined style={{ fill: "red" }} />
        <p>{impoTxt.YouSure}</p>
      </DialogContent>
      <DialogActions
        style={{ marginTop: 0 }}>
        <Button
          onClick={onConfirm}
          simple="true">
          {impoTxt.Oui}
                    </Button>

        <Button
          onClick={onDecline}
          simple="true"
        >
          {impoTxt.Non}
                    </Button>
      </DialogActions>
    </Dialog>);
}

class PushNotificationPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      users: [],
      order: 'asc',
      orderBy: 'username',
      selected: [],
      titre: "",
      message: "",
      filtre: ""
    };

    this.handleFiltre = this.handleFiltre.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
    this.handleTitre = this.handleTitre.bind(this);
    this.handleConfirmedSendAll = this.handleConfirmedSendAll.bind(this);
    this.handleConfirmedSendAll = this.handleConfirmedSendAll.bind(this);
  }
  handleFiltre = (ev) => {
    this.setState({ filtre: ev.target.value });
  };
  handleMessage = (val) => {
    warnLongNotif(val);
    this.setState({ message: val });
  };
  handleTitre = (val) => {
    warnLongNotif(val);
    this.setState({ titre: val });
  };

  componentDidMount() {
    DAL.getUsers("ignoreCache!").then(resp => {
      this.setState({ users: Object.values(resp) });
    });

  }

  handleConfirmedSendAll() {
    DAL.sendNotification(null, this.state.message, impoTxt.adminNotificationTitle);
    this.setState({ confirmSendAll: false });
  }
  // <Collapse collapsedHeight={50} in={false} timeout={{ enter: 666, exit: 2222 }}>

  render() {
    const { users, message, titre, confirmSendAll } = this.state;
    //const emptyRows = rowsPerPage - Math.min(rowsPerPage, users.length - page * rowsPerPage);
    const { classes, ...rest } = this.props;

    return (
      <div>
        <Header
          color="transparent"
          brand="Gnitic"
          fixed
          changeColorOnScroll={{
            height: 10,
            color: "dark"
          }}
          {...rest}
        />

        <Parallax small filter image={require("assets/img/impotx/background2.jpg")} />

        <div className={classNames(classes.main, classes.mainRaised)}>

        <ThrottledTextField noAnimation fullWidth autoFocus multiline rowsMax={2} value={this.state.titre} onChange={this.handleTitre} style={{ width: 375, margin: 10 }}
        label={impoTxt.TitreNotif}  placeholder={ impoTxt.adminNotificationTitle} ></ThrottledTextField>
          <br />
          <ThrottledTextField noAnimation fullWidth autoFocus multiline rowsMax={2} 
          label={impoTxt.Message} value={this.state.message} onChange={this.handleMessage} style={{ width: 375, margin: 10 }}></ThrottledTextField>
                  
          <br />


          {/* SECTION BROADCAST TO ALL */}


          {/* SECTION SEND TO SELECTED */}

          <Button color="secondary" onClick={() => {
            if (message) {
              this.setState({ confirmSendAll: true });
            }
            else {
              auth.showToast(impoTxt.toastMessageVide, 5000, "danger");
            }
          }}>{impoTxt.adminSendAll}</Button> <br />

          <TextField label={impoTxt.Filtre} value={this.state.filtre} onChange={this.handleFiltre} style={{ margin: 10 }}></TextField>


          <GridContainer>
            {users
              .filter(filtrerUsers.bind(this))
              .map(usr => <SendNotifToUser key={usr._id} user={usr} message={message} titre={titre} />)}
          </GridContainer>

          {confirmSendAll &&
            <ConfirmAction onConfirm={this.handleConfirmedSendAll} onDecline={() => this.setState({ confirmSendAll: false })} />}
        </div>
        <Footer />
      </div>
    );
  }
}

function warnLongNotif(msg){  
  if(msg.length > 45)
  {
    auth.showToast(impoTxt.adminLongNotif + " (" + msg.length + "/" + 45 + ")"
      , 5000,"danger");
  }
}
//export default withStyles(profilePageStyle)(FindUserPage);
export default withStyles(styles, { withTheme: true })(impoHOC(PushNotificationPage, "PushNotifs"));
