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

export const TIMEOUT_ATTRACTOR = 2000;

export const BOOT_VIDEO = 1250;
export const DURATION_VIDEO = 29800;
export const TIMER_VIDEO = 100;

export const Attractor = (props: AttractorProps) => {

  const [show, setShow] = React.useState(false);

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

  // const timer_ =  React.useRef<any>(null);
  // const [timer, setTimer] = React.useState(0);
  // React.useEffect(() => {
  //   timer_.current = setInterval(() => {
  //     setTimer(prevTimer => {
  //       // if (prevTimer === (DURATION_VIDEO + BOOT_VIDEO)) {
  //       //   return -1000;
  //       // }
  //       return prevTimer + 100;
  //     });
  //   }, 100);
  //   return () => {
  //     clearInterval(timer_.current);
  //   };
  // }, []);

  // const repeat = timer / (DURATION_VIDEO + BOOT_VIDEO);
  // const condition = Math.round((repeat - Math.floor(repeat)) * 100);

  return (
    <React.Fragment>
      {show &&
        <>
          <span
            style={{
              position: "absolute",
              top: "50px",
              left: "50px",
              fontSize: "30px"
            }}>
          {/* <p>Timer: {timer}</p>
          <p>Repeat + Boot: {repeat}</p>
          <p>Condition: {condition}</p> */}
          {/* <p>Repeat + Boot: {timer / (DURATION_VIDEO + BOOT_VIDEO)}</p> */}
          </span>
          <SreenWrapper onClick={eventAttractor}>
            {/* {(condition >= 76 && condition <= 84) && <CountUpComponent/>} */}
            {/* <video
              src="BOBCAT_PEPSI_MASTER_V02.mp4"
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
