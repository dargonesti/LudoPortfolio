import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
// core components  

import DAL from "utils/DataAccess/DALimpotx.js";
import utils from "utils/utils.js";
import auth from 'utils/auth';

import Select from '@material-ui/core/Select';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
    //width: "100%"
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});

class QuestionItemChoix extends React.Component {

  constructor(props) {
    super(props);

    var prevRep = DAL.getReponse(props.question.id);
    this.state = {
      widthLarge: this.props.widthLarge || 6,
      choixdereponse: (prevRep ? prevRep.choixdereponse : "")
    };

    this.handleChange = this.handleChange.bind(this);
    this.onConfirmed = this.onConfirmed.bind(this);
    this.refInput = React.createRef();
    if (this.props.sendRefToParent) this.props.sendRefToParent(this.refInput);
  }
  componentWillReceiveProps(nextProps) {
    var rep = nextProps.rep;
    this.setState({choixdereponse: rep && rep.choixdereponse ? rep.choixdereponse: this.state.choixdereponse, 
      annee: DAL.getAnnee()});
  }

  onConfirmed(newVal) {
    if (newVal) {
      var {repString, ...newQuestion} = this.props.question;

      newQuestion.rep = {
        choixdereponse: newVal,
        user: auth.getActiveUserId(),
        admin: auth.getActiveAdminId(),
        question: this.props.question.id,
        annee: DAL.getAnnee()
      };
      DAL.saveReponse(newQuestion)
        .then(res => { this.props.onChange(newQuestion, this.props.indQst) });
    }
  }
  handleChange = name => event => {
    var newVal = event.target.value;
    this.setState({ [name]:  newVal });

    if (this.props.user) {
      this.props.onAdminSave((accepted) => {
        if (accepted) {
          this.onConfirmed( newVal);
        }
      });
    }
    else {
      this.onConfirmed( newVal);
    }

  }

  specialOperationsOnSpecificQuestion(){
    if(this.props.question.idperso === "corresp-language"){
      //auth.set("language", valOfReponse);
    setTimeout(()=> utils.callEvent("language"), 100);
    }
  }
  render() {
    const { classes } = this.props;
    //console.log(this.props);

    var langSuffix = auth.isFr() ? "":"en";
    return (
      <span>
        <FormControl className={classes.formControl}
          style={{ width: "calc(100% - 65px" }}>
          <InputLabel htmlFor="age-native-simple">{this.props.question["titre"+langSuffix]}</InputLabel>
          <Select
            native
            style={{ width: "100%" }}
            value={this.state.choixdereponse}
            onChange={this.handleChange('choixdereponse')}
            inputProps={{
              name: 'choixdereponse',
              id: 'age-native-simple',
            }}
          >
            <option value="" />
            {this.props.question.choixdereponse
              .sort((a, b) => a.ordre - b.ordre)
              .map(ch =>
                <option value={ch.id} key={ch.id}>{ch["texte"+langSuffix]}</option>)}
          </Select>
        </FormControl>
      </span>
    );
  }
}


export default withStyles(styles)(QuestionItemChoix);
