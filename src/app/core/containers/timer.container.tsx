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
    switchMap(() => timerTouch$(time, true)),
    tap(value => console.log("timerDim$", value)),
    mergeMap(x => x === EventsTimer.TapDetect
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

    const timerSoft$ = sourceProxActive
    .pipe(
      switchMap(
        () => timerTouch$(TIMER_PROX, false).pipe(
          takeUntil(sourceProxInactive)
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

// const proximitySubscription = React.useRef<Subscription>(null);
// const timerSubscription = React.useRef<Subscription>(null);
// const exitSubscription = React.useRef<Subscription>(null);

// const resetProximitySubscription = () => {
//   if (proximitySubscription.current) {
//     proximitySubscription.current.unsubscribe();
//     proximitySubscription.current = null;
//   }
// };

// const resetTimerSubscription = () => {
//   if (timerSubscription.current) {
//     timerSubscription.current.unsubscribe();
//     timerSubscription.current = null;
//   }
// };

// function timerBoot$({
//   timer_last_touch_active,
//   timer_last_touch_inactive,
//   timer_dims_active,
//   timer_dims_inactive
// }, restart?: boolean): Subject<StatusTimer> {
//   console.log("==> timerBoot$ <==");

//   const subject_ = new Subject<any>();

//   function proximityDetect() {
//     console.log("==> proximityDetect <==");

//     let prevProximityStatus: DistanceTypes = null; // FROM ACTIVE => TO INACTIVE // CASE

//     resetProximitySubscription();

//     proximitySubscription.current = statusProximity$.current
//     .subscribe(
//       statusProximity => {

//         if (
//           !(prevProximityStatus === DistanceTypes.Far && statusProximity === DistanceTypes.Near ||
//           prevProximityStatus === DistanceTypes.Near && statusProximity === DistanceTypes.Far)
//         ) {
//           resetTimerSubscription();
//         }

//         const _isActive = isActiveDistance(statusProximity);
//         if (_isActive)
//           upDisplay();

//         // =======
//         console.log("==> exitDetect <==");

//         if (exitSubscription.current)
//           exitSubscription.current.unsubscribe();

//         if (prevProximityStatus && prevProximityStatus === DistanceTypes.Far && !_isActive) { // FROM ACTIVE => TO INACTIVE // CASE
//           dimDisplay();
//           exitSubscription.current = timerTouch$(2 * 1000, true)
//           .subscribe(
//             value => {
//               if (value === EventsTimer.TapDetect) {
//                 proximityDetect();
//               } else if (value === EventsTimer.TimerStop) {
//                 resetProximitySubscription();
//                 subject_.next(StatusTimer.ProximityExit);
//               }
//             }
//           );
//         }

//         // =======

//         console.log({ prevProximityStatus, statusProximity, timerSubscription });

//         if (!timerSubscription.current) {
//           console.log("==> timeoutDetect <==");

//           timerSubscription.current = timerTouch$((_isActive ? timer_last_touch_active : timer_last_touch_inactive) * 1000, false)
//           .pipe(
//             tap(() => dimDisplay()),
//             flatMap(() => timerTouch$((_isActive ? timer_dims_active : timer_dims_inactive) * 1000, true))
//           )
//           .subscribe(
//             value => {
//               resetTimerSubscription();
//               if (value === EventsTimer.TapDetect) {
//                 proximityDetect();
//               } else if (value === EventsTimer.TimerStop) {

//                 console.log({ prevProximityStatus, statusProximity, _isActive })
//                 subject_.next(_isActive ? StatusTimer.TimerActive : StatusTimer.TimerInactive);

//                 if (_isActive && restart) {
//                   sourceTouchEnd
//                   .pipe(
//                     first()
//                   )
//                   .subscribe(() => {
//                     proximityDetect();
//                   });
//                 } else {
//                   resetProximitySubscription();
//                 }
//               }
//             }
//           );

//         }

//         prevProximityStatus = statusProximity;
//       }
//     );
//   }

//   proximityDetect();

//   return subject_;
// }