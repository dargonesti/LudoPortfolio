/*eslint eqeqeq:0*/
/*eslint no-mixed-operators:0*/
import React from "react";

import debounce from "lodash.debounce";

import DAL from "utils/DataAccess/DALimpotx.js";
import localData from "utils/DataAccess/localData.js";

import { canvasEncode } from "./compress";

var reponses = {};
var questions = {};


function refreshReponses() {
  var reps = DAL.getReponses();
  reponses = {};
  if (reps) {
    reponses = reps.reduce((ret, rep) => {
      ret[rep.question] = rep;
      return ret;
    }, {});
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

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function keepOnlyLatestRep(reponses) {
  var existingRep = {};
  var rep2 = reponses
    .sort((a, b) => b.createdAt < a.createdAt ? -1 : 1);
  var rep3 = rep2
    .filter(rep => {
      if (!(rep.question in existingRep))
        existingRep[rep.question] = [];

      var exists = existingRep[rep.question].some(annee => annee == rep.annee);
      if (!exists) {
        existingRep[rep.question].push(rep.annee)
      }

      return !exists;
    });
  return rep3;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}


const lstIdentityQuestionIdPerso = [
  "user-last-name",
  "user-first-name",
  "user-no-nas",
  "corresp-language",
  "user-moyen-de-comm",
  "user-sex",
  "user-tel-day",
  "user-tel-evening",
  //adresse,
];

//const identityQuestionTitreRegex = RegExp("(" + lstIdentityQuestionTitre.join("|") + ")", "i");

function isIdentityQuestion(question) {
  return lstIdentityQuestionIdPerso.indexOf(question.idperso) >= 0;
  //return question.titre.match(identityQuestionTitreRegex);
}

function filtreOnlyIdentityQuestion(questions) {
  return questions.filter(question => isIdentityQuestion(question))
    .map(qst => {
      qst.repString = repToString(qst);
      return qst;
    });
}

function repToString(question) {
  var rep = DAL.getReponse(question.id);
  var ret = "";
  if (rep) {
    if (question.choixdereponse && question.choixdereponse.length > 0) {
      rep = question.choixdereponse.find(ch => ch.id === rep.choixdereponse);
      ret = rep ? rep.texte : "";
    }
    else if (question.reptype === 1)
      ret = rep.texte;
    else if (question.reptype === 3)
      ret = rep.date;
    else if (question.reptype > 3)
      ret = rep.numero + "";
  }

  if (ret.length === 0) return <i>non répondu</i>;

  return ret;
}


function sortDate(a, b) {
  return b.t > a.t ? -1 : 1;
}

function groupBy(xs, key) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
}

function tryAndTryAgain(fn, delay, callback) {
  if (!(delay)) delay = 123;
  try {
    if (callback) callback(fn());
    else fn();
  } catch (ex) {
    var fnApplyStyle = () => {
      setTimeout(() => {
        try {
          if (callback) callback(fn());
          else fn();
        } catch (ex) {
          fnApplyStyle();
        }
      }, delay);
    }
  }
}

function myCompare(obj1, obj2, lstParams) {
  return lstParams.every(param => obj1[param] == obj2[param]);
  // TODO : allow to recurse compare children Objects
}

const getCatTitre = id => (DAL.getDepenses().find(dep => dep.idperso == id)
  || DAL.getFeuillets().find(dep => dep.idperso == id)
  || { titre: id })
  .titre;


//CHANGE LANG LISTENERS
var listeners = {};
function addListener(event, id, callback) {
  if (!(event in listeners)) listeners[event] = {};
  listeners[event][id] = callback;
}
function removeListener(event, id) {
  if (event in listeners) {
    delete listeners[event][id];
  }
}
function callEvent(event, params) {
  if (event in listeners) {
    Object.values(listeners[event])
      .forEach(cb => {
        cb(params);
      });
  }
}

let _evDebouncer = {};
let throttledCallEvent = (ev, val) => {
  if (!_evDebouncer[ev])
    _evDebouncer[ev] = debounce((value) => {
      callEvent(ev, value);
    }, 500, { leading: true, trailing: true });
  _evDebouncer[ev](val);
};

var thSet = debounce((that) => {
    if(that._unmounted) return;
    that.setState(that._debouncedState);
    that._debouncedState = {}; 
}, 100, { leading: false, trailing: true });

function throttledSetState(param) {
  this._debouncedState = this._debouncedState || {};
  this._debouncedState = { ...this._debouncedState, ...param };
  thSet(this);
}

function testPermission(cbPrompt, cbGranted, cbDenied) {

  if (navigator &&
    navigator.permissions &&
    navigator.permissions.query) {
    navigator.permissions
      .query({ name: "notifications" })
      .then(res => {
        this.log("Notifications : " + res.state);
        if (res.state === 'prompt') {
          if (cbPrompt)
            cbPrompt();
        } else if (res.state === 'granted') {
          if (cbGranted)
            cbGranted();
        }
        else {
          if (cbDenied)
            cbDenied();
        }
      });
  } else if (cbDenied) {
    cbDenied();
  }
}

function lateEnoughAfterNo() {
  const sec = 1000;
  const secInMin = 60;
  const mininH = 60;
  const HinD = 24;
  const lastSaidNo = localData.getStorage("saidNoNotif");
  return !(lastSaidNo > Date.now() - sec * secInMin * mininH * HinD * 7);
}

function memorySizeOf(obj) {
  var bytes = 0;

  function sizeOf(obj) {
    if (obj !== null && obj !== undefined) {
      // eslint-disable-next-line
      switch (typeof obj) {
        case 'number':
          bytes += 8;
          break;
        case 'string':
          bytes += obj.length * 2;
          break;
        case 'boolean':
          bytes += 4;
          break;
        case 'object':
          var objClass = Object.prototype.toString.call(obj).slice(8, -1);
          if (objClass === 'Object' || objClass === 'Array') {
            for (var key in obj) {
              if (!obj.hasOwnProperty(key)) continue;
              sizeOf(obj[key]);
            }
          } else bytes += obj.toString().length * 2;
          break;
      }
    }
    return bytes;
  };

  function formatByteSize(bytes) {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(3) + " KiB";
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(3) + " MiB";
    else return (bytes / 1073741824).toFixed(3) + " GiB";
  };

  return formatByteSize(sizeOf(obj));
};

function combineUrl(path1, path2) {
  if (typeof (path1) !== "string" || typeof (path2) !== "string") {
    console.error("Should be 2 strings to combine");
  }
  if (path1.endsWith("/")) {
    if (path2.startsWith("/"))
      return path1 + path2.subString(1, path2.length);
    else
      return path1 + path2;
  }
  else {
    if (path2.startsWith("/"))
      return path1 + path2;
    else
      return path1 + "/" + path2;
  }
}

function isPDF(url) {
  return url && /.*pdf/gi.test(url);
}

function pdfUrlReform(url) {
  if (isPDF(url)) {
    return url.substring(0, url.length - 3) + "png";
  }
  return url;
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function toWebP(imgUrl) {
  if (canUseWebP() && imgUrl) {
    var imgParts = imgUrl.split(".");
    imgParts.pop();
    imgParts.push("webp");
    return imgParts.join(".");
  }
  return imgUrl;
}

function canUseWebP() {
  var cached = localData.getStorage("SupportWebP");
  if (cached == null) {
    var elem = document.createElement('canvas');

    if (!!(elem.getContext && elem.getContext('2d'))) {
      // was able or not to get WebP representation
      cached = (elem.toDataURL('image/webp').indexOf('data:image/webp') == 0) ? "yes" : "no";
      localData.setStorage("SupportWebP", cached);
    } else {
      cached = "no";
      localData.setStorage("SupportWebP", cached);
    }
  }

  return /yes/i.test(cached);
}

function replaceBR(str) {
  var newStr = str.split("<br>");
  var ret = <>{newStr.pop()}</>;
  while (newStr.length >= 1) {
    ret = <>{newStr.pop()}<br />{ret}</>;
  }
  return ret;
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/matchAll
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
function replaceA(str){
  let reg = /\<a.*href=.(.*)\".*\>(.*)<\/a>/gi;

  let arr = reg.exec(str);
  //console.log(arr);

  let splited = str.replace(reg, "_a_").split("_a_");    
  let ret = <></>;//<>{splited.pop()}</>;

  if(splited.length >= 1){
    while (splited.length >= 1 ) {
      if( arr && arr.length > 2){
        let txt = arr.pop();
        let href = arr.pop();
        let fullMatch = arr.pop();
        ret = <>{<a href={href} target="_blank">{txt}</a>}{splited.pop()}{ret}</>;
      }else{
        ret = <>{splited.pop()}{ret}</>;
      }
    }
  }else{
    ret = str;
  }

  return ret;
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole  matched string
}

const isDev = () => /^dev.*/gi.test(process.env.NODE_ENV);
const isProd = () => !isDev();
const log = (str) => {
  if (isDev()) {
    console.log(str);
  }
};
const isChatActive = () => /true/gi.test(process.env.REACT_APP_ACTIVATE_CHAT);

function convertArrayOfObjectsToCSV(args) {
  var result, ctr, keys, columnDelimiter, lineDelimiter, data;

  data = args.data || null;
  if (data == null || !data.length) {
    return null;
  }

  columnDelimiter = args.columnDelimiter || ',';
  lineDelimiter = args.lineDelimiter || '\n';

  keys = Object.keys(data[0]);

  result = '';
  result += keys.join(columnDelimiter);
  result += lineDelimiter;

  data.forEach(function (item) {
    ctr = 0;
    keys.forEach(function (key) {
      if (ctr > 0) result += columnDelimiter;

      result += item[key];
      ctr++;
    });
    result += lineDelimiter;
  });

  return result;
}
function downloadCSV(args) {
  var data, filename, link;
  var csv = convertArrayOfObjectsToCSV({ data });
  if (csv == null) return;

  filename = args.filename || 'export.csv';

  if (!csv.match(/^data:text\/csv/i)) {
    csv = 'data:text/csv;charset=utf-8,' + csv;
  }
  data = encodeURI(csv);

  link = document.createElement('a');
  link.setAttribute('href', data);
  link.setAttribute('download', filename);
  link.click();
}
console.log("Utils.toWebP : " + toWebP("imgTest.jpg"));
export default {
  groupBy,
  downloadCSV,
  isProd,
  isDev,
  log,
  isChatActive,
  isAnneesActive : () => false,
  isDocsActive : () => false,///true/gi.test(process.env.REACT_APP_ACTIVATE_DOCS),
  escapeRegExp,
  replaceBR,
  replaceA,
  toWebP,
  canUseWebP,
  isNumeric,
  combineUrl,
  memorySizeOf,
  lateEnoughAfterNo,
  testPermission,
  refreshQuestions,
  refreshReponses,
  QuestionIdPersoToChoixRep: QuestionIdPersoToChoixRep,
  urlBase64ToUint8Array: urlBase64ToUint8Array,
  keepOnlyLatestRep: keepOnlyLatestRep,
  stableSort: stableSort,
  filtreOnlyIdentityQuestion: filtreOnlyIdentityQuestion, 
  tryAndTryAgain: tryAndTryAgain,
  getCatTitre: getCatTitre,
  myCompare: myCompare,

  pdfUrlReform,

  addListener,
  removeListener,
  callEvent,
  throttledCallEvent,
  throttledSetState,

  getFB: (fbData, key) => {
    ("database.state."+key).split(".").forEach(k=>{
      if(fbData) fbData = fbData[k];
    });
    return fbData;
  },

  shorterString: (str, len, endChar = 3) => {
    if(str.length > len)
      return str.slice(0,len-(3+endChar)) + "..." + str.slice(-endChar);
    else
      return str;
  },

  canvasEncode
};