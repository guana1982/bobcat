import * as React from "react";
import { compose, lifecycle } from "recompose";

import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { MemoryRouter } from "react-router";

import { ThemeProvider } from "styled-components";
import { ConfigStore, TimerStore } from "@containers/index";
import { themeMain } from "@style";
import AppRouter from "./app.router";

import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

declare var document: any;

const fullScreen = compose(
  lifecycle({
    componentDidMount() {
      document.body.webkitRequestFullScreen();
    },
    componentDidCatch(err) {
      console.log("!!!!! catch", err);
    }
  }),
);

const onChange = (input) => {
  console.log("Input changed", input);
};

const onKeyPress = (button) => {
  let element = document.activeElement;
  element = element.tagName === "INPUT" ? element : undefined;

  switch (button) {
    case "{tab}":
      const input = document.getElementsByTagName("input")[0];
      input.focus();
      break;
    case "{bksp}":
      if (element) {
        element.value = element.value.substring(0, element.value.length - 1);
      }
      break;
    default:
      if (element) {
        element.value += button;
      }
      break;
  }
};

export default fullScreen(({
  isLoadingNetwork,
  error,
  getConfigState,
  ...props
}) => {
  return (
    <MemoryRouter>
      <ThemeProvider theme={themeMain}>
        <ConfigStore>
          <TimerStore>
            <AppRouter />
            {/* <div>
              <input type="text" tabIndex={1}></input>
              <input type="text" tabIndex={2}></input>
              <input type="text" tabIndex={3}></input>
              <Keyboard
                tabCharOnTab={false}
                onChange={input => onChange(input)}
                onKeyPress={button => onKeyPress(button)}
                preventMouseDownDefault={true}
              />
            </div> */}
          </TimerStore>
        </ConfigStore>
      </ThemeProvider>
    </MemoryRouter>
  );
});
