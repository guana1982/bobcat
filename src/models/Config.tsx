import * as React from "react";
import { get, post } from "../utils";
import { map, tap, delay, retry, first, flatMap } from "rxjs/operators";
import i18n from "../i18n";
import mediumLevel from "../utils/MediumLevel";
import { forkJoin, of, Observable, Subject } from "rxjs";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { setLangDict } from "../utils/lib/i18n";
import { withRouter } from "react-router-dom";
declare var window: any;

export interface ConfigInterface {
  vendorConfig: any;
  ws: WebSocketSubject<ISocket>;
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

export interface ISocket {
  message_type: string;
  name?: string;
  value: any;
}

const ConfigContext = React.createContext<ConfigInterface | null>(null);

export const ConfigProvider = ConfigContext.Provider;
export const ConfigConsumer = ConfigContext.Consumer;

class ConfigStoreComponent extends React.Component<any, any> {

  readonly socket_alarm = "alarm_changed";
  vendorConfig: any;
  ws: WebSocketSubject<ISocket>;

  constructor(props) {
    super(props);

    this.state = {
      isLit: false
    };

    /* ==== CONFIG SOCKET ==== */
    /* ======================================== */

    this.ws = webSocket({
      url: process.env.NODE_ENV === "production" ? "ws://0.0.0.0:5901" : "ws://192.168.188.204:5901", // "ws://93.55.118.44:5901"
      deserializer: data => {
        try {
          return JSON.parse(data.data);
        } catch (error) {
          return data.data;
        }
      }
    });

    /* ==== ALARM SOCKET ==== */
    /* ======================================== */

    this.ws
    .multiplex(
      () => console.info(`Start => ${this.socket_alarm}`),
      () => console.info(`End => ${this.socket_alarm}`),
      (data) => data && data.message_type === this.socket_alarm
    )
    .pipe(
      map(data => data.value)
    )
    .subscribe(value => {
      alert(value);
    });

    /* ==== GET CONFIG ==== */
    /* ======================================== */

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

  /* ==== BEVERAGE ==== */
  /* ======================================== */

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

  /* ==== MAIN ==== */
  /* ======================================== */

  render() {
    const { children } = this.props;
    return (
      <ConfigProvider
        value={{
          vendorConfig: this.vendorConfig,
          ws: this.ws,
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