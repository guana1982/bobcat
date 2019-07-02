import * as React from "react";
import { map, tap, first, mergeMap, debounceTime, switchMap } from "rxjs/operators";
import mediumLevel from "../utils/MediumLevel";
import { forkJoin, of, Observable, Subject, combineLatest, interval, timer, BehaviorSubject } from "rxjs";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { setLangDict } from "../utils/lib/i18n";
import { withRouter } from "react-router-dom";
import { IBeverage, ISocket, IBeverageConfig, IAlarm } from "../models";
import { SOCKET_ALARM, SOCKET_ATTRACTOR, MESSAGE_STOP_VIDEO, MESSAGE_START_CAMERA, Pages, Beverages, CONSUMER_ALARM, SOCKET_UPDATE } from "../utils/constants";
import { VendorConfig } from "@core/models/vendor.model";
import { MTypes } from "@modules/service/components/common/Button";
import { Alarms_ } from "@core/utils/APIMock";
import { IStatusAlarms } from "@core/utils/APIModel";

const mergeById = ([t, s, l]) => {
  return t.map((p, i) => {
    return Object.assign({}, p, s.find(q => p.beverage_id === q.beverage_id), {$lock: l[p.line_id - 1]});
  });
};

export interface ConfigInterface {
  authService: boolean;
  setAuthService: (v: boolean) => void;
  setBeverages: Observable<any>;
  setVendorConfig: Observable<any>;
  vendorConfig: VendorConfig;
  menuList: any;
  ws: WebSocketSubject<ISocket>;
  socketAlarms$: Subject<any>;
  socketAttractor$: Subject<any>;
  socketUpdate$: Subject<any>;
  allAlarms: IAlarm[];
  statusAlarms: IStatusAlarms;
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
  socketAlarms$ = new Subject<any>();
  socketAttractor$ = new Subject<any>();
  socketUpdate$ = new BehaviorSubject<any>({});

  constructor(props) {
    super(props);

    /* ==== CONFIG SOCKET ==== */
    /* ======================================== */

    const ws = webSocket({
      url: process.env.NODE_ENV === "production" ? "ws://0.0.0.0:5901" : "ws://93.55.118.44:5901" /* "ws://192.168.188.84:5901" */,
      deserializer: data => {
        try {
          return JSON.parse(data.data);
        } catch (error) {
          return data.data;
        }
      }
    });

    /* ==== STATE ==== */
    /* ======================================== */

    this.state = {
      authService: false,
      vendorConfig: {},
      ws: ws,
      beverages: [],
      allAlarms: [],
      statusAlarms: {
        alarmSuper_: false,
        alarmSparkling_: false,
        alarmConnectivity_: false,
        alarmWebcam_: false,
        alarmADAPanel_: false
      },
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

    const pollIntervalSustainability = 6000 * 60 * 10;
    timer(0, pollIntervalSustainability)
    .pipe(
      switchMap(() => mediumLevel.product.sustainabilityData())
    )
    .subscribe(data => {
      this.setState({sustainabilityData: data});
    });

    /* ==== ATTRACTOR SOCKET ==== */
    /* ======================================== */

    const socketUpdate$ = this.state.ws
    .multiplex(
      () => console.info(`Start => ${SOCKET_UPDATE}`),
      () => console.info(`End => ${SOCKET_UPDATE}`),
      (data) => data && data.message_type === SOCKET_UPDATE
    )
    .pipe(
      map((data: any) => data.value)
    );

    socketUpdate$
    .pipe(
      tap(value => this.socketUpdate$.next(value))
    )
    .subscribe(
      value => {
        if (value.percentage === 0) {
          this.props.history.push(Pages.Update);
        }
      }
    );

    /* ==== ATTRACTOR SOCKET ==== */
    /* ======================================== */

    const socketAttractor$ = this.state.ws
    .multiplex(
      () => console.info(`Start => ${SOCKET_ATTRACTOR}`),
      () => console.info(`End => ${SOCKET_ATTRACTOR}`),
      (data) => data && data.message_type === SOCKET_ATTRACTOR
    )
    .pipe(
      map((data: any) => data.value)
    );

    socketAttractor$
    .pipe(
      tap(value => this.socketAttractor$.next(value))
    )
    .subscribe();

    /* ==== ALARM SOCKET ==== */
    /* ======================================== */

    const socketAlarms$ = this.state.ws
    .multiplex(
      () => console.info(`Start => ${SOCKET_ALARM}`),
      () => console.info(`End => ${SOCKET_ALARM}`),
      (data) => data && (data.message_type === SOCKET_ALARM || data.message_type === CONSUMER_ALARM)
    )
    .pipe(debounceTime(250));

    const setAlarms = mediumLevel.alarm.getAlarms() // of(Alarms_)
    .pipe(
      map(data => data && data.elements || []),
      map(alarms => {
        return alarms.map(alarm => {
          if (alarm.alarm_state) {
            if (alarm.alarm_category === "alert" || alarm.alarm_category === "super_alert") {
              alarm.$info = MTypes.INFO_DANGER;
            } else if (alarm.alarm_category === "warning") {
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
        const enabledAlarms_ = alarms.filter(alarm => alarm.alarm_state);
        const statusAlarms_: IStatusAlarms = {
          alarmSuper_: Boolean(enabledAlarms_.find(alarm => alarm.alarm_category === "super_alert" && alarm.alarm_enable === true)),
          alarmSparkling_: Boolean(enabledAlarms_.find(alarm => alarm.alarm_name === "press_co2" && alarm.alarm_enable === true)),
          alarmConnectivity_: Boolean(enabledAlarms_.find(alarm => alarm.alarm_name === "mqtt" && alarm.alarm_enable === true)),
          alarmWebcam_: Boolean(enabledAlarms_.find(alarm => alarm.alarm_name === "webcam" && alarm.alarm_enable === true)),
          alarmADAPanel_: Boolean(enabledAlarms_.find(alarm => alarm.alarm_name === "ada_panel" && alarm.alarm_enable === true)),
        };
        this.setState({
          allAlarms: alarms,
          alarms: enabledAlarms_,
          statusAlarms: statusAlarms_
        });
      })
    );

    setAlarms
    .pipe(
      mergeMap(() => socketAlarms$),
      tap(value => this.socketAlarms$.next(value)),
      mergeMap(() => setAlarms),
      mergeMap(() => this.setBeverages)
    )
    .subscribe();

    /* ==== GET CONFIG ==== */
    /* ======================================== */

    this.setBeverages = combineLatest(mediumLevel.config.getBeverages(), mediumLevel.config.getBrands(), mediumLevel.line.getLockLines())
    .pipe(
      map(mergeById),
      tap(beverages => {
        // -- FILTER & ORDER => BEVERAGES --
        const beverages_ = beverages.filter(beverage => {
          const { beverage_type, line_id, $lock } = beverage;
          return beverage_type === Beverages.Plain || beverage_type === Beverages.Bev && line_id > 0 && !$lock;
        });
        beverages_.sort((a, b) => {
          if (a.beverage_type === Beverages.Plain) return -1; else if (b.beverage_type === Beverages.Plain) return 1;
          return a.line_id - b.line_id;
        });
        console.log("BEVERAGES_", beverages);
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
      mediumLevel.config.getLang(),
      mediumLevel.config.startDisplay(),
    ).subscribe((res: any[]) => {

      let [
        vendorConfig,
        beverages,
        langDict
      ] = res;

      const otherValuesLang = {};
      setLangDict({
        ...langDict.i18n,
        ...otherValuesLang
      });
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
    return mediumLevel.dispense.pour(recipe)
    .pipe(
      first(),
      tap(() => this.setState({isPouring: true}))
    );
  }

  private onStopPour = () => {
    return mediumLevel.dispense.stop()
    .pipe(
      first(),
      tap(() => this.setState({isPouring: false}))
    );
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
          allAlarms: this.state.allAlarms,
          statusAlarms: this.state.statusAlarms,
          alarms: this.state.alarms,
          isPouring: this.state.isPouring,
          socketAlarms$: this.socketAlarms$,
          socketAttractor$: this.socketAttractor$,
          socketUpdate$: this.socketUpdate$,
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