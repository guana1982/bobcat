import * as React from "react";
import { compose, setDisplayName } from "recompose";
import withGestureHandler from "@utils/enhancers/gesture";

const enhance = compose(setDisplayName("Gesture"), withGestureHandler);
const Gesture = enhance(({ children }) => {
  return null;
});

export default Gesture;
