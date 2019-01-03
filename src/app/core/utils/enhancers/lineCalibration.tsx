import { withState, withHandlers, compose, lifecycle } from "recompose";
import query from "../enhancers/fetchState";
import mediumLevel from "../lib/mediumLevel";

export default compose(
  withState("unit", "setUnit", "ml"),
  withHandlers({
    selectUnit: ({ setUnit }) => unit => e => {
      setUnit(unit);
    }
  }),
  // query(mediumLevel.config.getBeverages, {
  //   name: 'getLines',
  // }),
  query(mediumLevel.config.testPour, {
    name: "testPour"
  }),
  query(mediumLevel.config.lineTest, {
    name: "lineTest"
  }),
  query(mediumLevel.config.saveLineCalibration, {
    name: "updateCalibration"
  })
);
