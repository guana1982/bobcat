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
import { ConsumerStore, AccessibilityProvider, AlertProvider, TimerProvider, PaymentProvider, ConfigContext } from "@core/containers";
import { ThemeProvider } from "styled-components";
import { Update } from "./screens/Update";
import { OutOfOrder } from "./screens/OutOfOrder";

import { TimerContext } from "@core/containers";
import { ReplaySubscription } from "./components/common/Subscription";
export const TestProximity = () => {
  const configConsumer = React.useContext(ConfigContext);
  const timerConsumer = React.useContext(TimerContext);
  const { vendorConfig } = configConsumer;
  const { statusProximity$, displayIsDims } = timerConsumer;

  if (!vendorConfig.debug_mode)
    return null;

  return (
    <div style={{
      zIndex: 1000,
      width: 200,
      height: 60,
      position: "absolute",
      top: 10,
      left: 10,
      background: "#fff",
      border: "2px solid tomato",
      borderRadius: 10,
      padding: 10
    }}>
      <ReplaySubscription source={statusProximity$.current}>
        {(status) => {
          return (
            <>
              <span style={{display: "block"}}>Active Distance: <b>{status}</b></span>
              {/* <span style={{display: "block"}}>Is Dims: <b>{String(displayIsDims)}</b></span> */}
            </>
          );
        }}
      </ReplaySubscription>
    </div>
  );
};

export const Consumer = () => (
  <ThemeProvider theme={themeMain}>
    <AccessibilityProvider>
        <AlertProvider alertComponent={<AlertFull />}>
          <ConsumerStore>
            <PaymentProvider>
              <TimerProvider>
                <TestProximity />
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