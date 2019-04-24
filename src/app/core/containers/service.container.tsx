import * as React from "react";
import createContainer from "constate";
import { ConfigContext } from "./config.container";
import { IBeverage } from "@core/models";
import { Beverages, SOCKET_CONNECTIVITY } from "@core/utils/constants";
import mediumLevel from "@core/utils/lib/mediumLevel";
import { flatMap, map, tap } from "rxjs/operators";
import { of, Observable, forkJoin } from "rxjs";
import { FindValueSubscriber } from "rxjs/internal/operators/find";
import { IOption } from "@modules/service/components/common/ButtonGroup";

//  ==== LINE ====>
export interface ILineSave {
  line_id: number;
  beverage_id:  number;
  beverage_menu_index: number;
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
    value: 0,
    label: "PBC"
  }, {
    value: 1,
    label: "FOBO"
  }, {
    value: 2,
    label: "3PO"
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

export enum AuthLevels {
  Crew = "crew_menu",
  Tech = "tech_menu",
  Super = "superuser_menu"
}

interface ILines {
  pumps: ILine[];
  waters: ILine[];
}

interface ServiceState {

}

const ServiceContainer = createContainer(() => {

  const configConsumer = React.useContext(ConfigContext);

  React.useEffect(() => {
    console.log("ServiceContainer => Config ;", configConsumer);
    return () => {
      console.log("close");
    };
  }, []);

  /* ==== SERVICE LIST ==== */
  /* ======================================== */

  const [videoList, setVideoList] = React.useState<IList>(initList);
  const loadVideoList = () => getList_(ListConfig.video).pipe(tap(data => setVideoList(data)));
  const updateVideoList = (valueSelected) => setList_({ ...videoList, valueSelected, ...ListConfig.video }).pipe(flatMap(() => loadVideoList()));

  const [languageList, setLanguageList] = React.useState(initList);
  const loadLanguageList = () => getList_(ListConfig.language).pipe(tap(data => setLanguageList(data)));
  const updateLanguageList = (valueSelected) => setList_({ ...languageList, valueSelected, ...ListConfig.language }).pipe(flatMap(() => loadLanguageList()));

  const [countryList, setCountryList] = React.useState(initList);
  const loadCountryList = () => getList_(ListConfig.country).pipe(tap(data => setCountryList(data)));
  const updateCountryList = (valueSelected) =>  setList_({ ...countryList, valueSelected, ...ListConfig.country }).pipe(flatMap(() => loadCountryList()));

  const [paymentList, setPaymentList] = React.useState(initList);
  const loadPaymentList = () => getList_(ListConfig.payment).pipe(tap(data => setPaymentList(data)));
  const updatePaymentList = (valueSelected) => setList_({ ...paymentList, valueSelected, ...ListConfig.payment }).pipe(flatMap(() => loadPaymentList()));

  const [operationList, setOperationList] = React.useState(initList);
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

  /* ==== GENERAL ==== */
  /* ======================================== */

  const reboot = () => {
    mediumLevel.menu.reboot()
    .subscribe();
  };

  /* ==== CONNECTIVITY ==== */
  /* ======================================== */

  const [connectivity, setConnectivity] = React.useState<any>(null);

  React.useEffect(() => {
    const socketConnectivity$ = configConsumer.ws
    .multiplex(
      () => console.info(`Start => ${SOCKET_CONNECTIVITY}`),
      () => console.info(`End => ${SOCKET_CONNECTIVITY}`),
      (data) => data && data.message_type === SOCKET_CONNECTIVITY
    );

    const socketConnectivity_ = socketConnectivity$
    .subscribe(
      data => {
        console.log("connectivity", data);
        setConnectivity(data);
      }
    );
    return () => {
      socketConnectivity_.unsubscribe();
    };
  }, []);

  /* ==== AUTH ==== */
  /* ======================================== */

  const [authLevel, setAuthLevel] = React.useState<AuthLevels>(null);

  function authLogin(pincode: string) {
    if (pincode === "23456") { // MOCK => AUTH LEVEL SUPER
      const authLevel: AuthLevels = AuthLevels.Super;
      setAuthLevel(authLevel);
      return of(authLevel);
    }

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
    mediumLevel.line.bibReset(payload).pipe(
      flatMap(() => configConsumer.setBeverages)
    ).subscribe();
  }

  const allList = {
    video: { ...videoList, update: (v) => updateVideoList(v).subscribe() },
    language: { ...languageList, update: (v) => updateLanguageList(v).subscribe() },
    country: { ...countryList, update: (v) => updateCountryList(v).subscribe() },
    payment: { ...paymentList, update: (v) => updatePaymentList(v).subscribe() },
    operation: { ...operationList, update: (v) => updateOperationList(v).subscribe() }
  };

  return { authLevel, setAuthLevel, authLogin, lines, syrups, saveLines, reboot, bibReset, allList };
});

export const ServiceProvider = ServiceContainer.Provider;
export const ServiceContext = ServiceContainer.Context;