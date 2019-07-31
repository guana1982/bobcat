import * as React from "react";
import createContainer from "constate";
import { Subscription, fromEvent, timer, BehaviorSubject, of, Subject, Observable, interval } from "rxjs";
import { startWith, switchMap, takeUntil, skip, filter, map, first, tap, merge, debounce, debounceTime, flatMap, timeout, delay } from "rxjs/operators";
import mediumLevel from "@core/utils/lib/mediumLevel";
import { MESSAGE_START_VIDEO, Pages, MESSAGE_STOP_VIDEO, MESSAGE_START_CAMERA, MESSAGE_STOP_CAMERA, TIMER_PREPAY_ACTIVE } from "@core/utils/constants";
import { withRouter } from "react-router-dom";
import { ConfigContext, ConsumerContext, AlertTypes, AlertContext, PaymentContext } from ".";

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
  ProximityExit = "proximity_exit"
}

const TimerContainer = createContainer((props: any) => {

  const statusProximity$ = React.useRef(new BehaviorSubject<DistanceTypes>(DistanceTypes.None));

  const timer_ = React.useRef<number>(null);
  const [displayIsDims, setDisplayIsDims] = React.useState<boolean>(false);

  const configConsumer = React.useContext(ConfigContext);

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

  const sourceTouchStart = fromEvent(document, "touchstart").pipe(merge(fromEvent(document, "keydown")));
  const sourceTouchEnd = fromEvent(document, "touchend").pipe(merge(fromEvent(document, "keyup")));

  const isActiveDistance = (status): boolean => {
    return status !== DistanceTypes.None;
  };

  const dimDisplay = () => mediumLevel.brightness.dimDisplay().pipe(tap(() => setDisplayIsDims(true))).subscribe();
  const upDisplay = () => mediumLevel.brightness.brightenDisplay().pipe(tap(() => setDisplayIsDims(false))).subscribe();

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

  const proximitySubscription = React.useRef<Subscription>(null);
  const timerSubscription = React.useRef<Subscription>(null);
  const exitSubscription = React.useRef<Subscription>(null);

  function timerBoot$({
    timer_last_touch_active,
    timer_last_touch_inactive,
    timer_dims_active,
    timer_dims_inactive
  }): Subject<StatusTimer> {

    let prevProximityStatus: DistanceTypes = null; // FROM ACTIVE => TO INACTIVE // CASE
    const subject_ = new Subject<any>();

    function proximityDetect () {

      if (proximitySubscription.current)
        proximitySubscription.current.unsubscribe();

      proximitySubscription.current = statusProximity$.current
      .subscribe(
        statusProximity => {
          console.log({ statusProximity });
          if (exitSubscription.current)
            exitSubscription.current.unsubscribe();

          if (prevProximityStatus && prevProximityStatus === DistanceTypes.Far && !isActiveDistance(statusProximity)) { // FROM ACTIVE => TO INACTIVE // CASE
            if (timerSubscription.current)
              timerSubscription.current.unsubscribe();
            dimDisplay();
            exitSubscription.current = timerTouch$(2 * 1000, true)
            .subscribe(
              value => {
                if (value === EventsTimer.TapDetect) {
                  proximityDetect();
                } else if (value === EventsTimer.TimerStop) {
                  proximitySubscription.current.unsubscribe();
                  subject_.next(StatusTimer.ProximityExit);
                }
              }
            );
          }

          console.log({ prevProximityStatus, statusProximity });
          if (
            !isActiveDistance(prevProximityStatus) && isActiveDistance(statusProximity) ||
            prevProximityStatus !== DistanceTypes.Far && statusProximity === DistanceTypes.None
          ) {

            if (timerSubscription.current)
              timerSubscription.current.unsubscribe();

            upDisplay();
            const _isActive = isActiveDistance(statusProximity);

            timerSubscription.current = timerTouch$((_isActive ? timer_last_touch_active : timer_last_touch_inactive) * 1000, false)
            .pipe(
              tap(() => dimDisplay()),
              flatMap(() => timerTouch$((_isActive ? timer_dims_active : timer_dims_inactive) * 1000, true))
            )
            .subscribe(
              value => {
                if (value === EventsTimer.TapDetect) {
                  proximityDetect();
                } else if (value === EventsTimer.TimerStop) {
                  subject_.next(_isActive ? StatusTimer.TimerActive : StatusTimer.TimerInactive);
                  if (!_isActive) {
                    if (timerSubscription.current)
                      timerSubscription.current.unsubscribe();
                    proximitySubscription.current.unsubscribe();
                  } else {
                    sourceTouchEnd
                    .subscribe(() => {
                      if (timerSubscription.current)
                        timerSubscription.current.unsubscribe();
                      proximitySubscription.current.unsubscribe();
                      proximityDetect();
                    });
                  }
                }
              }
            );

          }

          prevProximityStatus = statusProximity;
        }
      );
    }

    proximityDetect();

    return subject_;
  }

  const timerPrepay$ = timerTouch$(TIMER_PREPAY_ACTIVE * 1000, false);

  return {
    statusProximity$,
    displayIsDims,
    timerBoot$,
    timerPrepay$
  };
});

export const TimerProvider = withRouter(TimerContainer.Provider);
export const TimerContext = TimerContainer.Context;