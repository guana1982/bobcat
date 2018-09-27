import * as React from "react";
import { Provider } from "mobx-react";
import { Machine } from "xstate";
import { actions, reducers, statechart } from "./machine";
import MachineState from "./stores/MachineState";
import App from "./app/app.component";
// import * as Raven from "raven-js";
declare var process: any;

import { AppContainer } from "react-hot-loader";
import { render } from "react-dom";

const machine = new MachineState(
  Machine(statechart), actions, reducers
);

// if (process.env.NODE_ENV !== "development" && process.env.INTELLITOWER_VENDOR === "pepsi") {
//   Raven
//     .config("https://4fa9a2c412a64540a6d7b9e4aeacd06d@sentry.io/1186576")
//     .install();

//   Raven.context(function () {
//     ReactDOM.render(<Provider machine={machine}>
//       <App />
//     </Provider>, document.getElementById("root"));
//   });
// } else {
//   ReactDOM.render(<Provider machine={machine}>
//     <App />
//   </Provider>, document.getElementById("root"));
// }

// Raven.context(function () {
//   ReactDOM.render(<Provider machine={machine}>
//     <App />
//   </Provider>, document.getElementById("root"));
// });

const rootEl = document.getElementById("root");

render(
  <AppContainer>
    <Provider machine={machine}>
      <App />
    </Provider>
  </AppContainer>,
  rootEl
);

// Hot Module Replacement API
declare let module: { hot: any };

if (module.hot) {
  module.hot.accept("./app/app.component", () => {
      const NewApp = require("./app/app.component").default;

      render(
        <AppContainer>
          <Provider machine={machine}>
            <NewApp/>
          </Provider>
        </AppContainer>,
        rootEl
      );
  });
}


console.log("+ IntelliTower vendor:", process.env.INTELLITOWER_VENDOR);
console.log("+ IntelliTower version:", process.env.INTELLITOWER_VERSION);