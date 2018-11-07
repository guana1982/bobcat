import * as React from "react";
import { get, post } from "../utils";
import { map, tap, delay } from "rxjs/operators";
import i18n from "../i18n";
import mediumLevel from "../utils/MediumLevel";
import { forkJoin, of, Observable } from "rxjs";
import { setLangDict } from "../utils/lib/i18n";
import { withRouter } from "react-router-dom";
declare var window: any;

export interface ConfigInterface {
  vendorConfig: any;
  onStartPour: (beverage: IBeverage, config: IBeverageConfig) => Observable<any>;
  onStopPour: () => Observable<any>;
}

export interface IBeverage {
  label: string;
  id: number;
  type?: string;
}

export interface IBeverageConfig {
  flavor_level: number;
  carbonation_level: number;
  temperature_level: number;
  b_complex?: boolean;
  antioxidants?: boolean;
}

const ConfigContext = React.createContext<ConfigInterface | null>(null);

export const ConfigProvider = ConfigContext.Provider;
export const ConfigConsumer = ConfigContext.Consumer;

class ConfigStoreComponent extends React.Component<any, any> {

  vendorConfig: any;
  ws: WebSocket;

  constructor(props) {
    super(props);

    this.state = {
      isLit: false
    };

    this.ws = new window.WebSocket(process.env.NODE_ENV === "production" ? "ws://0.0.0.0:5901" : "ws://192.168.188.204:5901"); // "ws://93.55.118.43:5901"
    this.ws.onopen = () => {
      console.log("connected");
    };

    this.ws.onmessage = data => {
      console.log("socket message was received", data);
      const messageData = JSON.parse(data.data);
      if (messageData.message_type === "attract_loop" && messageData.value === "stop_video") {
        this.props.history.push("/home");
      }
    };

    // setTimeout(() => {
    //   alert("ook");
    //   this.props.history.push("/home");
    // }, 1000);

    forkJoin(
      mediumLevel.config.getVendor(),
      mediumLevel.config.getBeverages(),
      mediumLevel.config.getSizes(),
      mediumLevel.config.getLang(),
      mediumLevel.config.startDisplay(),
    ).subscribe((res: any[]) => {
      console.log({res});
      let [
        vendorConfig,
        beverages,
        sizes,
        langDict
      ] = res;

      this.vendorConfig = vendorConfig;
      setLangDict(langDict.i18n);
    });

  }

  private onStartPour = (beverage: IBeverage, config: IBeverageConfig) => {
    const recipe = {
      beverage_size_id: null,
      carbonation_level: config.carbonation_level,
      topping_id: 0,
      topping_perc_id: 0,
      beverage_id: beverage.id,
      syrup_perc: config.flavor_level,
      temperature_level: config.temperature_level,
      pour_method: "free_flow"
    };
    return mediumLevel.dispense.pour(recipe);
  }

  private onStopPour = () => {
    return mediumLevel.dispense.stop();
  }

  toggleLight = () => {
    this.setState(state => ({ isLit: !state.isLit }));
  }

  render() {
    const { children } = this.props;
    return (
      <ConfigProvider
        value={{
          vendorConfig: this.vendorConfig,
          onStartPour: this.onStartPour,
          onStopPour: this.onStopPour
        }}
      >
        {children}
      </ConfigProvider>
    );
  }
}

export const ConfigStore = withRouter(ConfigStoreComponent);