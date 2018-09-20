import * as React from "react";
import { get, post } from "../utils";
import { map, tap, delay } from "rxjs/operators";
import { RouterStore } from "./Router";
import i18n from "../i18n";
import mediumLevel from "../utils/MediumLevel";
import { Observable } from "rxjs/internal/Observable";
let ws: any;
declare var window: any;

export interface PaymentInterface {
  startQrCamera: () => Observable<any>;
  stopQrCamera: () => Observable<any>;
  startScanning: () => Observable<any>;
}

const PaymentContext = React.createContext<PaymentInterface | null>(null);

export const PaymentProvider = PaymentContext.Provider;
export const PaymentConsumer = PaymentContext.Consumer;

export class PaymentStore extends React.Component<any, any> {

  constructor(props) {
    super(props);
    ws = new window.WebSocket(process.env.NODE_ENV === "production" ? "ws://93.55.118.42:5901" : "ws://192.168.188.204:5901"); // ws://0.0.0.0:5901
    ws.onopen = () => {
      console.log("connected");
    };
  }

  toggleLight = () => {
    this.setState(state => ({ isLit: !state.isLit }));
  }

  startQrCamera = mediumLevel.config.startQrCamera;
  stopQrCamera = mediumLevel.config.stopQrCamera;

  startScanning = () => {
    return this.startQrCamera()
    .pipe(
      tap(() => {
        ws.onmessage = data => {
          console.log("socket message was received");
          const qrData = JSON.parse(data.data);
          if (qrData.message_type === "qr_found") {
            const qrString = qrData.value;
            alert(qrString);
            this.stopQrCamera().subscribe(() => console.log("Close Qr Camera"));
          }
        };
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