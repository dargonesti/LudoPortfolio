import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// @material-ui/icons 

import { Send } from "@material-ui/icons";
// core components  
import TextField from '@material-ui/core/TextField';
import Button from "components/CustomButtons/Button.jsx";

import basicsStyle from "assets/jss/material-kit-react/views/componentsSections/basicsStyle.jsx";

import DAL from "utils/DataAccess/DALimpotx.js";
import auth from 'utils/auth';
import utils from 'utils/utils';

class QuestionItemChiffre extends React.Component {

  constructor(props) {
    super(props);

    var prevRep = this.props.rep;
    this.state = {
      val: (prevRep ? prevRep.numero : ""),
      widthLarge: this.props.widthLarge || 6
    };

    this.handleChange = this.handleChange.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
    this.onConfirmed = this.onConfirmed.bind(this);
    this.refInput = React.createRef();
    if (this.props.sendRefToParent) this.props.sendRefToParent(this.refInput);
  }
  componentWillReceiveProps(nextProps) {
    var rep = nextProps.rep;
    this.setState({
      val: rep && rep.numero ? rep.numero : this.state.val,
      annee: DAL.getAnnee()
    });
  }
  onConfirm = ev => {
    if (this.props.user) {
      this.props.onAdminSave(this.onConfirmed);
    }
    else {
      this.onConfirmed(true);
    }
  }

  onConfirmed = ev => {
    if (ev) {
      var { repString, ...newQuestion } = this.props.question;

      var num = this.state.val;
      if (this.props.question.reptype === 4)
        num = parseInt(num, 10);
      else
        num = parseFloat(num);

      newQuestion.rep = {
        numero: num,
        user: auth.getActiveUserId(),
        admin: auth.getActiveAdminId(),
        question: this.props.question.id,
        annee: DAL.getAnnee()
      };
      utils.log(newQuestion);
      DAL.saveReponse(newQuestion)
        .then(res => { this.props.onChange(newQuestion, this.props.indQst) });
    }
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });

  }

  render() {
    //const { classes } = this.props;

    var langSuffix = auth.isFr() ? "" : "en";
    return (
      <span>
        <TextField
          style={{ marginLeft: 20, marginTop: 8, width: "calc(100% - 110px)" }}
          id="standard-number"
          label={this.props.question["titre" + langSuffix]}
          value={this.state.val}
          onChange={this.handleChange('val')}
          type={this.props.question.reptype === 6 ? "tel" : "number"}

          onKeyPress={(e) => {
            if (e.key === 'Enter')
              this.onConfirm();
          }}
          pattern="\d*"
        >
        </TextField>
        <Button
          color="transparent"
          target="_blank"
          justIcon
          onClick={this.onConfirm}
        >
          <Send />
        </Button>
      </span>
    );
  }
}


export default withStyles(basicsStyle)(QuestionItemChiffre);
