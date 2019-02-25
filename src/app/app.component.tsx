import * as React from "react";
import { MemoryRouter } from "react-router";
import { ThemeProvider } from "styled-components";
import { ConfigStore, TimerStore, ServiceProvider } from "@containers/index";
import AppRouter from "./app.router";
import { themeMain, GlobalStyle } from "./app.style";
import { ConsumerStore } from "@containers/consumer.container";


{/* <AccessibilityStore> */}
const App = () => (
  <MemoryRouter>
    <ThemeProvider theme={themeMain}>
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
    </ThemeProvider>
  </MemoryRouter>
);

export default App;
