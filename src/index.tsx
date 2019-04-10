import * as React from "react";
import App from "./app/App";
declare var process: any;

import { AppContainer } from "react-hot-loader";
import { render } from "react-dom";

const rootEl = document.getElementById("root");

render(
  <AppContainer>
    <App />
  </AppContainer>,
  rootEl
);

// Hot Module Replacement API
declare let module: { hot: any };

if (module.hot) {
  module.hot.accept("./app/App", () => {
      const NewApp = require("./app/App").default;

      render(
        <AppContainer>
          <NewApp/>
        </AppContainer>,
        rootEl
      );
  });
}

console.log("+ IntelliTower vendor:", process.env.INTELLITOWER_VENDOR);
console.log("+ IntelliTower version:", process.env.INTELLITOWER_VERSION);