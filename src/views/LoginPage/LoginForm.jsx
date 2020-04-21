import React from "react";
import { Redirect } from 'react-router-dom';
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Email from "@material-ui/icons/Email";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";

import loginPageStyle from "assets/jss/material-kit-react/views/loginPage.jsx";


import BlockUi from 'react-block-ui';
// Utils
import auth from 'utils/auth';
import impoTxt from 'texts/localization';

import request from 'utils/request';
import DAL from "utils/DataAccess/DALimpotx.js";
import utils from "utils/utils";

class LoginForm extends React.Component {

  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      cardAnimaton: "cardHidden",
      email: "",
      pass: "",
      successLogin: false,
      redirect: null
    };
    this.onClose = this.onClose.bind(this);
    this.clickLogin = this.clickLogin.bind(this);
    this.clickLogout = this.clickLogout.bind(this);
    this.clickForgot = this.clickForgot.bind(this);
    this.clickQuestions = this.clickQuestions.bind(this);
    this.clickRegister = this.clickRegister.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  componentWillUnmount() {
    this._unmounted = true;
  }
  clickLogin(ev) {
    DAL.auth(this.state.email, this.state.pass).then(res => {
      utils.log(res);
      if(res && res.jwt && res.user){

      auth.setToken(res.jwt, true); // True => body.rememberMe
      auth.setUserInfo(res.user, true); // True => body.rememberMe
      if(utils.isChatActive())
        auth.setFirebaseToken(res.firebaseToken, true); 

      var conErr = ex => {
        utils.log(ex);
        auth.clearAppStorage();
        auth.clearToken();
        auth.clearUserInfo();
        if (!this._unmounted)
          this.setState({ redirect: "/" });
        auth.showToast(impoTxt.toastErrCon , 5000, "danger"); //+ ex.message
      };

      DAL.getUser()
        .then(res => {
          utils.log(res);
          if (!this._unmounted)
            this.setState({ successLogin: true });
          auth.setUserInfo(res, true);
          auth.showToast(impoTxt.toastWelcome);
          utils.callEvent("Login", {userId: res._id, isAdmin: auth.isAdmin()});
          if (auth.isAdmin()) {
            var necessaryData = 0;
            //Changed to cached Users
            DAL.getUsers("ignoreCache").then(res => {
              if (necessaryData++ >= 1) {
                if (!this._unmounted)
                  this.setState({ redirect: "find-user-page" });
              }
            })
              .catch(conErr);
            DAL.getQuestions("ignoreCache").then(res => {
              if (necessaryData++ >= 1) {
                if (!this._unmounted)
                  this.setState({ redirect: "find-user-page" });
              }
            })
              .catch(conErr);
          } else
            DAL.getQuestions("ignoreCache").then(res => {
              if (!this._unmounted) {
               // window.scrollTo(0, 0)
                this.setState({ redirect: "user-profile-page" });
              }
            })
              .catch(conErr);
        }).catch(conErr);

      }else{
        auth.showToast(impoTxt.toastErrCon , 5000, "danger");      // + (res || res())       
      }
      //window.location.reload();
    }).catch(ex => {
      auth.showToast(impoTxt.toastErrCon, 5000, "danger");// + ex.message
      utils.log(ex);
    });
    this.onClose();
    //auth.login(this.state.login/pwd)
  }

  clickRegister() {
    if (!this._unmounted)
      this.setState({ redirect: "/sign-in-page" });
    this.onClose();
  }

  /// CHECK : https://strapi.io/documentation/3.x.x/guides/authentication.html#forgotten-password
  clickForgot() {
    if (this.state.email) {
      this.setState({ emailing: true });
      request("auth/forgot-password", {
        method: "POST",
        body: {
          email: this.state.email,
          url: "https://impotx.gnitic.com/reset-page"
        }
      })
        .then((res) => {
          auth.showToast(impoTxt.toastMailSent);
          this.setState({ emailing: false });
        }).catch(res => {
          auth.showToast(impoTxt.toastErrEnvoieCourriel, 3333, "danger");
          this.setState({ emailing: false });
        });
    }
    else {
      auth.showToast(impoTxt.toastNeedEmail, 3333, "danger");
    }
  }

  clickLogout() {
    
    utils.callEvent("Logout");

    auth.clearAppStorage();
    auth.clearToken();
    auth.clearUserInfo();

    if (!this._unmounted)
      this.setState({ redirect: "/" });
    this.forceUpdate();
    setTimeout(() => {
    }, 123);
    auth.showToast(impoTxt.toastBye, null, "info");
    this.onClose();
  }

  onClose() {
    if (this.props.handleCloseModal) {
      //this.props.handleCloseModal();
    }
  }
  clickQuestions() {
    if (!this._unmounted)
      this.setState({ redirect: "/questions-page" });
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  componentDidMount() {
    this._unmounted = false;
    // we add a hidden class to the card and after 700 ms we delete it and the transition appears
    setTimeout(
      function () {
        this.setState({ cardAnimaton: "" });
      }.bind(this),
      700
    );
  }

  render() {
    const { classes } = this.props;
    var loc = this.props.Location || this.props.location || window.location.href;
    if (this.state.redirect && !loc.endsWith(this.state.redirect)) {
      return <Redirect to={this.state.redirect} />;
    }
    else {
      if (auth.getToken())
        return (<div>
          <GridContainer >
            <GridItem md={12}>
              <h4>{impoTxt.conWannaLogout}</h4>
            </GridItem>

            <GridItem xs={12} md={6}>

              <Button simple color="primary" size="lg" onClick={this.clickLogout}>
                {impoTxt.conLogout}
              </Button>
            </GridItem>

            <GridItem xs={12} md={6}>

              <Button color="primary" size="lg" onClick={this.clickQuestions} simple>
                {impoTxt.conGotoQ}
              </Button>

            </GridItem>
          </GridContainer>
        </div>
        );
      else
        return (
          <Card className={classes[this.state.cardAnimaton]}>
            <BlockUi tag="div" blocking={this.state.emailing} >
              <form className={classes.form}>
                <CardHeader color="primary" className={classes.cardHeader}>
                  <h4>{impoTxt.conLogin}</h4>
                </CardHeader>
                <CardBody> 
                    <CustomInput
                      labelText={impoTxt.conUsername}
                      id="email"
                      onChange={this.handleChange}
                      formControlProps={{
                        fullWidth: true
                      }}
                      autoFocus
                      inputProps={{
                        type: "email",
                        onChange: this.handleChange,
                        endAdornment: (
                          <InputAdornment position="end">
                            <Email className={classes.inputIconsColor} />
                          </InputAdornment>
                        )
                      }}
                    />
                  <CustomInput
                    labelText={impoTxt.conPassword}
                    id="pass"
                    onChange={this.handleChange}
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      type: "password",
                      onChange: this.handleChange,
                      endAdornment: (
                        <InputAdornment position="end">
                          <Icon className={classes.inputIconsColor}>
                            lock_outline
                              </Icon>
                        </InputAdornment>
                      ),
                      onKeyPress: (e) => {
                        if (e.key === 'Enter')
                          this.clickLogin();
                      }
                    }}
                  />
                </CardBody>
                <CardFooter className={classes.cardFooter}>
                </CardFooter>
                <Button simple color="primary" size="lg" onClick={this.clickLogin}>
                  {impoTxt.conGetStarted}
                </Button>
                <br />
                <Button simple color="primary" size="lg" onClick={this.clickRegister}>
                  {impoTxt.conRegister}
                </Button>
                <br />
                <Button simple color="primary" size="lg" onClick={this.clickForgot}>
                  {impoTxt.conForgotPass}
                </Button>
              </form>
            </BlockUi>
          </Card>
        );
    }
  }
}

export default withStyles(loginPageStyle)(LoginForm);
