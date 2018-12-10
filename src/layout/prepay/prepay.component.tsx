import * as React from "react";

import { ScreenContent, QrSquare, Webcam, InfoContent, PrepayContent, Header } from "./prepay.style";
import { ConfigConsumer, ConfigInterface } from "../../store";
import { CircleBtn } from "../../components/global/CircleBtn";
import { ReplaySubscription } from "../../components/global/Subscription";
import { Subscription } from "rxjs";
import { TimerInterface } from "../../store/timer.store";
import { TimerLabel } from "../home/home.style";
import mediumLevel from "../../utils/MediumLevel";
import { tap, mergeMap, first, map } from "rxjs/operators";
import { SOCKET_QR } from "../../utils/constants";

interface PrepayProps {
  history: any;
  configConsumer: ConfigInterface;
  timerConsumer: TimerInterface;
}
interface PrepayState {
  message: string;
}

export class PrepayComponent extends React.Component<PrepayProps, PrepayState> {

  readonly state: PrepayState;

  wsSub_: Subscription;

  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      message: null
    };
  }

  componentDidMount() {
    this.props.timerConsumer.startTimer();
    this.start();
  }

  setMessage = (message) => this.setState(() => ({ message: message || null }));

  start() {
    this.setMessage(null);
    this.wsSub_ = this.startScanning()
    .subscribe(message => {
      this.setMessage(message);
      this.props.timerConsumer.clearTimer();
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
          () => console.info(`Start => ${SOCKET_QR}`),
          () => console.info(`End => ${SOCKET_QR}`),
          (data) => data && data.message_type === SOCKET_QR
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
    this.props.timerConsumer.resetTimer();
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
        {/* <ReplaySubscription source={this.props.timerConsumer.time$}>
          {time =>
            <TimerLabel>Timer: {time ? time.s : "-"}</TimerLabel>
          }
        </ReplaySubscription> */}
      </PrepayContent>
    );
  }
}

export default PrepayComponent;