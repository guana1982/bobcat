import * as React from "react";
import mediumLevel from "@utils/MediumLevel";

import { tap } from "rxjs/operators";
import { Subscription } from "rxjs";
import { Pages, MESSAGE_STOP_VIDEO, MESSAGE_START_CAMERA } from "@utils/constants";
import { ConfigContext, PaymentContext } from "@core/containers";
import { SreenWrapper } from "../components/common/ScreenWrapper";
import CountUp from "react-countup";
import { themeMain } from "@style";
import { CountUpComponent } from "../components/common/CountUp";

interface AttractorProps {
  history: any;
}

export const TIMEOUT_ATTRACTOR = 1500;
let eventTimeout_ = null;

export const Attractor = (props: AttractorProps) => {

  const [show, setShow] = React.useState(false);

  const configConsumer = React.useContext(ConfigContext);
  const paymentConsumer = React.useContext(PaymentContext);

  const goToHome = () => props.history.push(Pages.Home);
  const goToPrepay = () => props.history.push(Pages.Prepay);
  const goToOutOfOrder = () => props.history.push(Pages.OutOfOrder);

  React.useEffect(() => {
    paymentConsumer.restartPayment();
    eventTimeout_ = setTimeout(() => setShow(true), TIMEOUT_ATTRACTOR);
    const video_ = mediumLevel.config.startVideo().subscribe();
    return () => {
      clearTimeout(eventTimeout_);
      video_.unsubscribe();
      // setTimeout(() => {
      //   mediumLevel.config.stopVideo().subscribe();
      // }, TIMEOUT_ATTRACTOR);
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
  }, [socketAttractor$]);
  //  <=== PROXIMITY SENSOR ====

  return (
    <React.Fragment>
      {show &&
        <>
          {/* <CountUpComponent/> */}
          <SreenWrapper onClick={eventAttractor}/>
        </>
      }
      {/* <Warning /> */}
    </React.Fragment>
  );

};
