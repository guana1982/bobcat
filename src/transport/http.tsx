// http.js
// for using http as transport layer
import axios from "axios";
declare var window: any;

const CancelToken = axios.CancelToken;
const VENDOR = process.env.INTELLITOWER_VENDOR;
const VERSION = process.env.INTELLITOWER_VERSION;
// const BASE_URL = process.env.NODE_ENV === "production" ? "http://0.0.0.0:5900/api/v0" : process.env.INTELLITOWER_MEDIUMLEVEL_URL;
const BASE_URL = process.env.INTELLITOWER_MEDIUMLEVEL_URL;
const TIMEOUT = 1000 * 30;
window.__requestSources = {};

export async function get(part = "/", params = {}) {
  const source = CancelToken.source();
  window.__requestSources[part] = source;
  const response = await axios.get(
    `${BASE_URL}/${part}`,
    {
      timeout: TIMEOUT,
      cancelToken: new CancelToken(c => c),
      ...params
    }
  );
  delete window.__requestSources[part];
  if (!response) {
    return reject(response);
  }
  return success(response);
}

export async function post(part = "/", params = {}, config?) {
  // we can't export a global CancelToken.source
  // because a new cancel token must be generated for each request
  const source = CancelToken.source();
  window.__requestSources[part] = source;
  const response = await axios.post(`${BASE_URL}/${part}`, params, {
    cancelToken: source.token,
    timeout: TIMEOUT
  });
  delete window.__requestSources[part];
  if (!response) {
    return reject(response);
  }
  return success(response);
}

function success(response) {
  if (axios.isCancel(response)) {
    console.log("[!] Request canceled", response);
    return null;
  }
  if (response instanceof Error) {
    return null;
    // throw new Error("Network error")
  }
  if (response.data && Boolean(response.data.error) === true) {
    console.log("[!] API error %o", response.data.error);
    return response.data;
  }
  return response.data;
}

function reject(error) {
  if (axios.isCancel(error)) {
    console.log("[!] Request canceled", error.message);
  } else {
    console.log("[!] API error", error);
    return error;
  }
}

// --------------------------------------------------
// FAKE API
// --------------------------------------------------
const getApiPath = path => {
  const [first, ...rest] = path.split("/");
  return { url: `data/${first}.json`, key: rest.join("/") };
};

function successFake(response, part) {
  if (!response.data || response.data.error) {
    console.warn("[!] API error %o", response.data.error);
    return new Error(response.data.error);
  }
  return response.data[part];
}

export function getFake(part = "/", params = {}) {
  const { url, key } = getApiPath(part);
  return axios
    .get(`${url}`, params)
    .then(res => {
      return successFake(res, key);
    })
    .catch(reject);
}

export function postFake(part = "/", params = {}) {
  const { url, key } = getApiPath(part);
  return axios
    .get(`${url}`, params)
    .then(res => success(res))
    .catch(reject);
}

export function intercept({ onRequest, onResponse, onError }) {
  axios.interceptors.request.use(config => {
    onRequest(config);
    return config;
  });
  axios.interceptors.response.use(
    response => {
      onResponse(response);
      return response;
    },
    error => {
      onError(error);
      return error;
    }
  );
}
