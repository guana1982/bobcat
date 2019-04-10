import * as React from "react";
import { Route } from "react-router";
import { Pages } from "@utils/constants";
import { themeMenu } from "@style";

/* ==== PAGES ==== */
import { NewMenu } from "./screens/Main";

/* ==== STORES ==== */
import { ServiceProvider, TimerStore, AlertProvider } from "@core/containers";
import { ThemeProvider } from "styled-components";

export const Service = () => (
  <ThemeProvider theme={themeMenu}>
    {/* <AlertProvider alertComponent={<Alert />}> */}
      <ServiceProvider>
        {/* <TimerStore> */}
          <Route path={Pages.Menu} component={NewMenu}/>
        {/* </TimerStore> */}
      </ServiceProvider>
    {/* </AlertProvider> */}
  </ThemeProvider>
);