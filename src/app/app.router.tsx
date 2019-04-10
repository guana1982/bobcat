import * as React from "react";
import { Route } from "react-router";

/* ==== PAGES ==== */
import { Attractor } from "@modules/consumer/screens/Attractor";
import { Home } from "@modules/consumer/screens/Home";
import { Prepay } from "@modules/consumer/screens/Prepay";
import { OldMenu } from "@modules/consumer/screens/Menu";
import { NewMenu } from "@modules/service/service.component";

/* ==== STORES ==== */
import { Pages } from "@utils/constants";

const AppRouter = () => (
  <React.Fragment>
    <Route exact path={Pages.Attractor} component={Attractor}/>
    <Route path={Pages.Home} component={Home}/>
    <Route path={Pages.Prepay} component={Prepay}/>
    <Route path={Pages.Menu} component={OldMenu}/>
  </React.Fragment>
);

export default AppRouter;