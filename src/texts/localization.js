import React from "react";
import LocalizedStrings from 'react-localization';


/* NOTE : 

    Le format original de fichier est peut pratique pour la maintenance et est comme suit : 
    {en : {
        id1: "texte1", 
        id2: "texte2", etc.
    },
    fr: {
        id1: "text1", etc.
    }}

    Le format utilisé est tel que : 
    {
        id1: ["text FR", "text EN"],
        id2: ... 
    }

    NOTE 2 : 
    Si le texte anglais n'est pas présent, 
    celui en francais sera choisit par défaut.
    Edit from the Web?
*/

var ordreLangues = ["fr", "en"];

var texts = [
    {
        nomSection: "General",
        prefix: "",
        sufix: "",
        texts: {
            Annee: ["Année", "Year"],
            Notes: ["Notes", "Notes"],
            AboutUs: ["À Propos", "About Us"],
            FAQ: ["FAQ", "FAQ"],
            MadeBy: ["Créé par ", "Made by "],

            Filtre: ["Filtre", "Filter"],
            Message: ["Message", "Message"],
            Type: ["Type", "Type"],
            TitreNotif: ["Titre (optionel)", "Title (optional)"],
            Tous: ["Tous", "All"],
            Toutes: ["Toutes", "All"],
            Bonjour: ["Bonjour", "Welcome"],

            Oui: ["Oui", "Yes"],
            Non: ["Non", "No"],
            idk: ["Je ne sais pas", "I don't know"],
            YouSure: ["Êtes vous certain?", "Are you sure?"],

            Question: ["Question", "Question"],
            Doc: ["Document", "Document"],
        }
    },
    {
        nomSection: "Header",
        prefix: "head",
        sufix: "",
        texts: {
            docs: ["Documents", "Documents"],
            questions: ["Questions", "Questions"],
            monProfile: ["Mon Profil", "My Profile"],

            Login: ["Se connecter", "Login"],
            Logout: ["Logout", "Logout"],
            Register: ["Créer un compte", "Create an Account"],

            PushNotification: ["Envoyer Notifications", "Send Notifications"],
            FindUser: ["Trouver Usager", "Find User"],

        }
    },
    {
        nomSection: "Admin",
        prefix: "admin",
        sufix: "",
        texts: {
            EtatCompte: ["État de traitement : ", "State of processing :"],
            Etat1: ["Nouveau", "New"],
            Etat2: ["En traitement", "In process"],
            Etat3: ["En attente du client", "Waiting for client"],
            Etat4: ["À Signer", "To Sign"],
            Etat5: ["À payer", "To Pay"],
            Etat6: ["À Transmettre", "To Transfer"],

            EtatUndefined: ["-Non Défini-", "-Undefined-"],

            AjouterNote: ["Ajouter note", "Add note"],

            EstCompteTest: ["Est un compte de test : ", "Is a test account :"],

            NotificationTitle: ["Message admin d'ImpotX", "Admin message from ImpotX"],

            Send: ["Envoyer", "Send"],
            SendAll: ["Envoyer à tous", "Send to everyone"],
            LongNotif: ["Attention, les messages de notification doivent être brefs!",
                "Beware! Notification messages must be short!"],
            OpenChat:["Clavarder", "Open Chat"],
            Certain:["Êtes vous certain de vouloir sauvegarder?", "Are you sure you want to save?"],
            OuiPlusDemander:["Oui et ne plus demander", "Yes and don't ask anymore"]
        }
    },
    {
        nomSection: "FindUser",
        prefix: "find",
        sufix: "",
        texts: {
            UserName: ["Nom d'usager", "Username"],
            Email: ["Email", "Email"],

            Created: ["Dte de Création", "Creation Date"],
            LastActivity: ["Dernière Activité", "Last Activity"],
            RepCount: ["# Réponses", "# Ans."],
            DocCount: ["# Docs.", "# Files"],
            IsComplete: ["Complété", "Is Complete"],
            State: ["Statut", "State"],
            ShowTests: ["Afficher les comptes test :", "Show Tests :"]
        }
    },
    {
        nomSection: "Questions",
        prefix: "qst",
        sufix: "",
        texts: {
            titreMenu: ["Questions", "Questions"],

            nouvelles: ["Non Répondues", "New"],
            repondues: ["Répondues", "Answered"],
            toutes: ["Toutes", "All"],

            FiltrerQuestion: ["Rechercher", "Search"],
            AnneeDuRap: ["Année du rapport", "Year to see"],

            EnteteNew: ["LES QUESTIONS QU'IL VOUS RESTE À RÉPONDRE AVEC LES PLUS PERTINENTES EN PREMIER.", "The questions you still haven't answered."],
            EnteteRep: ["LES QUESTIONS AUX QUELLES VOUS AVEZ DÉJÀ RÉPONDU.", "The questions you have already answered"],
            EnteteToutes: ["LISTE DE QUESTIONS COMPLÈTES, RÉPONDUES OU NON.", "Every questions we could have, even those we're still not sure you'd have to answer."],
        }
    },
    {
        nomSection: "Documents",
        prefix: "doc",
        sufix: "",
        texts: {
            titreMenu: ["Documents", "Documents"],
            titrePage: ["Documents", "Documents"],

            paraEntete: [`Naviguez parmis vos images déjà importées et uploadez de nouvelles images.
Les images pertinentes sont généralement des factures ou des formulaires / rapports gouvernementaux.`
                , `Navigate within your uploaded files and upload new ones.
Relevant images are usually either recipes, or Official documents from the Government`
            ],

            filtrerDocs: ["Filtrer Documents", "Filter Files"],
            anneeRap: ["Année du rapport", "Year of report"], //Duplicat
            FeuilDep: ["Feuillet/Dépense", "File/Spending"],

            AucunDoc: ["Aucun document à afficher.", "No file to show."],

            Feuillet: ["Feuillet", "File"],
            Depense: ["Dépense", "Spending"],
            DocAdmin: ["Document Admin", "Admin File"],

            Sommaire1: ["Sommaire 1", "Summary 1"],
            Sommaire2: ["Sommaire 2", "Summary 2"],

            TotalDep: ["Total des dépenses : ", "Spendings Total :"],

            Type: ["Type"],
            TypeFeuillet: ["Type de Feuillet", "Type of file"],
            TypeDepense: ["Type de Dépense", "Type of spending"],
            Titre: ["Titre", "Title"],
            DragDrop: [`Glisser / Déposer Cliquer`, "Drag/Drop or Click"],

            Renseignement: ["Demander un renseignement", "Ask a question"],

            ValiderSuppression: ["Voulez vous supprimer l'image?", "Do you want to delete the file?"],

            DownloadOri: ["Télécherger l'original", "Download original"],
            CompressToggle: ["Compresser avant l'envoi", "Compress before upload"],
            DescCompression: ["Sauvez du temps et des Données en compressant l'image avant de l'envoyer à nos serveurs; Vous ne devriez pas voir de différence entre le fichier plus léger, mais vous pourrez vérifier si l'image est satisfaisante en allant dans ses détails, puis 'Télécharger l'Original'.", 
            "Save time and Data by compressing the image before sending it to us; You shouldn't see a difference between the lighter file, but you will be able to check if it's still good enough by going to its details, then 'Download Original'."],

            ModeLarge: ["Mode Large", "Large Mode"],

            Signature: ["Signature : ", "Signature : "],
            Signer: ["Signer", "Sign"],
        }
    },

    {
        nomSection: "Toasts",
        prefix: "toast",
        sufix: "",
        texts: {
            Bye: ["Au revoir!", "Bye!"],
            ErrCon: ["Erreur lors de la connection : ", "Error on connection : "],

            Welcome: ["Bien venu!", "Welcome!"],
            RepSaved: ["Réponse enregistrée.", "Answer Saved."],
            Saved: ["Change Saved!", "Bye"],
            Cat: ["Catégorie ", "Bye"],
            NonTrouvee: [" non trouvée.", "Bye"],
            PassPasPareil: ["La confirmation de mot de passe ne concorde pas.", "The password is not the same in both fields."],
            SuccessCreaCompte: ["Votre compte a été créé avec succès! Vérifiez vos courriels.", "Your profile was successfully created! Check your emails."],
            CompteValide: ["Votre compte a été validé.", "Your email was confirmed."],
            ErrorCreation: ["Une erreur s'est produite lors de votre inscription!", "An error occured!"],
            ErrElemNonScrollable: ["Impossible de trouver l'élément", "Couldn't scroll to target"],
            ErrFindUser: ["Erreur lors de la recherche d'user", "Error finding the user"],
            ErrAdminDataUser: ["Erreur, données non trouvées pour l'user : ", "Error getting data for user : "],
            NeedEmail: ["Vous devez fournir l'adresse courriel.", "You need to enter your email."],
            ErrEnvoieCourriel: ["Erreur lors de l'envoie du courriel", "An error occured while sending you an email"],
            ErrChangePass: ["Erreur lors du changement de mot de passe", "An error occured while changing the password"],

            PassChanged: ["Succès du changement de mot de passe", "Succesfully changed the password"],
            MailSent: ["Un courriel vous as été envoyé", "An email was sent"],
            MsgComming: ["messages en attente", "messages coming-up"],

            NotificationProcess: ["Voulez vous recevoir une notification quand un Comptable aura vérifié votre dossier?", "Do you want to be notified when an ImpotX employee will have processed your case?"],
            NotificationRep: ["Voulez vous recevoir une notification quand un Employé aura répondu à votre question?", "Do you want to be notified when an amployee will have answered your question?"],
            SaidYesNotifs: ["Merci, acceptez la demande de votre appareil pour recevoir nos notifications.", "Thank you, accept the request from your device to receive our notifications."],
            SaidNoNotifs: ["Vous pouvez aller dans votre profile pour activer les notifications quand vous le voudrez.", "You can go in your profile to accept notifiactions when you want it."],

            MessageVide: ["'Message' ne doit pas être vide.", "There must be a 'Message'"],
            NotifSent: ["Notification envoyée", "Notification sent"],
 
        }
    },

    {
        nomSection: "User Summary",
        prefix: "sum",
        sufix: "",
        texts: { 
            ClicPush: ["Recevoir Notifications", "Subscribe to Pushes"]
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
    {
        nomSection: "Landing Page",
        prefix: "landing",
        sufix: "",
        texts: {
            Titre: ["Ludovic Migneault", "Ludovic Migneault"],
            FirstDesc: ["Une solution  .",
                "A solution adapted  ."],
            TalkProduct: ["Notre offre", "Our offer"],
            DescProduct: [`Ceci est un st parce qu'il est un intéréssé.`,
                `This is the paragra ser is curious, otherwise he wouldn't scroll to get here. 
        Add a button if you want the user to see more.`],

            WorkWithUs: ["Faites un essai avec nous", "Try us"],
            Desc: [`Description.`,
                `Description.`],
 

            AucunDep: ["AUCUN DÉPLACEMENT NÉCESSAIRE", "FROM ANYWHERE"],
            AucunDepDesc: ["Rencontrez un conseiller comme vous voulez ...téléphone, courriel, etc.",
                "Talk with our staff the way you want ... phone, mail, etc."],

            MeilleurPrix: ["LES MEILLEURS PRIX DU QUÉBEC", "THE BEST PRICES"],
            MeilleurPrixDesc: ['Le meilleur rapport qualité/prix du québec. "Pas de surprise!"',
                "The best price/quality in Québec. No surprises!"],

            DansMesMots: ["L'IMPÔT DANS MES MOTS", "IN YOUR WORDS"],
            DansMesMotsDesc: ["Impôt XYZ est né de la volonté de simplifier l'impôt pour tous.",
                "Impôt XYZ was born from the idea of simplifying the work for everyone."]
        }
    },

    {
        nomSection: "Notifications Page",
        prefix: "notifs",
        sufix: "",
        texts: {
            Titre: ["Messages non répondus", "Unanswered Messages"],
            Intro: [`Voyez la liste des mésages envoyé par les différents utilisateurs qui n'ont pas encore été répondus.`,
                `See the unanswered messages sent by all the users.`],
            By: [" Notifs De ", " Notifs by "],
            ByUser: [" Notifs ", " Notifs "],
            Datant: [" datant de ", " Dating "],
            DeType: [" de type ", " of type "],
            UserNotFound: [" -utilisateur supprimé- ", " -user deleted- "],
            ComptesTest: ["Comptes test", "Test users"],
            Voir: ["Vu", "Seen"],
             
            Sent: [" a envoyé " , " sent " ],
            Received: [ "Vous avez reçus ", "You received "],
            Completed: ["a complété ses informations pour", "completed his files for"],
            YearsToProcess: [ " années prêtes à traiter pour ", " years ready to process for "],

            ReadyToProcess: ["Dossier prêt à traiter pour ", "File ready to process for "]
        }
    },


    {
        nomSection: "Sections à signer",
        prefix: "",
        sufix: "",
        texts: {
            EnCliquantVous: ["En cliquant le bouton suivant, vous validez que vous avez lu et acceptez ", "By clicking the following button, you confirm that read and accept "],
            "admin-somm-approuve": ["la section 4-D du document lié.", "section 4-D of the linked document."],
            "admin-final-rap": ["la section 5 du document lié.", "section 5 of the linked document."],
           
            "admin-tp1000": ["le document lié.", "the linked document."],
            "admin-t183": ["le document lié.", "the linked document."],
            "admin-t1013":  ["le document lié.", "the linked document."],
            "admin-mr69":  ["le document lié.", "the linked document."],
            "admin-docs-multiple": ["le document lié.", "the linked document."],
        }
    },
    
    {
        nomSection: "Chat",
        prefix: "chat",
        sufix: "",
        texts: {
            Head: ["Clavardage", "Live Chat"],
            NoAdmins: ["Pas d'admin connecté", "No admins live"],
            AdminsOnline: ["admins connecté", "online admins"],
            QuestionToTeam: ["Questions envoyées à l'équipe ImpotX", "Questions sent to the ImpotX team"],
            DemanderRenseignements: ["Demander des renseignements", "Ask for informations"],
            CurrentExchanges: ["Échanges en Cours", "Active Chats"],
            UsersOnline: ["Usagers en Ligne", "Users Online"],

            Open: ["Parler", "Chat"],
            Answer: ["Répondre", "Answer"],
            SeeFile: ["Voir Dossier","See File"],
            NoUsers: ["Aucun usager en ligne", "No user online"],
            NoCurrentMessages: ["Aucun messages récents", "No recent messages"],
            DemandeAdmin:["Demander la présence d'un admin", "Ask to speak to someone"],
            RequestSent:["Demande envoyée!", "Request Sent"],
            VoirPlus:["Voir Anciens Messages", "See Older Messages"]
        }
    },

    {
        nomSection: "Tutoriels",
        prefix: "tuto",
        sufix: "",
        texts: {
            Next: ["Suivant", "Next"],
            Prev: ["Précédent", "Prev"],
            Done: ["Terminé", "Done"],
            Skip: ["Ignorer", "Skip"],
            IntroQst: ["Introduction : Questions", "Introduction: Questions"],
            IntroDoc: ["Introduction : Documents", "Introduction: Documents"],
            IntroMsg: ["Introduction : Messages", "Introduction: Messages"],

            FirstIntroMessage: [`Bonjour!<br>Le tour guidé du site devrais prendre environ 5 minutes si vous désirez le compléter et nous permettra d'assez vous connaître pour pouvoir communiquer avec vous.<br>Vous pouvez aussi choisir de passer le tour guidé en cliquant sur le bouton rouge "Ignorer".`, 
        "Welcome!<br>The guided tour should take about 5 minutes and will allow us tou know how to contact you.<br>If you want, you can skip the tour by clicking the red 'Pass' button."],

            CanSkip: ["Vous pouvez passer une question et y répondre plus tard!", "You can skip a question and answer it later!"],
            QstBool: ["Saisissez simplement oui ou non. ", "Just select true or false. "],
            QstChoice: ["Saisissez le choix de réponse le plus approprié. ", "Select the most relevant answer. "],
            QstText: ["Saisissez les champs texte. ", "Fill the text fields. "],

            Doc1: ["Vous pouvez choisir de tout de suite nous envoyer des documents pour nous aider à faire votre dossier d'impots. Envoyez nous vos PDF!", "You can chose to upload files to us, here are a few examples! Send us your PDFs!"],
            Doc2: ["Vous pouvez stocker vos documents et factures avec nous! Vous y aurez toujours accès en vous connectant à votre compte!", "You can leave your files and receipts with us! You'll always have access to them when login-in!"],
            Msg1: ["Vous pouvez communiquer avec un membre de notre équipe directement sur le site web! Ouvrez les détails d'une question à l'aide de l'icon suivant, et entrez votre message dans la section à cet effet.", 
            "You can communicate with a member of our team right here on the web-site! Open the details of a question with the following icon, then type your message in the appropriate field."],
            Msg2: ["Le même champ de message se trouve sur les détails de vos documents.", "The same message field can be found in the details section of your files."],
            Msg21: ['Le sommaire de tous vos messages se trouve dans la page "Mon Profil".', 'The summary of all your messages is located in the page "My Profile".'],
            SentMsg: ["Normalement, un message aurait été envoyé, mais cette fois, il s'agit d'un exemple.", "Normally, a message would have been sent, but this time it's just an example."],

            ClickIcon:["Cliquez l'icone ", "Click the icon "],
            AccessMessages:["pour ouvrir les détails de la question, vous aurez ainsi accès à la section message : ", "to open the detail panel of the question, you will then have access to the message section :"],
            ForAccess:["Pour avoir accès au champ :", "To access the field :"],

            Step: ["Étape ", "Step "],


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