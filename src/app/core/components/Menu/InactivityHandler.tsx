import * as React from "react";
import { compose, setDisplayName } from "recompose";
import withInactivityTimer from "@utils/enhancers/inactivityTimer";

const enhance = compose(
  setDisplayName("InactivityHandler"),
  withInactivityTimer({
    resetOnClick: true
  })
);

const InactivityHandler = enhance(({ children }) => {
  return null;
});

export default InactivityHandler;
