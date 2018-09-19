import * as React from "react";
import { compose, lifecycle } from "recompose";
// import Vendor from "../VendorComponents";

import { I18nextProvider } from "react-i18next";
import i18n from "../i18n"; // initialized i18next instance

import { ThemeProvider } from "styled-components";
import { theme1, theme2 } from "../style/globalStyle";
import { ConfigStore, ConfigConsumer, Route, RouterConsumer, RouterStore } from "../models";

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
    <ThemeProvider theme={theme1}>
      <ConfigStore>
        <RouterStore>
          <RouterConsumer>
            {({ setPage }) => (
              <div>
                <button onClick={() => setPage("HOME")}>HOME</button>
                <button onClick={() => setPage("ATTRACTOR")}>ATTRACTOR</button>
              </div>
            )}
          </RouterConsumer>
          <Route />
        </RouterStore>
      </ConfigStore>
    </ThemeProvider>
  );
});
