/*eslint eqeqeq:0*/
/*eslint no-mixed-operators:0*/
import React, {
  useState
} from "react";

import PropTypes from "prop-types";

import { Select, } from "@material-ui/core";
import DAL from "utils/DataAccess/DALimpotx.js";
import auth from 'utils/auth';
import utils from "utils/utils";
import localData from "utils/DataAccess/localData";
import impoTxt from 'texts/localization';


const QuestionItemChoix = ({ question, setSaveFn }) => {

  var [choixdereponse, setChoixdereponse] = useState("skip");

  function handleChange(ev) {
    utils.log(ev);
    var newVal = ev.target.value;
    setChoixdereponse(newVal);

    var { repString, ...newQuestion } = question;

    if (newVal && newVal != "skip") {
      newQuestion.rep = {
        choixdereponse: newVal,
        user: auth.getUserInfo().id,
        question: question.id,
        annee: DAL.getAnnee()
      };

      //Throttle this call
      if (setSaveFn)
        setSaveFn(() => {
          if (question.idperso === "corresp-language") {
            //auth.set("language", valOfReponse);
            var selectedChoix = question.choixdereponse.find(ch=>ch.id === newVal);
            if(selectedChoix){
              if(/^fr.*/i.test(selectedChoix.texte)){
                localData.setStorage("prefLang", "fr"); 
              }else{
                localData.setStorage("prefLang", "en"); 
              }
              setTimeout(() => utils.callEvent("language"), 100);
            }
          }
          DAL.saveReponse(newQuestion).then((newResp) => {
            utils.throttledCallEvent("newResponse", newResp);
          });
        }, question.idperso);

    }
  }

  var langSuffix = auth.isFr() ? "" : "en";

  return (
    <span>

      <h3 style={{ margin: 0, marginTop: 20 }}>{question["titre"+ langSuffix]}</h3>
      {utils.replaceA(question["texte"+ langSuffix])}
      <br />

      <Select
        native
        value={choixdereponse}
        onChange={handleChange}
        inputProps={{
          name: 'choixdereponse',
          id: 'age-native-simple',
        }}
      >
        <option value="skip">{impoTxt.tutoSkip}</option>
        {question.choixdereponse
          .sort((a, b) => a.ordre - b.ordre)
          .map(ch =>
            <option value={ch.id} key={ch.id}>{ch["texte" + langSuffix]}</option>)}
      </Select>

    </span>
  );
  // style={{ width: "100%" }}
}

QuestionItemChoix.propTypes = {
  question: PropTypes.object,
  setSaveFn: PropTypes.func
}


export default QuestionItemChoix;
