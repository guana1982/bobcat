import * as React from "react";
import { get, post } from "../utils";
import { map, tap, delay, retry, first, flatMap, mergeMap } from "rxjs/operators";
import mediumLevel from "../utils/MediumLevel";
import { forkJoin, of, Observable, Subject } from "rxjs";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { setLangDict } from "../utils/lib/i18n";
import { withRouter } from "react-router-dom";
import { IBeverage, ISocket, IBeverageConfig, IAlarm } from "../models";
import { SOCKET_ALARM } from "../utils/constants";
declare var window: any;

export interface ConfigInterface {
  vendorConfig: any;
  ws: WebSocketSubject<ISocket>;
  alarms: IAlarm[];
  onStartPour: (beverage: IBeverage, config: IBeverageConfig) => Observable<any>;
  onStopPour: () => Observable<any>;
}

const ConfigContext = React.createContext<ConfigInterface | null>(null);

export const ConfigProvider = ConfigContext.Provider;
export const ConfigConsumer = ConfigContext.Consumer;

class ConfigStoreComponent extends React.Component<any, any> {

  vendorConfig: any;
  ws: WebSocketSubject<ISocket>;

  constructor(props) {
    super(props);

    this.state = {
      alarms: []
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

    const getAlarms = mediumLevel.alarm.getAlarms()
    .pipe(
      tap((data: any) => {
        this.setState(prevState => ({
          ...prevState,
          alarms: data && data.elements || []
        }));
      })
    );

    const socketAlarms = this.ws
    .multiplex(
      () => console.info(`Start => ${SOCKET_ALARM}`),
      () => console.info(`End => ${SOCKET_ALARM}`),
      (data) => data && data.message_type === SOCKET_ALARM
    ).pipe(map(data => data.value));

    getAlarms
    .pipe(
      mergeMap(() => socketAlarms),
      mergeMap(value => getAlarms.pipe(map(() => value)))
    )
    .subscribe(value => {
      alert(value);
    });

    setTimeout(() => {
      const half_length = Math.ceil(this.state.alarms.length / 2);
      this.setState(prevState => ({
        ...prevState,
        alarms: prevState.alarms.splice(0, half_length)
      }));
      console.log(this.state.alarms);
    }, 30000);

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
          alarms: this.state.alarms,
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