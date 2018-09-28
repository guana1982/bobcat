import * as React from "react";
import { observer } from "mobx-react";
import { toJS } from "mobx";
import { compose, setDisplayName, onlyUpdateForKeys } from "recompose";
import withInactivityTimer from "../../enhancers/inactivityTimer";
import Beverage from "./Beverage";
import mediumLevel from "../../lib/mediumLevel";
import * as styles from "./BeverageConfig.scss";

const enhance = compose(
  setDisplayName("BeverageConfig"),
  withInactivityTimer({
    resetOnClick: true
  }),
  onlyUpdateForKeys(["sizeId", "carbonationLevel", "topping", "beverage", "paymentIsValid", "recipe", "machineState", "disabledMenuOpen"])
);

const setDefaultConfig = beverage => {
  return {
    beverage,
    topping: beverage.toppings[0],
    carbonationLevel: beverage.carbonation_levels.values.length === 1 ? beverage.carbonation_levels.values[0] : null,
    sizeId: beverage.enabled_beverage_size_ids.length === 1 ? beverage.enabled_beverage_size_ids[0] : null
  };
};

const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

@observer
class BeverageConfig extends React.Component<any> {

  state: any = {};

  constructor(props) {
    super(props);
    this.state = {
      sizeId: null,
      animatedId: null,
      animationStarted: false,
      selectedBeverage: null
    };
  }

  onStart = async (beverage, index?) => {
    console.log("onStart");
    const { onNext, pourMethod } = this.props;
    if (beverage) {
      const recipe = {
        beverage_size_id: null,
        carbonation_level: this.state.carbonationLevel || beverage.carbonation_levels.values[0],
        topping_id: 0,
        topping_perc_id: 0,
        beverage_id: beverage.beverage_id,
        temperature_level: beverage.temperature_level,
        pour_method: "free_flow" // pourMethod === "timed" ? "timed" : "continuous"
      };
      const dispense = await mediumLevel.dispense.pour(recipe);
      this.props.onStart(recipe);
      this.setState(prevState => ({
        ...prevState,
        animatedId: index
      }));
    }
  }

  onFastFoodStop = async () => {
    console.log("onStop");
    const stop = await mediumLevel.dispense.stop();
    this.props.onStop();
    this.setState(prevState => ({
      ...prevState,
      animatedId: null,
      animationStarted: false
    }));
  }

  render() {
    let { beverages, beverage, machineState, carbonationLevel, sizes, size, eta, paymentMethod, pourMethod, easySelection, toggleMenu, disabledMenuOpen } = this.props;
    const { animationStarted, selectedBeverage, animatedId } = this.state;

    // console.log("-------- beverages --------");
    // console.log(JSON.stringify(toJS(beverages)));
    // console.log("-------- beverages --------");

    return (
      <div className={`${styles.gridContainer}`}>
        <React.Fragment >
          { beverages.map((b, i) => { // .sort((a, b) => a.line_id > b.line_id)
            return (
              <Beverage
                key={i}
                index={i}
                beverage={b}
                onSelect={this.onStart}
                pourMethod={pourMethod}
                animatedId={animatedId}
                onStop={this.onFastFoodStop}
              />
            );
          })}
        </React.Fragment>
      </div>
    );
  }
}

export default enhance(BeverageConfig);