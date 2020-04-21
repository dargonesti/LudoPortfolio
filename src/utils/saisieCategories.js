//TODO : https://auth0.com/blog/converting-your-web-app-to-mobile/
import { prop, indexBy } from "ramda";
const catFeuillet = [
  {
    titre: "Autre",
    idperso: "autre",
    desc: "Feuillet non listé parmis nos choix, mais que vous croyez pertinent."
  },
  {
    titre: "T2202 / TL11",
    idperso: "t2202",
    desc: "Certificat pour frais de scolarité et d’inscription"
  },
  {
    titre: "T3",
    idperso: "t3",
    desc: "État des revenus de fiducie"
  },

  {
    titre: "T4",
    idperso: "t4a",
    desc: "État de la rémunération payée"
  },
  {
    titre: "T4AOAS",
    idperso: "T4AOAS",
    desc: "Relevé de la Sécurité de la vieillesse"
  },
  {
    titre: "T4A",
    idperso: "T4A",
    desc: "État du revenu de pension, de retraite, de rente ou d'autres sources",
  },
  {
    titre: "T4AP",
    idperso: "T4AP",
    desc: "État des prestations du Régime de pensions du Canada",
  },
  {
    titre: "T4ARCA",
    idperso: "T4ARCA",
    desc: "",
  },
  {
    titre: "T4E",
    idperso: "T4E",
    desc: "État des prestations d'assurance-emploi et autres prestations",
  },
  {
    titre: "T4P", // T4PS?
    idperso: "T4PS",
    desc: "État des prestations du Régime de pensions du Canada",
  },
  {
    titre: "T4RIF",
    idperso: "T4RIF",
    desc: "État du revenu provenant d'un fonds enregistré de revenu de retraite",
  },
  {
    titre: "T4RSP",
    idperso: "T4RSP",
    desc: "État du revenu provenant d'un REER",
  },
  {
    titre: "T5",
    idperso: "T5",
    desc: "État des revenus de placements",
  },
  {
    titre: "T101",
    idperso: "T101",
    desc: "État des frais de ressources",
  },
  {
    titre: "T5006",
    idperso: "T5006",
    desc: "État des actions de la catégorie A d'une société agréée à capital de risque de travailleurs",
  },
  {
    titre: "T5007",
    idperso: "T5007",
    desc: "État des prestations",
  },
  {
    titre: "T5008",
    idperso: "T5008",
    desc: "Déclaration des opérations sur titres",
  },
  {
    titre: "T5013",
    idperso: "T5013",
    desc: "État des revenus d'une société de personnes",
  },
  {
    titre: "A3Détails",
    idperso: "A3Details",
    desc: "",
  },
  {
    titre: "S3 Résidence Principale Détail",
    idperso: "S3ResidencePrincipaleDetail",
    desc: "Résidence principale et biens immobiliers",
  },
  {
    titre: "Étranger",
    idperso: "etranger",
    desc: "CRÉDIT POUR IMPÔT ÉTRANGER?",
  },
  {
    titre: "RC62",
    idperso: "RC62",
    desc: "État de la prestation universelle pour la garde d'enfants",
    relatedQuestions: ["np-personnes-a-charge"]
  },
  {
    titre: "T1RRSP Deduction Summary",
    idperso: "T1RRSPDeductionSummary",
    desc: " État du revenu provenant d’un REER au Canada",
  },
  {
    titre: "PFRT",
    idperso: "PFRT",
    desc: "Prestation fiscale pour le revenu de travail ",
  },
  {
    titre: "T1135 Détail",
    idperso: "T1135Detail",
    desc: "Bilan de vérification du revenu étranger",
  },
  {
    titre: "T1204",
    idperso: "T1204",
    desc: "Paiements contractuels de services du gouvernement",
  },

  {
    titre: "RL-1",
    idperso: "RL1",
    desc: "Relevé 1 - Revenus d'emploi et revenus divers",
  },
  {
    titre: "RL-31",
    idperso: "RL31",
    desc: "Relevé 31 - Renseignements sur l'occupation d'un logement",
  },

].map(cat => {
  return { relatedQuestions: [], ...cat, idperso: "cat-f-" + cat.idperso };
});

const catDepense = [
  {
    titre: "Autre",
    idperso: "autre",
    desc: "Dépense non listée parmis nos choix, mais que vous croyez pertinent."
  },
  {
    titre: "Entreprise / Travailleur Autonome",
    idperso: "ent",
    desc: "Dépense reliée à votre entreprise si vous êtes Travailleur Autonome"
  },

  {
    titre: "REER : reçus officiels",
    idperso: "REER",
    desc: ""
  },

  {
    titre: "Frais de scolarité : Relevé 8/T2202A",
    idperso: "T2202A",
    desc: ""
  },
  {
    titre: "Intérêts payés sur prêts étudiants : Relevé de la banque ou de la caisse",
    idperso: "prets-etudiants",
    desc: ""
  },
  {
    titre: "Frais de déménagement",
    idperso: "demenagement",
    desc: ""
  },
  {
    titre: "Dernier talon de paie de l’année pour chaque emploi",
    idperso: "talon-de-paie",
    desc: ""
  },
  {
    titre: "Transport en commun",
    idperso: "transport-commun",
    desc: ""
  },
  {
    titre: "Dons de charité/ Contributions politiques",
    idperso: "dons",
    desc: ""
  },
  {
    titre: "Cotisations syndicales ou professionnelles (si autres que sur T4)",
    idperso: "cotisations-syndicales",
    desc: ""
  },
  {
    titre: "Acomptes provisionnels : documents officiels du gouvernement",
    idperso: "acomptes-provisionnels",
    desc: ""
  },
  {
    titre: "Crédit pour maintien à domicile (si vous avez 70 ans ou plus)",
    idperso: "maintien-domicile",
    desc: ""
  },
  {
    titre: "Rénovert (2016-2017), LogiRénov (2014-2015)",
    idperso: "renovert",
    desc: ""
  },
  {
    titre: "Crédit de solidarité : Relevé 31 (si locataire)",
    idperso: "releve-31",
    desc: ""
  },


  {
    titre: "Frais médicaux",
    idperso: "medicaux",
    desc: ""
  },
  /* // TODO : Lier à page d'information  sur les dépenses [Médicales|Déménagement|Entrepreneur]
    {
    titre: "Frais médicaux - Acupuncteur",
    idperso: "medicaux-Acupuncteur",
    desc: ""
  },
  {
    titre: "Frais médicaux - Assistant médical en ophtamologie",
    idperso: "medicaux-assist-ophtamolog",
    desc: ""
  },
  {
    titre: "Frais médicaux - Assistant dentaire",
    idperso: "medicaux-assist-dent",
    desc: ""
  },
  {
    titre: "Frais médicaux - Associé en Psychologie",
    idperso: "medicaux-assoc-psycho",
    desc: ""
  },
  {
    titre: "Frais médicaux - Audiologiste",
    idperso: "medicaux-audiologiste",
    desc: ""
  },
  {
    titre: "Frais médicaux - ",
    idperso: "medicaux-",
    desc: ""
  },
  {
    titre: "Frais médicaux - ",
    idperso: "medicaux-",
    desc: ""
  },
  {
    titre: "Frais médicaux - ",
    idperso: "medicaux-",
    desc: ""
  },
  {
    titre: "Frais médicaux - ",
    idperso: "medicaux-",
    desc: ""
  },
  {
    titre: "Frais médicaux - ",
    idperso: "medicaux-",
    desc: ""
  },
  {
    titre: "Frais médicaux - ",
    idperso: "medicaux-",
    desc: ""
  },
  {
    titre: "Frais médicaux - ",
    idperso: "medicaux-",
    desc: ""
  },
  {
    titre: "Frais médicaux - ",
    idperso: "medicaux-",
    desc: ""
  },
  {
    titre: "Frais médicaux - ",
    idperso: "medicaux-",
    desc: ""
  },
  {
    titre: "Frais médicaux - ",
    idperso: "medicaux-",
    desc: ""
  },
  {
    titre: "Frais médicaux - ",
    idperso: "medicaux-",
    desc: ""
  },*/
].map(cat => {
  return { relatedQuestions: [], ...cat, idperso: "dep-" + cat.idperso };
});

const catAdmin = [

  {
    titre: "MR-69",
    idperso: "mr69",
    desc: "Autorisation relative à la communication de renseignements ou procuration"
  },

  {
    titre: "T1013",
    idperso: "t1013",
    desc: "Demander ou annuler l'autorisation d'un représentant"
  },

  {
    titre: "T-183",
    idperso: "t183",
    desc: "Déclaration de renseignements pour la transmission électronique d'une déclaration de revenus et de prestations d'un particulier"
  },

  {
    titre: "TP-1000",
    idperso: "tp1000",
    desc: "Transmission par internet de la décalration de revenis d'un particulier"
  },

  {
    titre: "Sommaire à approuver",
    idperso: "somm-approuve",
    desc: "Sommaire à faire approuver."
  },
  {
    titre: "Rapport Final",
    idperso: "final-rap",
    desc: "Sommaire à faire approuver."
  },
  {
    titre: "Documents multiples",
    idperso: "docs-multiple",
    desc: "Contiens plus d'un document à approuver."
  },
  ///// NOTE : Comment gérer les signatures? Variable dans adminNotes?  
].map(cat => {
  return { relatedQuestions: [], ...cat, idperso: "admin-" + cat.idperso };
});


const categories =
{
  feuillets: catFeuillet,
  depenses: catDepense,
  admin: catAdmin,
  combined: indexBy(prop("idperso"), catDepense.concat(catFeuillet).concat(catAdmin))
};



export default categories;