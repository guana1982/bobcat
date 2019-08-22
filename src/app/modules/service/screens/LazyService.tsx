import * as React from "react";
import { Route } from "react-router";

/* ==== PAGES ==== */
import { NewMenu } from "../screens/Main";
import { MasterMenu } from "../screens/Master";
import { TestMenu } from "../screens/Test";

import { ServiceProvider } from "@core/containers";
import { Pages } from "@core/utils/constants";

const LazyService = (props) => {
  const { authLevel } = props;
  return (
    <ServiceProvider>
      <Route
        path={Pages.Menu}
        render={(routeProps) => (
          <NewMenu {...routeProps} authLevel={authLevel} />
        )}
      />
      <Route
        path={Pages.Master}
        render={(routeProps) => (
          <MasterMenu {...routeProps} authLevel={authLevel} />
        )}
      />
      <Route
        path={Pages.Test}
        render={(routeProps) => (
          <TestMenu {...routeProps} authLevel={authLevel} />
        )}
      />
    </ServiceProvider>
  );
};

export default LazyService;