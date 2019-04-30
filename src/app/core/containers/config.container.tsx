import * as React from "react";
import { map, tap, first, mergeMap, debounceTime, switchMap } from "rxjs/operators";
import mediumLevel from "../utils/MediumLevel";
import { forkJoin, of, Observable, Subject, combineLatest, interval, timer } from "rxjs";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { setLangDict } from "../utils/lib/i18n";
import { withRouter } from "react-router-dom";
import { IBeverage, ISocket, IBeverageConfig, IAlarm } from "../models";
import { SOCKET_ALARM, SOCKET_ATTRACTOR, MESSAGE_STOP_VIDEO, MESSAGE_START_CAMERA, Pages, Beverages } from "../utils/constants";
import { VendorConfig } from "@core/models/vendor.model";
import { MTypes } from "@modules/service/components/common/Button";

const mergeById = ([t, s, l]) => {
  return t.map((p, i) => {
    return Object.assign({}, p, s.find(q => p.beverage_id === q.beverage_id), {$lock: l[p.line_id - 1]});
  })
};

export interface ConfigInterface {
  authService: boolean;
  setAuthService: (v: boolean) => void;
  setBeverages: Observable<any>;
  setVendorConfig: Observable<any>;
  vendorConfig: VendorConfig;
  menuList: any;
  ws: WebSocketSubject<ISocket>;
  socketAlarms$: Observable<any>;
  socketAttractor$: Observable<any>;
  alarms: IAlarm[];
  allBeverages: IBeverage[];
  beverages: IBeverage[];
  isPouring: boolean;
  sustainabilityData: { saved_bottle_year?: string, saved_bottle_day?: string };
  onStartPour: (beverage: IBeverage, config: IBeverageConfig) => Observable<any>;
  onStopPour: () => Observable<any>;
}

export const ConfigContext = React.createContext<ConfigInterface | null>(null);

export const ConfigProvider = ConfigContext.Provider;
export const ConfigConsumer = ConfigContext.Consumer;

class ConfigStoreComponent extends React.Component<any, any> {

  menuList: any;
  setBeverages: Observable<any>;
  setVendorConfig: Observable<any>;
  socketAttractor$: Observable<any>;
  socketAlarms$: Observable<any>;

  constructor(props) {
    super(props);

    /* ==== CONFIG SOCKET ==== */
    /* ======================================== */

    const ws = webSocket({
      url: process.env.NODE_ENV === "production" ? "ws://0.0.0.0:5901" : "ws://93.55.118.44:5901", // "ws://93.55.118.44:5901",
      deserializer: data => {
        try {
          return JSON.parse(data.data);
        } catch (error) {
          return data.data;
        }
      }
    });

    /* ==== ATTRACTOR SOCKET ==== */
    /* ======================================== */

    const socketAttractor$ = ws
    .multiplex(
      () => console.info(`Start => ${SOCKET_ATTRACTOR}`),
      () => console.info(`End => ${SOCKET_ATTRACTOR}`),
      (data) => data && data.message_type === SOCKET_ATTRACTOR
    ).pipe(map((data: any) => data.value));

    // socketAttractor$
    // .subscribe(value => {
    //   const { pathname } = this.props.location;
    //   if (pathname !== Pages.Attractor && pathname !== Pages.Home)
    //     return;

    //   let page = "";
    //   if (value === MESSAGE_STOP_VIDEO)
    //     page = Pages.Home;
    //   else if (value === MESSAGE_START_CAMERA)
    //     page = Pages.Prepay;

    //   this.props.history.push(page);
    // });

    /* ==== STATE ==== */
    /* ======================================== */

    this.state = {
      authService: false,
      vendorConfig: {},
      ws: ws,
      socketAttractor$: socketAttractor$,
      beverages: [],
      alarms: [],
      isPouring: false,
      sustainabilityData: { saved_bottle_year: "", saved_bottle_day: "" }
    };

    this.setAuthService = this.setAuthService.bind(this);

  }

  componentDidMount() {

    /* ==== TEST SOCKET ==== */
    /* ======================================== */

    const socketTest$ = this.state.ws
    .multiplex(
      () => console.info(`Start => ${"Socket test"}`),
      () => console.info(`End => ${"Socket test"}`),
      (data) => true
    );

    socketTest$.subscribe(data => console.log("SOCKET", data));

    /* ==== POLLING SUSTAINABILITY DATA ==== */
    /* ======================================== */

    const pollIntervalSustainability = 6000 * 60;
    timer(0, pollIntervalSustainability)
      .pipe(
        switchMap(() => mediumLevel.product.sustainabilityData())
      ).subscribe(data => {
        this.setState({sustainabilityData: data});
      });

    /* ==== ALARM SOCKET ==== */
    /* ======================================== */

    const setAlarms = mediumLevel.alarm.getAlarms()
    .pipe(
      map(data => data && data.elements || []),
      map((alarms: IAlarm[]) => alarms.filter(alarm => alarm.alarm_state)),
      map(alarms => {
        return alarms.map(alarm => {
          if (alarm.alarm_state) {
            if (alarm.alarm_category === "alarm_category_1") {
              alarm.$info = MTypes.INFO_DANGER;
            } else if (alarm.alarm_category === "alarm_category_2") {
              alarm.$info = MTypes.INFO_WARNING;
            }
          } else {
            alarm.$info = MTypes.INFO_SUCCESS;
          }
          return alarm;
        });
      }),
      tap((alarms: IAlarm[]) => {
        console.log("ALARMS", alarms);
        this.setState({alarms: alarms});
      })
    );

    this.socketAlarms$ = this.state.ws
    .multiplex(
      () => console.info(`Start => ${SOCKET_ALARM}`),
      () => console.info(`End => ${SOCKET_ALARM}`),
      (data) => data && data.message_type === SOCKET_ALARM
    ).pipe(debounceTime(250));

    setAlarms
    .pipe(
      mergeMap(() => this.socketAlarms$),
      mergeMap(() => setAlarms),
      mergeMap(() => this.setBeverages)
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

    /* ==== GET CONFIG ==== */
    /* ======================================== */

    this.setBeverages = combineLatest(mediumLevel.config.getBeverages(), mediumLevel.config.getBrands(), mediumLevel.line.getLockLines())
    .pipe(
      map(mergeById),
      tap(beverages => {
        console.log("BEVERAGES", beverages);

        // -- FILTER & ORDER => BEVERAGES --
        const beverages_ = beverages.filter(beverage => {
          const { beverage_type, line_id } = beverage;
          return beverage_type === Beverages.Plain || beverage_type === Beverages.Bev && line_id > 0;
        });
        beverages_.sort((a, b) => {
          if (a.beverage_type === Beverages.Plain) return -1; else if (b.beverage_type === Beverages.Plain) return 1;
          return a.line_id - b.line_id;
        });
        console.log(beverages);
        this.setState({
          allBeverages: beverages,
          beverages: beverages_
        });
      })
    );

    this.setVendorConfig = mediumLevel.config.getVendor()
    .pipe(
      tap(vendorConfig => {
        console.log("VENDOR CONFIG", vendorConfig);
        this.setState({vendorConfig: vendorConfig});
      })
    );

    forkJoin(
      this.setVendorConfig,
      this.setBeverages,
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

  /* ==== AUTH SERVICE ==== */
  /* ======================================== */

  setAuthService(status: boolean) {
    this.setState({authService: status});
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
    this.setState({isPouring: true});
    return mediumLevel.dispense.pour(recipe).pipe(first());
  }

  private onStopPour = () => {
    this.setState({isPouring: false});
    return mediumLevel.dispense.stop().pipe(first());
  }

  /* ==== MAIN ==== */
  /* ======================================== */

  render() {
    const { children } = this.props;
    return (
      <ConfigProvider
        value={{
          authService: this.state.authService,
          setAuthService: this.setAuthService,
          setBeverages: this.setBeverages,
          setVendorConfig: this.setVendorConfig,
          vendorConfig: this.state.vendorConfig,
          allBeverages: this.state.allBeverages,
          beverages: this.state.beverages,
          menuList: this.menuList,
          alarms: this.state.alarms,
          isPouring: this.state.isPouring,
          socketAlarms$: this.socketAlarms$,
          socketAttractor$: this.state.socketAttractor$,
          ws: this.state.ws,
          onStartPour: this.onStartPour,
          onStopPour: this.onStopPour,
          sustainabilityData: this.state.sustainabilityData
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