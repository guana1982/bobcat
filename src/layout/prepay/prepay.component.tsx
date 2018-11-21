import * as React from "react";
import i18n from "../../i18n";

import { ScreenContent, QrSquare, Webcam, InfoContent, PrepayContent, Header } from "./prepay.style";
import { ConfigConsumer, ConfigInterface } from "../../models";
import { CircleBtn } from "../../components/global/CircleBtn";
import { ReplaySubscription } from "../../components/global/Subscription";
import { Subscription } from "rxjs";
import { InactivityTimerInterface } from "../../models/InactivityTimer";
import { TimerLabel } from "../home/home.style";
import mediumLevel from "../../utils/MediumLevel";
import { tap, mergeMap, first, map } from "rxjs/operators";

interface PrepayProps {
  history: any;
  configConsumer: ConfigInterface;
  inactivityTimerConsumer: InactivityTimerInterface;
}
interface PrepayState {
  message: string;
}

export class PrepayComponent extends React.Component<PrepayProps, PrepayState> {

  readonly socket_type = "qr_found";
  wsSub_: Subscription;

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

  setMessage = (message) => this.setState(() => ({ message: message || null }));

  start() {
    this.setMessage(null);
    this.wsSub_ = this.startScanning()
    .subscribe(message => {
      this.setMessage(message);
      this.props.inactivityTimerConsumer.clearTimer();
    });
  }

  stop() {
    mediumLevel.config.stopQrCamera()
    .pipe(
      tap(() => this.wsSub_.unsubscribe())
    )
    .subscribe();
  }


  startScanning = () => {
    return mediumLevel.config.startQrCamera()
    .pipe(
      mergeMap(() => {
        const { ws } = this.props.configConsumer;
        const onmessage = ws
        .multiplex(
          () => console.info(`Start => ${this.socket_type}`),
          () => console.info(`End => ${this.socket_type}`),
          (data) => data && data.message_type === this.socket_type
        )
        .pipe(
          first(),
          map(data => data.value)
        );
        return onmessage;
      }),
      mergeMap(message => mediumLevel.config.stopQrCamera().pipe(map(() => message)))
    );
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