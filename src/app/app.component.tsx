import * as React from "react";
import { MemoryRouter } from "react-router";
import { ThemeProvider } from "styled-components";
import { ConfigStore, TimerStore, ServiceProvider } from "@containers/index";
import AppRouter from "./app.router";
import { themeMain, GlobalStyle } from "./app.style";
import { ConsumerStore } from "@containers/consumer.container";
import { AlertProvider } from "@core/containers/alert.container";


{/* <AccessibilityStore> */}
const App = () => (
  <MemoryRouter>
    <ThemeProvider theme={themeMain}>
      <AlertProvider>
        <ConfigStore>
          <ServiceProvider>
            <ConsumerStore>
              <TimerStore>
                <GlobalStyle />
                <AppRouter />
              </TimerStore>
            </ConsumerStore>
          </ServiceProvider>
        </ConfigStore>
      </AlertProvider>
    </ThemeProvider>
  </MemoryRouter>
);

export default App;
