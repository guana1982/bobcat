import * as React from "react";
import i18n from "../../i18n";

import { ScreenContent, QrSquare, Webcam, InfoContent } from "./prepay.style";
import { ConfigConsumer, PaymentConsumer, PaymentInterface, PaymentStore } from "../../models";

interface PrepayProps {
  paymentConsumer: PaymentInterface;
  history: any;
}
interface PrepayState {}

export class PrepayComponent extends React.Component<PrepayProps, PrepayState> {

  constructor(props) {
    super(props);
    console.log(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.paymentConsumer.startScanning()
    .subscribe(() => console.log("Start Scanning"));
  }

  componentWillUnmount() {
    this.props.paymentConsumer.stopQrCamera()
    .subscribe(() => console.log("Stop Scanning"));
  }

  render() {
    return (
      <div>
        <div>
          <button onClick={() => this.props.history.push("/home")}>HOME</button>
        </div>
        <ScreenContent>
          <h2>Place your qr-code in front of the camera</h2>
          <QrSquare />
        </ScreenContent>
        <Webcam />
        <InfoContent>
          <h2>{"---"}</h2> { /* machine.data.qr || onClick={onRetry} */ }
          <button>try again</button>
        </InfoContent>
      </div>
    );
  }
}

export default PrepayComponent;