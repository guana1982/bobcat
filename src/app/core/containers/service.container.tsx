import * as React from "react";
import createContainer from "constate";
import { ConfigContext } from "./config.container";
import { IBeverage } from "@core/models";
import { Beverages, SOCKET_CONNECTIVITY } from "@core/utils/constants";
import mediumLevel from "@core/utils/lib/mediumLevel";
import { flatMap, map, tap, mergeMap, finalize } from "rxjs/operators";
import { of, Observable, forkJoin, merge } from "rxjs";
import { MTypes } from "@modules/service/components/common/Button";
import { SetupTypes } from "@modules/service/components/modals/EquipmentConfiguration";
import { LoaderContext } from "./loader.container";

//  ==== AUTH ====>
export enum AuthLevels {
  Crew = "crew_menu",
  Tech = "tech_menu",
  Super = "super_menu"
}
//  <=== AUTH ====

//  ==== CONNECTIVITY ====>
export enum ConnectivityTypes {
  Eth = "eth",
  Wifi = "wifi",
  Mobile = "mobile"
}

export enum ConnectivityStatus {
  Off = "OFF", // it's off
  NotConnected = "NOT_CONNECTED", // it's on but not connected to the internet
  Inactive = "INACTIVE", // it's on and connected but is not the main one
  Active = "ACTIVE" // it's on and connected and is the main one
}
//  <=== CONNECTIVITY ====

//  ==== LINE ====>
export interface ILineSave {
  line_id: number;
  beverage_id:  number;
  beverage_menu_index: number;
}

interface ILines {
  pumps: ILine[];
  waters: ILine[];
}

export class ILine {
  line_id: number;
  $beverage: IBeverage;

  constructor({ line_id, $beverage }) {
    this.line_id = line_id;
    this.$beverage = $beverage;
  }

  getLineSave(): ILineSave {
    return {
      line_id: this.line_id,
      beverage_id: this.$beverage ? this.$beverage.beverage_id : -1,
      beverage_menu_index: -1
    };
  }
}
//  <=== LINE ====

//  ==== LIST ====>
interface IList {
  list: any[];
  valueSelected: any;
}

const operationMock = () => of({
  operation_selected: null,
  operations: [{
    operation: "PBC"
  }, {
    operation: "FOBO"
  }, {
    operation: "3PO"
  }]
});

const ListConfig = {
  video: {
    getObservable$: mediumLevel.video.getVideoList,
    setObservable$: mediumLevel.video.setVideo,
    indexValue: { list_: "video" , value_: "filename", selected_ : "video_selected" }
  },
  language : {
    getObservable$: mediumLevel.language.getLanguageList,
    setObservable$: mediumLevel.language.setLanguage,
    indexValue: { list_: "languages" , value_: "language", selected_ : "language_selected" },
  },
  country: {
    getObservable$: mediumLevel.country.getCountryList,
    setObservable$: mediumLevel.country.setCountry,
    indexValue: { list_: "countries" , value_: "country", selected_ : "country_selected" }
  },
  payment: {
    getObservable$: mediumLevel.price.getPaymentType,
    setObservable$: mediumLevel.price.setPaymentType,
    indexValue: { list_: "payment_type_list" , value_: null, selected_ : "payment_type" },
  },
  operation: {
    getObservable$: operationMock,
    setObservable$: null,
    indexValue: { list_: "operations" , value_: "operation", selected_ : "operation_selected" },
  }
};

const initList: IList = {
  list: [],
  valueSelected: null
};

const getList_ = ({ getObservable$, indexValue }): Observable<IList> => {
  return getObservable$()
  .pipe(
    map((data: any) => {
      let list = data[indexValue.list_] || [];
      const elementSelected = data[indexValue.selected_] || null;

      let valueSelected: number = null;
      list = list.map((item, index) => {
        const valueItem = indexValue.value_ ? item[indexValue.value_] : item;
        if (valueItem === elementSelected) {
          valueSelected = index;
        }
        let option = {
          value: index,
          label: valueItem
        };
        return option;
      });

      return { list, valueSelected };
    })
  );
};

const setList_ = ({ list, valueSelected, setObservable$ }): Observable<any> => {
  if (list === null || list === [])
    return;

  const element = list.find(element => element.value === valueSelected );

  if (element === null)
    return;

  const { label } = element;

  return setObservable$(label);
};
//  <=== LIST ====


/* ==== MAIN ==== */
/* ======================================== */

const ServiceContainer = createContainer(() => {

  const configConsumer = React.useContext(ConfigContext);

  React.useEffect(() => {
    console.log("ServiceContainer => INIT");
    return () => {
      console.log("ServiceContainer => END");
    };
  }, []);

  /* ==== SERVICE LIST ==== */
  /* ======================================== */

  const [videoList, setVideoList] = React.useState<IList>(initList);
  const loadVideoList = () => getList_(ListConfig.video).pipe(tap(data => setVideoList(data)));
  const updateVideoList = (valueSelected) => setList_({ ...videoList, valueSelected, ...ListConfig.video }).pipe(flatMap(() => loadVideoList()));

  const [languageList, setLanguageList] = React.useState<IList>(initList);
  const loadLanguageList = () => getList_(ListConfig.language).pipe(tap(data => setLanguageList(data)));
  const updateLanguageList = (valueSelected) => setList_({ ...languageList, valueSelected, ...ListConfig.language }).pipe(flatMap(() => loadLanguageList()));

  const [countryList, setCountryList] = React.useState<IList>(initList);
  const loadCountryList = () => getList_(ListConfig.country).pipe(tap(data => setCountryList(data)));
  const updateCountryList = (valueSelected) =>  setList_({ ...countryList, valueSelected, ...ListConfig.country }).pipe(flatMap(() => loadCountryList()));

  const [paymentList, setPaymentList] = React.useState<IList>(initList);
  const loadPaymentList = () => getList_(ListConfig.payment).pipe(tap(data => setPaymentList(data)));
  const updatePaymentList = (valueSelected) => setList_({ ...paymentList, valueSelected, ...ListConfig.payment }).pipe(flatMap(() => loadPaymentList()));

  const [operationList, setOperationList] = React.useState<IList>(initList);
  const loadOperationList = () => getList_(ListConfig.operation).pipe(tap(data => setOperationList(data)));
  const updateOperationList = (valueSelected) =>  setList_({ ...operationList, valueSelected, ...ListConfig.operation }).pipe(flatMap(() => loadOperationList()));

  React.useEffect(() => {
    forkJoin(
      loadVideoList(),
      loadLanguageList(),
      loadCountryList(),
      loadPaymentList(),
      loadOperationList()
    )
    .subscribe(data => console.log("dataList", data));
  }, []);

  const allList = {
    video: { ...videoList, update: (v) => updateVideoList(v).subscribe() },
    language: { ...languageList, update: (v) => updateLanguageList(v).subscribe() },
    country: { ...countryList, update: (v) => updateCountryList(v).subscribe() },
    payment: { ...paymentList, update: (v) => updatePaymentList(v).subscribe() },
    operation: { ...operationList, update: (v) => updateOperationList(v).subscribe() }
  };

  /* ==== GENERAL ==== */
  /* ======================================== */

  const loaderConsumer = React.useContext(LoaderContext);

  const reboot = () => {
    mediumLevel.menu.reboot()
    .subscribe();
  };

  /* ==== ALARMS ==== */
  /* ======================================== */

  const { alarms } = configConsumer;
  const [statusAlarms, setStatusAlarms] = React.useState<MTypes>(null);

  React.useEffect(() => {
    setStatusAlarms(null);
  }, [alarms]);

  /* ==== CONNECTIVITY ==== */
  /* ======================================== */

  const [connectivity, setConnectivity] = React.useState<any>(null);
  const [statusConnectivity, setStatusConnectivity] = React.useState<MTypes>(null);

  React.useEffect(() => {
    setStatusConnectivity(null);
  }, [connectivity]);

  const loadConnectivity =
    forkJoin(
      mediumLevel.connectivity.connectivityInfo(),
      mediumLevel.connectivity.getApn(),
      mediumLevel.connectivity.signalStrength()
    )
    .pipe(
      map(data => {
        const listConnectivity = data[0];
        const { apn } = data[1];
        const signalStrength = data[2].signal_strength;

        const list =
        [ConnectivityTypes.Mobile, ConnectivityTypes.Wifi, ConnectivityTypes.Eth] // Object.keys(listConnectivity)
        .map((key, i) => {
          const elmConnectivity_ = { $index: key, info: null, ...listConnectivity[key] };

          if (listConnectivity[key].status === ConnectivityStatus.Active || listConnectivity[key].status === ConnectivityStatus.Inactive) {
           elmConnectivity_.info = MTypes.INFO_SUCCESS;
          } else if (listConnectivity[key].status === ConnectivityStatus.NotConnected) {
           elmConnectivity_.info = MTypes.INFO_WARNING;
          }

          return elmConnectivity_ ;
        });

        return { list, apn, signalStrength };
      }),
      tap((data) => {
        setConnectivity(data);
      })
    );

  React.useEffect(() => {
    const socketConnectivity$ = configConsumer.ws
    .multiplex(
      () => console.info(`Start => ${SOCKET_CONNECTIVITY}`),
      () => console.info(`End => ${SOCKET_CONNECTIVITY}`),
      (data) => data && data.message_type === SOCKET_CONNECTIVITY
    );

    const socketConnectivity_ = loadConnectivity
    .pipe(
      mergeMap(() => socketConnectivity$),
      mergeMap(() => loadConnectivity)
    )
    .subscribe();

    return () => {
      socketConnectivity_.unsubscribe();
    };
  }, []);

  React.useEffect(() => {
    console.log("connectivity =>", connectivity);
  }, [connectivity]);

  const enableConnection = (type: ConnectivityTypes) => {
    let call_ = null;
    loaderConsumer.show();
    if (type === ConnectivityTypes.Mobile) {
      call_ = mediumLevel.connectivity.enableMobileData();
    } else if (type === ConnectivityTypes.Wifi) {
      call_ = mediumLevel.wifi.enable()
      .pipe(
        flatMap(() => loadConnectivity)
      );
    }
    if (call_) {
      call_
      .pipe(
        finalize(() => loaderConsumer.hide())
      )
      .subscribe();
    }
  };

  const disableConnection = (type: ConnectivityTypes) => {
    let call_ = null;
    loaderConsumer.show();
    if (type === ConnectivityTypes.Mobile) {
      call_ = mediumLevel.connectivity.disableMobileData();
    } else if (type === ConnectivityTypes.Wifi) {
      call_ = mediumLevel.wifi.disable();
    }
    if (call_) {
      call_
      .pipe(
        finalize(() => loaderConsumer.hide())
      )
      .subscribe();
    }
  };

  /* ==== AUTH ==== */
  /* ======================================== */

  const [authLevel, setAuthLevel] = React.useState<AuthLevels>(null);

  function authLogin(pincode: string) {
    return mediumLevel.menu.authentication(pincode)
    .pipe(
      map(data => {
        if (data.error) {
          throw data.error;
        }
        const authLevel: AuthLevels = data.menu_id;
        return authLevel;
      }),
      tap(authLevel => {
        setAuthLevel(authLevel);
      })
    );
  }

  /* ==== BEVERAGES / LINES ==== */
  /* ======================================== */

  const [lines, setLines] = React.useState<ILines>({
    pumps: [],
    waters: []
  });
  const [syrups, setSyrups] = React.useState<IBeverage[]>([]);

  const { allBeverages, vendorConfig } = configConsumer;
  React.useEffect(() => {
    if (allBeverages && vendorConfig) {
      let pumps = [], waters = [];

      console.log("allBeverages", allBeverages);

      const pumpsNumber = 6; // vendorConfig.installed_pumps_number
      for (let index = 0; index < pumpsNumber; index++) {
        const idLine = index + 1;
        const beverage_ = allBeverages.filter(beverage => beverage.line_id === idLine)[0];
        const line = new ILine({
          line_id: idLine,
          $beverage: beverage_
        });
        pumps.push(line);
      }

      waters = allBeverages
      .filter(beverage => {
        const { beverage_type } = beverage;
        return beverage_type === Beverages.Plain || beverage_type === Beverages.Soda || beverage_type === Beverages.Amb;
      })
      .map(beverage => {
        const line = new ILine({
          line_id: beverage.line_id,
          $beverage: beverage
        });
        return line;
      })
      .sort((a, b) => a.line_id - b.line_id);

      const lines_: ILines = { pumps, waters };
      console.log("setLines", lines_);
      setLines(lines_);

      let syrups_: IBeverage[] = [];
      const notUsed: IBeverage = {
        line_id: null,
        beverage_id: -1,
        beverage_menu_index: -1,
        beverage_type: null,
        beverage_label_id: "not_used"
      };
      const beveragesNotAssigned = allBeverages.filter(beverage => beverage.line_id === -1);
      syrups_ = [notUsed, ...beveragesNotAssigned];
      console.log("setSyrups", syrups_);
      setSyrups(syrups_);
    }
    return () => {

    };
  }, [allBeverages, vendorConfig]);

  function saveLines(editLine: ILineSave) {
    if (!editLine)
      return;

    const { pumps } = lines;

    const linesSave = pumps.map(pump => pump.line_id === editLine.line_id ? editLine : pump.getLineSave());

    return mediumLevel.config.saveLinesConfig(linesSave)
    .pipe(
      flatMap(() => configConsumer.setBeverages)
    );
  }

  function bibReset(payload) {
    mediumLevel.line.bibReset(payload)
    .pipe(
      flatMap(() => configConsumer.setBeverages)
    )
    .subscribe();
  }

  const lockLine = (line_id) => {
    return mediumLevel.line.setLockLine(line_id)
    .pipe(
      flatMap(() => configConsumer.setBeverages)
    );
  };

  const unlockLine = (line_id) => {
    return mediumLevel.line.setUnlockLine(line_id)
    .pipe(
      flatMap(() => configConsumer.setBeverages)
    );
  };

  /* ==== EQUIPMENT CONFIGURATION ==== */
  /* ======================================== */

  const [firstActivation, setFirstActivation] = React.useState(null);

  React.useEffect(() => {
    mediumLevel.equipmentConfiguration.getFirstActivation()
    .pipe(
      map(data => {
        const data_ = Object.keys(data).map((key) => {
          return {...data[key], ...{$index: key}};
        });

        const form_ = {};
        Object.keys(data).map((key) => form_[key] = "");

        const structure_ = [
          {
            title: "INFO",
            fields: data_.splice(0, 6)
          }, {
            title: "CUSTOMER",
            fields: data_.splice(0, 6)
          }, {
            title: "EQUIPMENT",
            fields: data_.splice(0, 6)
          }
        ];

        return { form_, structure_ };
      })
    )
    .subscribe(
      data => {
        console.log("firstActivation", data);
        setFirstActivation(data);
      }
    );
  }, []);

  function endInizialization(form) {
    mediumLevel.equipmentConfiguration.setFirstActivation(form)
    .subscribe(
      data => {
        if (data.error === false) {
          window.location.reload();
          return;
        }
        // => ERROR
        alert(data.error);
      }
    );
  }

  function endReplacement(setup: SetupTypes, serialNumber: string) {
    let callReplacement_ = null;
    if (setup === SetupTypes.MotherboardReplacement) {
      callReplacement_ = mediumLevel.equipmentConfiguration.motherboardSubstitution;
    } else if (setup === SetupTypes.EquipmentReplacement) {
      callReplacement_ = mediumLevel.equipmentConfiguration.equipmentSubstitution;
    }

    callReplacement_(serialNumber)
    .subscribe(
      data => {
        if (data.error === false) {
          window.location.reload();
          return;
        }
        // => ERROR
        alert(data.error);
      }
    );
  }

  return {
    authLevel,
    setAuthLevel,
    authLogin,
    lines,
    syrups,
    saveLines,
    reboot,
    bibReset,
    lockLine, 
    unlockLine,
    allList,
    connectivity,
    enableConnection,
    disableConnection,
    statusAlarms,
    statusConnectivity,
    firstActivation,
    endInizialization,
    endReplacement
  };
});

export const ServiceProvider = ServiceContainer.Provider;
export const ServiceContext = ServiceContainer.Context;