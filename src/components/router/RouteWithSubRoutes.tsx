import * as React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

export const RouteWithSubRoutes = route => (
  <Route
    path={route.path}
    render={props => (
      // pass the sub-routes down to keep nesting
      <route.component {...props} routes={route.routes} />
    )}
  />
);
