import * as React from "react";
import { MemoryRouter } from "react-router";
import { ThemeProvider } from "styled-components";
import { ConfigStore, TimerStore } from "../store";
import AppRouter from "./app.router";
import { theme1, theme2 } from "./app.style";
import { ConsumerStore } from "../store/consumer.store";


{/* <AccessibilityStore> */}
const App = () => (
  <MemoryRouter>
    <ThemeProvider theme={theme1}>
      <ConfigStore>
        <ConsumerStore>
          <TimerStore>
            <AppRouter />
          </TimerStore>
        </ConsumerStore>
      </ConfigStore>
    </ThemeProvider>
  </MemoryRouter>
);

export default App;
