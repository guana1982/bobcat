import * as React from "react";
import mediumLevel from "@utils/MediumLevel";

import { first } from "rxjs/operators";
import { Pages, MESSAGE_STOP_VIDEO, MESSAGE_START_CAMERA } from "@utils/constants";
import { ConfigContext, PaymentContext } from "@core/containers";
import { SreenWrapper } from "../components/common/ScreenWrapper";
import { CountUpComponent } from "../components/common/CountUp";

interface AttractorProps {
  history: any;
}

let showTimer;
let hideTimer;

export const TIMEOUT_ATTRACTOR = 2000;

export const Attractor = (props: AttractorProps) => {

  const [show, setShow] = React.useState(false);
  const [showCountUp, setShowCountUp] = React.useState(false);
  const [timer, setTimer] = React.useState(0);

  const eventTimeout_ =  React.useRef<any>(null);

  const configConsumer = React.useContext(ConfigContext);
  const paymentConsumer = React.useContext(PaymentContext);

  const goToHome = () => props.history.push(Pages.Home);
  const goToPrepay = () => props.history.push(Pages.Prepay);
  const goToOutOfOrder = () => props.history.push(Pages.OutOfOrder);

  React.useEffect(() => {
    paymentConsumer.restartPayment();
    mediumLevel.config.startVideo().pipe(first()).subscribe();
    eventTimeout_.current = setTimeout(() => setShow(true), TIMEOUT_ATTRACTOR);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      clearTimeout(eventTimeout_.current);
      mediumLevel.config.stopVideo().pipe(first()).subscribe();
    };
  }, []);

  const eventAttractor = () => {
    if (alarmSuper_) {
      goToOutOfOrder();
      return;
    }
    goToHome();
  };


  //  ==== PROXIMITY SENSOR ====>
  const { socketAttractor$ } = configConsumer;
  const { alarmSuper_ } = configConsumer.statusAlarms;
  React.useEffect(() => {
    if (socketAttractor$ === undefined) {
      return () => null;
    }
    const socketAttractor_ = socketAttractor$
    .subscribe(value => {
      if (alarmSuper_) {
        goToOutOfOrder();
        return;
      }

      if (value === MESSAGE_STOP_VIDEO) {
        goToHome();
      } else if (value === MESSAGE_START_CAMERA) {
        goToPrepay();
      }
    });
    return () => {
      socketAttractor_.unsubscribe();
    };
  }, [socketAttractor$, alarmSuper_]);
  //  <=== PROXIMITY SENSOR ====

  // ==== TIMER HANDLER ===>
  React.useEffect(() => {
    setTimeout(() => {
      timer < 29 && setTimer(prev => prev + 1);
      timer === 29 && setTimeout(() => setTimer(0), 60);
    }, show ? 1000 : 1000 + TIMEOUT_ATTRACTOR);
  }, [timer]);
  // <=== TIMER HANDLER ====

  // ==== SHOW-COUNTUP HANDLER ===>
  React.useEffect(() => {
    timer === 21 && setShowCountUp(true);
    timer === 24 && setTimeout(() => setShowCountUp(false), 600);
  }, [timer]);
  // <=== SHOW-COUNTUP HANDLER ====


  return (
    <React.Fragment>
      {show &&
        <>
          {showCountUp && <CountUpComponent/>}
          <span
            style={{
              position: "absolute",
              top: "50px",
              left: "50px",
              fontSize: "30px"
            }}>{timer}</span>
          <SreenWrapper onClick={eventAttractor}>
          {/* <video
            src="BOBCAT_PEPSI_MASTER_V02.m4v"
            onClick={() => goToHome()}
            width="1280"
            height="800"
            loop
            autoPlay
            muted
          /> */}
          </SreenWrapper>
        </>
      }
      {/* <Warning /> */}
    </React.Fragment>
  );

};
