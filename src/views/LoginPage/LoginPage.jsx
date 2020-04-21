import React from "react";
import { Link, Redirect } from 'react-router-dom'
import impoHOC from "HoC/impoHOC.js";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import Header from "components/Header/Header.jsx";
import Footer from "components/Footer/Footer.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";

import ToastMessages from "components/Footer/ToastMessages";
import NotificationToastMessages from "components/Footer/NotificationToastMessages";

import loginPageStyle from "assets/jss/material-kit-react/views/loginPage.jsx";

import bg1 from "assets/img/impotx/background1.jpg";
import wbg1 from "assets/img/impotx/background1.webp";

import LoginForm from "./LoginForm.jsx";


// Utils
import auth from 'utils/auth';
import utils from "utils/utils.js";
import DAL from "utils/DataAccess/DALimpotx.js";

class LoginPage extends React.Component {

  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      cardAnimaton: "cardHidden",
      email: "",
      pass: "",
      successLogin: false
    };
    this.clickLogin = this.clickLogin.bind(this);
    this.clickLogout = this.clickLogout.bind(this);
    this.handleChange = this.handleChange.bind(this);

    if (auth.getUserInfo()) {
      if (auth.isAdmin()) {
        this.props.setRedirect("/find-user-page");
      } else {
        this.props.setRedirect("/user-profile-page");
      }
    }
  }
  clickLogin(ev) {

    //var reqBody = { "identifier": this.state.email, "password": this.state.pass };
    //console.log(reqBody);

    //request("auth/local", { method: "POST", body: reqBody })

    //TODO : Afficher loader icon et bloquer la page en attendant.
    DAL.auth(this.state.email, this.state.pass).then(res => {
      utils.log(res);

      auth.setToken(res.jwt, true); // True => body.rememberMe
      auth.setUserInfo(res.user, true); // True => body.rememberMe
      auth.setFirebaseToken(res.firebaseToken, true); 

      DAL.getUser()
        .then(res => {
          utils.log(res);
          this.setState({ successLogin: true });
          auth.setUserInfo(res, true);
          this.setState({ redirect: "questions-page" });

        }).catch(ex => {
          utils.log(ex);
        });

      //window.location.reload();
    }).catch(ex => {
      utils.log(ex);
    });
    //auth.login(this.state.login/pwd)
  }

  clickLogout(ev) {
    utils.callEvent("Logout");
    auth.clearAppStorage();
    auth.clearToken();
    auth.clearUserInfo();
    this.setState({ redirect: "/" });
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }
  componentDidMount() {
    // we add a hidden class to the card and after 700 ms we delete it and the transition appears
    setTimeout(
      function () {
        this.setState({ cardAnimaton: "" });
      }.bind(this),
      700
    );
  }
  render() {
    const { classes, ...rest } = this.props;
    if (auth.getToken())
      return <Redirect to="/" />
    else
      return (
        <div>
          <ToastMessages />
          <NotificationToastMessages />
          <Header
            absolute
            color="transparent"
            brand="Gnitic"
            {...rest}
      />
          <div
            className={classes.pageHeader}
            style={{
              backgroundImage: "url(" + (utils.canUseWebP() ? wbg1 : bg1) + ")",
              backgroundSize: "cover",
              backgroundPosition: "top center"
            }}
          >
            <div className={classes.container}>
              <GridContainer justify="center">
                <GridItem xs={12} sm={12} md={4}>
                  <LoginForm />
                </GridItem>
              </GridContainer>
            </div>
            {this.state.successLogin && <Redirect to='/questions-page' />}
            <Footer whiteFont />
          </div>
        </div>
      );
  }
}

export default withStyles(loginPageStyle)(impoHOC(LoginPage, "LoginPage"));
