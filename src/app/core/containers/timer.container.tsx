import * as React from "react";
import createContainer from "constate";
import { Subscription, fromEvent, timer } from "rxjs";
import { startWith, switchMap, takeUntil, skip, filter, map, first, tap } from "rxjs/operators";
import mediumLevel from "@core/utils/lib/mediumLevel";
import { MESSAGE_START_VIDEO, Pages } from "@core/utils/constants";
import { withRouter } from "react-router-dom";
import { ConfigContext, ConsumerContext, AlertTypes, AlertContext } from ".";

let timer_: Subscription;

const TimerContainer = createContainer((props: any) => {

  const configConsumer = React.useContext(ConfigContext);
  const consumerConsumer = React.useContext(ConsumerContext);
  const alertConsumer = React.useContext(AlertContext);

  const { socketAttractor$ } = configConsumer;
  const { isLogged } = consumerConsumer;

  const sourceTouchStart = fromEvent(document, "touchstart");
  const sourceTouchEnd = fromEvent(document, "touchend");

  const timer$ = (time: number, tapDetect: boolean) => sourceTouchEnd
  .pipe(
    startWith(void 0), // trigger emission at launch
    switchMap(() => timer(0, time).pipe(
      takeUntil(sourceTouchStart)
    )),
    skip(1),
    filter(data => data !== 0 || tapDetect),
    map(data => data === 0 ? "tap_detect" : "timer_stop")
  );


  const startVideo$ = socketAttractor$
  .pipe(
    filter(value => value === MESSAGE_START_VIDEO)
  );

  // .pipe(
  //   merge(startVideo$)
  // )

  const brightness$ = mediumLevel.brightness.dimDisplay()
  .pipe(
    switchMap(() => timer$(3000, true)),
    first(),
    tap(value => value === "tap_detect" && mediumLevel.brightness.brightenDisplay().subscribe())
  );

  const home$ = timer$(10000, false)
  .pipe(
    first(),
    switchMap(() => brightness$)
  );

  function startTimer() {
    timer_ = home$.subscribe(
      val => {
        if (val === "timer_stop") {
          alertConsumer.show({
            type: AlertTypes.TimedOut,
            timeout: true,
            onDismiss: () => {
              consumerConsumer.resetConsumer();
              props.history.push(Pages.Attractor);
            }
          });
        } else {
          startTimer();
        }
      }
    );
  }

  function resetTimer() {
    timer_.unsubscribe();
  }

  function  clearTimer() {

  }

  return { startTimer, resetTimer, clearTimer };
});

export const TimerProvider = withRouter(TimerContainer.Provider);
export const TimerContext = TimerContainer.Context;