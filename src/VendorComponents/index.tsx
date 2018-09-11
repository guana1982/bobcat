import * as React from "react";
import { observer, inject } from "mobx-react";
import {
  START,
  PAYMENT_METHODS,
  BEVERAGE,
  PREPAY_QR,
  POURING
} from "../machine/statechart";
import { Match, Switch } from "../components/Machine";

import ErrorDialog from "../components/common/ErrorDialog";
import "./index.scss";

import Menu from "./Menu";
import BeverageConfig from "./Beverage/BeverageConfig";
import Prepay from "./Payment/Prepay";

const TRANSITION_ANIM_DIRECTIONS = evt => {
  switch (evt) {
    case "BACK":
    case "TIMEOUT":
    case "FAIL":
      return -1;
    default:
      return 1;
  }
};

type AppState = {
  disabledMenuOpen: boolean
};

@inject("machine")
@observer
class App extends React.Component<any, AppState> {
  constructor(props) {
    super(props);
    this.state = {
      disabledMenuOpen: false
    };
  }
  componentDidMount() {}
  next = (data?) => {
    this.props.machine.transition("NEXT", data);
  }
  onNext = (evt) => {
    this.next();
  }
  onBack = () => {
    this.props.machine.transition("BACK");
  }
  onTimeout = () => {
    this.props.machine.transition("TIMEOUT");
  }
  onSetPaymentMethod = method => {
    this.props.machine.transition(method.id, { paymentMethod: method });
  }
  // TEST QRCODE ===>
  onSetScanQr = () => {
    this.props.machine.transition("qr_pre");
  }
  // <=== TEST QRCODE
  onScanQr = (qr) => {
    this.next({ qr });
  }
  onConfirmBeverage = (beverage) => {
    console.log("--- confirm beverage");
    this.next({ beverage });
  }
  onConfirmRecipe = (recipe) => {
    this.next({ recipe });
  }
  onConfirmPostpay = () => {
    this.next({
      paymentData: this.props.machine.data.paymentData,
      recipe: this.props.machine.data.recipe
    });
  }
  onStop = () => {
    this.props.machine.transition("STOP");
  }
  toggleMenu = () => {
    const menuState = this.state.disabledMenuOpen;
    this.setState({
      disabledMenuOpen: !menuState
    });
  }
  render() {
    const {
      state: { event },
      currentState,
      data,
      data: { vendorConfig = {}, error }
    } = this.props.machine;


    console.log("%c [EVENT]: %s", "color: #2ECC71", event);
    console.log("%c  [STATE]: %o", "color: #9E86C1", this.props.machine.toString());
    console.log("  [DATA]: %o", data);

    const beverageConfig = {
      beverages: data.beverages,
      beverage: data.beverage,
      sizes: data.sizes,
      onSelect: this.onConfirmBeverage,
      onNext: this.onConfirmRecipe
    };
    const machineState = this.props.machine.toString();
    const machine = this.props.machine;
    return (
      <div style={{ height: "100%" }}>
        {/* {process.env.NODE_ENV === "development" && (
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: 40,
              top: 0,
              left: 0,
              zIndex: 1000,
              paddingLeft: 20,
              background: "#fae3c6"
            }}
          >
            <p>State: {machineState}</p>
          </div>
        )} */}

        <div>
        {/* -- ERROR DIALOG -- */}
        <Match
          show={START}
          state={machineState}
          // eslint-disable-next-line react/jsx-no-bind
          render={isMatch => {
            if (isMatch && error) {
              return <ErrorDialog message={error} />;
            }
            return null;
          }}
        />

        {/* -- MENU -- */}
        <Menu
          onTimeout={this.onTimeout}
          vendorConfig={data.vendorConfig}
          disabledMenuOpen={this.state.disabledMenuOpen}
          globalMachineState={machineState}
          setScanQr={this.onSetScanQr}
        />

        {/* -- PREPAY -- */}
        <Match
          state={machineState}
          show={[
            `${PREPAY_QR}.scanning`,
            `${PREPAY_QR}.scanned`,
            `${PREPAY_QR}.validating`,
          ]}
        >
          <Prepay
            scanQr={this.onScanQr}
            onTimeout={this.onTimeout}
            machine={machine}
            inactivityTimeout={vendorConfig.screen_saver_timeout}
          />
        </Match>

        {/* -- BEVERAGE_SELECTION -- */}
        <Match
          state={machineState}
          show={[
            `${PREPAY_QR}.valid`,
            `${BEVERAGE}.selection`,
            `${BEVERAGE}.setup`,
            `${BEVERAGE}.confirming`,
            `${POURING}.prepare`,
            `${POURING}.dispensing`,
            `${POURING}.completed`,
            `${POURING}.stop`,
          ]}
        >
          <BeverageConfig
            {...beverageConfig}
            paymentIsValid={true}
            machineState={machineState}
            beverages={beveragesTest}
            beverage={data.beverage}
            eta={data.eta}
            onBack={this.onBack}
            onComplete={this.onNext}
            onTimeout={this.onTimeout}
            onStop={this.onStop}
            paymentMethod={data.paymentMethod}
            pourMethod={data.pourMethod}
            easySelection={data.easySelection}
            disabledMenuOpen={this.state.disabledMenuOpen}
            toggleMenu={this.toggleMenu}
            inactivityTimeout={vendorConfig.screen_saver_timeout}
          />
        </Match>
        </div>
      </div>
    );
  }
}
export default App;


const typesTest = ["NAT", "GAS", "AMB"];
const flavorsTest = ["", "F1", "F2", "F3", "F4", "F5", "F6"];
let beveragesTest = []; // data.availableBeverages
let indexBeverage = 0;

typesTest.forEach(type => {
  flavorsTest.forEach(flavor => {

    beveragesTest.push({
      "type_id": type,
      "flavor_id": flavor,
      "beverage_logo_id": 9,
      "status_id": "ok",
      "last_sanification_date": "2018-07-04",
      "bib_reload_date": "2018-07-04",
      "country": [
        "USA",
        "CSH",
        "Turkey",
        "Europe",
        "United Kingdom",
        "Italy",
        "France",
        "Greece",
        "Spain",
        "Poland",
        "Latin America",
        "Australia",
        "Belgique"
      ],
      "available": true,
      "ratio": 1,
      "second_shelf_life": 0,
      "toppings": [
        {
          "enable": true,
          "topping_percs": {
            "type": "single",
            "values": [
              0
            ]
          },
          "topping_id": 0
        }
      ],
      "enabled_beverage_size_ids": [
        1,
        2,
        3,
        4
      ],
      "beverage_id": indexBeverage,
      "remaining_bib": 0,
      "beverage_type": "plain",
      "beverage_label_id": "plain_water",
      "line_id": 9,
      "current_flow_rate": 49.28,
      "density": 0.99717,
      "calibration_status": 0,
      "carbonation_divider": 1,
      "bib_expiring_date": "2018-07-04",
      "bib_size": 20,
      "carbonation_levels": {
        "type": "single",
        "values": [
          type === "GAS" ? 100 : 0
        ]
      },
      "last_calibration_date": "2018-07-04",
      "beverage_menu_index": 9,
      "target_flow_rate": 50
    });

    indexBeverage++;

  });
});