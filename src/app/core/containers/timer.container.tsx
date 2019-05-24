import * as React from "react";
import createContainer from "constate";
import { Subscription, fromEvent, timer } from "rxjs";
import { startWith, switchMap, takeUntil, skip, filter, map, first, tap, merge } from "rxjs/operators";
import mediumLevel from "@core/utils/lib/mediumLevel";
import { MESSAGE_START_VIDEO, Pages } from "@core/utils/constants";
import { withRouter } from "react-router-dom";
import { ConfigContext, ConsumerContext, AlertTypes, AlertContext } from ".";

let timer_: Subscription;

const TimerContainer = createContainer((props: any) => {

  const configConsumer = React.useContext(ConfigContext);

  const { socketAttractor$ } = configConsumer;

  const sourceTouchStart = fromEvent(document, "touchstart");
  const sourceTouchEnd = fromEvent(document, "touchend");

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

  const timerWithBrightness$ = timerTouch$(10000, false)
  .pipe(
    first(),
    switchMap(() => brightness$),
  );

  const startVideo$ = socketAttractor$
  .pipe(
    filter(value => value === MESSAGE_START_VIDEO),
    switchMap(() => timerTouch$(3000, false)),
    first(),
    map(() => "proximity_stop")
  );

  const timerFull$ = timerWithBrightness$
  .pipe(
    merge(startVideo$),
    first()
  );

  const restartBrightness$ = sourceTouchStart
  .pipe(
    switchMap(() => mediumLevel.brightness.brightenDisplay()),
    first()
  );

  return {
    timerFull$,
    restartBrightness$
  };
});

export const TimerProvider = withRouter(TimerContainer.Provider);
export const TimerContext = TimerContainer.Context;