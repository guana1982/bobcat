export let langDict;

export function setLangDict(dict) {
  langDict = dict;
}

export function __(label , fallback?) {
  if (!fallback) fallback = label;
  if (!langDict || !langDict[label]) {
    return fallback;
  }
  return langDict[label];
}
