import * as React from "react";
import { get, post } from "../utils";
import { map, tap, delay, flatMap } from "rxjs/operators";
import i18n from "../i18n";
import mediumLevel from "../utils/MediumLevel";
import { Observable } from "rxjs/internal/Observable";
import { IBeverageConfig } from "./Config";
import { Subject, of } from "rxjs";
// let ws: any;
declare var window: any;

export interface PaymentInterface {
  startQrCamera: () => Observable<any>;
  stopQrCamera: () => Observable<any>;
  startScanning: () => Observable<any>;
}

interface PaymentProps {
  configConsumer: IBeverageConfig;
}

const PaymentContext = React.createContext<PaymentInterface | null>(null);

export const PaymentProvider = PaymentContext.Provider;
export const PaymentConsumer = PaymentContext.Consumer;

export class PaymentStore extends React.Component<any> {

  constructor(props) {
    super(props);
  }

  startQrCamera = mediumLevel.config.startQrCamera;
  stopQrCamera = mediumLevel.config.stopQrCamera;

  startScanning = () => {
    return this.startQrCamera()
    .pipe(
      flatMap(() => {
        const ws = this.props.configConsumer.ws;
        const onmessage: Observable<any> = Observable.create((observer) => {
          observer.next(null);
          ws.onmessage = data => {
            console.log("socket message was received");
            const qrData = JSON.parse(data.data);
            if (qrData.message_type === "qr_found") {
              const qrString = qrData.value;
              observer.next(qrString);
            }
          };
        });
        return onmessage;
      })
    );
  }

  render() {
    const { children } = this.props;
    return (
      <PaymentProvider
        value={{
          startQrCamera: this.startQrCamera,
          stopQrCamera: this.stopQrCamera,
          startScanning: this.startScanning
        }}
      >
        {children}
      </PaymentProvider>
    );
  }
}