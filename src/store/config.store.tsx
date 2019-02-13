import * as React from "react";
import { get, post } from "../utils";
import { map, tap, delay, retry, first, flatMap, mergeMap, filter, debounceTime } from "rxjs/operators";
import mediumLevel from "../utils/MediumLevel";
import { forkJoin, of, Observable, Subject } from "rxjs";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { setLangDict } from "../utils/lib/i18n";
import { withRouter } from "react-router-dom";
import { IBeverage, ISocket, IBeverageConfig, IAlarm } from "../models";
import { SOCKET_ALARM, SOCKET_ATTRACTOR, MESSAGE_STOP_VIDEO, MESSAGE_START_CAMERA, Pages, Beverages } from "../utils/constants";
declare var window: any;

export interface ConfigInterface {
  vendorConfig: any;
  menuList: any;
  ws: WebSocketSubject<ISocket>;
  alarms: IAlarm[];
  beverages: IBeverage[];
  onStartPour: (beverage: IBeverage, config: IBeverageConfig) => Observable<any>;
  onStopPour: () => Observable<any>;
}

export const ConfigContext = React.createContext<ConfigInterface | null>(null);

export const ConfigProvider = ConfigContext.Provider;
export const ConfigConsumer = ConfigContext.Consumer;

class ConfigStoreComponent extends React.Component<any, any> {

  menuList: any;
  ws: WebSocketSubject<ISocket>;
  socketAlarms$: Observable<any>;

  constructor(props) {
    super(props);

    this.state = {
      vendorConfig: {},
      beverages: [],
      alarms: []
    };

  }

  componentDidMount() {

    /* ==== CONFIG SOCKET ==== */
    /* ======================================== */

    this.ws = webSocket({
      url: process.env.NODE_ENV === "production" ? "ws://0.0.0.0:5901" : "ws://192.168.188.204:5901", // "ws://93.55.118.44:5901",
      deserializer: data => {
        try {
          return JSON.parse(data.data);
        } catch (error) {
          return data.data;
        }
      }
    });

    /* ==== TEST SOCKET ==== */
    /* ======================================== */

    const socketTest$ = this.ws
    .multiplex(
      () => console.info(`Start => ${"Socket test"}`),
      () => console.info(`End => ${"Socket test"}`),
      (data) => true
    );

    socketTest$.subscribe(data => console.log("SOCKET", data));

    /* ==== ALARM SOCKET ==== */
    /* ======================================== */

    const setAlarms = mediumLevel.alarm.getAlarms()
    .pipe(
      map(data => data && data.elements || []),
      map((alarms: IAlarm[]) => alarms.filter(alarm => alarm.alarm_state)),
      tap((alarms: IAlarm[]) => {
        console.log("ALARMS", alarms);
        this.setState({alarms: alarms});
      })
    );

    this.socketAlarms$ = this.ws
    .multiplex(
      () => console.info(`Start => ${SOCKET_ALARM}`),
      () => console.info(`End => ${SOCKET_ALARM}`),
      (data) => data && data.message_type === SOCKET_ALARM
    ).pipe(debounceTime(250));

    setAlarms
    .pipe(
      mergeMap(() => this.socketAlarms$),
      mergeMap(() => setAlarms),
      mergeMap(() => setBeverages)
    )
    .subscribe();

    // setTimeout(() => {
    //   const half_length = Math.ceil(this.state.alarms.length / 2);
    //   this.setState(prevState => ({
    //     ...prevState,
    //     alarms: prevState.alarms.splice(0, half_length)
    //   }));
    //   console.log(this.state.alarms);
    // }, 30000);

    /* ==== ATTRACTOR SOCKET ==== */
    /* ======================================== */

    const socketAttractor$ = this.ws
    .multiplex(
      () => console.info(`Start => ${SOCKET_ATTRACTOR}`),
      () => console.info(`End => ${SOCKET_ATTRACTOR}`),
      (data) => data && data.message_type === SOCKET_ATTRACTOR
    ).pipe(map(data => data.value));

    socketAttractor$
    .subscribe(value => {
      const { pathname } = this.props.location;
      if (pathname !== Pages.Attractor && pathname !== Pages.Home)
        return;

      let page = "";
      if (value === MESSAGE_STOP_VIDEO)
        page = Pages.Home;
      else if (value === MESSAGE_START_CAMERA)
        page = Pages.Prepay;

      this.props.history.push(page);
    });

    /* ==== GET CONFIG ==== */
    /* ======================================== */

    const setBeverages = mediumLevel.config.getBeverages()
    .pipe(
      tap(beverages => {
        console.log("BEVERAGES", beverages);
        this.setState({beverages: beverages});
      })
    );

    const setVendorConfig = mediumLevel.config.getVendor()
    .pipe(
      tap(vendorConfig => {
        console.log("VENDOR CONFIG", vendorConfig);
        this.setState({vendorConfig: vendorConfig});
      })
    );

    forkJoin(
      setVendorConfig,
      setBeverages,
      mediumLevel.menu.getList(),
      mediumLevel.config.getSizes(),
      mediumLevel.config.getLang(),
      mediumLevel.config.startDisplay(),
    ).subscribe((res: any[]) => {
      console.log({res});
      let [
        vendorConfig,
        beverages,
        menuList,
        sizes,
        langDict
      ] = res;

      console.log(vendorConfig);

      this.menuList = menuList;

      console.log(langDict.i18n);
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
      beverage_id: beverage.beverage_id,
      syrup_intensity: config.flavor_level,
      temperature_level: config.temperature_level,
      pour_method: "free_flow"
    };
    return mediumLevel.dispense.pour(recipe)
    .pipe(
      mergeMap(() => this.socketAlarms$.pipe(first()))
    );
  }

  private onStopPour = () => {
    return mediumLevel.dispense.stop();
  }

  /* ==== MAIN ==== */
  /* ======================================== */

  render() {
    const { children } = this.props;

    // -- FILTER BEVERAGES --
    const beverages = this.state.beverages.filter(beverage => {
      const { beverage_type, line_id } = beverage;
      return beverage_type === Beverages.Plain || beverage_type === Beverages.Bev && line_id > 0;
    });

    return (
      <ConfigProvider
        value={{
          vendorConfig: this.state.vendorConfig,
          beverages: beverages,
          menuList: this.menuList,
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

export const withConfig = Comp => props => (
  <ConfigConsumer>
    {config => <Comp {...props} configConsumer={config}></Comp> }
  </ConfigConsumer>
);


export const ConfigStore = withRouter(ConfigStoreComponent);