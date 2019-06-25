// import { compose, lifecycle, withHandlers, withProps, withState, setDisplayName } from "recompose";
// import { observer } from "mobx-react";
// import { timer } from "d3-timer";
// import appLifecycle from "stores/AppLifecycle";
// import query from "../enhancers/fetchState";
// import mediumLevel from "../lib/mediumLevel";

// export default compose(
//   setDisplayName("BeveragePouringProgress"),
//   observer,
//   withState("showCompletedMessage", "setShowCompletedMessage", false),
//   withState("eta", "setEta", -1),
//   withState("height", "setHeight", 0),
//   withState("animationTimer", "setAnimationTimer", null),
//   withState("lineData", "setLineData", [
//     { x: 0, y: 10 },
//     { x: 20, y: 15 },
//     { x: 40, y: 20 },
//     { x: 60, y: 25 },
//     { x: 80, y: 30 },
//     { x: 100, y: 35 }
//   ]),
//   withProps(() => ({
//     beverage: appLifecycle.beverage,
//     topping: appLifecycle.topping,
//     paymentMethod: appLifecycle.paymentMethod
//   })),
//   query(mediumLevel.dispense.pour, {
//     name: "pour"
//   }),
//   query(mediumLevel.dispense.stop, {
//     name: "stop"
//   }),
//   withHandlers({
//     onStop: ({ stop, onComplete, animationTimer, setShowCompletedMessage }) => e => {
//       animationTimer.stop();
//       stop();
//       setShowCompletedMessage(true);
//       setTimeout(() => {
//         setShowCompletedMessage(false);
//         onComplete();
//       }, 2000);
//     }
//   }),
//   lifecycle({
//     async componentDidMount() {
//       const { beverage, onComplete, lineData, setLineData, setHeight, setAnimationTimer, setShowCompletedMessage } = this.props;
//       if (!beverage) {
//         onComplete();
//         // throw new Error('No beverage selected!')
//       }
//       console.log(appLifecycle.serializeBeverageConfig());
//       const task = await this.props.pour(appLifecycle.serializeBeverageConfig());
//       if (!task || !task.eta) {
//         onComplete();
//         appLifecycle.reset();
//         throw new Error("Cannot pour beverage");
//       }
//       const t = timer(elapsed => {
//         setAnimationTimer(t);
//         const newLineData = lineData.map(n => {
//           let x = n.x;
//           let y = n.y + 0.08;
//           return { x: x, y: y };
//         });
//         const growFactor = 100 * (elapsed / task.eta);
//         const newHeight = growFactor;
//         setLineData(newLineData);
//         setHeight(newHeight);
//         if (elapsed > parseFloat(task.eta)) {
//           t.stop();
//           setShowCompletedMessage(true);
//           setTimeout(() => {
//             setShowCompletedMessage(false);
//             onComplete();
//           }, 2000);
//         }
//       });
//     }
//   })
// );
