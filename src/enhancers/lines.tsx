import { withHandlers, compose, lifecycle, withState } from "recompose";
import query from "../enhancers/fetchState";
import mediumLevel from "../lib/mediumLevel";
//
const MAX_SELECTABLE_LINES = 100;
export default compose(
  withState("selectedLines", "setSelected", []),
  query(mediumLevel.config.saveLinesConfig, {
    name: "saveLines"
  }),
  query(mediumLevel.config.getBeverages, {
    name: "getLines"
  }),
  // query(mediumLevel.config.getBeveragesDescription, {
  //   name: "getBeveragesDescription"
  // }),
  query(mediumLevel.config.resetStockShelfLife, {
    name: "resetStockShelfLife"
  }),
  query(mediumLevel.config.updateStockShelfLife, {
    name: "updateStockShelfLife"
  }),
  withHandlers({
    toggleLine: ({ selectedLines, setSelected }) => lineId => e => {
      const index = selectedLines.indexOf(lineId);
      if (index > -1) {
        const nextLines = selectedLines.slice();
        nextLines.splice(index, 1);
        setSelected(nextLines);
        return;
      }
      if (index < 0 && selectedLines.length >= MAX_SELECTABLE_LINES) {
        selectedLines.pop();
      }
      setSelected([...selectedLines, lineId]);
    },
    resetLines: ({ setSelected }) => () => {
      setSelected([]);
    }
  }),
  lifecycle({
    componentDidMount() {
      this.props.getLines();
      if (process.env.INTELLITOWER_VENDOR === "waterbar") {
        this.props.getBeveragesDescription();
      }
    }
  })
);
