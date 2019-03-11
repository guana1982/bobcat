import * as React from "react";
import { SreenWrapper, Warning } from "@components/global/ScreenWrapper";
import mediumLevel from "@utils/MediumLevel";

import { tap } from "rxjs/operators";
import { Subscription } from "rxjs";
import { Pages } from "@utils/constants";

interface AttractorProps {
  history: any;
}

const TIMEOUT_ATTRACTOR = 1100;
let eventTimeout_ = null;

export const Attractor = (props: AttractorProps) => {

  const [show, setShow] = React.useState(false);

  let video_: Subscription;

  const goToHome = () => props.history.push(Pages.Home);

  React.useEffect(() => {
    const timeout_ = props.history.index === 0 ? 0 : TIMEOUT_ATTRACTOR;
    eventTimeout_ = setTimeout(() => setShow(true), timeout_);
    video_ = mediumLevel.config.startVideo().subscribe();
    return () => {
      mediumLevel.config.stopVideo()
      .pipe(
        tap(() => video_.unsubscribe())
      )
      .subscribe();
      clearTimeout(eventTimeout_);
    };
  }, []);

  return (
    <React.Fragment>
      {show && <SreenWrapper onClick={() => goToHome()} />}
      {/* <Warning /> */}
    </React.Fragment>
  );

};

export default Attractor;
