import * as React from "react";
import { Route } from "react-router";
import { Pages } from "@utils/constants";
import { themeMenu } from "@style";
import { Auth } from "./components/auth/Auth";

/* ==== PAGES ==== */
import { NewMenu } from "./screens/Main";

/* ==== STORES ==== */
import { ServiceProvider, TimerStore, AlertProvider } from "@core/containers";
import { ThemeProvider } from "styled-components";
import { LoaderProvider } from "@core/containers/loader.container";
import { LoaderComponent } from "./components/common/Loader";

export const Service = (props) => (
  <ThemeProvider theme={themeMenu}>
    <LoaderProvider loaderComponent={<LoaderComponent />}>
      <ServiceProvider>
        {/* <TimerStore> */}
          <Auth />
          <Route path={Pages.Menu} component={NewMenu}/>
        {/* </TimerStore> */}
      </ServiceProvider>
    </LoaderProvider>
  </ThemeProvider>
);