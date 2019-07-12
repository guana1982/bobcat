export let langDict;

export function setLangDict(dict) {
  langDict = dict;
}

export function __(label: string , fallback?) {
  if (!fallback) fallback = label;
  if (!langDict || !langDict[label.toLowerCase()]) {
    return fallback;
  }
  return langDict[label];
}
