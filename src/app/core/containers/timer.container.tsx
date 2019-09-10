import * as React from "react";
import createUseContext from "constate";
import { fromEvent, timer, BehaviorSubject, of, Observable, merge as Merge, throwError } from "rxjs";
import { startWith, switchMap, takeUntil, skip, filter, map, first, tap, merge, pairwise, retryWhen, mergeMap, mapTo } from "rxjs/operators";
import mediumLevel from "@core/utils/lib/mediumLevel";
import { MESSAGE_START_VIDEO, Pages, MESSAGE_STOP_VIDEO, MESSAGE_START_CAMERA, MESSAGE_STOP_CAMERA, TIMER_OUT_OF_ORDER } from "@core/utils/constants";
import { withRouter } from "react-router-dom";
import { ConfigContext, ConsumerContext } from ".";

export enum DistanceTypes {
  None = "none",
  Far = "far",
  Near = "near"
}

export enum EventsTimer {
  TapDetect = "tap_detect",
  TimerStop = "timer_stop"
}

export enum StatusTimer {
  TimerActive = "timer_active",
  TimerInactive = "timer_inactive",
  TimerNear = "timer_near"
}

const TimerContainer = createUseContext((props: any) => {

  const statusProximity$ = React.useRef(new BehaviorSubject<DistanceTypes>(DistanceTypes.None));

  const configConsumer = React.useContext(ConfigContext);
  const { isLogged } = React.useContext(ConsumerContext);

  React.useEffect(() => {

    // STATUS PROXIMITY
    const { socketAttractor$ } = configConsumer;
    const socketAttractor_ = socketAttractor$
    .pipe(
      filter(value => value === MESSAGE_STOP_VIDEO || value === MESSAGE_START_CAMERA || value === MESSAGE_START_VIDEO || value === MESSAGE_STOP_CAMERA), // DETECT ENTER / EXIT MESSAGES
      map(value => {
        let distanceType_: DistanceTypes = null;
        if (value === MESSAGE_STOP_VIDEO || value === MESSAGE_STOP_CAMERA) {
          distanceType_ = DistanceTypes.Far;
        } else if (value === MESSAGE_START_CAMERA) {
          distanceType_ = DistanceTypes.Near;
        } else {
          distanceType_ = DistanceTypes.None;
        }
        return distanceType_;
      })
    );

    socketAttractor_
    .subscribe(value => {
      statusProximity$.current.next(value);
    });

  }, []);

  const dimDisplay = () => mediumLevel.brightness.dimDisplay().subscribe();
  const upDisplay = () => mediumLevel.brightness.brightenDisplay().subscribe();

  const sourceTouchStart = fromEvent(document, "touchstart").pipe(merge(fromEvent(document, "keydown")));
  const sourceTouchEnd = fromEvent(document, "touchend").pipe(merge(fromEvent(document, "keyup")));

  const sourceProxActive = statusProximity$.current
  .pipe(
    startWith(DistanceTypes.None),
    pairwise(),
    filter(types => types[1] !== DistanceTypes.None),
    mapTo(true)
  );

  const sourceProxNear = statusProximity$.current
  .pipe(
    startWith(DistanceTypes.None),
    pairwise(),
    filter(types => types[1] === DistanceTypes.Near),
    mapTo(true)
  );

  const sourceProxInactive = statusProximity$.current
  .pipe(
    startWith(DistanceTypes.None),
    pairwise(),
    filter(types => types[1] === DistanceTypes.None),
    mapTo(true)
  );

  const sourceProxFromActiveToInactive = statusProximity$.current
  .pipe(
    pairwise(),
    filter(types => (types[0] === DistanceTypes.Far || types[0] === DistanceTypes.Near) && types[1] === DistanceTypes.None),
    mapTo(true)
  );

  const sourceProxFromInactiveToActive = statusProximity$.current
  .pipe(
    pairwise(),
    filter(types => types[0] === DistanceTypes.None && (types[1] === DistanceTypes.Far || types[1] === DistanceTypes.Near)),
    mapTo(true)
  );

  const timerTouch$ = (time: number, tapDetect: boolean) => sourceTouchEnd
  .pipe(
    startWith(void 0), // trigger emission at launch
    switchMap(() => timer(0, time).pipe(
      takeUntil(sourceTouchStart)
    )),
    skip(1),
    filter(data => data !== 0 || tapDetect),
    map(data => data === 0 ? EventsTimer.TapDetect : EventsTimer.TimerStop),
    first()
  );

  const timerDim$ = (time: number, value: StatusTimer) => of("")
  .pipe(
    tap(dimDisplay),
    switchMap(() => Merge(
      timerTouch$(time, true),
      sourceProxFromInactiveToActive
    )),
    mergeMap(x => x === EventsTimer.TapDetect || x === true
      ? throwError(true)
      : of(x)
    ),
    mapTo(value)
  );

  const upDim$ = (retry: Observable<any>) => retry
  .pipe(
    tap(upDisplay)
  );

  function timerBoot$([
    timer_touch,
    timer_prox,
    timer_dim,
    timer_account_touch,
    timer_account_prox,
    timer_account_dim
  ]: number[]): Observable<StatusTimer> {

    const TIMER_TOUCH = isLogged ? timer_account_touch : timer_touch;
    const TIMER_PROX = isLogged ? timer_account_prox : timer_prox;
    const TIMER_DIM = isLogged ? timer_account_dim : timer_dim;

    const timerHard$ = timerTouch$(TIMER_TOUCH, false)
    .pipe(
      mapTo(StatusTimer.TimerInactive)
    );

    const timerSoft$ = sourceProxFromActiveToInactive
    .pipe(
      switchMap(
        () => timerTouch$(TIMER_PROX, false).pipe(
          takeUntil(sourceProxActive)
        )
      ),
      mapTo(StatusTimer.TimerActive)
    );

    const timer$ = Merge(
      timerHard$,
      timerSoft$
    )
    .pipe(
      first(),
      switchMap(value => timerDim$(TIMER_DIM, value)),
      retryWhen(retry => upDim$(retry))
    );

    return timer$; // .pipe(tap(value => console.log("timerBoot$", value))); // <= LOG

  }

  function timerNear$([
    timer_touch,
    timer_prox,
    timer_dim,
    timer_near
  ]: number[]): Observable<StatusTimer> {

    const timerNear$ = sourceProxNear
    .pipe(
      switchMap(
        () => timer(timer_near).pipe(
          takeUntil(sourceProxInactive)
        )
      ),
      mapTo(StatusTimer.TimerNear)
    );

    const timer$ = Merge(
      timerBoot$([timer_touch, timer_prox, timer_dim]),
      timerNear$
    );

    return timer$; // .pipe(tap(value => console.log("timerNear$", value))); // <= LOG

  }

  const timerOutOfOrder$ = timerTouch$(TIMER_OUT_OF_ORDER, false);

  return {
    statusProximity$,
    timerBoot$,
    timerNear$,
    timerOutOfOrder$
  };
});

export const TimerProvider = withRouter(TimerContainer.Provider);
export const TimerContext = TimerContainer.Context;