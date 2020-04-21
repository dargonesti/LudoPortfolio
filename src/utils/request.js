/*eslint eqeqeq:0*/
/*eslint no-mixed-operators:0*/
import 'whatwg-fetch';
import auth from './auth';
import utils from './utils';

const SERVER_PATH = process.env.REACT_APP_SERVER_URL + "/" + process.env.REACT_APP_URL_API;

var acceptedErrorCodes = [];

//"http://localhost:1337/";
/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */
function parseJSON(response) {
  return response.json ? response.json() : response;
}

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */
function checkStatus(response, ignoreError) {
  if (ignoreError || (response.status >= 200 && response.status < 300 || acceptedErrorCodes.some(errCode => errCode === response.status))) {
    return response;
  }

  return parseJSON(response)
    .then(responseFormatted => {
      const error = new Error(response.statusText);
      error.response = response;
      error.response.payload = responseFormatted;
      throw error;
    })
    .catch(ex => {
      utils.log(ex);
      return response.text;
    });
}

/**
 * Format query params
 *
 * @param params
 * @returns {string}
 */
function formatQueryParams(params) {
  return Object.keys(params)
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
    .join('&');
}


/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {object}           The response data
 */
export default function request(url, options = {}, acceptedErrors) {
  // customCall = false; // tests middleWare server.
  if (acceptedErrors) {
    acceptedErrorCodes = acceptedErrors;
  }
  if (!Array.isArray(acceptedErrorCodes)) acceptedErrorCodes = [];
  url = utils.combineUrl(false ? "" : SERVER_PATH, url);
  // Set headers
  if (!("headers" in options) || !("Content-Type" in options.headers))
    options.headers = Object.assign({
      'Content-Type': 'application/json',
    }, options.headers, {});

  const token = auth.getToken();

  if (options.noAuth) {
    delete options.noAuth;
  } else if (token) {
    options.headers = Object.assign({
      'Authorization': `Bearer ${token}`,
    }, options.headers);
  }

  if (options && options.params) {
    const params = formatQueryParams(options.params);
    url = `${url}?${params}`;
  }

  // Stringify body object
  if (options && options.body) {
    options.body = JSON.stringify(options.body);
  }

  let respCatched= null;
  return fetch(url, options)
    .then(res => {
      respCatched = res;
      return checkStatus(res, options.ignoreError);
    })
    .then(parseJSON)
    .catch(ex=>{
      utils.log(ex);
      return respCatched;
    });
}
