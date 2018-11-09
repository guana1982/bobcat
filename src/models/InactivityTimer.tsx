import * as React from "react";
import { get, post } from "../utils";
import { map, tap, delay } from "rxjs/operators";
import i18n from "../i18n";
import { Subject, Observable } from "rxjs";
import { withRouter } from "react-router-dom";

export interface InactivityTimerInterface {
  time: any;
  time$: Observable<any>;
  startTimer: () => void;
  clearTimer: () => void;
  resetTimer: () => void;
}

const InactivityTimerContext = React.createContext<InactivityTimerInterface | null>(null);

export const InactivityTimerProvider = InactivityTimerContext.Provider;
export const InactivityTimerConsumer = InactivityTimerContext.Consumer;

class InactivityTimerStoreComponent extends React.Component<any, any> {
  timer: any;
  time: any;
  seconds: any;
  time$: Subject<any>;

  constructor(props) {
    super(props);
    this.clearTimer(false);
    this.time$ = new Subject<any>();
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
    clearInterval(this.timer);
    this.time = {};
    this.seconds = 30;
    this.timer = 0;
    if (enable) {
      this.timer = setInterval(this.countDown, 1000);
    }
  }

  startTimer() {
    this.clearTimer(true);
    document.addEventListener("touchstart", () => clearInterval(this.timer));
    document.addEventListener("touchend", () => this.clearTimer(true));
  }

  resetTimer() {
    this.clearTimer(false);
    document.removeEventListener("touchstart", () => clearInterval(this.timer));
    document.removeEventListener("touchend", () => this.clearTimer(true));
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
      this.props.history.push("/");
    }
  }

  render() {
    const { children } = this.props;
    return (
      <InactivityTimerProvider
        value={{
          time: this.time,
          time$: this.time$.asObservable(),
          startTimer: () => this.startTimer(),
          resetTimer: () => this.resetTimer(),
          clearTimer: () => this.clearTimer(true)
        }}
      >
        {children}
      </InactivityTimerProvider>
    );
  }

}

export const InactivityTimerStore = withRouter(InactivityTimerStoreComponent);