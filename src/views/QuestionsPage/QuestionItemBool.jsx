/*eslint eqeqeq:0*/
/*eslint no-mixed-operators:0*/
import React from "react";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import { Select, FormControl, InputLabel } from "@material-ui/core";

import DAL from "utils/DataAccess/DALimpotx.js";
import auth from 'utils/auth';
import utils from "utils/utils";
import impoTxt from 'texts/localization';

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

class QuestionItemBool extends React.Component {

  constructor(props) {
    super(props);

    var rep = this.props.rep;

    var incertain = rep && rep.incertain;
    var ouinon = rep && rep.ouinon;
    var choixdeRep = rep ?
      (incertain && "idk") ||
      (ouinon ? "oui" : "non") :
      "";

    this.state = {
      repNull: rep ? false : true,
      ouinon: ouinon,
      incertain: incertain,
      choixdereponse: choixdeRep,
      widthLarge: this.props.widthLarge || 6
    };
    //utils.log("Width bool : " + this.state.widthLarge);
    this.handleChange = this.handleChange.bind(this);
    //this.handleChangeEnabled = this.handleChangeEnabled.bind(this);
    this.refInput = React.createRef();
    if (this.props.sendRefToParent) this.props.sendRefToParent(this.refInput);

  }
  componentWillReceiveProps(nextProps) {
    var rep = nextProps.rep;
    var incertain = rep && rep.incertain;
    var ouinon = rep && rep.ouinon;
    var choixdeRep = rep ?
      (incertain && "idk") ||
      (ouinon ? "oui" : "non") :
      "";
    this.setState({choixdereponse: choixdeRep, 
      annee: DAL.getAnnee()});
  }

  onSave = ev => {
    if (this.props.user) {
      this.props.onAdminSave(this.onConfirmed);
    }
    else {
      this.onConfirmed(true);
    }
  }

  handleChange = name => event => {
    var newVal = event.target.value;
    this.setState({ [name]: newVal }); 
    var { repString, ...newQuestion } = this.props.question;

    utils.log(event.target);
    newQuestion.rep = {
      ouinon: newVal == "oui",
      incertain: newVal == "idk",
      user: auth.getUserInfo().id,
      question: this.props.question.id,
      annee: DAL.getAnnee()
    };
    DAL.saveReponse(newQuestion)
      .then(res => {
        this.props.onChange(newQuestion, this.props.indQst) 
      });
  }

  render() {
    const { classes } = this.props; 
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
            {(this.state.repNull || true) && // cond si question jamais répondue
              <option value="" />}
            <option value="oui">{impoTxt.Oui}</option>
            <option value="non">{impoTxt.Non}</option>
            <option value="idk">{impoTxt.idk}</option>

          </Select>
        </FormControl>
      </span>
    );
  }
}


export default withStyles(styles)(QuestionItemBool); //basicsStyle
