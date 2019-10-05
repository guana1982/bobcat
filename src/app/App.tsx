import * as React from "react";
import { MemoryRouter } from "react-router";
import { ConfigStore, ConfigContext } from "@containers/index";
import { GlobalStyle } from "./GlobalStyle";
import { pure } from "recompose";
import { motion } from "framer-motion"
import Gesture from "@core/components/Menu/Gesture";
import { Beverage, BeverageSize } from "@modules/consumer/components/beverage/Beverage";
import { IBeverage } from "@core/models";

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

const b: any = {"current_flow_rate":60,"status_id":"ok","beverage_logo_id":9,"density":1,"carbonation_divider":1,"bib_size":20,"available":true,"bib_expiring_date":"2018-07-04","enabled_beverage_size_ids":[1,2,3,4],"line_id":8,"last_calibration_date":"2018-07-04","bib_reload_date":"2018-07-04","line_type":null,"calibration_status":0,"target_flow_rate":58.17,"carbonation_levels":{"values":[0],"type":"single"},"country":["USA"],"ratio":[1],"beverage_id":9,"last_sanification_date":"2018-07-04","beverage_type":"plain","second_shelf_life":0,"toppings":[{"topping_id":0,"enable":true,"topping_percs":{"values":[0],"type":"single"}}],"beverage_label_id":"plain_water","remaining_bib":0,"uom":["gallon"],"sugars_perc":"0","sugars":"0","protein":"0","total_fat_perc":"0","calories":"0","sodium":"0","sizes":["1"],"serving_size_ml":"90","protein_perc":"0","sodium_perc":"0","beverage_font_color":"#2b9cda","total_carb":"0","serving_size_fl_oz":"0.3","total_carb_perc":"0","total_fat":"0","$lock":false,"$price":0};

const TestGesture = () => {
  const [countGesture, setCountGesture] = React.useState(0);
  const [countClick, setCountClick] = React.useState(0);
  const [countTouchStart, setCountTouchStart] = React.useState(0);
  const [countTouchHoldStart, setCountTouchHoldStart] = React.useState(0);
  const [countTouchMove, setCountTouchMove] = React.useState(0);
  const [countTouchHoldEnd, setCountTouchHoldEnd] = React.useState(0);
  const [enableGesture, setEnableGesture] = React.useState(true);

  const timestampStart = React.useRef(null);
  const timestampEnd = React.useRef(null);
  const [historyTimestamp, setHistoryTimestamp]  = React.useState([]);

  const onGesture = (gesture) => {
    setCountGesture(prevCount => prevCount + 1);
  };

  const reset = () => {
    // timestampStart.current = null;
    // timestampEnd.current = null;
    // setHistoryTimestamp([]);
    // setCountGesture(0);
    // setCountClick(0);
    // setCountTouchMove(0);
    setCountTouchStart(0);
    setCountTouchHoldStart(0);
    setCountTouchHoldEnd(0);
  };

  // React.useEffect(() => {

  //   const element = document.getElementById("example-container");
  //   element.classList.add("not-active");

  //   window.addEventListener("touchstart", () => {
  //     timestampEnd.current = null;
  //     timestampStart.current = new Date();
  //     setCountTouchStart(prevCount => prevCount + 1);
  //   });
  //   window.addEventListener("click", () => {
  //     setCountClick(prevCount => prevCount + 1);
  //   });
  //   window.addEventListener("touchmove", () => {
  //     setCountTouchMove(prevCount => prevCount + 1);
  //   });
  //   window.addEventListener("touchend", () => {
  //     timestampEnd.current = new Date();
  //     const diff_ = timestampEnd.current - timestampStart.current;
  //     setHistoryTimestamp(prev => [diff_, ...prev]);
  //     setCountTouchEnd(prevCount => prevCount + 1);
  //   });
  // }, []);

  const configConsumer = React.useContext(ConfigContext);

  const start = () => setCountTouchStart(prevCount => prevCount + 1);
  const holdStart = () => {
    setCountTouchHoldStart(prevCount => prevCount + 1);
    configConsumer.onStartPour(b, {
      flavor_level: 1,
      carbonation_level: 50,
      temperature_level: 100,
      isConsumerBeverage: false
    }).subscribe();
  };
  const holdEnd = () => {
    setCountTouchHoldEnd(prevCount => prevCount + 1);
    configConsumer.onStopPour().subscribe();
  };

  return (
    <div id="example-container">
      <div id="beverage-test">
        <Beverage
          pouring={false}
          types={null}
          size={BeverageSize.Normal}
          color={b.beverage_font_color}
          beverage={b}
          logoId={b.beverage_logo_id}
          status_id={b.status_id}
          title={b.beverage_label_id}
          onStart={start}
          onHoldStart={holdStart}
          onHoldEnd={holdEnd}
          disabled={false}
          nutritionFacts={false}
          handleDisabled={() => {}}
        />
      </div>
      <div id="box">
        <h1>Touch start: {countTouchStart}</h1>
        <h1>Touch hold start: {countTouchHoldStart}</h1>
        <h1>Touch hold end: {countTouchHoldEnd}</h1>
        {/* <h1>Gestures: {countGesture}</h1>
        <h1>Click: {countClick}</h1>
        <h1>Touch start: {countTouchStart}</h1>
        <h1>Touch move: {countTouchMove}</h1>
        <h1>Touch end: {countTouchEnd}</h1> 
        <h1>Diff start / end: {historyTimestamp.slice(0, 70).map(value => <span>{value} </span>)}</h1> */}
        <button onClick={reset}>Reset</button>
        {/* <button onClick={() => setEnableGesture(prev => !prev)}>{!enableGesture ? "Enable" : "Disable"} Gesture</button> */}
        <button onClick={() => window.location.reload(true)}>Reload</button>
      </div>
    </div>
  );
};

const App = pure(() => (
  <React.Fragment>
    <GlobalStyle />
    <MemoryRouter>
      <ConfigStore>
        <TestGesture />
      </ConfigStore>
    </MemoryRouter>
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
