import * as React from "react";
import { Route } from "react-router";
import { Pages } from "@utils/constants";
import { AlertFull } from "./components/common/Alert";
import { themeMain } from "@style";

/* ==== PAGES ==== */
import { Attractor } from "./screens/Attractor";
import { Home } from "./screens/Home";
import { Prepay } from "./screens/Prepay";

/* ==== STORES ==== */
import { ConsumerStore, AccessibilityProvider, AlertProvider, TimerProvider, PaymentProvider } from "@core/containers";
import { ThemeProvider } from "styled-components";
import { Update } from "./screens/Update";
import { OutOfOrder } from "./screens/OutOfOrder";

export const Consumer = () => (
  <ThemeProvider theme={themeMain}>
    <AccessibilityProvider>
        <AlertProvider alertComponent={<AlertFull />}>
          <ConsumerStore>
            <PaymentProvider>
              <TimerProvider>
                <Route exact path={Pages.Attractor} component={Attractor}/>
                <Route path={Pages.Home} component={Home}/>
                <Route path={Pages.Prepay} component={Prepay}/>
                <Route path={Pages.Update} component={Update}/>
                <Route path={Pages.OutOfOrder} component={OutOfOrder}/>
              </TimerProvider>
            </PaymentProvider>
          </ConsumerStore>
        </AlertProvider>
    </AccessibilityProvider>
  </ThemeProvider>
);