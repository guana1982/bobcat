import * as React from "react";
import { compose, lifecycle } from "recompose";

import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { MemoryRouter } from "react-router";

import { ThemeProvider } from "styled-components";
import { ConfigStore, TimerStore } from "../store";
import AppRouter from "./app.router";
import { theme1, theme2 } from "./app.style";
import InactivityHandler from "../components/Menu/InactivityHandler";
import { ConsumerStore } from "../store/consumer.store";

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
          <TimerStore>
            <ConsumerStore>
              <AppRouter />
            </ConsumerStore>
          </TimerStore>
        </ConfigStore>
      </ThemeProvider>
    </MemoryRouter>
  );
});
