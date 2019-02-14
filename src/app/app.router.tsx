import * as React from "react";
import { Route } from "react-router";

/* ==== PAGES ==== */
import AttractorComponent from "@modules/consumer/attractor/attractor.component";
import HomeComponent from "@modules/consumer/home/home.component";
import PrepayComponent from "@modules/consumer/prepay/prepay.component";
import MenuComponent from "@modules/consumer/menu/menu.component";

/* ==== STORES ==== */
import { Pages } from "@utils/constants";

const AppRouter = () => (
  <React.Fragment>
    <Route exact path={Pages.Attractor} component={AttractorComponent}/>
    <Route path={Pages.Home} component={HomeComponent}/>
    <Route path={Pages.Prepay} component={PrepayComponent}/>
    <Route path={Pages.Menu} component={MenuComponent}/>
  </React.Fragment>
);

export default AppRouter;