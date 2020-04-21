import React from "react";

import Datetime from "react-datetime";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles"; 
import Checkbox from "@material-ui/core/Checkbox"; 
import Tooltip from '@material-ui/core/Tooltip'; 
import FormControl from "@material-ui/core/FormControl";
import Typography from '@material-ui/core/Typography';
// @material-ui/icons 
import IndeterminateCheckBox from "@material-ui/icons/IndeterminateCheckBox";
// core components  

import basicsStyle from "assets/jss/material-kit-react/views/componentsSections/basicsStyle.jsx";

import DAL from "utils/DataAccess/DALimpotx.js";
import auth from 'utils/auth';


class QuestionItemDate extends React.Component {
  constructor(props) {
    super(props);

    var prevRep = DAL.getReponse(props.question.id);

    this.state = {
      val: (prevRep && prevRep.date ? prevRep.date.split("T").shift() : ""),
      checked: [24, 22],
      selectedEnabled: "b",
      checkedA: this.props.question.rep,
      disabled: false,
      widthLarge: this.props.widthLarge || 6
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeEnabled = this.handleChangeEnabled.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
    
    this.refInput = React.createRef();
    if (this.props.sendRefToParent) this.props.sendRefToParent(this.refInput);
  }
  componentWillReceiveProps(nextProps) {
    var rep = nextProps.rep;
    this.setState({val: rep && rep.date ? rep.date.split("T").shift() : this.state.val, 
      annee: DAL.getAnnee()});
  }

  handleChange = name => event => {
    console.log("name : " + name + " , val : " + event.target.checked);
    this.setState({ [name]: event.target.checked });
  }

  onChangeDate(ev) {    
    var dateVal = ev.format("YYYY-MM-DD")
   // var newQuestion = jsonCopy(this.props.question);
    var {repString, ...newQuestion} = this.props.question;

    newQuestion.rep = {
      date: dateVal,
      user: auth.getActiveUserId(),
      admin: auth.getActiveAdminId(),
      question: this.props.question.id,
      annee: DAL.getAnnee()
    };
    
    if (this.props.user)
      this.props.onAdminSave((accepted)=> { if(accepted) this.onConfirm(newQuestion); });
    else
      this.onConfirm(newQuestion);
  }

  onConfirm(newQuestion) {
    if (newQuestion) {
      DAL.saveReponse(newQuestion)
        .then(res => { 
          this.props.onChange(newQuestion, this.props.indQst);
          this.setState({val:newQuestion.rep.date});
         });

    }
  }

  handleChangeEnabled(event) {
    // console.log("Changed : ");
    // console.log(event);
    this.setState({ selectedEnabled: event.target.value });
  }

  handleToggle(value) {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      checked: newChecked
    });
  }

  render() {
    //console.log(this.props);
    
    var langSuffix = auth.isFr() ? "":"en";
    return (
      <span>
        <Tooltip title="Je ne sais pas" leaveDelay={500} placement="top">
          <Checkbox
            checkedIcon={<IndeterminateCheckBox /> /*<Close />*/}
            onChange={this.handleChange("disabled")}
            style={{ marginRight: "1em" }}
          />
        </Tooltip>

        <FormControl >
          <Typography varaint="body1">{this.props.question["titre"+langSuffix]} : </Typography>
          <Datetime
            onChange={this.onChangeDate}
            timeFormat=""
            inputProps={{
              placeholder: "Choisir Date",
              value: this.state.val,
              readOnly:"readonly"
            }
            }
            closeOnSelect
          />
        </FormControl>

      </span>
    );
  }
}


export default withStyles(basicsStyle)(QuestionItemDate);
