 
var tr = {};
tr.bool = 0;
tr.text = 1;
tr.choix = 2;
tr.date = 3;
tr.int = 4;
tr.float = 5;
tr.tel = 6;
tr.addresse = 7;

 
function question(titre, titreen,  desc, descen, reptype, choixRep, priorite, myId, idFAQ) {
  let lienFAQ = idFAQ ?  ' <a href="http://impotx.com/faq#'+idFAQ+'">FAQ</a>' : "";
  return {changeexpected:true,  titre, titreen, texte: desc + lienFAQ, texteen: descen + lienFAQ, reptype: reptype, priorite, choixdereponse: choixRep, idperso: myId };
}
function questionFix(titre, titreen,  desc, descen, reptype, choixRep, priorite, myId, idFAQ) {
  let lienFAQ = idFAQ ?  ' <a href="http://impotx.com/faq#'+idFAQ+'">FAQ</a>' : "";
  return { changeexpected:false, titre, titreen, texte: desc + lienFAQ, texteen: descen + lienFAQ, reptype: reptype, priorite, choixdereponse: choixRep, idperso: myId };
}

var ordre = 0;
function choix() {
  var ret = [];
  for (var i = 0; i < arguments.length/2; i++) {
    ret.push({ texte: arguments[i*2].toString(),texteen: arguments[i*2 + 1].toString(), ordre: ordre++ });
  }
  return ret;
}

function identiteUser() {
  return [
    questionFix("Nom","Name", "Quel est votre nom de famille?", "What's your familly name?", tr.text, [], 100, "user-last-name"),
    questionFix("Prénom", "First Name", "Quel est votre prénom?", "What's your first name", tr.text, [], 101, "user-first-name"),
    questionFix("Numéro d'assurance sociale","NAS", "Votre numéro d'assurance sociale", "What's your NAS?", tr.int, [], 80, "user-no-nas"),
    questionFix("Langue", "Language",  "Quel est votre langue de correspondance?","In what language do you want us to speak with you?", tr.choix, choix("Français", "French", "Anglais", "English"), 103, "corresp-language"),
    questionFix("Moyen de communication préféré", "Favourite communication method", "Comment préférez vous que nous communiquions avec vous?", "How do you want us to talk with you?", tr.choix, choix("Application ImpotXYZ","Application ImpotXYZ", "Courriel", "Email", "SMS","SMS", "Téléphone","Phone"), 102, "user-moyen-de-comm"),
    questionFix("Moyen de communication alternatif","Alternative communication method","Favorisez vous un autre moyen de communication pour que nous vous contactions?", "Alternative communication method", tr.choix, choix("Non","No", "Application ImpotXYZ","Application ImpotXYZ", "Courriel","Email", "SMS","SMS", "Téléphone", "Phone","Télécopieur", "Copy Machine"), 98, "user-moyen-de-comm-alt"),

    questionFix("Sexe", "Sex","Quel est votre sexe?", "What's your sex?", tr.choix, choix("Autre", "Other", "Femme","Female",  "Homme","Male"), 95, "user-sex"),
    
    questionFix("Date du naissance","Birth date", "Votre date de naissance","The date of your birth", tr.date, [], 94.5, "user-date-naissance"),

    questionFix("Téléphone (jour)","Phone number (day)", "Numéro de téléphone pour vous rejoindre de jour.","Telephone number where we can reach you by day.", tr.tel, [], 94, "user-tel-day"),
    questionFix("Téléphone (soir)","Phone number (evening)", "Numéro de téléphone pour vous rejoindre de soir.","Telephone number where we can reach you by night.", tr.tel, [], 94, "user-tel-evening"),

    //questionFix("Courriel", "Email", "Adresse courriel où vous joindre", "Your email", tr.text, [], 95, "user-courriel"),

    ///Adresse
    questionFix("Code Postal","Postal Code", "Quel est le Code Postal de votre adresse principale?","The Postal Code of your main residency", tr.text, [], 90, "user-code-postal"),
    questionFix("Province", "Province", "Quel est la Province de votre adresse principale?","Province of your main residency",  tr.choix,
      choix("Québec","Québec", "Alberta", "Alberta", "Colombie-Britanique", "Colombie-Britanique", "Île-du-Prince-Édouard","Île-du-Prince-Édouard", "Manitoba", "Manitoba", "Nouveau-Brunswick",  "Nouveau-Brunswick", "Nouvelle-Écosse",  "Nouvelle-Écosse", "Nunavut", "Nunavut", "Ontario","Ontario", "Saskatchewan",  "Saskatchewan", "Terre-Neuve-et-Labrador", "Terre-Neuve-et-Labrador", "Territoires du Nord-Ouest", "Territoires du Nord-Ouest", "Yukon", "Yukon"), 90, "user-province"),
      questionFix("Ville", "City","Quel est la Ville de votre adresse principale?","The City of your main residency.", tr.text, [], 90, "user-ville"),
      questionFix("Adresse","Adress", "Quel est l'Adresse de votre adresse principale?","The Adress of your main residency", tr.text, [], 90, "user-adresse"),
      questionFix("Appartement","Appartment Number", "Quel est le numéro d'appartement de votre adresse principale?","Your appartment number if you have one", tr.text, [], 90, "user-appartement"),

    question("Avez-vous déménagé?","Residency move last year?", "Avez vous changé d'adresse principale durant l'année?","Did you change your main residency within last year?", tr.bool, [], 89, "user-demenagement"),
    question("Date du déménagement","Moving Date", "Depuis quand restez vous à votre adresse courrante?","The date of your last change of residency", tr.date, [], 88, "user-date-demenagement"),

    //TODO : Question déduction de région

    question("État civil", "Civil Status", "","", tr.choix, choix("Célibataire", "Single", "Conjoint de fait", "Conjoint de fait", "Marié(e)","Marié(e)", "Séparé(e)","Séparé(e)", "Divorcé(e)", "Divorcé(e)", "Veuf/Veuve", "Veuf/Veuve"),87 , "user-etat-civil"),
    question("État civil précédent (Si changement)","Previous Civil Status", "Choisissez votre ancien état civil si celui-ci a changé au cours de l'année.","Pick your last civil status if it changed diring last year.", tr.choix, choix("Pas de changement", "Pas de changement", "Célibataire","Célibataire", "Conjoint de fait", "Conjoint de fait", "Marié(e)","Marié(e)", "Séparé(e)", "Séparé(e)", "Divorcé(e)", "Divorcé(e)", "Veuf/Veuve", "Veuf/Veuve"),86 , "user-ancien-etat-civil"),
    question("Date de changement de l'état civil", "Date of Civil Status change", "La date de changement de votre état civil.", "The date where your changed Civil Status the last time", tr.date, [],85 , "user-date-changement-etat-civil"),
    question("Revenu net du conjoint avant la séparation","Earning of Partner before separation", "Le revenu net du conjoint avant la séparation tel qu'affiché à la ligne : *** ?", "",tr.chiffre, [],84 , "user-revenu-avant-separation"),
  ];
}

function additionnelUser(){
  return [
    question("Je possède plus de 100 000$ de biens étrangers.","I possess more than 100 000$ in strange goods", "Vous possédez plus de 100 000$ en biens hors du Québec.", "", tr.bool, [], 69, "user-biens-etranges"),
    questionFix("Autoriser Revenu Canada a communiquer mes informations.*","I autorize Revenu Canada to share my informations", "Autoriser Revenu Canada à communiquer avec Élections Canada mon nom, adresse et date de naissance afin de mettre à jour mes renseignements dans le Registre national des électeurs. ","", tr.bool, [], 68.9, "user-autoriser-revenu-canada"),
    
    question("Dans quelle ville restiez vous avant votre déménagement?","Last City before moving", "La ville où vous résidiez avant votre dernier déménagement", "",tr.text, [], 67, "user-ancienne-ville")
  ];
}

function identiteConjoint() {
  return [
    questionFix("Nom Conjoint","Partner Name", "Quel est nom de famille de votre conjoint(e)?", "",tr.text, [], 87, "conj-last-name"),
    questionFix("Prénom Conjoint", "Partner's name","Quel est prénom de votre conjoint(e)?","", tr.text, [], 87, "conj-first-name"),
    questionFix("Numéro d'assurance sociale de votre conjoint(e)", "Partner's NAS","Le numéro d'assurance sociale","", tr.int, [], 80, "conj-no-nas"),

    questionFix("Sexe du Conjoint","Partner's Sex", "Quel est sexe du conjoint?","", tr.choix, choix( "Femme","Female",  "Homme", "Male"), 87, "conj-sex"),

    questionFix("Téléphone du Conjoint (jour)","Partner's Phone Number (day)", "Numéro de téléphone du Conjoint pour le rejoindre de jour.","", tr.tel, [], 87, "conj-tel-day"),
    questionFix("Téléphone du Conjoint (soir)","Partner's Phone Number (evening)", "Numéro de téléphone du Conjoint pour le rejoindre de soir.","", tr.tel, [], 87, "conj-tel-evening"),

    
    question("Traitons nous aussi la déclaration du conjoint?", "Do we also make your partner's declaration?","","", tr.bool, [], 86, "conj-traite-aussi"),  

    question("Ligne 236 au fédéral du conjoint","Partner's Line 236 of Federal", "Saisissez la ligne 236 du Document : [asdasd]","", tr.float, [], 82 , "conj-ligne-236-fed"),
    question("Ligne 275 au provincial du conjoint","Partner's Line 275 of Provincial", "Saisissez la ligne 275 du Document : [asdasd]","", tr.float, [], 82 , "conj-ligne-275-prov"),
  ];
}

function personnesACharge()
{
  const personnesAChargeMax = 10;
  const nbQuestionParPersonne = 10; // pas grave si plus élevé que la vraie valeur

  var ret =  [];
  var prioriteQuestion = function(questNo, persAChargeNo){
    return 79 - persAChargeNo/(personnesAChargeMax+1) - (questNo/nbQuestionParPersonne)/(personnesAChargeMax+1);
  }
  
  ret.push(question("Combien de personnes avez vous à votre charge?","How many person do you have under your care?", 'Personne à charge tel que : enfants, parents, grands-parents, etc. vivant à la même adresse', "",tr.choix, choix(0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10), 79, "np-personnes-a-charge"));

  for(var i = 0; i < personnesAChargeMax; i++){
    var j = i+1;
    ret.push(questionFix("Prénom de la personne à charge #" + j, "First name of the person #"+j+ " under your care","","", tr.text, [], prioriteQuestion(1, i), "pers-charge-prenom-" + i));
    ret.push(questionFix("Nom de la personne à charge #" + j, "Name of the person #"+j+ " under your care","","", tr.text, [],prioriteQuestion(2, i), "pers-charge-nom-" + i));
    
    ret.push(questionFix("Lien avec la personne à charge #" + j, "Relation with the person #"+j+ " under your care","","", tr.choix, choix("Enfant","Child", "Parent", "Parent", "Grans-Parent","Grans-Parent", "Autre", "Other"), prioriteQuestion(3, i), "pers-charge-lien-" + i));
    
    ret.push(questionFix("Revenu net de la personne à charge #" + j,"Net revenue* of the person #"+j+ " under your care", "Saisir le montant ou nous envoyer une photo du document","", tr.float, [], prioriteQuestion(4, i), "pers-charge-revenu-net-" + i));
    
    ret.push(question("Est-ce que la personne à charge #" + j + " est un étudiant post-secondaire?", "Is the person #"+j+ " under your care a College student?*","","", tr.bool, [],prioriteQuestion(5, i), "pers-charge-etudes-post-secondaire-" + i));
    ret.push(question("Est-ce que vous payez une pension alimentaire pour la personne à charge #" + j + "?", "Do you pay pension* for the person #"+j+ " under your care","","", tr.bool, [],prioriteQuestion(6, i), "pers-charge-pension-" + i));
  }

  return ret;
}

///Ajout de question de Février, réviser et classer plus tard
function qstAClasser(){
  return [
    question("Assurance Médicament (RAMQ)","Meds Insurance (RAMQ)*", "Avez vous été souscrit à l'assurance médicaments gouvernementale cette année? ( RAMQ )", "Were you subscribed to the gouvernment's medical insurance this year? ( RAMQ )",tr.bool, [], 77, "med-ass-ramq"),
    question("Début de l'Assurance (RAMQ)","Beginning of the insurance (RAMQ)*", "Date de début la RAMQ cette année ( ou 1 jan )", "The initial date of subscription to RAMQ ( or 1 Jan )", tr.date, [], 77, "med-ass-ramq-start"),
    question("Fin de l'Assurance (RAMQ)","End of the insurance (RAMQ)*", "Date de fin la RAMQ cette année ( ou 30 déc )", "The final date of subscription to RAMQ ( or 30 Dec )", tr.date, [], 77, "med-ass-ramq-end"),
   
    question("Assurance Médicament (propre régime collectif)","Meds Insurance (own collective regime)*", "Avez vous été souscrit à votre propre régime d'assurance collectif cette année?", "Were you subscribed to your own collective regime this year?",tr.bool, [], 76, "med-ass-own"),
    question("Début de l'Assurance (propre régime collectif)","Beginning of the insurance (own collective regime)*", "Date de début d'inscription à votre propre régime d'assurance collectif  cette année ( ou 1 jan )", "The initial date of subscription to your own collective regime  ( or 1 Jan )", tr.date, [], 76, "med-ass-own-start"),
    question("Fin de l'Assurance (propre régime collectif)","End of the insurance (own collective regime)*", "Date de fin d'inscription a votre propre régime d'assurance collectif  cette année ( ou 30 déc )", "The final date of subscription to your own collective regime ( or 30 Dec )", tr.date, [], 76, "med-ass-own-end"),
    
    question("Assurance Médicament (regime collectif(parent/conj.))","Meds Insurance (RAMQ)*", "Avez vous été souscrit au régime collectif d'un parent ou conjoint cette année? )", "Were you subscribed to the gouvernment's medical insurance this year? ( RAMQ )",tr.bool, [], 75, "med-ass-conj"),
    question("Début de l'Assurance (regime collectif(parent/conj.))","Beginning of the insurance (RAMQ)*", "Date de début d'inscription au régime collectif d'un parent ou conjoint cette année ( ou 1 jan )", "The initial date of subscription to RAMQ ( or 1 Jan )", tr.date, [], 75, "med-ass-conj-start"),
    question("Fin de l'Assurance (regime collectif(parent/conj.))","End of the insurance (RAMQ)*", "Date de fin d'inscription au régime collectif d'un parent ou conjoint cette année ( ou 30 déc )", "The final date of subscription to RAMQ ( or 30 Dec )", tr.date, [], 75, "med-ass-conj-end"),
    
    question("Exemption d'Assurance Médicaments ( indien, permis vacance-travail )","Meds Insurance Exemption ( Kree, work-travel pass )", "Avez vous été exempté de l'assurance médicaments cette année?", "Were you exempt from medical insurance this year?",tr.bool, [], 74, "med-ass-exempt"),
    question("Début de l'Exemption d'Assurance Médicaments","Beginning of the Meds Insurance Exemption", "Date de début de l'exemption cette année.", "The initial date of Meds Insurance Exemption ( or 1 Jan )", tr.date, [], 74, "med-ass-exempt-start"),
    question("Fin de l'Exemption d'Assurance Médicaments","End of the Meds Insurance Exemption", "Date de fin l'exemption à l'assurance cette année ( ou 30 déc )", "The final date of Meds Insurance Exemption ( or 30 Dec )", tr.date, [], 74, "med-ass-exempt-end"),

    question("Crédit de région éloignée", "Remote Region Credit", "Choisissez l'option désirée si vous avez droit au crédit de région éloignée. C'est à dire, si vous êtes resté 6 mois ou plus à la même adresse en région éloignée.", "Chose the desired option if you're elligible to the remote region credit. (If you had the same adress for 6 months or more in a remote region)", tr.choix, choix("Non", "No", "Le plus avantageux", "The most profitable", "50/50 chaque colocataire", "50/50 each con.", "Le conjoint le recevra", "My conj. will receive it."), 91.2, "remote-choice"),
    question("Nom du conjoint recevant le crédit de région éloignée", "Name of the Conj. receiving the Credit for remote region", "Saisissez le nom du conjoint reçevant le crédit de région éloignée", "Write the full name of the Conj. receiving the Remote Region Credit.", tr.text, [], 91.1, "remote-conj-name"),

    question("Crédit pour Nouveaux Diplômé", "Newly Diplomated Credit", "Vous avez droit à un crédit si vous avez obtenu votre diplôme cette année*.","You're allowed to a credit if you received your diploma this year.*", tr.bool, [], 91, "diplome-credit", "11"),
    question("Titre du diplôme", "Diploma's Title", "Le titre du diplôme obtenu.","Title of the obtained diploma.", tr.text, [], 90.91, "diplome-titre"),
    question("Date de diplomation", "Diplomation Date", "La date d'obtention de votre diplôme.","The date at which you received yout diploma.*", tr.date, [], 90.9, "diplome-date"),

    
    question("Arrivé au Canada durant l'année", "Arrived to Cannada during the year", "Êtes vous arrivé au Canada durant l'année?","Did you arrive to Canada during this year?", tr.bool, [], 51.5, "arriv-canada"),
    question("Date d'Arrivé au Canada", "Date of arrival to Cannada", "La date de votre arrivée au Canada.","Your date of arrival to Canada.", tr.date, [], 51.4, "arriv-canada-date"),

    question("Départ au Canada durant l'année", "Left Cannada during the year", "Êtes vous parti du Canada durant l'année?","Did you leave Canada during this year?", tr.bool, [], 51.3, "parti-canada"), 
    question("Date de Départ du Canada", "Date of departing from Cannada", "La date de votre départ du Canada.","Your date of departure from Canada.", tr.date, [], 51.2, "parti-canada-date"),

    
    question("Acquésition de première résidence", "Aquisition of main house*", "Vous ou votre conjoint avez vous acheté ou construit une première résidence cette anée?","Did you or your conj. buy or build your first house this year?", tr.bool, [], 73, "residence-achat"), 
    question("Vente de première résidence", "Selling of main house*", "Vous ou votre conjoint avez vous venduvotre résidence cette anée?","Did you or your conj. sell your house this year?", tr.bool, [], 73, "residence-vente"), 
  ];
}

const idSpecials = [
  "special-pret-a-faire"
];
function questionSpeciale(){
  return [
    question("Informations complètes","Informations are complete", "Noux avez-vous transféré toutes les informations nécessaires pour que nous remplissions le rapport d'impot.","", tr.bool, [], 0, "special-pret-a-faire")
  ];
}

function getAll(){
  return identiteUser()
  .concat(identiteConjoint())
  .concat(personnesACharge())
  .concat(additionnelUser())
  .concat(questionSpeciale())
  .concat(qstAClasser());
}

function questionToString(question){
  return JSON.stringify(question);
}
function questionsToString(questions){
  return questions.map(qst=>questionToString(qst)+"\n");
}

export default {
  getAll: getAll,
  questionsToString: questionsToString,
  idSpecials : idSpecials
};