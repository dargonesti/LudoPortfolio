/*eslint eqeqeq:0*/
/*eslint no-mixed-operators:0*/

import utils from "utils/utils";
import DAL from "utils/DataAccess/DALimpotx.js";

// Consider memoize libraries : https://itnext.io/how-i-wrote-the-worlds-fastest-react-memoization-library-535f89fc4a17
// Here : https://github.com/theKashey/memoize-state

var _ongoingQueries = {};

const storage = {

  clearCache(key) {
    if (this._cache)
      delete this._cache[key];
  },

  clearStorage(key) {
    this.clearCache(key);

    if (localStorage && localStorage.getItem(key)) {
      return localStorage.removeItem(key);
    }
  },

  clearAppStorage() {
    this._cache = {};

    if (localStorage) {
      localStorage.clear();
    }
  },

  get(key, nullValue) {
    if (this._cache == null) this._cache = {};
    if (this._cache[key] === null)
      return nullValue;
    return this._cache[key];
  },

  set(key, value) {
    if (this._cache == null) this._cache = {};
    this._cache[key] = value;
  },

  getStorage(key, nullValue) {
    var ret = this.get(key);
    if (ret) return ret;

    if (localStorage) {
      ret = localStorage.getItem(key);
      if (ret) {
        try {
          ret = JSON.parse(ret);
        } catch (ex) {
          utils.log(ex);
          ret = null;
        }
      }
      this._cache[key] = ret;
    }

    if (ret === null)
      return nullValue;
    else
      return ret;
  },

  setStorage(key, value) {
    this.set(key, value);

    if (localStorage) {
      try{
        localStorage.setItem(key, JSON.stringify(value));
      }catch(ex){
        console.error(ex);
      }
    }
  },

  checkLocalDataAdmin() {
    //_checkAndGetDAL("getUsers", DAL.getUsers);
    _checkAndGetDAL("getQuestionsById", DAL.getQuestions);
  }

}

function _checkAndGetDAL(cacheName, DALfn) {
  if (!(cacheName in localStorage) && !_ongoingQueries[cacheName]) {
    DALfn(true)
      .then(res => { delete _ongoingQueries[cacheName]; });
    _ongoingQueries[cacheName] = Date.now();
    utils.log("_check and get DAL : " + cacheName + " was not cached");
  }
}


export default storage;
