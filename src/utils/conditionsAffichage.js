
/*eslint eqeqeq:0*/
/*eslint no-mixed-operators:0*/ 
import DAL from "./DataAccess/DALimpotx"; 

var reponses = {};
var questions = {};

function refreshReponses() {
  var reps = DAL.getReponses();
  reponses = {};
  if (reps) {
    reponses = {};
    reps.forEach(rep=>{reponses[rep.question] = rep;});
    /*reps.reduce((ret, rep) => {
      ret[rep.question] = rep;
      return ret;
    }, {});*/
  }
}

function refreshQuestions(pQuestions) {
  if (Array.isArray(pQuestions)) {
    questions = pQuestions.reduce((ret, qst) => {
      ret[qst.idperso] = qst;
      return ret;
    }, {});
  } else {
    questions = pQuestions;
  }
}


// eslint-disable-next-line
function QuestionIdToChoixRep(questionId, def) {
  var ret = def;
  var qstACharge = Object.values(questions).find(qst => qst._id === questionId);
  if (qstACharge) {
    var rep = reponses[questionId]; // Contient l'id de la réponse mais pas le texte
    if (rep) {
      rep = qstACharge.choixdereponse.find(ch => ch._id === rep.choixdereponse);
      if (rep)
        ret = parseInt(rep.texte, 10);
    }
  }

  return ret;
}

function QuestionIdPersoToChoixRep(questionIdPerso, def) {
  var ret = def;
  var qstACharge = questions[questionIdPerso];
  if (qstACharge) {
    var rep = reponses[qstACharge._id]; // Contient l'id de la réponse mais pas le texte
    if (rep) {
      rep = qstACharge.choixdereponse.find(ch => ch._id === rep.choixdereponse);
      if (rep) {
        if ("np-personnes-a-charge" === questionIdPerso)
          ret = parseInt(rep.texte, 10);
        else
          ret = rep.texte;
      }
    }
  }

  return ret;
}

function matchAny(str, lstReg) {
  return lstReg.some(reg => str.match(RegExp(reg)));
}

function reqChoix(qst, lstToFiltre, qstARepondre, lstTexteChoix) {
  var choix = QuestionIdPersoToChoixRep(qstARepondre, false);
  return !matchAny(qst.idperso, lstToFiltre) ||
    (choix && lstTexteChoix.some(ch => ch === choix));
}

// eslint-disable-next-line
function reqTrue(qst, lstToFiltre, requiredQuestion) {
  if (!Array.isArray(requiredQuestion))
    requiredQuestion = [requiredQuestion];
  var rep = requiredQuestion.every(reqQst => {
    var qst = questions[reqQst]
    var ret = qst && reponses[qst._id];
    return ret && ret.ouinon;
  });

  return rep || !matchAny(qst.idperso, lstToFiltre);
}

function reqPersonnesACharge(qst) {
  var nbACharge = QuestionIdPersoToChoixRep("np-personnes-a-charge", 0);

  return !qst.idperso.match(/^pers-charge/) ||
    nbACharge > parseInt(qst.idperso.split("-").pop(), 10);
}

function filtreConditionMet(pQuestions) {
  refreshReponses();
  refreshQuestions(pQuestions);

  return pQuestions.filter(qst =>
    // La question as été remplacée par un choix de réponse 
    //    je garde la ligne comme example de condition booléenne
    //    reqTrue(qst, ["^conj\-"], ["user-as-conjoint"]) && 
    reqPersonnesACharge(qst)
    && (
      reqChoix(qst, ["^conj-"], "user-etat-civil", ["Conjoint de fait", "Marié(e)"])
      || ////// TODO : Gestion d'avoir été conjoint avec 2 personnes au cours de la même année...
      reqChoix(qst, ["^conj-"], "user-ancien-etat-civil", ["Conjoint de fait", "Marié(e)"])
    )
    && reqChoix(qst, ["user-revenu-avant-separation"], "user-ancien-etat-civil", ["Conjoint de fait", "Marié(e)"])
    && reqTrue(qst, ["user-ancienne-ville", "user-date-demenagement"], "user-demenagement") 
    && reqChoix(qst, ["user-date-changement-etat-civil"], "user-ancien-etat-civil", ["Célibataire", "Conjoint de fait", "Marié(e)", "Séparé(e)", "Divorcé(e)", "Veuf/Veuve"])
  
    && reqTrue(qst, ["med-ass-ramq-start", "med-ass-ramq-end"], "med-ass-ramq")
    && reqTrue(qst, ["med-ass-own-start", "med-ass-own-end"], "med-ass-own")
    && reqTrue(qst, ["med-ass-conj-start", "med-ass-conj-end"], "med-ass-conj") 
    && reqTrue(qst, ["med-ass-exempt-start", "med-ass-exempt-end"], "med-ass-exempt")

    && reqChoix(qst, ["remote-conj-name"], "remote-choice", ["Le conjoint le recevra"])
  
    && reqTrue(qst, ["arriv-canada-date"], "arriv-canada")
    && reqTrue(qst, ["parti-canada-date"], "parti-canada")

    && reqTrue(qst, ["diplome-titre", "diplome-date"], "diplome-credit")

    ); 
}

export default {
  filtreConditionMet: filtreConditionMet
};