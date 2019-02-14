import * as React from "react";
import { SreenWrapper, Warning } from "@components/global/ScreenWrapper";
import mediumLevel from "@utils/MediumLevel";

import { tap } from "rxjs/operators";
import { Subscription } from "rxjs";
import { Pages } from "@utils/constants";

interface AttractorProps {
  history: any;
}

export const Attractor = (props: AttractorProps) => {

  let video_: Subscription;

  const goToHome = () => props.history.push(Pages.Home);

  React.useEffect(() => {
    video_ = mediumLevel.config.startVideo().subscribe();
    return () => {
      mediumLevel.config.stopVideo()
      .pipe(
        tap(() => video_.unsubscribe())
      )
      .subscribe();
    };
  }, []);

  return (
    <React.Fragment>
      <SreenWrapper onClick={() => goToHome()} />
      {/* <Warning /> */}
    </React.Fragment>
  );

};

export default Attractor;
