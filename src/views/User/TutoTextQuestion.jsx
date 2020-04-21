/*eslint eqeqeq:0*/
/*eslint no-mixed-operators:0*/
import React, {
   useState
} from "react";
 
import { TextField, Input } from "@material-ui/core";
import DAL from "utils/DataAccess/DALimpotx.js";
import auth from 'utils/auth';
import utils from "utils/utils";


const QuestionItemText = ({ question,  setSaveFn }) => {
  var [val, setVal] = useState(""); 

  var langSuffix = auth.isFr() ? "" : "en";

  let attributes = {
    style:{ marginLeft: 20, marginTop: 8, width: "calc(100% - 110px)" },
        id:"standard-number",
        label:question["titre" + langSuffix],
        value:val,
        onChange:(e) => {
          setVal(e.target.value);
          var { repString, ...newQuestion } = question;

          if (newQuestion) {
            newQuestion.rep = {
              texte: e.target.value,
              user: auth.getUserInfo().id,
              question: question.id,
              annee: DAL.getAnnee()
            };
            if (setSaveFn)
              setSaveFn(() => (DAL.saveReponse(newQuestion).then((newResp) => {
                utils.throttledCallEvent("newResponse", newResp);
              })), question.idperso);
          }
        }
  };

  return (
    <span>

      <h3 style={{ margin: 0, marginTop: 20 }}>{question["titre"+ langSuffix]}</h3>
      {utils.replaceA(question["texte"+ langSuffix])}
      <br />

      {question.reptype === 6 ? 
        <Input {...attributes} type="tel" />
        :
        <TextField
          {...attributes}      
          type="text" 
        />}

    </span>
  );
  // style={{ width: "100%" }}
}


export default QuestionItemText; //basicsStyle
