import * as React from "react";
import { MemoryRouter } from "react-router";
import { ThemeProvider } from "styled-components";
import { ConfigStore, TimerStore } from "@containers/index";
import AppRouter from "./app.router";
import { themeMain, GlobalStyle } from "./app.style";
import { ConsumerStore } from "@containers/consumer.container";
import { AccessibilityStore } from "@containers/accessibility.container";


{/* <AccessibilityStore> */}
const App = () => (
  <MemoryRouter>
    <ThemeProvider theme={themeMain}>
      <ConfigStore>
        <ConsumerStore>
          <TimerStore>
            <GlobalStyle />
            <AppRouter />
          </TimerStore>
        </ConsumerStore>
      </ConfigStore>
    </ThemeProvider>
  </MemoryRouter>
);

export default App;
