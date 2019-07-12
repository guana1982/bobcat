export let langDict;

export function setLangDict(dict) {
  langDict = dict;
}

export function __(label: string , fallback?) {
  if (!fallback) fallback = label;
  if (label) {
    label = label.toLowerCase();
  }
  if (!langDict || !langDict[label]) {
    return fallback;
  }
  return langDict[label];
}
