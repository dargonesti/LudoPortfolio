/*eslint eqeqeq:0*/
/*eslint no-mixed-operators:0*/
import React, {useState } from "react";

// @material-ui/core components
import { Radio } from "@material-ui/core";

import DAL from "utils/DataAccess/DALimpotx.js";
import auth from 'utils/auth';
import utils from "utils/utils";
import impoTxt from 'texts/localization';


const QuestionItemBool2 = ({ question,  setSaveFn }) => {

  var [selectedValue, setSelectedValue] = useState("skip");

  function handleChange(ev) {
    utils.log(ev);
    var newVal = ev.target.value;
    setSelectedValue(newVal);

    var { repString, ...newQuestion } = question;

    if (newQuestion && "skip" != newVal) {
      newQuestion.rep = {
        ouinon: /oui/i.test(newVal),
        incertain: /idk/i.test(newVal),
        user: auth.getUserInfo().id,
        question: question.id,
        annee: DAL.getAnnee()
      };

      //Throttle this call
      if (setSaveFn)
        setSaveFn(() => (DAL.saveReponse(newQuestion).then((newResp) => {
          utils.throttledCallEvent("newResponse", newResp);
        })), question.idperso);

    }
  }
 
  var langSuffix = auth.isFr() ? "" : "en";
  return (
    <span>

      <h3 style={{ margin: 0 }}>{question["titre" + langSuffix]}</h3>
      {utils.replaceA(question["texte" + langSuffix])}
      <br />
      <Radio
        checked={selectedValue === 'Oui'}
        onChange={handleChange}
        value="Oui"
        name="radio-button-Qst"
        aria-label="Oui"
        style={{ marginRight: -10, marginLeft: 10 }}
      /> {impoTxt.Oui}

      <Radio
        checked={selectedValue === 'Non'}
        onChange={handleChange}
        value="Non"
        name="radio-button-Qst"
        aria-label="Non"
        style={{ marginRight: -10, marginLeft: 10 }}
      /> {impoTxt.Non}

      <Radio
        checked={selectedValue === 'skip'}
        onChange={handleChange}
        value="skip"
        name="radio-button-Qst"
        aria-label="skip"
        style={{ marginRight: -10, marginLeft: 10 }}
      /> {impoTxt.tutoSkip}

    </span>
  );

}


export default QuestionItemBool2; //basicsStyle
