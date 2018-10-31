import * as React from "react";
import { compose, lifecycle } from "recompose";

import { I18nextProvider } from "react-i18next";
import i18n from "../i18n"; // initialized i18next instance

import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { MemoryRouter } from "react-router";

import { ThemeProvider } from "styled-components";
import { ConfigStore } from "../models";
import AppRouter from "./app.router";
import { theme1, theme2 } from "./app.style";
import InactivityHandler from "../components/Menu/InactivityHandler";
import { InactivityTimerStore } from "../models/InactivityTimer";

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

export default fullScreen(({
  isLoadingNetwork,
  error,
  getConfigState,
  ...props
}) => {
  return (
    <MemoryRouter>
      <ThemeProvider theme={theme1}>
        <ConfigStore>
          <InactivityTimerStore>
            <AppRouter />
          </InactivityTimerStore>
        </ConfigStore>
      </ThemeProvider>
    </MemoryRouter>
  );
});