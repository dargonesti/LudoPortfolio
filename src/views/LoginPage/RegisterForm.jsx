/*eslint eqeqeq:0*/
/*eslint no-mixed-operators:0*/
import React from "react";
import { Redirect } from 'react-router-dom';
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
import Email from "@material-ui/icons/Email";
import Person from "@material-ui/icons/Person";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";

import loginPageStyle from "assets/jss/material-kit-react/views/loginPage.jsx";

// Utils
import auth from 'utils/auth';
import impoTxt from 'texts/localization';
import localData from "utils/DataAccess/localData";

import DAL from "utils/DataAccess/DALimpotx.js";
import utils from "utils/utils.js";

class RegisterForm extends React.Component {
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
      successRegister: false
    };
    this.clickRegister = this.clickRegister.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  clickRegister(ev) {
    if (this.state.passReg != this.state.pass2Reg) {
      auth.showToast(impoTxt.toastPassPasPareil, 4321, "danger");
    } else {

      //TODO : Afficher loader icon et bloquer la page en attendant.
      DAL.register(this.state.nickReg, this.state.emailReg, this.state.passReg).then(res => {
        utils.log(res);

        localData.setStorage("confirmEmail", this.state.emailReg);
        auth.showToast(impoTxt.toastSuccessCreaCompte, 5000);
        this.setState({ "successRegister": true });

      }).catch(ex => {
        auth.showToast(impoTxt.toastErrorCreation, null, "danger");
      });
    }
    //auth.login(this.state.login/pwd)
  }

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ open: false });
  };
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
  }

  render() {
    const { classes } = this.props;

    if (this.state.successRegister) {
      return <Redirect to={"/"} />;
    } else {
      return (
        <Card className={classes[this.state.cardAnimaton]}>
          <form className={classes.form}>
            <CardHeader color="primary" className={classes.cardHeader}>
              <h4>{impoTxt.conRegister}</h4>
              {/*<div className={classes.socialLine}>
              <Button
                justIcon
                disabled
                href="#pablo"
                target="_blank"
                color="transparent"
                onClick={e => e.preventDefault()}
              >
                <i className={"fab fa-facebook"} />
              </Button>
              <Button
                justIcon
                disabled // Doit prendre <GoogleLogin pour l'instant... Todo : rediriger le click ou changer le render?
                href="#pablo"
                target="_blank"
                color="transparent"
                onClick={e => e.preventDefault()}
                aria-label="Google"
              >
                <i className={"fab fa-google-plus-g"} />
              </Button>
    </div>*/}
            </CardHeader>
            {/*<p className={classes.divider}>{impoTxt.conBeClassic}</p>*/}
            <CardBody>

              <CustomInput
                labelText={impoTxt.conUsername}
                id="nickReg"
                onChange={this.handleChange}
                formControlProps={{
                  fullWidth: true
                }}
                inputProps={{
                  type: "name",
                  onChange: this.handleChange,
                  endAdornment: (
                    <InputAdornment position="end">
                      <Person className={classes.inputIconsColor} />
                    </InputAdornment>
                  )
                }}
              />
              <CustomInput
                labelText={impoTxt.conEmail}
                id="emailReg"
                onChange={this.handleChange}
                formControlProps={{
                  fullWidth: true
                }}
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
                      this.clickRegister();
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
                      this.clickRegister();
                  }
                }}
              />
            </CardBody>
            <CardFooter className={classes.cardFooter}>
              <Button simple color="primary" size="lg" onClick={this.clickRegister}>
                {impoTxt.conRegister}
              </Button>
            </CardFooter>
          </form>

        </Card>
      );
    }
  }
}

export default withStyles(loginPageStyle)(RegisterForm);
