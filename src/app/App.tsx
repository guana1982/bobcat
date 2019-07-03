import * as React from "react";
import { MemoryRouter } from "react-router";
import { ConfigStore } from "@containers/index";
import { GlobalStyle } from "./GlobalStyle";
import PreCacheImg from "react-precache-img";
import { Consumer } from "@modules/consumer/Consumer";
import { Service } from "@modules/service/Service";

const PreCacheFont = () => (
  <div className="font_preload" style={{opacity: 0}}>
    <span style={{fontFamily: "Karla-Reg"}}></span>
    <span style={{fontFamily: "Karla-Bol"}}></span>
    <span style={{fontFamily: "NeuzeitGro-Reg"}}></span>
    <span style={{fontFamily: "NeuzeitGro-Bol"}}></span>
  </div>
);

const App = () => {
  let ROOT = document.getElementById("root");
  ROOT.addEventListener("touchstart", function() {
    // console.log("touched");
    setTimeout(() => ROOT.style.pointerEvents = "none", 50);
    setTimeout(() => ROOT.style.pointerEvents = "auto", 750);
  });

  return (
    <React.Fragment>
      <GlobalStyle />
      <PreCacheFont />
      <MemoryRouter>
        <ConfigStore>
          <Consumer />
          <Service />
        </ConfigStore>
      </MemoryRouter>
    </React.Fragment>
  );
};

export default App;
