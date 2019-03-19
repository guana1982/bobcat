import * as React from "react";
import { MemoryRouter } from "react-router";
import { ThemeProvider } from "styled-components";
import { ConfigStore, TimerStore, ServiceProvider, AccessibilityProvider } from "@containers/index";
import AppRouter from "./app.router";
import { themeMain, GlobalStyle } from "./app.style";
import { ConsumerStore } from "@containers/consumer.container";
import { AlertProvider } from "@core/containers/alert.container";
import PreCacheImg from "react-precache-img";

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
                  <PreCacheImg
                    images={[
                      "img/slider-bg.png",
                      "img/detail-card-bg.png",
                      "img/bottle-qr.svg",
                      "img/phone-qr.svg",
                      "img/rectangle.png",
                      "img/flavor-card-bg.png",
                      "img/qr-bg.png",

                      "img/logos/9.png",
                      "img/logos/2009.png",
                      "img/logos/2011.png",
                      "img/logos/2012.png",
                      "img/logos/2013.png",
                      "img/logos/2014.png",
                      "img/logos/2015.png",

                      "img/logos/9@sparkling.png",
                      "img/logos/2009@sparkling.png",
                      "img/logos/2011@sparkling.png",
                      "img/logos/2012@sparkling.png",
                      "img/logos/2013@sparkling.png",
                      "img/logos/2014@sparkling.png",
                      "img/logos/2015@sparkling.png",

                      "img/logos/9@blur.png",
                      "img/logos/2009@blur.png",
                      "img/logos/2011@blur.png",
                      "img/logos/2012@blur.png",
                      "img/logos/2013@blur.png",
                      "img/logos/2014@blur.png",
                      "img/logos/2015@blur.png",

                      "icons/sparkling.svg",
                      "icons/still.svg",
                      "icons/qr-code.svg",
                      "icons/close.svg",
                      "icons/nutrition.svg",
                      "icons/log-out.svg",
                      "icons/flavor.svg",
                      "icons/temperature.svg",
                      "icons/arrow-circle.png",
                      "icons/favorite.png",
                      "icons/favorite@blur.png",
                      "icons/last-pour.png",
                      "icons/last-pour@blur.png",
                    ]}
                  />
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
