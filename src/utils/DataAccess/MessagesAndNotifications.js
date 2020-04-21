/*eslint eqeqeq:0*/
/*eslint no-mixed-operators:0*/
import request from 'utils/request';
import auth from 'utils/auth';
import utils from "utils/utils.js";
import localData from "utils/DataAccess/localData.js";
import impoTxt from 'texts/localization';
import { keys, length, map, filter, flatten, groupBy, uniq, values } from "rambda";

const MIN_TIME_TO_RECALL = 1000;

var _DAL = {

    sendNotification: function (userId, message, titre) {
        request("send-push", {
            method: "POST",
            body: {
                userid: userId,
                text: message,
                titre
            }
        })
            .then(res => {
                auth.showToast(impoTxt.toastNotifSent);
            });
    },

    notifyAdminRequested: function (userId){
        request("request-admin", {
            method: "POST",
            body: {
                userid: userId
            }
        });
    },

    getMessages() {
        var ret = [];
        if (auth.getUserInfo() == null)
            ret = [];
        else if (localData.getStorage("selectedUser"))
            ret = localData.getStorage("selectedUser").messages
        else
            ret = auth.getUserInfo().messages;

        if (ret == null) ret = [];
        return ret;
    },

    saveMessage: async function (message) {
        return request("messages", { method: "POST", body: message }, true)
            .then(rep => { // Fix ME
                return this.getUser(message.admin ? message.user : "me")
                    .then(res => {
                        if (message.admin) {
                            localData.setStorage("selectedUser", res);
                        } else {
                            auth.setUserInfo(res, true);
                        }
                        utils.callEvent("msgAdded");
                        return "success";
                    });
            });
    },
    setMessageSeen: async function (message) {
        //  if (!auth.isAdmin()) {
        if (message && !message.repondu) {
            return request("messages/" + message._id, { method: "PUT", body: { repondu: true } })
                .then(rep => {
                    message.repondu = true;
                });
        }
        // }
    },

    getMessagesPerQuestion(questionId) {
        return this.getMessages()
            .filter(msg => {
                return msg.question === questionId;
            });
    },

    getMessagesPerDoc(docId) {
        return this.getMessages()
            .filter(msg => msg.doc === docId);
    },

    /*
    Dois : 
        - Parmis tous les messages des usagers suivis : 
        - retourner 1 message / [question | Doc | General]
        - Trier par plus récent Top
        - Filtré par seulement ceux envoyé par usagés, 
            cacher toutes les questions pour la question/doc si le dernier message de celui ci est par un admin
        - Afficher aussi le messages répondus / admin mais les mettre APRÈS ceux non répondus
    */
    getAdminNotifications: async function (ignoreCache) {
        if (!auth.isAdmin()) {
            utils.log("Error, not admin");
            return [];
        } else {
            var ret = localData.get("getNotifs");
            if (!ignoreCache && ret) {
                return new Promise((res, rej) => {
                    res(localData.get("getNotifs"));
                });
            }
            else {
                var adminId = auth.getUserInfo().id;
                return this.getUsers(adminId)
                    .then(res => {
                        var o1 =
                            Object.values(res).map(
                                user => ({
                                    id: user._id,
                                    username: user.username,
                                    messagesPerQuestion: formatMessagesToNotif(user.messages, { username: user.username })
                                })
                            );
                        var o2 = o1
                            .reduce((ret, obj) => {
                                if (obj) {
                                    return ret.concat(obj.messagesPerQuestion);
                                }
                                else {
                                    return ret;
                                }
                            }, []);
                        var o3 = o2
                            .filter(notifList => (Array.isArray(notifList) && (!notifList[notifList.length - 1].admin && !notifList[notifList.length - 1].repondu)))
                            .sort(sortLastFirst);

                        auth.set("getNotifs", o3);
                        return o3;
                    }
                    );
            }
        }
    },

    getUserNotifications: async function (allowSeen) {
        var usr;
        if (auth.isAdmin()) {
            usr = localData.getStorage("selectedUser");
        } else {
            usr = auth.getUserInfo();
        }
        if (usr == null || usr.messages == null) return [];

        if(!utils.isDocsActive())
            usr.messages = usr.messages.filter(msg=>!msg.doc)
        var o1 = formatMessagesToNotif(usr.messages, { username: usr.username })
        var o3 = o1
            .map(not => Array.isArray(not) ? not.reverse() : not)
            .filter(notifList => Array.isArray(notifList) && (allowSeen || notifList[0].admin && !notifList[0].repondu))
            .sort(sortLastFirst);

        return o3;
    },

    _formatedNotifs: {},
    getFormatedNotifications: async function (ignoreCache) {
        if (shouldUpdate(ignoreCache, this._formatedNotifs, "def")) {
            this._formatedNotifs.def = {
                time: Date.now(),
                promise: (auth.isAdmin() ?
                    this.getAdminNotifications(ignoreCache) :
                    this.getUserNotifications(ignoreCache)).then(async notifs => {
                        var byUser = groupBy(it => it[0] ? it[0].user : it.user, notifs);
                        var processingNotifs = {};
                        if(auth.isAdmin()){
                            await this.getReadyToProcessNotif(ignoreCache);
                        }
                      /*  for(let userId in processingNotifs){
                            byUser[userId] = [...processingNotifs[userId] ,...(byUser[userId] || [])]
                        }*/

                        console.log(processingNotifs);

                        return {
                            notifs,
                            count: notifs.length,
                            byUser,
                            userCount: length(keys(byUser)) + length(keys(processingNotifs)),
                            notifsProcessing: processingNotifs
                        };
                    })
            };
        }
        return this._formatedNotifs.def.promise;
    },

    getReadyToProcessNotif: async function (ignoreCache) {
        var qstReady = this.getQuestion("special-pret-a-faire");
        if(!qstReady){
            await this.getQuestions();
            qstReady = this.getQuestion("special-pret-a-faire");
        }
        var users = await this.getUsers();
        var etatsComptesAllYears = {};

        var allCompletedYearUser =
            map(usr => {
                return qstReady && 
                usr.reponses.filter(rep => rep.question === qstReady._id
                    && rep.ouinon 
                    //&& getEtatCompte(usr._id, etatsComptesAllYears) < 2
                );
            },
                users);

        var distinctYears = uniq(map(usr => usr ? usr.annee : usr, flatten(values(allCompletedYearUser))));

        for (let year of distinctYears) {
            etatsComptesAllYears[year] = await this.getAdminValPerKey("etatCompte");
        }
 
        return filter(usr => Array.isArray(usr) && usr.length > 0,
            map(usr => 
                map(rep => [rep], 
                usr.filter(rep => {
                return !(getEtatCompte(usr[0], etatsComptesAllYears[rep.annee]) > 2);
            }), usr), allCompletedYearUser));
    },

};

function getEtatCompte(rep, etatsComptes) {
    if (etatsComptes && rep && rep.user in etatsComptes) {
        var valEtat = etatsComptes[rep.user]["etatCompte"];
        if (valEtat) valEtat = valEtat.val;
        //if (valEtat) return impoTxt["adminEtat" + valEtat];
        return valEtat;
    }
    return 0;//impoTxt.adminEtatUndefined;
}

function formatMessagesToNotif(messages, additionalProperties) {
    var qst = groupMessagesPerQuestion(messages);
    var docs = groupMessagesPerDoc(messages);
    // var global = getLastGeneralMessage(messages);
    var allMsg = qst.concat(docs)
        .map(nLst => nLst.sort((n1, n2) => n1.createdAt > n2.createdAt ? 1 : -1))
        .sort((n1, n2) => n1[0].createdAt < n2[0].createdAt ? 1 : -1);//.concat(global);

    //Note : pas le plus propre des codes... changer?
    /*if(additionalProperties)
    {
      allMsg = allMsg
      .map(qstList=>
        qstList.map(qst=>Object.assign(additionalProperties, qst)));
    }*/

    return allMsg;
}

function groupMessagesPerQuestion(messages, onlyUnanswered) {
    return changeObjectOfMessagesGroup(
        utils.groupBy(
            messages
                .filter(msg => msg.question)
                .sort(utils.sortDate)
            , "question"), onlyUnanswered);
    /*
    .reduce((ret, msg) => {
      if (msg.question in ret)
        ret[msg.question].push(msg);
      else
        ret[msg.question] = [msg];
      return ret;
    }, {});//*/
}

/**
 * @return [[{msg1, question1, createdLatest}, {msg2... }],
 *          [{msg1, question2, createdEarlier}, ...]]
 * ... only questions ending without Admin if onlyUnanswered is true
 * @param {*} messages 
 * @param {*} onlyUnanswered 
 */
function groupMessagesPerDoc(messages, onlyUnanswered) {
    return changeObjectOfMessagesGroup( // Changes le format en objet vers Array 
        utils.groupBy(// group par # de doc
            messages
                .filter(msg => msg.doc) // seulement les messages en liens a un document
                .sort(utils.sortDate) // trie par date dans chaque groupe
            , "doc"), onlyUnanswered);
}

function changeObjectOfMessagesGroup(messageGroups, onlyUnanswered) {
    return Object.values(messageGroups)
        .reduce((ret, grpMsg) => {
            ret.push(grpMsg);
            return ret;
        }, [])// change l'objet en array
        .filter(msgGroup => !(onlyUnanswered ? true : false) || (msgGroup[0].admin ? false : true)) // Filtre les déjà répondu 
        .sort((a, b) => a[0].t > b[0].t ? 1 : -1); // trie l'array en plus recent first
}

function getLastGeneralMessage(messages, onlyUnanswered) {
    return messages
        .filter(msg => !(msg.question) && !(msg.doc))
        .sort(utils.sortDate)
        .reduce((ret, msg) => [...ret, msg], [])
        .filter(msgGroup => !(onlyUnanswered ? true : false) || (msgGroup[0].admin ? false : true)) // Filtre les déjà répondu 
        ;
}


function sortLastFirst(a, b, adminMsgFirst) {
    try {
        a = a[a.length - 1];
        b = b[b.length - 1];
        var timeSort = b.createdAt > a.createdAt ? 1 : -1;
        if (!adminMsgFirst) return timeSort;
        if (a.admin) {
            if (b.admin)
                return timeSort;
            else
                return 1;
        } else if (b.admin)
            return -1;
        else
            return timeSort;
    } catch (ex) {
        return 0;
    }
}

function shouldUpdate(forceServer, cache, key) {
    if ((forceServer &&
        (!cache[key] || cache[key].time + MIN_TIME_TO_RECALL < Date.now())
    ) || !cache[key]) return true;
    //console.log("Saved a call! :)");
    return false;
}

export default _DAL;



