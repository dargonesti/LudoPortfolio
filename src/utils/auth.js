/*eslint eqeqeq:0*/
/*eslint no-mixed-operators:0*/
import utils from "./utils.js";
import localData from "./DataAccess/localData.js";
import uuidv4 from 'uuid/v4';

import firebase from "firebase";

const TOKEN_KEY = 'jwtToken';
const FIREBASE_TOKEN_KEY = 'FirebaseJwtToken';
const USER_INFO = 'userInfo';


const auth = {
  get() {
    return localData.get.apply(localData, arguments);
  },
  set() {
    localData.set.apply(localData, arguments);
  },
  clearAppStorage() {
    localData.clearAppStorage();
    try {
      if (firebase.auth().currentUser)
        firebase.database().ref('/status/' + firebase.auth().currentUser.uid)
          .set({
            state: 'online', // NOTE: was "offline"???
            last_changed: firebase.database.ServerValue.TIMESTAMP
          });
    } catch (ex) { }
    firebase.auth().signOut();
  },
  clearToken() {
    localData.clearStorage(TOKEN_KEY);
    localData.clearStorage(FIREBASE_TOKEN_KEY);
  },
  clearUserInfo() {
    localData.clearStorage(USER_INFO);
  },
  //// Messagse Toast / Snackbar 
  // primary, warning, danger
  showToast(msg, time, type) {
    if (!time) time = 3000;
    if (!type) type = "primary";
    var messages = localData.get("snackMessages", true);
    if (!messages) messages = [];
    var newId = uuidv4();
    messages = [{ text: msg, type: type, time: time, id: newId }, ...messages];
    localData.set("snackMessages", messages);
    return newId;
  },

  getToast() {
    var messages = localData.get("snackMessages", true);
    if (!messages) messages = [];
    return messages[messages.length - 1];
  },
  getAllToasts() {
    var messages = localData.get("snackMessages", true);
    if (!messages) messages = [];
    return messages;
  },

  removeToast(id) {
    var messages = localData.get("snackMessages", true);
    if (!messages) messages = [];
    localData.set("snackMessages", messages.filter(msg => msg.id != id));
  },

  getScrollTarget() {
    return localData.get("scrollTarget");
  },
  setScrollTarget(value) {
    localData.set("scrollTarget", value);
  },

  refreshSelectedUser() {
    /* if(this.get("selectedUser"))
     {
       return DAL.findUser(this.get(selectedUser).id)
       .then(res=>{
         this.set("selectedUser", res);
         return "ok";
       });
     }
     return null;*/
  },
  getToken(tokenKey = TOKEN_KEY) {
    return localData.getStorage(tokenKey);
  },
  getFirebaseToken(tokenKey = FIREBASE_TOKEN_KEY) {
    return localData.getStorage(tokenKey);
  },
  getUserInfo(userInfo = USER_INFO) {
    return localData.getStorage(userInfo);
  },


  setToken(value = '', isLocalStorage = false, tokenKey = TOKEN_KEY) {
    return localData.setStorage(tokenKey, value, isLocalStorage);
  },
  setFirebaseToken(value = '', isLocalStorage = false, tokenKey = FIREBASE_TOKEN_KEY) {
    return localData.setStorage(tokenKey, value, isLocalStorage);
  },

  setUserInfo(value = {}, isLocalStorage = false, userInfo = USER_INFO) {
    try {
      if (value &&
        value.reponses) {
        utils.log("Rep Before filtered : " + value.reponses.length);
        value.reponses = utils.keepOnlyLatestRep(value.reponses);
        utils.log("Rep After filtered : " + value.reponses.length);

        if (!utils.isDocsActive()) {
          value.messages = value.messages.filter(msg => !msg.doc)
        }
      }
      value.id = value.id || value._id;
      localData.setStorage("currentUserId", value.id);
    } catch (ex) { }
    var ret = localData.setStorage(userInfo, value);

    return ret;
  },

  addRep(newRep) { // now adding the real, inserted rep
    var usr = this.getUserInfo();
    var rep = usr.reponses
      .filter(oldRep => oldRep.question !== newRep.question);
    rep.push(newRep);
    usr.reponses = rep;
    if (!this.isAdmin()) {
      this.setUserInfo(usr, true);
    }
  },

  isAdmin() {
    let token = this.getToken();
    let curUsr = this.getUserInfo();
    let role = curUsr && curUsr.role;
    let roleName = role && role.name;
    return token && roleName && /(Administrator|Comptable)/i.test(roleName);
  },

  isSuperAdmin() {
    let token = this.getToken();
    let curUsr = this.getUserInfo();
    let role = curUsr && curUsr.role;
    let roleName = role && role.name;
    return token && roleName && /(Administrator)/i.test(roleName);
  },

  getActiveUserId() {
    if (auth.isAdmin()) {
      //let selUsr = localData.getStorage("selectedUser");
      //return selUsr ? selUsr._id : "";
      return localData.getStorage("currentUserId");
    } else {
      var userInfo = auth.getUserInfo();
      return userInfo ? userInfo._id : "";
    }
  },
  getActiveAdminId() {
    if (auth.isAdmin()) {
      return auth.getUserInfo()._id;
    } else {
      return null;
    }
  },

  isFr() {
    var authLang = localData.get("prefLang");
    var qstLang = utils.QuestionIdPersoToChoixRep("corresp-language", "Francais");

    var selected = authLang || qstLang || "Français";

    return /.*fr.*/i.test(selected);
  },

}


export default auth;
