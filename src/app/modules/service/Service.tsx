import * as React from "react";
import { themeMenu } from "@style";
import { Auth } from "./components/auth/Auth";

/* ==== STORES ==== */
import { AlertProvider, AuthLevels } from "@core/containers";
import { ThemeProvider } from "styled-components";
import { LoaderProvider } from "@core/containers/loader.container";
import { LoaderComponent } from "./components/common/Loader";
import { Alert } from "./components/common/Alert";
import mediumLevel from "@core/utils/lib/mediumLevel";
import { map, tap } from "rxjs/operators";

const LazyService = React.lazy(() => import("./screens/LazyService"));

export const Service = () => {

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
            <React.Suspense fallback={<></>}>
              <LazyService authLevel={authLevel} />
            </React.Suspense>
          }
        </AlertProvider>
      </LoaderProvider>
    </ThemeProvider>
  );

};

export default Service;