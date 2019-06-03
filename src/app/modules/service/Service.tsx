import * as React from "react";
import { Route } from "react-router";
import { Pages } from "@utils/constants";
import { themeMenu } from "@style";
import { Auth } from "./components/auth/Auth";

/* ==== PAGES ==== */
import { NewMenu } from "./screens/Main";

/* ==== STORES ==== */
import { ServiceProvider, AlertProvider, AuthLevels } from "@core/containers";
import { ThemeProvider } from "styled-components";
import { LoaderProvider } from "@core/containers/loader.container";
import { LoaderComponent } from "./components/common/Loader";
import { Alert } from "./components/common/Alert";
import mediumLevel from "@core/utils/lib/mediumLevel";
import { map, tap } from "rxjs/operators";
import { MasterMenu } from "./screens/Master";

export const Service = (props) => {

  /* ==== AUTH ==== */
  /* ======================================== */

  const [authLevel, setAuthLevel] = React.useState<AuthLevels>(null);

  function authLogin(pincode: string) {
    return mediumLevel.menu.authentication(pincode)
    .pipe(
      map(data => {
        if (data.error) {
          throw data.error;
        }
        const authLevel: AuthLevels = data.menu_id;
        return authLevel;
      }),
      tap(authLevel => {
        setAuthLevel(authLevel);
      })
    );
  }

  /* ==== MAIN ==== */
  /* ======================================== */

  return (
    <ThemeProvider theme={themeMenu}>
      <LoaderProvider loaderComponent={<LoaderComponent />}>
        <AlertProvider alertComponent={<Alert />}>
          <Auth authLogin={authLogin} setAuthLevel={setAuthLevel} />
          {
            authLevel &&
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
            </ServiceProvider>
          }
        </AlertProvider>
      </LoaderProvider>
    </ThemeProvider>
  );

};