import * as React from "react";
import { MemoryRouter } from "react-router";
import { ConfigStore } from "@containers/index";
import { GlobalStyle } from "./GlobalStyle";
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

// const ButtonPressHandler = () => {
//   document.addEventListener("click", e => {
//     let b = e["path"].find(el =>
//       el.id === "nutrition-btn" || el.id === "signin-btn" || el.id === "logout-btn");
//     if (b) {
//       console.log("%c NUTRITION BUTTON", "color: #0ff");
//       b.setAttribute("style", "pointer-events: none");
//       setTimeout(() => b.setAttribute("style", "pointer-events: auto"), 1000);
//     }
//   });
//   return <React.Fragment />;
// };

const App = () => (
  <React.Fragment>
    <GlobalStyle />
    <PreCacheFont />
    {/* <ButtonPressHandler /> */}
    <MemoryRouter>
      <ConfigStore>
        <Consumer />
        <Service />
      </ConfigStore>
    </MemoryRouter>
  </React.Fragment>
);

export default App;
