import * as React from "react";
import createContainer from "constate";
import { Subscription, fromEvent, timer, BehaviorSubject, of } from "rxjs";
import { startWith, switchMap, takeUntil, skip, filter, map, first, tap, merge, debounce, debounceTime, flatMap } from "rxjs/operators";
import mediumLevel from "@core/utils/lib/mediumLevel";
import { MESSAGE_START_VIDEO, Pages, MESSAGE_STOP_VIDEO, MESSAGE_STOP_CAMERA, MESSAGE_START_CAMERA } from "@core/utils/constants";
import { withRouter } from "react-router-dom";
import { ConfigContext, ConsumerContext, AlertTypes, AlertContext } from ".";

export enum StatusProximity {
  TapDetect = "tap_detect",
  TimerRestart = "timer_restart",
  TimerStop = "timer_stop",
  ProximityStop = "proximity_stop",
  TouchStop = "touch_stop"
}

const TimerContainer = createContainer((props: any) => {

  const enableProximity = React.useRef(false);

  const configConsumer = React.useContext(ConfigContext);

  const { socketAttractor$ } = configConsumer;

  const [timerStop, setTimerStop] = React.useState(false);

  // BASIC

  const statusProximity$ = socketAttractor$
  .pipe(
    filter(value => value === MESSAGE_STOP_VIDEO || value === MESSAGE_START_CAMERA || value === MESSAGE_START_VIDEO), // DETECT ENTER / EXIT MESSAGES
    map(value => value === MESSAGE_STOP_VIDEO || value === MESSAGE_START_CAMERA), // SET CONDITION
  );

  React.useEffect(() => { // STATUS PROXIMITY
    statusProximity$
    .subscribe(value => {
      enableProximity.current = value;
    });
  }, []);

  const sourceTouchStart = fromEvent(document, "touchstart").pipe(merge(fromEvent(document, "keydown")));
  const sourceTouchEnd = fromEvent(document, "touchend").pipe(merge(fromEvent(document, "keyup")));

  const timerTouch$ = (time: number, tapDetect: boolean) => sourceTouchEnd
  .pipe(
    startWith(void 0), // trigger emission at launch
    switchMap(() => timer(0, time).pipe(
      takeUntil(sourceTouchStart)
    )),
    skip(1),
    filter(data => data !== 0 || tapDetect),
    map(data => data === 0 ? StatusProximity.TapDetect : StatusProximity.TimerStop)
  );

  const brightness$ = mediumLevel.brightness.dimDisplay()
  .pipe(
    switchMap(() => timerTouch$(3000, true)),
    first(),
    tap(value => value === StatusProximity.TapDetect && mediumLevel.brightness.brightenDisplay().subscribe())
  );

  // TO MERGE

  const timerWithBrightness$ = timerTouch$(10000, false)
  .pipe(
    first(),
    switchMap(() => brightness$),
  );

  const startVideo$ = socketAttractor$
  .pipe(
    filter(value => value === MESSAGE_START_VIDEO),
    switchMap(() => timerTouch$(1500, false)),
    first(),
    map(() => StatusProximity.TouchStop)
  );

  const startVideoNoProximity$ = timerTouch$(10000, false)
  .pipe(
    map(() => StatusProximity.TouchStop),
  );

  const upBrightness$ = sourceTouchStart
  .pipe(
    tap(() => mediumLevel.brightness.brightenDisplay().subscribe()),
    tap(() => setTimerStop(false)),
    first(),
    map(() => StatusProximity.TimerRestart)
  );

  // MAIN

  const timerFull$ = timerWithBrightness$
  .pipe(
    merge(enableProximity.current ? startVideo$ : startVideoNoProximity$),
    tap(value => setTimerStop(value === StatusProximity.TimerStop)),
    first()
  );

  const restartBrightness$ = upBrightness$
  .pipe(
    merge(enableProximity.current ? startVideo$ : startVideoNoProximity$),
    tap(() => setTimerStop(false)),
    first()
  );

  const timerPrepay$ = enableProximity.current ? timerTouch$(30000, false) : timerTouch$(15000, false)

  return {
    timerFull$,
    timerPrepay$,
    restartBrightness$,
    timerStop
  };
});

export const TimerProvider = withRouter(TimerContainer.Provider);
export const TimerContext = TimerContainer.Context;