import * as React from "react";

import { QrSquare, Webcam, PrepayContent, Header, SectionWrap, SectionContent } from "./prepay.style";
import { ConfigConsumer, ConfigInterface } from "../../store";
import { CircleBtn } from "../../components/global/CircleBtn";
import { ReplaySubscription } from "../../components/global/Subscription";
import { Subscription } from "rxjs";
import { TimerInterface } from "../../store/timer.store";
import { tap, mergeMap, first, map } from "rxjs/operators";
import { Alert, AlertTypes, AlertProps } from "../../components/global/Alert";
import { ConsumerInterface } from "../../store/consumer.store";
import { IdentificationConsumerTypes } from "../../utils/APIModel";
import { Pages } from "../../utils/constants";
import { FocusElm } from "../../store/accessibility.store";

interface PrepayProps {
  history: any;
  configConsumer: ConfigInterface;
  timerConsumer: TimerInterface;
  consumerConsumer: ConsumerInterface;
}

interface PrepayState {
  alert: AlertProps;
}

export class PrepayComponent extends React.Component<PrepayProps, PrepayState> {

  readonly state: PrepayState;

  constructor(props) {
    super(props);
    this.state = {
      alert: undefined
    };
  }

  componentDidMount() {
    this.props.timerConsumer.startTimer();
    this.start();
  }

  private goToHome = () => {
    this.props.history.push(Pages.Home);
  }

  start() {
    const { startScanning } = this.props.consumerConsumer;
    startScanning()
    .subscribe((status: true | false | null) => { // => true: correct qr / false: error qr / null: data from server <=
      this.props.timerConsumer.clearTimer();
      if (status === true) {
        this.handleAlert({
          type: AlertTypes.Success,
          timeout: true,
          onDismiss: () => {
            this.goToHome();
          }
        });
      } else if (status === false) {
        this.handleAlert({
          type: AlertTypes.Error,
          timeout: true,
          onDismiss: () => {
            this.start();
            this.handleAlert();
          }
        });
      }
    });
  }

  stop() {
    const { stopScanning } = this.props.consumerConsumer;
    stopScanning().subscribe();
  }

  componentWillUnmount() {
    this.props.timerConsumer.resetTimer();
    this.stop();
  }

  /* ==== HANDLE ==== */
  /* ======================================== */

  private handleAlert = (alert?: AlertProps) => {
    this.setState(prevState => ({
      ...prevState,
      alert: alert
    }));
  }

  /* ==== MAIN ==== */
  /* ======================================== */

  render() {
    const { alert } = this.state;
    return (
      <section data-focus={FocusElm.Controller}>
        <PrepayContent>
          <Header>
            <CircleBtn dataBtnFocus={FocusElm.Init} onClick={() => this.goToHome()} bgColor={"primary"} color={"light"} icon={"icons/cancel.svg"} />
          </Header>
          <SectionContent>
            <SectionWrap>
              <h2>{"Download the Acqua+ App to \n to Create an Account!"}</h2>
              <Webcam>
                <QrSquare><span /></QrSquare>
              </Webcam>
            </SectionWrap>
            <SectionWrap>
              <img id="banner" src={"icons/smartphone_bottle.svg"} />
              <h1>{"Present your code \n to the camera"}</h1>
              <img id="icon" src={"icons/arrow.svg"} />
            </SectionWrap>
          </SectionContent>

          {/* <InfoContent>
            <h2>{this.state.message || "---"}</h2>
            {this.state.message && <button onClick={() => this.start()}>try again</button>}
          </InfoContent> */}

          {/* <ReplaySubscription source={this.props.timerConsumer.time$}>
            {time =>
              <TimerLabel>Timer: {time ? time.s : "-"}</TimerLabel>
            }
          </ReplaySubscription> */}
          {alert && <Alert {...alert} />}
        </PrepayContent>
      </section>
    );
  }
}

export default PrepayComponent;