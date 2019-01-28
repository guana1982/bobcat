import * as React from "react";
import mediumLevel from "../utils/lib/mediumLevel";
import { mergeMap, first, map, tap, delay } from "rxjs/operators";
import { SOCKET_CONSUMER, Pages } from "../utils/constants";
import { IConsumerModel, IdentificationConsumerTypes, IConsumerBeverage } from "../utils/APIModel";
import { Observable, of, merge } from "rxjs";
import { withConfig } from "./config.store";
import { withRouter } from "react-router-dom";

export interface ConsumerInterface {
  isLogged: boolean;
  dataConsumer: IConsumerModel;
  consumerBeverages: IConsumerBeverage[];
  resetConsumer: () => void;
  startScanning: () => Observable<boolean>;
  stopScanning: () => Observable<any>;
}

const ConsumerContext = React.createContext<ConsumerInterface | null>(null);

export const ConsumerProvider = ConsumerContext.Provider;
export const ConsumerConsumer = ConsumerContext.Consumer;

class ConsumerStoreComponent extends React.Component<any, any> {

  constructor(props) {
    super(props);
    this.state = {
      isLogged: false,
      dataConsumer: null,
      consumerBeverages: []
    };
  }

  resetConsumer = () => {
    this.setState({
      isLogged: false,
      dataConsumer: null,
      consumerBeverages: []
    });
    this.props.history.push(Pages.Attractor);
  }

  getConsumerBeverage = (dataConsumer): IConsumerBeverage[] => {
    // [{beverage_label_id: "Favorite 1"}, {beverage_label_id: "Last Pour"}, {beverage_label_id: "Favorite 2"}];
    let consumerBeverages = [];
    if (dataConsumer && dataConsumer.favourite && dataConsumer.favourite[0]) {
      consumerBeverages = [dataConsumer.favourite[0], dataConsumer.last_pour, dataConsumer.favourite[1]];
    }
    return consumerBeverages;
  }

  /* ==== CONSUMER SOCKET ==== */
  /* ======================================== */

  getDataFromSocket = (type: SOCKET_CONSUMER): Observable<any> => {

    // if (type === SOCKET_CONSUMER.SERVER) {
    //   const testServer = {
    //     "consumer_nick": "Daniele",
    //     "identification_type": "2",
    //     "last_pour": {
    //       "flavorTitle": "Limeeee",
    //       "enhancements": [
    //         {
    //           "product": {
    //             "flavorUpc": ""
    //           }
    //         }
    //       ],
    //       "flavours": [
    //         {
    //           "product": {
    //             "flavorUpc": "3"
    //           },
    //           "flavorStrength": "3"
    //         }
    //       ],
    //       "carbLvl": "100",
    //       "coldLvl": "0"
    //     },
    //     "favourite": [
    //       {
    //         "flavorTitle": "Superlemon",
    //         "enhancements": [],
    //         "flavours": [
    //           {
    //             "product": {
    //               "flavorUpc": "2"
    //             },
    //             "flavorStrength": "3"
    //           }
    //         ],
    //         "carbLvl": "100",
    //         "coldLvl": "0"
    //       },
    //       {
    //         "flavorTitle": "Raspy",
    //         "enhancements": [
    //           {
    //             "product": {
    //               "flavorUpc": ""
    //             }
    //           }
    //         ],
    //         "flavours": [
    //           {
    //             "product": {
    //               "flavorUpc": "4"
    //             },
    //             "flavorStrength": "2"
    //           }
    //         ],
    //         "carbLvl": "50",
    //         "coldLvl": "50"
    //       },
    //       {
    //         "flavorTitle": "MyPeach",
    //         "enhancements": [
    //           {
    //             "product": {
    //               "flavorUpc": ""
    //             }
    //           }
    //         ],
    //         "flavours": [
    //           {
    //             "product": {
    //               "flavorUpc": "5"
    //             },
    //             "flavorStrength": "1"
    //           }
    //         ],
    //         "carbLvl": "0",
    //         "coldLvl": "100"
    //       }
    //     ],
    //     "saveBottles": "5",
    //     "consumer_id": "00001",
    //     "hydraGoal": "90",
    //     "currHydraLvl": "66"
    //   };
    //   return of(testServer).pipe(delay(5000));
    // }

    const { ws } = this.props.configConsumer;
    const socketConsumer$ = ws
    .multiplex(
      () => console.info(`Start => ${type}`),
      () => console.info(`End => ${type}`),
      (data) => data && data.message_type === type
    )
    .pipe(
      first(),
      map((data: any) => data.value)
    );
    return socketConsumer$;
  }

  /* ==== SCANNING ==== */
  /* ======================================== */

  startScanning = (): Observable<boolean> => {

    const loadDataFromQr: Observable<true | false> =
      mediumLevel.config.startQrCamera()
      .pipe(
        mergeMap(() => this.getDataFromSocket(SOCKET_CONSUMER.QR)),
        tap(() => this.stopScanning().subscribe()),
        map((data: IConsumerModel) => {
          console.log(data);
          const isLogged = data.identification_type !== IdentificationConsumerTypes.NoAuth;
          this.setState({
            isLogged: isLogged,
            dataConsumer: data,
            consumerBeverages: this.getConsumerBeverage(data)
          });
          return isLogged;
        }),
      );

    const loadDataFromServer: Observable<null> =
      this.getDataFromSocket(SOCKET_CONSUMER.SERVER)
      .pipe(
        map((data: IConsumerModel) => {
          this.setState({
            dataConsumer: data,
            consumerBeverages: this.getConsumerBeverage(data)
          });
          return null;
        }),
      );

    return merge(loadDataFromQr, loadDataFromServer);
  }


  stopScanning = () => mediumLevel.config.stopQrCamera().pipe(first());

  /* ==== MAIN ==== */
  /* ======================================== */

  render() {
    const { children } = this.props;
    const { isLogged, dataConsumer, consumerBeverages } = this.state;
    return (
      <ConsumerProvider
        value={{
          isLogged: isLogged,
          dataConsumer: dataConsumer,
          consumerBeverages: consumerBeverages,
          startScanning: this.startScanning,
          stopScanning: this.stopScanning,
          resetConsumer: this.resetConsumer
        }}
      >
        <React.Fragment>
          {children}
        </React.Fragment>
      </ConsumerProvider>
    );
  }
}

export const ConsumerStore = withConfig(withRouter(ConsumerStoreComponent));