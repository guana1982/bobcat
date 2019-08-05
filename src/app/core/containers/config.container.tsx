import * as React from "react";
import { map, tap, first, mergeMap, debounceTime, switchMap } from "rxjs/operators";
import mediumLevel from "../utils/MediumLevel";
import { forkJoin, of, Observable, Subject, combineLatest, interval, timer, BehaviorSubject, merge } from "rxjs";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { setLangDict } from "../utils/lib/i18n";
import { withRouter } from "react-router-dom";
import { IBeverage, ISocket, IBeverageConfig, IAlarm } from "../models";
import { SOCKET_ALARM, SOCKET_ATTRACTOR, MESSAGE_STOP_VIDEO, MESSAGE_START_CAMERA, Pages, Beverages, CONSUMER_ALARM, SOCKET_UPDATE, SOCKET_STOP_EROGATION, MESSAGE_STOP_EROGATION, SOCKET_SUSTAINABILITY } from "../utils/constants";
import { VendorConfig } from "@core/models/vendor.model";
import { MTypes } from "@modules/service/components/common/Button";
import { IStatusAlarms } from "@core/utils/APIModel";

const mergeById = ([bevs, brands, locks, prices]) => {
  return bevs.map((bev, i) => {
    const brand_ = brands.find(b => bev.beverage_id === b.beverage_id);
    const lock_ = {$lock: locks[bev.line_id - 1]};
    const price_ = prices.products.filter(p => (Number(bev.beverage_id) === Number(p.upc))).map(p => { return { $price: Number(p.price) }; })[0] || { $price: 0 };
    return Object.assign({}, bev, brand_, lock_, price_);
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
  socketStopErogation$: Subject<MESSAGE_STOP_EROGATION>;
  allAlarms: IAlarm[];
  statusAlarms: IStatusAlarms;
  alarms: IAlarm[];
  allBeverages: IBeverage[];
  beverages: {
    still: IBeverage[],
    sparkling: IBeverage[]
  };
  isPouring: boolean;
  socketSustainability$: BehaviorSubject<{ saved_bottle_year: string, saved_bottle_day: string }>;
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
  socketStopErogation$ = new Subject<MESSAGE_STOP_EROGATION>();
  socketUpdate$ = new BehaviorSubject<any>({});
  socketSustainability$ = new BehaviorSubject({ saved_bottle_year: "", saved_bottle_day: "" });
  isPouring: boolean = false;

  constructor(props) {
    super(props);

    /* ==== CONFIG SOCKET ==== */
    /* ======================================== */

    const ws = webSocket({
      url: process.env.NODE_ENV === "production" ? "ws://0.0.0.0:5901" : "ws://192.168.1.6:5901", // "ws://93.55.118.44:5901",
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
      allBeverages: [],
      beverages: {
        still: [],
        sparkling: []
      },
      allAlarms: [],
      statusAlarms: {
        alarmSuper_: false,
        alarmSparkling_: false,
        alarmConnectivity_: false,
        alarmWebcam_: false,
        alarmADAPanel_: false,
        alarmPayment_: false
      },
      alarms: [],
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

    /* ==== SUSTAINABILITY DATA SOCKET ==== */
    /* ======================================== */

    const socketSustainability$ = this.state.ws
    .multiplex(
      () => console.info(`Start => ${SOCKET_SUSTAINABILITY}`),
      () => console.info(`End => ${SOCKET_SUSTAINABILITY}`),
      (data) => data && data.message_type === SOCKET_SUSTAINABILITY
    )
    .pipe(
      map((data: any) => data.value)
    );

    merge(
      mediumLevel.product.sustainabilityData(),
      socketSustainability$
    )
    .subscribe(data => {
      this.socketSustainability$.next(data);
    });

    /* ==== UPDATE SOCKET ==== */
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

    /* ==== STOP EROGATION SOCKET ==== */
    /* ======================================== */

    this.socketStopErogation$ = this.state.ws
    .multiplex(
      () => console.info(`Start => ${SOCKET_STOP_EROGATION}`),
      () => console.info(`End => ${SOCKET_STOP_EROGATION}`),
      (data) => data && data.message_type === SOCKET_STOP_EROGATION
    )
    .pipe(
      map((data: any) => data.value)
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
          alarmConnectivity_: false, // Boolean(enabledAlarms_.find(alarm => alarm.alarm_name === "mqtt" && alarm.alarm_enable === true)),
          alarmWebcam_: Boolean(enabledAlarms_.find(alarm => alarm.alarm_name === "webcam" && alarm.alarm_enable === true)),
          alarmADAPanel_: Boolean(enabledAlarms_.find(alarm => alarm.alarm_name === "ada_panel" && alarm.alarm_enable === true)),
          alarmPayment_: Boolean(enabledAlarms_.find(alarm => alarm.alarm_name === "payment" && alarm.alarm_enable === true)),
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
    this.setBeverages = combineLatest(mediumLevel.config.getBeverages(), mediumLevel.config.getBrands(), mediumLevel.line.getLockLines(), mediumLevel.payment.getPrices())
    .pipe(
      map(mergeById),
      tap(allBeverages => {

        // -- FILTER & ORDER => BEVERAGES --
        const plain_ =  allBeverages.filter(beverage => beverage.beverage_type === Beverages.Plain)[0];
        const soda_ = allBeverages.filter(beverage => beverage.beverage_type === Beverages.Soda)[0];
        const beverages_ = allBeverages.filter(beverage => {
          const { beverage_type, line_id } = beverage;
          return beverage_type === Beverages.Bev && line_id > 0;
        });

        const beveragesObj = {
          still: [plain_, ...beverages_],
          sparkling: [soda_, ...beverages_]
        };

        this.setState({ allBeverages: allBeverages, beverages: beveragesObj });
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
      tap(() => this.isPouring = true)
    );
  }

  private onStopPour = () => {
    return mediumLevel.dispense.stop()
    .pipe(
      first(),
      tap(() => this.isPouring = false)
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
          menuList: this.menuList,
          allAlarms: this.state.allAlarms,
          beverages: this.state.beverages,
          statusAlarms: this.state.statusAlarms,
          alarms: this.state.alarms,
          isPouring: this.isPouring,
          socketAlarms$: this.socketAlarms$,
          socketAttractor$: this.socketAttractor$,
          socketUpdate$: this.socketUpdate$,
          socketStopErogation$: this.socketStopErogation$,
          ws: this.state.ws,
          onStartPour: this.onStartPour,
          onStopPour: this.onStopPour,
          socketSustainability$: this.socketSustainability$
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