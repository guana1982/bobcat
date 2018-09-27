import * as React from "react";
import { compose, lifecycle } from "recompose";
import createHistory from "history/createBrowserHistory";
// import Vendor from "../VendorComponents";

import { I18nextProvider } from "react-i18next";
import i18n from "../i18n"; // initialized i18next instance

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import { ThemeProvider } from "styled-components";
import { theme1, theme2 } from "../style/globalStyle";
import { ConfigStore, ConfigConsumer, PaymentStore, PaymentConsumer } from "../models";
import { Home } from "../layout";
import { Prepay } from "../layout/Prepay";
import { RouteWithSubRoutes } from "../components/router/RouteWithSubRoutes";
import { MenuComponent } from "../layout/menu/menu.component";
import MenuRouter from "../layout/menu/menu.router";

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

const withConsumer = Comp => props => (
  <PaymentStore> { /* To FIX */}
    <PaymentConsumer>
      {payment => (
        <Comp {...props} paymentConsumer={payment}></Comp>
      )}
    </PaymentConsumer>
  </PaymentStore>
);

// const routes = [
//   {
//     path: "/home",
//     component: Home
//   },
//   {
//     path: "/prepay",
//     component: withConsumer(Prepay)
//   },
//   {
//     path: "/menu/",
//     component: MenuComponent
//   }
// ];

export default fullScreen(({
  isLoadingNetwork,
  error,
  getConfigState,
  ...props
}) => {
  const history = createHistory();
  return (
    <Router history={history}>
      <ThemeProvider theme={theme1}>
        <ConfigStore>
          {/* {routes.map((route, i) => <RouteWithSubRoutes key={i} {...route} />)} */}

          <Route exact path="/" component={Home}/>
          <Route path="/menu/:typeMenu(tech|crew)" component={MenuComponent}/>

          {/* <RouterStore>
              <RouterConsumer>
                {({ setPage }) => (
                  <div>
                    <button onClick={() => setPage("SCREENSAVER")}>SCREENSAVER</button>
                    <button onClick={() => setPage("PREPAY")}>PREPAY</button>
                    <button onClick={() => setPage("HOME")}>HOME</button>
                    <button onClick={() => setPage("ATTRACTOR")}>ATTRACTOR</button>
                  </div>
                )}
              </RouterConsumer>
            <Route />
          </RouterStore> */}
        </ConfigStore>
      </ThemeProvider>
    </Router>
  );
});
