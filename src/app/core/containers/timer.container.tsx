import * as React from "react";
import createContainer from "constate";
import { Subscription, fromEvent, timer } from "rxjs";
import { startWith, switchMap, takeUntil, skip, filter, map, first, tap, merge } from "rxjs/operators";
import mediumLevel from "@core/utils/lib/mediumLevel";
import { MESSAGE_START_VIDEO, Pages } from "@core/utils/constants";
import { withRouter } from "react-router-dom";
import { ConfigContext, ConsumerContext, AlertTypes, AlertContext } from ".";


const TimerContainer = createContainer((props: any) => {

  const configConsumer = React.useContext(ConfigContext);

  const { socketAttractor$ } = configConsumer;

  const [timerStop, setTimerStop] = React.useState(false);

  // BASIC

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
    map(data => data === 0 ? "tap_detect" : "timer_stop")
  );

  const brightness$ = mediumLevel.brightness.dimDisplay()
  .pipe(
    switchMap(() => timerTouch$(3000, true)),
    first(),
    tap(value => value === "tap_detect" && mediumLevel.brightness.brightenDisplay().subscribe())
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
    map(() => "proximity_stop")
  );

  const upBrightness$ = sourceTouchStart
  .pipe(
    tap(() => mediumLevel.brightness.brightenDisplay().subscribe()),
    tap(() => setTimerStop(false)),
    first(),
    map(() => "timer_restart")
  );

  // MAIN

  const timerFull$ = timerWithBrightness$
  .pipe(
    merge(startVideo$),
    tap(value => setTimerStop(value === "timer_stop")),
    first()
  );

  const restartBrightness$ = upBrightness$
  .pipe(
    merge(startVideo$),
    tap(() => setTimerStop(false)),
    first()
  );

  return {
    timerFull$,
    restartBrightness$,
    timerStop
  };
});

export const TimerProvider = withRouter(TimerContainer.Provider);
export const TimerContext = TimerContainer.Context;