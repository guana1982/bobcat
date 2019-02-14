import * as React from "react";
import { SreenWrapper, Warning } from "../../components/global/ScreenWrapper";
import mediumLevel from "../../utils/MediumLevel";

import { tap } from "rxjs/operators";
import { Subscription } from "rxjs";
import { Pages } from "../../utils/constants";
// import Lottie from "react-lottie";
// const animationData = require("./test.json");

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

  // const defaultOptions = {
  //   loop: true,
  //   autoplay: true,
  //   animationData: animationData,
  //   rendererSettings: {
  //     preserveAspectRatio: "xMidYMid slice"
  //   }
  // };

  return (
    // <div>
    //   <Lottie options={defaultOptions} height={"50vh"} width={"50vw"} />
    // </div>
    <React.Fragment>
      <SreenWrapper onClick={() => goToHome()} />
      {/* <Warning /> */}
    </React.Fragment>
    // <video
    //   autoPlay
    //   style={{
    //     // width: "100vw",
    //     display: "block",
    //     height: "100vh",
    //     margin: "auto",
    //   }}
    //   src={`/video/video_pepsi_fsu.mp4`}
    //   loop
    //   onClick={() => this.goToHome()}
    // />
  );

};

export default Attractor;
