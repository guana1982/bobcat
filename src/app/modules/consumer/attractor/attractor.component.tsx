import * as React from "react";
import { SreenWrapper, Warning } from "@components/global/ScreenWrapper";
import mediumLevel from "@utils/MediumLevel";

import { tap } from "rxjs/operators";
import { Subscription } from "rxjs";
import { Pages, MESSAGE_STOP_VIDEO, MESSAGE_START_CAMERA } from "@utils/constants";
import { ConfigContext } from "@core/containers";

interface AttractorProps {
  history: any;
}

const TIMEOUT_ATTRACTOR = 1100;
let eventTimeout_ = null;

export const Attractor = (props: AttractorProps) => {

  const [show, setShow] = React.useState(false);

  const configConsumer = React.useContext(ConfigContext);

  const goToHome = () => props.history.push(Pages.Home);
  const goToPrepay = () => props.history.push(Pages.Prepay);

  React.useEffect(() => {
    const timeout_ = props.history.index === 0 ? 0 : TIMEOUT_ATTRACTOR;
    eventTimeout_ = setTimeout(() => setShow(true), timeout_);
    const video_ = mediumLevel.config.startVideo().subscribe();
    return () => {
      mediumLevel.config.stopVideo()
      .pipe(
        tap(() => video_.unsubscribe())
      )
      .subscribe();
      clearTimeout(eventTimeout_);
    };
  }, []);

  //  ==== PROXIMITY SENSOR ====>
  const { socketAttractor$ } = configConsumer;
  React.useEffect(() => {
    if (socketAttractor$ === undefined) {
      return () => null;
    }
    const socketAttractor_ = socketAttractor$
    .subscribe(value => {
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
      {show && <SreenWrapper onClick={() => goToHome()} />}
      {/* <Warning /> */}
    </React.Fragment>
  );

};

export default Attractor;
