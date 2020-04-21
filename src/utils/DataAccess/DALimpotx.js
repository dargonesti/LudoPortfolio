/*eslint eqeqeq:0*/
/*eslint no-mixed-operators:0*/
import request from 'utils/request';
import auth from 'utils/auth';
import utils from "utils/utils.js";
import localData from "utils/DataAccess/localData.js";
import impoTxt from 'texts/localization';
import saisieCategories from 'utils/saisieCategories';
import MessagesAndNotifications from "./MessagesAndNotifications.js";


const MIN_TIME_TO_RECALL = 1000;

/*
Plan pour améliorer le DAL : 
- Définir différent type de Data Calls : 
    - Get from server
    - Get from cache
    - Get subset from cache

    - Get local var
    - Set local var
    - Get local session var
    - Set local session var

    - Set server
    - change server
    - delete server?


*/
//SERVICE STRAPI
// TODO : Systeme pour offline saves et upload quand internet reviens.
var _DAL = {
    getAnnee(subSection) {
        if (!(subSection)) subSection = "";
        var currAnnee = localData.get("annee" + subSection);
        if (currAnnee) {
            if (/\d{2,4}/i.test("" + currAnnee)) {
                return currAnnee;
            } else {
                return null;// Null ok?
            }
        } else {
            return (new Date()).getFullYear();
        }
    },
    setAnnee(annee, subSection) {
        if (!(subSection)) subSection = "";
        localData.set("annee" + subSection, annee);
        utils.callEvent("annee");
    },

    getFeuillets: function () {
        return saisieCategories.feuillets;
    },
    getDepenses: function () {
        return saisieCategories.depenses;
    },
    getAdminFile: function () {
        return saisieCategories.admin;
    },
    getDocCategory: function (idCat) {
        var ret = saisieCategories.combined[idCat];
        return ret ? ret.titre : impoTxt.etatEtatUndefined;
    },
    register: async function (userName, email, pass) {
        return request("auth/local/register", {
            method: "POST",
            body: {
                username: userName,
                email: email,
                password: pass
            }
        });
    },
    auth: async function (email, password) {
        return request(utils.isChatActive() ? "login-fb" : "auth/local"
        , {
            method: "POST",
            body: {
                identifier: email,
                password: password
            }
        },[500]);
    },
    authGoogle: async function (params) {
        return request("auth/google/callback?" + params, {
            noAuth: true,
            method: "GET"
        });
    },

    getUser: async function (id) {
        if (auth.getUserInfo()) {
            if (!(id)) {
                id = "me"
            }

            if (shouldUpdate(true, this._usrVal, id)) {
                this._usrVal[id] = {
                    time: Date.now(),
                    promise: request("users/" + id)
                }
            }
            return this._usrVal[id].promise;
        } else
            return null;
    },

    //Note : Fire and Forget function, on n'écoute pas la réponse
    registerPush: function (subscription) {
        try {
            request("pushlists", {
                method: "POST", body:
                {
                    endPoint: JSON.stringify(subscription),  //subscription.endpoint
                    expirationDate: subscription.expirationTime,
                    user: auth.getUserInfo().id
                }, ignoreError: true
            }, true)
                .then(resp => {
                    //utils.log("subscribe push to Strapi success");
                    //utils.log(resp);
                })
                .catch(ex => {
                    //utils.log("ERROR : Subscribe push to Strapi failed");
                    //utils.log(ex);
                });
        } catch (ex) {

        }
    },
 
    _qstVal: {},        
    _removedQuestions: ["user-no-nas", "conj-no-nas"],
    getQuestions: async function (ignoreCache) {
        if (shouldUpdate(ignoreCache, this._qstVal, "def")) {
            this._qstVal.def = {
                time: Date.now(),
                promise: request("questions?_limit=1234", { method: "GET" })
                .then(results => {
                    results = results.filter(qst => !this._removedQuestions.some(id => id == qst.idperso));
                    //utils.log(results);
                    let ret = results.map(ori => {
                        ori.rep = false;
                        return ori;
                    });
                    var retIdPerso = ret
                        .reduce((ret, qst) => {
                            ret[qst.idperso] = qst;
                            return ret;
                        }, {});

                    var retId = ret
                        .reduce((ret, qst) => {
                            ret[qst._id] = qst;
                            return ret;
                        }, {});

                    localData.setStorage("getQuestions", retIdPerso);
                    localData.setStorage("getQuestionsById", retId);
                    localData.setStorage("mapIdPerso", results.reduce((ret, qst) => {
                        ret[qst.idperso] = qst._id;
                        ret[qst._id] = qst.idperso;
                        return ret;
                    }, {}));

                    utils.refreshQuestions(ret);

                    return ret;
                }).catch(ex => {
                    // utils.log(ex);
                    return [];
                })
            };
        }
        return this._qstVal.def.promise;
    },
    getQuestion: function (questionId) {
        var qst = localData.getStorage("getQuestions");
        return qst ? qst[questionId] : null;
    },
    getQuestionById: function (questionId) {
        var qst = localData.getStorage("getQuestionsById");
        return qst ? qst[questionId] : null;
    },


    signerDoc: async function (fileId) {
        if (!auth.isAdmin()) {
            if (fileId) {
                request("signatures", { method: "POST", body: { accepte: true, user: auth.getUserInfo().id, fileupload: fileId } })
                    .then(res => {
                        utils.log(res);
                    }).catch(ex => console.error(ex));
                return request("fileuploads/" + fileId, { method: "PUT", body: { statut: "signed" } })
                    .then(rep => {
                        auth.showToast(impoTxt.toastSigned);
                    });
            }
        }
    },

    getFiles: async function () {
        var selectUser = localData.get("selectedUser");
        if (selectUser)
            return new Promise((resolve, reject) => {
                resolve(selectUser.fileuploads || []);
            });
        else if (auth.getToken())
            return this.getUser().then(rep => {
                return new Promise((resolve, reject) => {
                    resolve(rep?rep.fileuploads || []:[]);
                });
            });
        else
            return new Promise((resolve) => { resolve([]) });
    },
    getFile: async function (fileId) {
        // TODO... ou plus probablement simplement le passer comme url d'image
    },
    saveFile: async function (titre, category, montant, fileURL, annee, user) {
        user = user || auth.getUserInfo().id;
        if (isNaN(montant)) montant = 0;
        category = category || "";
        if (!utils.isNumeric(annee)) {
            annee = null;
        }
        return request("fileuploads", {
            method: "POST", body: {
                titre,
                category,
                montant: parseFloat(montant),
                url: fileURL,
                user,
                annee
            }
        })
            .then(rep => {
                utils.log(rep);
                utils.callEvent("docAdded");
                //auth.addRep(question.rep);
            })
            .catch(ex => { utils.log(ex); });
    },


    changeFile: async function (id, titre, montant, cat) {
        if (isNaN(montant)) montant = 0;
        return request("fileuploads/" + id, {
            method: "PUT", body: {
                titre,
                montant: parseFloat(montant),
                category: cat
            }
        })
            .then(rep => {
                utils.log(rep);
                //auth.addRep(question.rep);
            })
            .catch(ex => { utils.log(ex); });
    },


    removeFile: async function (file) {
        //Type : DELETE /fileuploads/:id
        return request("fileuploads/" + file._id, { method: "DELETE" })
            .then(rep => {
            })
            .catch(ex => { utils.log(ex); });
    },

    saveReponse: async function (question) {
        var questions = localData.getStorage("getQuestions");

        if (questions) {
            var oldQuestion = questions[question.idperso];
            // TODO : if oldQuestion.rep != null > Edit it to disable it
            oldQuestion.rep = question.rep;

            utils.log("Insertion de reponse : ");
            utils.log(question.rep);

            // Ajout Valeurs problématiques par défaut : 
            question.rep.numero = question.rep.numero || null;

            return request("reponses", { method: "POST", body: question.rep })
                .then(rep => {
                    utils.log(rep);
                    auth.addRep(rep);
                    auth.showToast(impoTxt.toastRepSaved, 1500, "info");
                    if (auth.isAdmin()) {
                        this.getUser(localData.get("currentUserId"))
                            .then(res => {
                                // auth.setUserInfo(res, true);
                                localData.setStorage("selectedUser", res);
                                utils.callEvent("repAdded");
                            });
                    } else {
                        this.getUser()
                            .then(res => {
                                auth.setUserInfo(res, true);
                                utils.callEvent("repAdded");
                            });
                    }
                });
        }
        else {
            utils.log("Erreur : on sauvegarde un changement avant même que les questions soient loadées");
        }
    },
    getReponses() {
        var ret = [];
        if (auth.getUserInfo() == null)
            return [];
        else if (localData.getStorage("selectedUser")) {
            ret = localData.getStorage("selectedUser").reponses || [];
        }
        else {
            ret = auth.getUserInfo().reponses || [];
        }

        // console.table(ret);
        var annee = this.getAnnee();
        var qst = localData.getStorage("getQuestions");
        var questions = (qst ? Object.values(qst) : [])
            .reduce((ret, rep) => {
                ret[rep._id] = rep;
                return ret;
            }, {});//*/

        // On cache les réponses pour les années pas en cours SI on s'attends à ce que la réponse change
        ret = ret.filter(rep => {
            var qst = questions[rep.question];
            return qst && (rep.annee == annee || !utils.isNumeric(annee) || !qst.changeexpected); //rep.question.changeexpected
        });

        // On filtre à nouveau pour garder SOIS l'année en cours, ou une réponse d'une autre année SI on ne s'attends pas à ce que la réponse change
        return Object.values(ret.reduce((ret, rep) => {
            var prev = ret[rep.question];
            if (prev == null ||
                this.getAnnee() == rep.annee ||
                (prev.annee != this.getAnnee() &&
                    prev.createdAt < rep.createdAt)) {
                ret[rep.question] = rep;
            }

            return ret;
        }, {}));
    },
    ///// SECTION Offline
    getReponse: function (questionId) {
        var rep = this.getReponses();
        if (rep) {
            return rep
                .find(rep => {
                    return rep.question === questionId
                });
        }
        else
            return null;
    },

    /////// SECTION ADMIN


    confirmEmail: async function (param) {
        return request("auth/email-confirmation?" + param, {
            noAuth: true,
            method: "GET"
        });
    },
    _usrVal: {},
    getUsers: async function (ignoreCache) {
        if (shouldUpdate(ignoreCache, this._usrVal, "def")) {
            this._usrVal.def = {
                time: Date.now(),
                promise: request("users", { method: "GET" })
                    .then(results => {
                        //utils.log(results);
                        let ret = results.map(this.setUserForAdminDisplay)
                            .reduce((ret, usr) => {
                                ret[usr._id] = usr;
                                return ret;
                            }, {});

                        localData.setStorage("getUsers", ret);
                        return ret;
                    }).catch(ex => {
                        utils.log(ex);
                        return [];
                    })
            }
        }
        return this._usrVal.def.promise;
    },
    getCachedUser: function (userId) {
        return (localData.getStorage("getUsers") || {})[userId];
    },

    _admVal: {},
    /** 
     * @param {*} userId 
     * returns {userid1: 
     *              {key1:val1,
     *               key2:val2}} 
     *           Where val = {user, admin, key, val, createdAt}
     */
    getDonneesAdmin: function (userId, annee, forceServer) {
        var filtre = userId + (annee ? "&annee=" + annee : "");
        if (shouldUpdate(forceServer, this._admVal, filtre)) {
            this._admVal[filtre] = {
                time: Date.now(),
                promise: request("donneesadmins/?user=" + filtre, { method: "GET" })
                    .then(results => {
                        var ret = results
                            .reduce(reduceDonneesAdmin, {});

                        localData.set("donneesAdmin", ret);
                        return ret;
                    }).catch(ex => {
                        utils.log(ex);
                        // auth.showToast(impoTxt.ErrAdminDataUser + userId, 3214, "danger");
                        return {};
                    })
            };
        }
        return this._admVal[filtre].promise;
    },

    _admValKey: {},
    getAdminValPerKey: function (key, annee, forceServer) {
        var filtre = key + (annee ? "&annee=" + annee : "");
        if (shouldUpdate(forceServer, this._admValKey, filtre)) {
            this._admValKey[filtre] = {
                time: Date.now(),
                promise: request("donneesadmins/?key=" + filtre, { method: "GET" })
                    .then(results => {
                        var ret = results
                            .reduce(reduceDonneesAdmin, {});

                        localData.set("donneesAdmin", ret);
                        return ret;
                    }).catch(ex => {
                        utils.log(ex);
                        // auth.showToast(impoTxt.ErrAdminDataUser + key, 3214, "danger");
                        return {};
                    })
            };
        }
        return this._admValKey[filtre].promise;
    },

    saveDonneesAdmin: function (user, year, key, val) {
        // http://impotx.gnitic.com:1337/donneesadmins
        return request("donneesadmins", {
            method: "POST", body: {
                user,
                admin: auth.getUserInfo().username, //_id,
                annee: utils.isNumeric(year) ? year : null,
                key,
                val: JSON.stringify(val),
            }
        })
            .then(rep => {
                utils.log(rep);
                rep.val = val;
                let prevDic = localData.getStorage("donneesAdmin");
                if (!(rep.user in prevDic)) prevDic[rep.user] = {};
                prevDic[rep.user][rep.key] = rep;
                auth.set("donneesAdmin", prevDic);
                //auth.addRep(question.rep);
            })
            .catch(ex => { utils.log(ex); });
    },



    setUserForAdminDisplay: function (user) {
        if (user) {
            if (user.reponses)
                user.reponses = utils.keepOnlyLatestRep(user.reponses);
            else
                user.reponses = [];

            user.fileuploads = user.fileuploads || [];

            user.repCount = user.reponses.length;
            user.docCount = user.fileuploads.length;

            if (user.reponses.length >= 1)
                user.lastActivity = user.reponses[0].createdAt.split("T")[0];
            else
                user.lastActivity = "never";
        }
        return user;
    },

    ...MessagesAndNotifications

};

function reduceDonneesAdmin(ret, data) {
    if (!(data.user in ret)) ret[data.user] = {};

    //Keep the latest entry for each key
    if (ret[data.user][data.key] == null ||
        ret[data.user][data.key].createdAt < data.createdAt) {
        try {
            data.val = JSON.parse(data.val);
        } catch (ex) {
            utils.log("Couldn't parse : " + data.val);
        }
        ret[data.user][data.key] = data;
    }
    return ret;
}

function shouldUpdate(forceServer, cache, key) {
    if ((forceServer &&
        (!cache[key] || cache[key].time + MIN_TIME_TO_RECALL < Date.now())
    ) || !cache[key]) return true;
    //console.log("Saved a call! :)");
    return false;
}

export default _DAL;



