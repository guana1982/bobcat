import * as React from "react";
import mediumLevel from "../utils/lib/mediumLevel";
import { mergeMap, first, map, tap } from "rxjs/operators";
import { SOCKET_CONSUMER, Pages } from "../utils/constants";
import { IConsumerModel, IdentificationConsumerTypes, IConsumerBeverage } from "../utils/APIModel";
import { Observable } from "rxjs";
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

  /* ==== CONSUMER SOCKET ==== */
  /* ======================================== */

  getDataFromSocket = (type: SOCKET_CONSUMER) => {
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

    const getConsumerBeverage = (dataConsumer): IConsumerBeverage[] => {
      // [{beverage_label_id: "Favorite 1"}, {beverage_label_id: "Last Pour"}, {beverage_label_id: "Favorite 2"}];
      let consumerBeverages = [];
      if (dataConsumer && dataConsumer.favourite && dataConsumer.favourite[0]) {
        consumerBeverages = [dataConsumer.favourite[0], dataConsumer.last_pour, dataConsumer.favourite[1]];
      }
      return consumerBeverages;
    };

    return mediumLevel.config.startQrCamera()
    .pipe(
      mergeMap(() => this.getDataFromSocket(SOCKET_CONSUMER.QR)),
      tap(() => this.stopScanning().subscribe()),
      map((data: IConsumerModel) => {
        console.log(data);
        const isLogged = data.identification_type !== IdentificationConsumerTypes.NoAuth;
        this.setState({
          isLogged: isLogged,
          dataConsumer: data,
          consumerBeverages: getConsumerBeverage(data)
        });
        return isLogged;
      })
    );

  }

  stopScanning = () => {
    return mediumLevel.config.stopQrCamera();
  }

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
          resetConsumer: this.resetConsumer,
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