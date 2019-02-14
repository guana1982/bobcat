import * as React from "react";
import { Route } from "react-router";

/* ==== PAGES ==== */
import HomeComponent from "../layout/home/home.component";
import PrepayComponent from "../layout/prepay/prepay.component";
import MenuComponent from "../layout/menu/menu.component";

/* ==== STORES ==== */
import AttractorComponent from "../layout/attractor/attractor.component";
import { Pages } from "../utils/constants";

const AppRouter = () => (
  <React.Fragment>
    <Route exact path={Pages.Attractor} component={AttractorComponent}/>
    <Route path={Pages.Home} component={HomeComponent}/>
    <Route path={Pages.Prepay} component={PrepayComponent}/>
    <Route path={Pages.Menu} component={MenuComponent}/>
  </React.Fragment>
);

export default AppRouter;