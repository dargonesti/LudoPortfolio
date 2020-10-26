import React from "react";
import LocalizedStrings from 'react-localization';

var ordreLangues = ["fr", "en"];

var texts = [
    {
        nomSection: "General",
        prefix: "",
        sufix: "",
        texts: {

            lan: ["fr", "en"],
            contact: ["Contact", "Contact"],
            about: ["About me", "À propos"],
            portfolio: ["Portfolio", "Portfolio"],
            projects: ["Projects", "Projets"],
            prints: ["Prints", "Impressions"],
            search: ["Search", "Chercher"],
            home: ["Home", "Accueil"],

            photography: ["Photography", "Photographie"],
            weddings: ["Weddings", "Mariages"],
            tech: ["Tech", "Techno"]

        }
    },
    {
        nomSection: "About Me",
        prefix: "about",
        sufix: "",
        texts: {
            Welcome: [`Welcome to my site!
    I'm a photographer, software engineer and hiker. I was born in the Northern-Québec move around Québec from time to time. I used to be captivated by video-games, but redirected that energy towards photography these last years.
    I'm a fan of Fantasy and Science-Fiction and I suggest you check my link to 
    GoodReads if you're bored and in search of a good story!`
    ,
                `Bienvenue sur mon site! Je suis un photographe, programmeur et randonneur. Je suis né dans le Nord-du-Québec mais sors visiter le reste du Québec de temps à autre.`],

        }
    },


    {
        nomSection: "Connexion",
        prefix: "con",
        sufix: "",
        texts: {
            Login: ["Se connecter", "Login"],
            Logout: ["Déconnexion", "Logout"],
            WannaLogout: ["Voulez vous vous déconnecter?", "Do you want to log out?"],
            GotoQ: ["Aller aux questions", "Go to Questions"],
            BeClassic: ["Ou soyez classique", "Or be classical"],
            Username: ["Nom d'utilisateur", "Username"],
            Email: ["Courriel", "Email"],
            Password: ["Mot de passe", "Password"],
            ConfirmPassword: ["Confirmez Mot de passe", "Confirm Password"],
            GetStarted: ["Se connecter", "Log in"],
            Register: ["Créer un compte", "Create an Account"],
            ForgotPass: ["Mot de passe oublié", "Forgot password"],
            ResetTitle: ["Changer mot de passe", "Reset password"],
            Reset: ["Changer", "Reset"]
        }
    },

];


function addPrefixSufix(lstTexts, prefix, sufix) {
    return Object.keys(lstTexts)
        .reduce((ret, key) => {
            ret[prefix + key] = lstTexts[key];
            return ret;
        }, {});
}

var mergedTexts;/* = {
    ...addPrefix(textsQuestion, "qst"),
    ...addPrefix(textsDocs, "doc")
};*/
mergedTexts = texts.reduce((ret, section) =>
    ({
        ...ret,
        ...addPrefixSufix(section.texts, section.prefix, section.sufix)
    })
    , {});

var MyTexts = Object.keys(mergedTexts)
    .reduce((ret, key) => {
        mergedTexts[key]//Pour chaque clé
            .forEach((txt, ind) => ret[ordreLangues[ind]][key] = txt) // inséré chaque langue
        return ret;
    }, { en: {}, fr: {} });


//console.log(MyTexts);
let strings = new LocalizedStrings(MyTexts);

/*
strings._defaultLanguageFirstLevelKeys
.forEach(key=>{
    if(!key.startsWith("_")){
        strings[key] = strings[key].split("<br>").join(<br/>)
    }
    })
    
strings._defaultLanguageFirstLevelKeys
.forEach(key=>{
    if(!key.startsWith("_") && strings[key].includes("<br>")){
        var newStr = strings[key].split("<br>");
        var ret = <>{newStr.pop()}</>;
        while(newStr.length >= 1){
            ret = <>{newStr.pop()}<br/>{ret}</>;
        }
        strings[key] = ret;
    }
    });*/

export default strings;