import React from "react";
// react components for routing our app without refresh
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// @material-ui/icons

// core components
import Button from "components/CustomButtons/Button.jsx";
import exampleStyle from "assets/jss/material-kit-react/views/componentsSections/exampleStyle.jsx";


import auth from 'utils/auth';
import DAL from 'utils/DataAccess/DALimpotx';
import request from 'utils/request';
import localData from 'utils/DataAccess/localData';
import utils from 'utils/utils';
import saisieQuestions from 'utils/saisieQuestions';
import ThrottledTextField from "views/ImpoCompo/ThrottledTextField";


///TODO : Watch the state of the official Strapi Bug : https://github.com/strapi/strapi/issues/1483
//// (Returns internal error but the delete works*)
function deleteChangedAndRemovedQuestions(question) {
  console.log("Deleting question : " + question._id + " - " + question.titre);

  deleteLinkedMessage(question._id);
  deleteLinkedRep(question._id);
  deleteChoixRep(question._id);
  return request("questions/" + question._id, { method: "DELETE" }, [500, 404]);
}

function deleteLinkedMessage(questionId) {
  request("messages?question=" + questionId, { method: "GET" }, [500, 404])
    .then(rep => {
      try{
        rep.forEach(msg => {
          request("messages/" + msg._id, { method: "DELETE" }, [500, 404]);
        });      
      }catch(ex){
        console.error(ex);
      }
    });
}
function deleteLinkedRep(questionId) {
  request("reponses?question=" + questionId, { method: "GET" }, [500, 404])
    .then(rep => {
      rep.forEach(reponse => {
        request("reponses/" + reponse._id, { method: "DELETE" }, [500, 404]);
      });
    });
}

//// TODO : Valider si la suppression des choix de rep fonctionne car leur lien est différent : question : {.... _id: ...}
function deleteChoixRep(questionId) {
  request("choixdereponses?question=" + questionId, { method: "GET" }, [500, 404])
    .then(rep => {
      rep.forEach(reponse => {
        request("choixdereponses/" + reponse._id, { method: "DELETE" }, [500, 404]);
      });
    });
}


async function saveQuestion(question, prevQst) {
  var choix = question.choixdereponse;
  question.choixdereponse = [];

  var saveAllChoix = function (qst) {
    choix.forEach(ch => {
      if (qst.choixdereponse ?
        !qst.choixdereponse.some(
          prevCh => ch.texte === prevCh.texte) :
        true) {
        ch.questions = qst._id;
        saveChoix(ch);
      }
    });
  };

  if (prevQst) { // Seulement les choix
    saveAllChoix(prevQst);
    return "success";
  } else {
    return request("questions", { method: "POST", body: question }, true)
      .then(rep => {
        if (rep._id) {
          saveAllChoix(rep);
        }
        return "success";
      });
  }
}

async function saveChoix(choix) {
  return request("choixdereponses", { method: "POST", body: choix }, true)
    .then(rep => {
      return "success";
    });
}

async function UpdateText(question) {
  var { choixdereponse, id, _id, createdAt, updatedAt, changeexpected, reptype, priorite, fileinstead, ...onlyTextBody } = question;

  // TODO : Match texte du choix pour trouver l'ancien Id, et updater si différent

  return request("questions/" + question._id, { method: "PUT", body: onlyTextBody }, true)
}
async function UpdateTextChoix(choix, oldChoix) {
  var { createdAt, updatedAt, _id, id, ordre, questions, ...onlyTextBody } = choix;
  return request("choixdereponses/" + oldChoix._id, { method: "PUT", body: onlyTextBody }, true)
}

class SectionSuperAdminImpotX extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      res: null,
      err: null,
      prevQuestions: null
    }
    this.insererQuestions = this.insererQuestions.bind(this);
    this.updateQuestions = this.updateQuestions.bind(this);
    this.deleteChanged = this.deleteChanged.bind(this);
    this.cleanupMissingLinks = this.cleanupMissingLinks.bind(this);


    this.handleNewTargetQuestion = this.handleNewTargetQuestion.bind(this);
    this.clickDeleteTarget = this.clickDeleteTarget.bind(this);
    this.clickUpdateTarget = this.clickUpdateTarget.bind(this);
  }

  componentDidMount() {
    console.log("TODO : - Cascade Deletes\n- Updates instead of insert?\n loading barre et affichage de retour");

    DAL.getQuestions(true).then(resp => {
      this.setState({ prevQuestions: resp })
    });
  }

  /**
   * {Retourne VRAI si les nouvelles questions en contiennent une avec le même titre, même texte et même choix de réponses que l'ancienne question} 
   * @param newQuestions 
   * @param {*} oldQ 
   */
  findQuestion(newQuestions, oldQ) {
    var paramsToCompare = ["texte", "titre", "priorite", "reptype", "idperso", "fileinstead", "changeexpected"]
    return newQuestions.some(newQ => {
      return paramsToCompare.every(param => newQ[param] === oldQ[param]) &&
        // newQ.texte === oldQ.texte && newQ.titre === oldQ.titre &&
        newQ.choixdereponse.every(ch => oldQ.choixdereponse.some(oldCh => oldCh.texte === ch.texte)) &&
        newQ.choixdereponse.length === oldQ.choixdereponse.length
    });
  }

  deleteChanged() {
    console.log("Suppression des questions");
    auth.showToast("Suppression des questions");

    var allQuestions = saisieQuestions.getAll();
    //var allChoix = allQuestions.reduce((ret, qst) => ret.concat(qst.choixdereponse), []);
    console.log(allQuestions);
    this.setState({ res: allQuestions });

    DAL.getQuestions()
      .then(oldQuestions => {
        var toDelete = Object.values(oldQuestions).filter(oldQ => !this.findQuestion(allQuestions, oldQ));

        console.log(toDelete.length + " questions a deleter");
        auth.showToast(toDelete.length + " questions a deleter", 5000, "danger");

        toDelete.forEach(qst => {
          deleteChangedAndRemovedQuestions(qst);
        });
      });
  }

  cleanupMissingLinks() {
    console.log("Suppression des Liens Manquants");
    auth.showToast("Suppression des Liens Manquants");

    DAL.getQuestions()
      .then(oldQuestions => {
        oldQuestions = Object.values(oldQuestions);

        request("messages", { method: "GET" }, [500, 404])
          .then(allMessages => {
            var missingMsg = allMessages.filter(msg => !oldQuestions.some(qst => qst._id === msg.question));

            console.log(missingMsg.length + " messages avec lien manquant");
            auth.showToast(missingMsg.length + " messages avec lien manquant", 5000, "danger");

            missingMsg.forEach(msg => {
              request("messages/" + msg._id, { method: "DELETE" }, [500, 404]);
            });
          });

        request("reponses", { method: "GET" }, [500, 404])
          .then(allMessages => {
            var missingMsg = allMessages.filter(msg => !oldQuestions.some(qst => qst._id === msg.question));

            console.log(missingMsg.length + " reponses avec lien manquant");
            auth.showToast(missingMsg.length + " reponses avec lien manquant", 5000, "danger");

            missingMsg.forEach(msg => {
              request("reponses/" + msg._id, { method: "DELETE" }, [500, 404]);
            });
          });

        request("choixdereponses", { method: "GET" }, [500, 404])
          .then(allMessages => {
            var missingMsg = allMessages.filter(msg => !oldQuestions.some(qst => qst._id === msg.questions._id));

            console.log(missingMsg.length + " choixdereponses avec lien manquant");
            auth.showToast(missingMsg.length + " choixdereponses avec lien manquant", 5000, "danger");

            missingMsg.forEach(msg => {
              request("choixdereponses/" + msg._id, { method: "DELETE" }, [500, 404]);
            });
          });
      });
  }

  updateQuestions() {
    console.log("Update des questions");
    auth.showToast("Update des questions");

    var allQuestions = saisieQuestions.getAll();
    //var allChoix = allQuestions.reduce((ret, qst) => ret.concat(qst.choixdereponse), []);
    console.log(allQuestions);
    this.setState({ res: allQuestions });

    var err = [];
    var success = [];

    var saveAllChoix = function (prevQ, newChoix) {
      newChoix.forEach(ch => {
        //Only Updates, no inserts
        if (prevQ.choixdereponse) {
          var oldCh = prevQ.choixdereponse.find(prevCh => ch.ordre === prevCh.ordre);
          ch.questions = prevQ._id;
          UpdateTextChoix(ch, oldCh);
        }
      });
    };

    DAL.getQuestions()
      .then(oldQuestions => {
        this.setState({ prevQuestions: oldQuestions })

        allQuestions.forEach(qst => {
          var prevQ = this.state.prevQuestions[qst.idperso];
          if (prevQ) {
            qst._id = prevQ._id;
            qst.id = prevQ.id;

            saveAllChoix(prevQ, qst.choixdereponse);

            if (qst.texte !== prevQ.texte || qst.texteen !== prevQ.texteen
              || qst.titre !== prevQ.titre || qst.titreen !== prevQ.titreen) {
              UpdateText(qst)
                .then(res => {
                  success.push(qst);
                  this.setState({ res: success });
                  console.log("" + (success.length + err.length) + " / " + allQuestions.length);
                })
                .catch(ex => {
                  console.log(ex);
                  err.push(qst.idperso);
                  this.setState(err);
                });
            } else {
              console.log("Question et Prev ont les même textes : " + qst.titre + " - " + prevQ.titre)
            }
          }
          else {
            err.push("Erreur, la questions : " + qst.idperso + " n'existait pas.");
            this.setState(err);
          }
        });

      });
  }

  insererQuestions() {
    console.log("Insertion des questions");
    auth.showToast("Insertion des questions");

    var allQuestions = saisieQuestions.getAll();
    //var allChoix = allQuestions.reduce((ret, qst) => ret.concat(qst.choixdereponse), []);
    console.log(allQuestions);
    this.setState({ res: allQuestions });

    var err = [];
    var success = [];


    DAL.getQuestions()
      .then(oldQuestions => {
        this.setState({ prevQuestions: oldQuestions })

        allQuestions.forEach(qst => {
          var prevQ = this.state.prevQuestions[qst.idperso];
          if (prevQ) {
            err.push("Erreur, la questions : " + qst.idperso + " est déjà présente et ne sera pas insérée.");
            this.setState(err);
          }

          saveQuestion(qst, prevQ)
            .then(res => {
              success.push(qst);
              this.setState({ res: success });
              console.log("" + (success.length + err.length) + " / " + allQuestions.length);
            })
            .catch(ex => {
              console.log(ex);
              err.push(qst.idperso);
              this.setState(err);
            });
        });

      });

  }

  handleNewTargetQuestion(newVal) {
    this.setState({ targetQst: newVal });
  }
  clickDeleteTarget(cb) {
    var { targetQst } = this.state;

    if (!targetQst) {
      auth.showToast("Il faut saisir un id-perso de question à supprimer!", 2341, "danger");
    } else {
      auth.showToast("Commences les suppressions", 987, "info");

      DAL.getQuestions()
        .then(oldQuestions => {
          var toDelete = Object.values(oldQuestions).filter(oldQ => {
            return oldQ.idperso === targetQst;
          });

          auth.showToast(toDelete.length + " questions a deleter - " + targetQst, 1234, "info");

          let justOnce = true;
          toDelete.forEach(qst => {
            deleteChangedAndRemovedQuestions(qst)
              .then(res => {
                auth.showToast("Done deleting " + targetQst);
                if(justOnce){
                  cb();
                  justOnce = false;
                }
              });
          });
        });
    }
  }
  clickUpdateTarget() {
    let { targetQst } = this.state;
    console.log("Entered Update");
    this.clickDeleteTarget(()=>{
      console.log("Update, after Delete");
      let allQuestions = saisieQuestions.getAll();
      let updatedQuestion = allQuestions.find(qst => qst.idperso === targetQst);
      if(updatedQuestion){
        saveQuestion(updatedQuestion, null)
          .then(res => {
            console.log("Update, saved");
            auth.showToast("Question updaté : " + targetQst);
          })
          .catch(ex => {
            console.log(ex);
          });
      }else{
        console.error("idperso non trouvé pour update : " + updatedQuestion);
      }
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.section}>
        <div className={classes.container}>
          <h3 >
            Section Admin ImpotX
          </h3>
          Insérer questions au serveur :
<Button disabled={this.state.prevQuestions ? false : true} onClick={this.insererQuestions}>Insérer</Button>
          <br />


          Update Texte des questions :
<Button disabled={this.state.prevQuestions ? false : true} onClick={this.updateQuestions}>Update</Button>
          <br />


          Delete les questions différentes sur le serveur :
<Button disabled={this.state.prevQuestions ? false : true} onClick={this.deleteChanged}>Delete</Button>
          <br />

          Cleanup les liens vers questions innexistantessur le serveur :
<Button disabled={this.state.prevQuestions ? false : true} onClick={this.cleanupMissingLinks}>Clean-up</Button>

          <br />
          Delete la questions suivante et les shticks relié à :
<ThrottledTextField label="idperso" onChange={this.handleNewTargetQuestion} />
          <Button onClick={this.clickDeleteTarget} >delete target</Button>
          <Button onClick={this.clickUpdateTarget} >delete&update target</Button>

          
          {this.state.res && (<ol style={{ textAlign: "left" }}>
            {this.state.res.map(qst => <li key={qst.idperso}>{qst.titre + " - " + qst.priorite}</li>)}
          </ol>)}

          {this.state.err && (<p>ERREUR : {this.state.err}</p>)}

          {this.state.err && (<ol style={{ textAlign: "left" }}>
            {this.state.err.map(qst => <li key={qst}>{qst}</li>)}
          </ol>)}

<br/><br/>
<Button onClick={()=>{
          localData.setStorage("skipIntro", false);
          utils.callEvent("changeIntroStep", "unskip");
        }}> Un-Skip Intro</Button> 

        </div>
      </div>
    );
  }
}


export default withStyles(exampleStyle)(SectionSuperAdminImpotX);
