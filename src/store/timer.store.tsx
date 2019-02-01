import * as React from "react";
import { get, post } from "../utils";
import { map, tap, delay } from "rxjs/operators";
import { BehaviorSubject, Observable } from "rxjs";
import { withRouter } from "react-router-dom";
import { Pages } from "../utils/constants";
import { withConsumer } from "./consumer.store";

export interface TimerInterface {
  time: any;
  time$: Observable<any>;
  startTimer: () => void;
  clearTimer: () => void;
  resetTimer: () => void;
}

const TimerContext = React.createContext<TimerInterface | null>(null);

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
    clearInterval(this.timer);
    this.time = {};
    this.seconds = 30;
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
  }

  resetTimer() {
    this.clearTimer(false);
    document.removeEventListener("touchstart", this.handlerTouchStart);
    document.removeEventListener("touchend", this.handlerTouchEnd);
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
      this.props.consumerConsumer.resetConsumer();
      this.props.history.push(Pages.Attractor);
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

export const TimerStore = withRouter(withConsumer(TimerStoreComponent));