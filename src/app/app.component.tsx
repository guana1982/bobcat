import * as React from "react";
import { MemoryRouter } from "react-router";
import { ThemeProvider } from "styled-components";
import { ConfigStore, TimerStore, ServiceProvider, AccessibilityProvider } from "@containers/index";
import AppRouter from "./app.router";
import { themeMain, GlobalStyle } from "./app.style";
import { ConsumerStore } from "@containers/consumer.container";
import { AlertProvider } from "@core/containers/alert.container";

const App = () => (
  <MemoryRouter>
    <ThemeProvider theme={themeMain}>
      <AccessibilityProvider>
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
      </AccessibilityProvider>
    </ThemeProvider>
  </MemoryRouter>
);

export default App;
