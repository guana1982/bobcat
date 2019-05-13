import * as React from "react";
import { MemoryRouter } from "react-router";
import { ConfigStore } from "@containers/index";
import { GlobalStyle } from "./GlobalStyle";
import PreCacheImg from "react-precache-img";
import { Consumer } from "@modules/consumer/Consumer";
import { Service } from "@modules/service/Service";

const images = [
  // "img/slider-bg.svg",
  // "img/slider-bg.png",
  // "img/detail-card-bg.png",
  "img/bottle-qr.svg",
  "img/phone-qr.svg",
  // "img/rectangle.png",
  // "img/flavor-card-bg.png",
  // "img/qr-bg.png",

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

  // "icons/sparkling.svg",
  // "icons/still.svg",
  // "icons/qr-code.svg",
  // "icons/close.svg",
  // "icons/nutrition.svg",
  // "icons/log-out.svg",
  // "icons/flavor.svg",
  // "icons/temperature.svg",
  // "icons/arrow-circle.png",
  // "icons/favorite.png",
  // "icons/favorite@blur.png",
  // "icons/last-pour.png",
  // "icons/last-pour@blur.png",
];

const PreCacheFont = () => (
  <div className="font_preload" style={{opacity: 0}}>
    <span style={{fontFamily: "Karla-Reg"}}></span>
    <span style={{fontFamily: "Karla-Bol"}}></span>
    <span style={{fontFamily: "NeuzeitGro-Reg"}}></span>
    <span style={{fontFamily: "NeuzeitGro-Bol"}}></span>
  </div>
);

const App = () => (
  <React.Fragment>
    <GlobalStyle />
    <PreCacheImg images={images} />
    <PreCacheFont />
    <MemoryRouter>
      <ConfigStore>
        <Consumer />
        <Service />
      </ConfigStore>
    </MemoryRouter>
  </React.Fragment>
);

export default App;
