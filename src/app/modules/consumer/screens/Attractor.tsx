import * as React from "react";
import mediumLevel from "@utils/MediumLevel";

import { tap, first } from "rxjs/operators";
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

export const TIMEOUT_ATTRACTOR = 2000;

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
