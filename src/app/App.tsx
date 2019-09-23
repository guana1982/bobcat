import * as React from "react";
import { MemoryRouter } from "react-router";
import { ConfigStore, ConfigContext } from "@containers/index";
import { GlobalStyle } from "./GlobalStyle";
import { pure } from "recompose";
import { motion } from "framer-motion"
import Gesture from "@core/components/Menu/Gesture";

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
// ========
// {/* <ButtonPressHandler /> */}

const Consumer = React.lazy(() => import("@modules/consumer/Consumer"));
const Service = React.lazy(() => import("@modules/service/Service"));

const LazyLoadService = () => {
  const configConsumer = React.useContext(ConfigContext);
  const { authService } = configConsumer;
  return (
    <>
     {authService !== null && <Service />}
    </>
  );
};


// export class Gesture2 extends React.Component<any, any> {



//   render() {
//     return (
//       <></>
//     );
//   }
// }

const TestGesture = () => {
  const [countGesture, setCountGesture] = React.useState(0);
  const [countTouchStart, setCountTouchStart] = React.useState(0);
  const [countTouchMove, setCountTouchMove] = React.useState(0);
  const [countTouchEnd, setCountTouchEnd] = React.useState(0);
  const [enableGesture, setEnableGesture] = React.useState(true);

  const onGesture = (gesture) => {
    setCountGesture(prevCount => prevCount + 1);
  };

  const reset = () => {
    setCountGesture(0);
    setCountTouchStart(0);
    setCountTouchMove(0);
    setCountTouchEnd(0);
  };

  React.useEffect(() => {
    window.addEventListener("touchstart", () => {
      setCountTouchStart(prevCount => prevCount + 1);
    });
    window.addEventListener("touchmove", () => {
      setCountTouchMove(prevCount => prevCount + 1);
    });
    window.addEventListener("touchend", () => {
      setCountTouchEnd(prevCount => prevCount + 1);
    });
  }, []);

  return (
    <div id="example-container">
      {enableGesture && <Gesture onGesture={onGesture} />}
      <motion.div
        id="animation-test"
        animate={{
          scale: [1, 2, 2, 1, 1],
          rotate: [0, 0, 270, 270, 0],
          borderRadius: ["20%", "20%", "50%", "50%", "20%"]
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          times: [0, 0.2, 0.5, 0.8, 1],
          loop: Infinity,
          repeatDelay: 1
        }}
      />
      <div id="box">
        <h1>Gestures: {countGesture}</h1>
        <h1>Touch start: {countTouchStart}</h1>
        <h1>Touch move: {countTouchMove}</h1>
        <h1>Touch end: {countTouchEnd}</h1>
        <button onClick={reset}>Reset</button>
        <button onClick={() => setEnableGesture(prev => !prev)}>{!enableGesture ? "Enable" : "Disable"} Gesture</button>
        <button onClick={() => window.location.reload(true)}>Reload</button>
      </div>
    </div>
  );
};

const App = pure(() => (
  <React.Fragment>
    <GlobalStyle />
    <TestGesture />
    {/* <PreCacheFont />
    <MemoryRouter>
      <ConfigStore>
        <React.Suspense fallback={<></>}>
          <Consumer />
          <LazyLoadService />
        </React.Suspense>
      </ConfigStore>
    </MemoryRouter> */}
  </React.Fragment>
));

export default App;
