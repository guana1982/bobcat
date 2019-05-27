import { ajax } from "rxjs/ajax";
import { map } from "rxjs/operators";

const VENDOR = process.env.INTELLITOWER_VENDOR;
const VERSION = process.env.INTELLITOWER_VERSION;
// const BASE_URL = process.env.INTELLITOWER_MEDIUMLEVEL_URL;
const BASE_URL = process.env.NODE_ENV === "production" ? /* "http://2.34.152.134:5900/api/v0" */ "http://0.0.0.0:5900/api/v0" : "http://192.168.188.204:5900/api/v0";
// const TIMEOUT = 1000 * 30;

export const get = (part = "/", params = {}) => {
  const complex$ = ajax({
    url: `${BASE_URL}/${part}`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // timeout: TIMEOUT,
      ...params
    }
  });
  return complex$.pipe(
    map(e => e.response)
  );
};

export const post = (part = "/", params = {}, config?) => {
  const complex$ = ajax({
    url: `${BASE_URL}/${part}`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // timeout: TIMEOUT
    },
    body: params
  });
  return complex$.pipe(
    map(e => e.response)
  );
};

// --------------------------------------------------
// FAKE API
// --------------------------------------------------
const getApiPath = path => {
  const [first, ...rest] = path.split("/");
  return { url: `data/${first}.json`, key: rest.join("/") };
};

export const getFake = (part = "/", params = {}) => {
  const { url, key } = getApiPath(part);
  return this.get(`${url}`, params);
};

export const postFake = (part = "/", params = {}) => {
  const { url, key } = getApiPath(part);
  return this.get(`${url}`, params);
};
