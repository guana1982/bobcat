import * as React from "react";
import { toDotNotation } from "../../utils/lib/dotNotation";

export const match = (stateA, stateB) => {
  if (typeof stateB === "object") {
    stateB = toDotNotation(stateB);
  }
  if (Array.isArray(stateA)) {
    return stateA.some(s => match(s, stateB));
  }
  // matches 'foo.*'
  if (stateA.endsWith(".*")) {
    return stateB.startsWith(stateA.replace(".*", ""));
  }
  // matches '*.foo'
  if (stateA.startsWith("*.")) {
    return stateB.endsWith(stateA.replace("*.", ""));
  }
  return stateA === stateB;
};

const Match: any = ({state, show, children, render}) => {
  let matched = match(show, state);

  if (typeof render === "function") {
    return render(matched);
  }

  if (!matched) return null;

  return React.Children.map(children, (child: any) => {
    if (child.type === Match) {
      return React.cloneElement(child, { ...child.props, state });
    }
    return child;
  });
};

export default Match;
