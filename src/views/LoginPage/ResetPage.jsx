import React from "react";
import {  Redirect } from 'react-router-dom';
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

import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";

// Utils
import auth from 'utils/auth';
import utils from "utils/utils.js";
import impoTxt from 'texts/localization';
import request from 'utils/request';

class ResetPage extends React.Component {

  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      cardAnimaton: "cardHidden",
      emailReg: "",
      passReg: "",
      pass2Reg: "",
      nickReg: "",
      successLogin: false,
      code: "",
    };
    this.clickReset = this.clickReset.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }


  /// TODO : Fix email plugin : https://github.com/strapi/strapi/issues/864
  clickReset(ev) {
    request("auth/reset-password", {
      method: "POST",
      body: {
        code: this.state.code,
        password: this.state.passReg,
        passwordConfirmation: this.state.pass2Reg,
      }
    })
      .then((res) => {
        auth.showToast(impoTxt.toastPassChanged);
        utils.log("received jwd - changed pwd ");
        utils.log(res);
        this.setState({successReset:true});
      }).catch(res => {
        auth.showToast(impoTxt.toastErrChangePass + " : " + res.response.payload.message, 3333, "danger");
      });
  }


  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }
  componentDidMount() {
    setTimeout(
      function () {
        this.setState({ cardAnimaton: "" });
      }.bind(this),
      700
    );

    var loc = this.props.Location || this.props.location || window.location.href;
    var params = (loc.search || loc).split("?");

    if (params.length > 1) {
      params = params[params.length - 1].split("=");
      var indCode = params.indexOf("code");
      var code = params[indCode + 1];
      if (code) {
        this.setState({ code: code });
      }
    }
  }
  render() {
    const { classes, props, ...rest } = this.props;

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

                <Card className={classes[this.state.cardAnimaton]}>
                  <form className={classes.form}>
                    <CardHeader color="primary" className={classes.cardHeader}>
                      <h4>{impoTxt.conResetTitle}</h4>
                    </CardHeader>

                    <CardBody>

                      <CustomInput
                        labelText={impoTxt.conPassword}
                        id="passReg"
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
                              this.clickReset();
                          }
                        }}
                      />
                      <CustomInput
                        labelText={impoTxt.conConfirmPassword}
                        id="pass2Reg"
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
                              this.clickReset();
                          }
                        }}
                      />
                    </CardBody>
                    <CardFooter className={classes.cardFooter}>
                      <Button simple color="primary" size="lg" onClick={this.clickReset}>
                        {impoTxt.conReset}
                      </Button>
                    </CardFooter>
                  </form>

                </Card>


              </GridItem>
            </GridContainer>
          </div>
          {this.state.successReset && <Redirect to='/' />}
          <Footer whiteFont />
        </div>
      </div>
    );
  }
}

export default withStyles(loginPageStyle)(impoHOC(ResetPage,"ResetPage"));