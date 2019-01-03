// import { compose, lifecycle, withHandlers, withProps, withState, setDisplayName } from "recompose";
// import { observer } from "mobx-react";
// import appLifecycle from "../stores/AppLifecycle";
// import query from "../enhancers/fetchState";
// import mediumLevel from "../lib/mediumLevel";
// import withInactivityTimer from "./inactivityTimer";
// import { withAvailableMenus } from "./menu";
// // import beverageSelector from 'stores/BeverageSelector'

// const sleep = ms => {
//   return new Promise(resolve => setTimeout(resolve, ms));
// };
// const withBeverageSelector = compose(
//   withAvailableMenus,
//   setDisplayName("BeverageSelector"),
//   observer,
//   withProps(() => ({
//     beverages: appLifecycle.beverages,
//     sizes: appLifecycle.sizes,
//     beverage: appLifecycle.beverage,
//     paymentMethod: appLifecycle.paymentMethod,
//     topping: appLifecycle.topping,
//     carbonation: appLifecycle.carbonation,
//     size: appLifecycle.size
//   })),
//   withState("animationStarted", "setAnimationStarted", false),
//   withState("animatedId", "setAnimatedId", null),
//   query(mediumLevel.config.getBeverages, {
//     name: "getBeverages"
//   }),
//   query(mediumLevel.config.getSizes, {
//     name: "getSizes"
//   }),
//   withHandlers({
//     onReset: ({ navigation }) => () => {
//       navigation.reset();
//       appLifecycle.reset();
//     },
//     setBeverage: props => beverage => {
//       // if (appLifecycle.topping) {
//       //   appLifecycle.setTopping(beverage.toppings[0])
//       // }
//       appLifecycle.setBeverage(beverage);
//     },
//     setSize: props => size => {
//       appLifecycle.setSize(size);
//     },
//     setTopping: props => topping => {
//       appLifecycle.setTopping(topping);
//     },
//     setCarbonation: props => level => {
//       appLifecycle.setCarbonation(level);
//     },
//     getBeverageDimension: () => index => {
//       const dimensions = [[66.6, 25], [33.3, 25], [33.3, 25], [33.3, 25], [33.3, 25], [33.3, 25], [33.3, 25], [33.3, 25], [50, 25], [50, 25]];
//       return dimensions[index];
//     },
//     getBeveragePosition: () => index => {
//       const positions = [[0, 0], [66.6, 0], [0, 25], [33.3, 25], [66.6, 25], [0, 50], [33.3, 50], [66.6, 50], [0, 75], [50, 75]];
//       return positions[index];
//     }
//   }),
//   withInactivityTimer(30),
//   lifecycle({
//     async componentWillMount() {
//       const { beverage, setAnimationStarted, setAnimatedId } = this.props;
//       if (beverage) {
//         setAnimationStarted(true);
//         setAnimatedId(beverage.beverage_id);
//         await sleep(500);
//         appLifecycle.softReset();
//         await sleep(1500);
//         setAnimationStarted(false);
//         setAnimatedId(null);
//       }
//     }
//   })
// );
// export default withBeverageSelector;
