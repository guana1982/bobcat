import * as React from "react";
import { get, post } from "../utils";
import { map, tap, delay } from "rxjs/operators";
import i18n from "../i18n";
import { Subject, Observable } from "rxjs";

export interface InactivityTimerInterface {
  // isLit: boolean;
  // onToggleLight: () => void;
  startTimer: any;
  time: any;
  time$: Observable<any>;
}

const InactivityTimerContext = React.createContext<InactivityTimerInterface | null>(null);

export const InactivityTimerProvider = InactivityTimerContext.Provider;
export const InactivityTimerConsumer = InactivityTimerContext.Consumer;

export class InactivityTimerStore extends React.Component<any, any> {
  timer: any;
  time: any;
  seconds: any;
  time$: Subject<any>;

  constructor(props) {
    super(props);
    this.time = {};
    this.seconds = 30;
    this.timer = 0;
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

  startTimer() {
    if (this.timer === 0 && this.seconds > 0) {
      this.timer = setInterval(this.countDown, 1000);
    }
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
      // alert("end");
    }
  }

  render() {
    const { children } = this.props;
    return (
      <InactivityTimerProvider
        value={{
          startTimer: this.startTimer,
          time: this.time,
          time$: this.time$.asObservable()
        }}
      >
        {children}
      </InactivityTimerProvider>
    );
  }

}


// import * as React from "react";
// import { get, post } from "../utils";
// import { map, tap, delay } from "rxjs/operators";
// import i18n from "../i18n";

// const DEFAULT_TIMEOUT = 30;

// export interface InactivityTimerInterface {
//   // isLit: boolean;
//   // onToggleLight: () => void;
//   start: any;
//   timer: any;
// }

// const InactivityTimerContext = React.createContext<InactivityTimerInterface | null>(null);

// export const InactivityTimerProvider = InactivityTimerContext.Provider;
// export const InactivityTimerConsumer = InactivityTimerContext.Consumer;

// export class InactivityTimerStore extends React.Component<any, any> {

//   timer;
//   countdownTimer;
//   inactivityTimeout = DEFAULT_TIMEOUT;
//   showCountdown: boolean = false;
//   resetOnClick: boolean = true;
//   stopCamera: boolean = false;
//   defaultTimeout = DEFAULT_TIMEOUT;
//   timerID: any;

//   constructor(props) {
//     super(props);

//     this.state = {
//         date: new Date()
//     };

//     this.timerID = setInterval(
//       () => this.tick(),
//       1000
//     );
//   }

//   tick() {
//     this.setState({
//       date: new Date()
//     });
//   }

//   clean() {
//     clearInterval(this.timerID);
//   }

//   // toggleLight = () => {
//   //   this.setState(state => ({ isLit: !state.isLit }));
//   // }

//   onTimeout = () => {
//     alert("timeout");
//     // this.props.history.push("/");
//     // this.props
//   }

//   setCountdown = (inactivityTimeout?) => {
//     console.log("boh");
//   }

//   clearTimer = () =>  {
//     console.log(this.timer);
//     clearTimeout(this.timer);
//   }

//   resetTimer = () => {
//     this.clearTimer();
//     // window.cancelAnimationFrame(timer)
//     if (this.showCountdown) this.setCountdown(this.inactivityTimeout);
//     this.timer = setTimeout((timeout, reqId) => {
//       // timer = reqId
//       this.onTimeout();
//     }, this.inactivityTimeout * 1000);
//   }

//   start = () => {
//     this.timer = setTimeout((timeout, reqId) => {
//       // timer = reqId
//       console.log("timeout");
//       this.onTimeout();
//     }, this.inactivityTimeout * 1000);
//     if (this.resetOnClick) {
//       document.addEventListener("touchstart", () => this.clearTimer());
//       document.addEventListener("touchend", this.resetTimer);
//     }
//     if (!this.showCountdown) {
//       return;
//     }
//     const start = Date.now();
//     const countdownRaf = () => {
//       const now = Date.now();
//       const dt = Math.ceil((now - start) / 1000);
//       if (dt > this.inactivityTimeout) {
//         return;
//       }
//       if (dt % 1 === 0) this.setCountdown(this.inactivityTimeout - dt);
//       this.countdownTimer = window.requestAnimationFrame(countdownRaf);
//     };
//     this.countdownTimer = window.requestAnimationFrame(countdownRaf);
//   }

//   render() {
//     const { children } = this.props;
//     return (
//       <InactivityTimerProvider
//         value={{
//           start: this.start,
//           timer: this.timer
//           // isLit: this.state.isLit,
//           // onToggleLight: this.toggleLight
//         }}
//       >
//         {children}
//       </InactivityTimerProvider>
//     );
//   }
// }