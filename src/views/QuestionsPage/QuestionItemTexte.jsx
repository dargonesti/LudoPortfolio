import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// @material-ui/icons 

import { Send } from "@material-ui/icons";
// core components  
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import Button from "components/CustomButtons/Button.jsx";

import basicsStyle from "assets/jss/material-kit-react/views/componentsSections/basicsStyle.jsx";

import DAL from "utils/DataAccess/DALimpotx.js";
import auth from 'utils/auth';
import utils from 'utils/utils';
import impoTxt from 'texts/localization';

var toastId = -1;

class QuestionItemTexte extends React.Component {

  constructor(props) {
    super(props);

    var prevRep = props.rep;
    this.state = {
      val: (prevRep ? prevRep.texte : ""),
      widthLarge: this.props.widthLarge || 6
    };

    this.handleChange = this.handleChange.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
    this.onSave = this.onSave.bind(this);

    this.refInput = React.createRef();
    if (this.props.sendRefToParent) this.props.sendRefToParent(this.refInput);
  }

  onSave = ev => {
    auth.removeToast(toastId);
    if (this.props.user) {
      this.props.onAdminSave(this.onConfirm);
    }
    else {
      this.onConfirm(true);
    }
  }
  onConfirm = ev => {
    if (ev) {
      // var newQuestion = jsonCopy(this.props.question);
      var { repString, ...newQuestion } = this.props.question;

      newQuestion.rep = {
        texte: this.state.val,
        user: auth.getActiveUserId(),
        admin: auth.getActiveAdminId(),
        question: this.props.question.id,
        annee: DAL.getAnnee()
      };
      utils.log(newQuestion);
      DAL.saveReponse(newQuestion)
        .then(res => {
          this.props.onChange(newQuestion, this.props.indQst);
          this.setState({ changedAns: false });
        });
    }
  }
  componentWillReceiveProps(nextProps) {
    var rep = nextProps.rep;
    this.setState({
      val: rep && rep.texte ? rep.texte : this.state.val,
      annee: DAL.getAnnee(),
      changedAns: false
    });
  }
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
      changedAns: true
    });
  }

  render() {
    //const { classes } = this.props;

    var langSuffix = auth.isFr() ? "" : "en";
    let attributes = {
      style:{ marginLeft: 20, marginTop: 8, width: "calc(100% - 110px)" },
      id:"standard-number",
      label:this.props.question["titre" + langSuffix],
      value:this.state.val,
      onChange:this.handleChange('val'),
      onClick:this.props.scrollToTop,
      onKeyPress:(e) => {
        if (e.key === 'Enter')
          this.onSave();
      },
      inputProps:{
        //onFocus: () => { auth.showToast("onFocus", 567, "info") },
        onBlur: () => {
          if (this.state.changedAns) {
            toastId = auth.showToast(<>{impoTxt.toastChangedText} ( <Send /> ) </>, 5000, "warning");
          }
        }
      }
    };
    return (
      <span>
       {this.props.question.reptype === 6 ? 
        <Input {...attributes} type="tel" onClick={this.props.scrollToTop} />
        :
        <TextField
          {...attributes}      
          type="text" 
        />}
        
        <Button
          color="transparent"
          target="_blank"
          justIcon
          onClick={this.onSave}
        >
          <Send />
        </Button>
      </span>
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    // return true or false
    return !utils.myCompare(this.props.question, nextProps.question, ["id", "rep", "repString"]) ||
      !utils.myCompare(this.state, nextState, ["val"]);
  }
}


export default withStyles(basicsStyle)(QuestionItemTexte);
