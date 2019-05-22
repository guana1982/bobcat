import * as React from "react";
import { Route } from "react-router";
import { Pages } from "@utils/constants";
import { Alert } from "./components/common/Alert";
import { themeMain } from "@style";

/* ==== PAGES ==== */
import { Attractor } from "./screens/Attractor";
import { Home } from "./screens/Home";
import { Prepay } from "./screens/Prepay";
import { OldMenu } from "./screens/Menu";

/* ==== STORES ==== */
import { ConsumerStore, AccessibilityProvider, AlertProvider, TimerProvider } from "@core/containers";
import { ThemeProvider } from "styled-components";

export const Consumer = () => (
  <ThemeProvider theme={themeMain}>
    <AccessibilityProvider>
      <AlertProvider alertComponent={<Alert />}>
        <ConsumerStore>
          <TimerProvider>
            <Route exact path={Pages.Attractor} component={Attractor}/>
            <Route path={Pages.Home} component={Home}/>
            <Route path={Pages.Prepay} component={Prepay}/>
            {/* <Route path={Pages.Menu} component={OldMenu}/> */}
          </TimerProvider>
        </ConsumerStore>
      </AlertProvider>
    </AccessibilityProvider>
  </ThemeProvider>
);