import * as React from "react";
import { BehaviorSubject, Observable } from "rxjs";
import { withRouter } from "react-router-dom";
import { Pages } from "../utils/constants";
import { withConsumer } from "./consumer.container";
import { withConfig } from "./config.container";
import { AlertTypes, withAlert } from "./alert.container";

export interface TimerInterface {
  time: any;
  time$: Observable<any>;
  startTimer: () => void;
  clearTimer: () => void;
  resetTimer: () => void;
}

export const TimerContext = React.createContext<TimerInterface | null>(null);

export const TimerProvider = TimerContext.Provider;
export const TimerConsumer = TimerContext.Consumer;

class TimerStoreComponent extends React.Component<any, any> {
  timer: any;
  time: any;
  seconds: any;
  time$: BehaviorSubject<any>;

  constructor(props) {
    super(props);
    this.time$ = new BehaviorSubject<any>(null);
    this.clearTimer(false);
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);
  }

  secondsToTime(secs) {
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
      "h": hours,
      "m": minutes,
      "s": seconds
    };
    return obj;
  }

  componentDidMount() {
    let timeLeftVar = this.secondsToTime(this.seconds);
    this.time = timeLeftVar;
  }

  clearTimer(enable: boolean) {

    const { vendorConfig } = this.props.configConsumer;
    const SECONDS_TIMER = vendorConfig.screen_saver_timeout || 10;

    clearInterval(this.timer);
    this.time = {};
    this.seconds = SECONDS_TIMER;
    this.timer = 0;
    if (enable) {
      this.timer = setInterval(this.countDown, 1000);
    } else {
      this.time$.next(null);
    }
  }

  private handlerTouchStart = () => clearInterval(this.timer);
  private handlerTouchEnd = () => this.clearTimer(true);

  startTimer() {
    if (this.time$.getValue() === null)
      this.clearTimer(true);
    else
      console.info("Timer already start!");
    document.addEventListener("touchstart", this.handlerTouchStart);
    document.addEventListener("touchend", this.handlerTouchEnd);
    // document.addEventListener("mousedown", this.handlerTouchStart); // => DESKTOP MODE
    // document.addEventListener("mouseup", this.handlerTouchEnd); // => DESKTOP MODE
    document.addEventListener("keydown", this.handlerTouchStart); // => ACCESSIBILITY
    document.addEventListener("keyup", this.handlerTouchEnd); // => ACCESSIBILITY
  }

  resetTimer() {
    this.clearTimer(false);
    document.removeEventListener("touchstart", this.handlerTouchStart);
    document.removeEventListener("touchend", this.handlerTouchEnd);
    // document.addEventListener("mousedown", this.handlerTouchStart); // => DESKTOP MODE
    // document.addEventListener("mouseup", this.handlerTouchEnd); // => DESKTOP MODE
    document.removeEventListener("keydown", this.handlerTouchStart); // => ACCESSIBILITY
    document.removeEventListener("keyup", this.handlerTouchEnd); // => ACCESSIBILITY
  }

  countDown() {
    // Remove one second, set state so a re-render happens.
    let seconds = this.seconds - 1;
    this.time = this.secondsToTime(seconds);
    this.seconds = seconds;

    this.time$.next(this.time);

    // Check if we're at zero.
    if (seconds === 0) {
      clearInterval(this.timer);

      this.props.alertConsumer.show({
        type: AlertTypes.TimedOut,
        timeout: true,
        onDismiss: () => {
          this.props.consumerConsumer.resetConsumer();
          this.props.history.push(Pages.Attractor);
        }
      });
    }
  }

  render() {
    const { children } = this.props;
    return (
      <TimerProvider
        value={{
          time: this.time,
          time$: this.time$.asObservable(),
          startTimer: () => this.startTimer(),
          resetTimer: () => this.resetTimer(),
          clearTimer: () => this.clearTimer(true)
        }}
      >
        {children}
      </TimerProvider>
    );
  }

}

export const TimerStore = withRouter(withAlert(withConfig(withConsumer(TimerStoreComponent))));