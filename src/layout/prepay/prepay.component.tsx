import * as React from "react";
import i18n from "../../i18n";

import { ScreenContent, QrSquare, Webcam, InfoContent, PrepayContent, Header } from "./prepay.style";
import { ConfigConsumer, PaymentConsumer, PaymentInterface, PaymentStore } from "../../models";
import { CircleBtn } from "../../components/global/CircleBtn";
import { ReplaySubscription } from "../../components/global/Subscription";
import { Subscription } from "rxjs";
import { InactivityTimerInterface } from "../../models/InactivityTimer";
import { TimerLabel } from "../home/home.style";

interface PrepayProps {
  paymentConsumer: PaymentInterface;
  history: any;
  inactivityTimerConsumer: InactivityTimerInterface;
}
interface PrepayState {
  message: string;
}

export class PrepayComponent extends React.Component<PrepayProps, PrepayState> {

  start_: Subscription;

  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      message: null
    };
  }

  componentDidMount() {
    this.props.inactivityTimerConsumer.startTimer();
    this.start();
  }

  start() {
    console.log("Start Scanning");
    this.start_ = this.props.paymentConsumer.startScanning()
    .subscribe(message => {
      this.setState(prevState => ({
        ...prevState,
        message: message
      }));
      if (message)
        this.stop();
    });
  }

  stop() {
    this.start_.unsubscribe();
    this.props.paymentConsumer.stopQrCamera()
    .subscribe(() => console.log("Stop Scanning"));
  }

  componentWillUnmount() {
    this.props.inactivityTimerConsumer.resetTimer();
    this.stop();
  }

  render() {
    return (
      <PrepayContent>
        <Header>
          <CircleBtn onClick={() => this.props.history.push("/home")} bgColor={"primary"} color={"light"} icon={"icons/back.svg"} />
        </Header>
        <ScreenContent>
          <h2>Place your qr-code in front of the camera</h2>
          <QrSquare />
        </ScreenContent>
        <Webcam />
        <InfoContent>
          <h2>{this.state.message || "---"}</h2>
          {this.state.message && <button onClick={() => this.start()}>try again</button>}
        </InfoContent>
        <ReplaySubscription source={this.props.inactivityTimerConsumer.time$}>
          {time =>
            <TimerLabel>Timer: {time ? time.s : "-"}</TimerLabel>
          }
        </ReplaySubscription>
      </PrepayContent>
    );
  }
}

export default PrepayComponent;