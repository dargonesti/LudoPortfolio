import React from "react";
// nodejs library that concatenates classes 
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import { Select, InputLabel } from '@material-ui/core';

import CustomTabs from "components/CustomTabs/CustomTabs.jsx";
import ThrottledTextField from "views/ImpoCompo/ThrottledTextField";

import QuestionList from "./QuestionList.jsx";
import DAL from "utils/DataAccess/DALimpotx.js";
import utils from "utils/utils";
import localData from "utils/DataAccess/localData.js";
import impoTxt from 'texts/localization';
import auth from "utils/auth.js";

import profilePageStyle from "assets/jss/material-kit-react/views/profilePage.jsx";
import conditionsAffichage from "utils/conditionsAffichage.js";


var listeQuestions = [
];

function filtrerQuestions(question) {
  var regFiltre = RegExp(".*(" + this.state.filtre + ").*", "i");
  return regFiltre.test(question.titre) ||
    this.state.reponses.some(rep => rep.question === question.id &&
      (
        match(rep.texte, regFiltre) ||
        match(rep.numero, regFiltre) ||
        match(rep.date, regFiltre) ||
        matchChoixDeReponse(rep.choixdereponse, question, regFiltre)
      ));
}
function match(str, reg) {
  try {
    return !(str == null) && reg.test(str.toString());
  } catch (ex) {
    utils.log("err, is not a string :" + str);
    return false;
  }
}

/*
{this.props.question.choixdereponse.map(ch=>
  <option value={ch.id} key={ch.id}>{ch.texte}</option>)}
*/

function matchChoixDeReponse(choix, question, reg) {
  return !(choix == null) &&
    question.choixdereponse &&
    question.choixdereponse.some(ch => ch.id === choix && match(ch.texte, reg));
}

class QuestionTabs extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      questions: listeQuestions,
      questionsAny: [],
      questionsRep: [],
      questionsNonRep: [],
      filtre: "",
      annee: DAL.getAnnee(),
      reponses: DAL.getReponses(),
      preOpenedTab: localData.getStorage("qstTabOpen") || 0
    };

    this.getAnnees = this.getAnnees.bind(this);
    this.handleChangeAnnee = this.handleChangeAnnee.bind(this);
    this.handleAnswered = this.handleAnswered.bind(this);
    this.filtreQuestions = this.filtreQuestions.bind(this)
  }

  filtreQuestions(questions) {
    var qstSorted = questions.sort((a, b) => b.priorite - a.priorite);

    var oldNonRep = this.state.questionsNonRep.filter(filtrerQuestions.bind(this));
    var newNonRep = filter(qstSorted, "false").filter(filtrerQuestions.bind(this));
    this.setState({
      questionsAny: qstSorted.filter(filtrerQuestions.bind(this)),
      questionsRep: filter(qstSorted, "true").filter(filtrerQuestions.bind(this)),
      questionsNonRep: newNonRep.concat(oldNonRep.filter(oldQst => !newNonRep.some(newQst => newQst._id === oldQst._id))).sort((a, b) => b.priorite - a.priorite)
    });
  }

  getAnnees() {
    // TODO : Trouver année courrante plutôt que 2018
    // Todo : Min ( 10 ans ou la première réponse de l'utilisateur )
    var ret = [];
    for (var i = 0; i < 10; i++) {
      ret.push((new Date()).getFullYear() - i);
    }
    return ret;
  }

  componentDidMount() {
    DAL.getQuestions().then(resp => { ///// TODO : Poor Perfs
      var qstArray = Object.values(resp);
      this.setState({ questions: qstArray });
      this.filtreQuestions(qstArray);
    });

    utils.addListener("userHasRep", "QuestionTabs", (ev) => {
      var newReps = DAL.getReponses();
      utils.log("QuestionTabs - New Reps = ");
      utils.log(newReps);
      this.setState({ reponses: newReps });
      this.filtreQuestions(this.state.questions);
    });
  }
  componentWillUnmount() {
    utils.removeListener("userHasRep", "QuestionTabs");
  }

  handleChangeAnnee = event => {
    var newVal = event.target.value;
    DAL.setAnnee(newVal);
    this.setState({ annee: newVal, reponses: DAL.getReponses() });
    //setTimeout(this.forceUpdate,234);
  }

  handleAnswered(qst) {

  }

  render() {
    var { questionsAny, questionsRep, questionsNonRep } = this.state;

    return (
      <div style={{
        justifyContent: "space-between"
      }}>
        <ThrottledTextField onChange={(val) => {
          this.setState({ filtre: utils.escapeRegExp(val) });

          this.filtreQuestions(this.state.questions);
        }
        }
          style={{ margin: 20, marginTop:-10 }}
          label={impoTxt.qstFiltrerQuestion} />

        {utils.isAnneesActive() && (<>
          <InputLabel htmlFor="age-native-simple">{impoTxt.qstAnneeDuRap}</InputLabel>
          <Select
            style={{ marginLeft: 10 }}
            native
            value={this.state.annee}
            onChange={this.handleChangeAnnee}
            inputProps={{
              name: 'choixdereponse',
              id: 'age-native-simple',
            }}
          >
            {this.getAnnees()
              .map(annee =>
                <option value={annee} key={annee}>{annee}</option>)}
          </Select>
        </>)}
        {/* value = auth.getScrollTarget() ? 2 : 0 ||*/}
        <CustomTabs
          headerColor="success"
          onChange={(ind) => localStorage.setItem("qstTabOpen", ind)}
          value={localData.getStorage("qstTabOpen") || 0//TODO Ludovic : Doesn't work if you close/open collapsable...
          }
          tabs={[
            {
              tabName: impoTxt.qstnouvelles,
              tabContent: (
                <div  >
                  <h6>{impoTxt.qstEnteteNew}</h6>
                  <QuestionList answered="false" user={this.props.user} questions={questionsNonRep} notifications={this.props.notifications} />
                </div>
              )
            },
            {
              tabName: impoTxt.qstrepondues,
              tabContent: (
                <div >
                  <h6>{impoTxt.qstEnteteRep}</h6>
                  <QuestionList answered="true" user={this.props.user} questions={questionsRep} notifications={this.props.notifications} />
                </div>
              )
            },
            {
              tabName: impoTxt.qsttoutes,
              tabContent: (
                <div >
                  <h6>{impoTxt.qstEnteteToutes}</h6>
                  <QuestionList answered="any" user={this.props.user} questions={questionsAny} notifications={this.props.notifications} />
                </div>
              )
            }
          ]}
        />

      </div>
    );

  }
}


//eslint-ignore-next-line
function filter(questions, answered) {
  var reps = DAL.getReponses();

  if (answered === "any" || reps == null) // Toutes
    return questions;

  else if (answered === "true") // Questions répondues
    return questions.filter(qst => reps.some(rep => rep.question === qst.id));

  else { // Nouvelles Questions
    var ret = conditionsAffichage.filtreConditionMet(questions);
    ret = ret.filter(qst => //qst._id === newRepId || 
      !reps.some(rep => rep.question === qst.id));
    return ret;
  }
}

QuestionTabs.defaultProps = {
  notifications: []
};
export default withStyles(profilePageStyle)(QuestionTabs);
