export const fromDotNotation = (obj, notation) => {
  return notation
    .split(".")
    .reduce((o, i) => {
      if (o && o[i]) {
        return o[i];
      }
      return null;
    }, obj);
};

export function toDotNotation(obj) {
  if (typeof obj === "string") {
    return obj;
  }

  if (Object.keys(obj).length > 1) {
    return Object.keys(obj).map(key =>
      toDotNotation({
        [key]: obj[key]
      })
    );
  }

  return Object
    .keys(obj)
    .concat(Object.keys(obj).map(e => obj[e])) // Object.values(obj)
    .reduce((a, b) => {
      return typeof b === "object"
        ? `${a}.${toDotNotation(b)}`
        : `${a}.${b}`;
    }, "").slice(1);
}
