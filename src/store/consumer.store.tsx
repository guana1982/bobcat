import * as React from "react";
import mediumLevel from "../utils/lib/mediumLevel";
import { mergeMap, first, map, tap } from "rxjs/operators";
import { SOCKET_CONSUMER } from "../utils/constants";
import { IConsumerModel, IdentificationConsumerTypes } from "../utils/APIModel";
import { Observable } from "rxjs";
import { ConfigConsumer, withConfig } from "./config.store";

export interface ConsumerInterface {
  isLogged: boolean;
  dataConsumer: IConsumerModel;
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
      dataConsumer: null
    };
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

  startScanning = () => {
    // let response: IConsumerModel = null;
    return mediumLevel.config.startQrCamera()
    .pipe(
      mergeMap(() => this.getDataFromSocket(SOCKET_CONSUMER.QR)),
      tap(() => this.stopScanning().subscribe()),
      map((data: IConsumerModel) => {
        console.log(data);
        const isLogged = data.identification_type !== IdentificationConsumerTypes.NoAuth;
        this.setState({
          isLogged: isLogged,
          dataConsumer: data
        });
        return isLogged;
      })
    );
  }

  stopScanning = () => {
    return mediumLevel.config.stopQrCamera();
  }

  resetConsumer = () => location.reload();

  /* ==== MAIN ==== */
  /* ======================================== */

  render() {
    const { children } = this.props;
    const { isLogged, dataConsumer } = this.state;
    return (
      <ConsumerProvider
        value={{
          isLogged: isLogged,
          dataConsumer: dataConsumer,
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

export const ConsumerStore = withConfig(ConsumerStoreComponent);