import * as React from "react";
import { SreenWrapper } from "../../components/ScreenWrapper";
import mediumLevel from "@utils/MediumLevel";
import { TimerInterface } from "@containers/timer.store";
import { ConfigInterface } from "@containers/config.store";

import Lottie from "react-lottie";
import { map, tap, mergeMap } from "rxjs/operators";
import { Subscription } from "rxjs";
import { SOCKET_ATTRACTOR, MESSAGE_START_CAMERA, MESSAGE_STOP_VIDEO } from "@utils/constants";
// const animationData = require("./bubbles.json");

interface AttractorProps {
  history: any;
  configConsumer: ConfigInterface;
  timerConsumer: TimerInterface;
}

interface AttractorState {}

class AttractorComponent extends React.Component<AttractorProps, AttractorState> {

  readonly state: AttractorState;

  video_: Subscription;

  constructor(props) {
    super(props);
    console.log(props);
  }

  componentDidMount() {
    this.video_ = mediumLevel.config.startVideo().subscribe();
  }

  componentWillUnmount() {
    mediumLevel.config.stopVideo()
    .pipe(
      tap(() => this.video_.unsubscribe())
    )
    .subscribe();
  }

  goToHome() {
    this.props.history.push("/home");
  }

  render() {

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
      //   <Lottie options={defaultOptions} height={"100vh"} width={"100vw"} />
      // </div>
      <SreenWrapper onClick={ () => this.goToHome() }></SreenWrapper>
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
  }
}

export default AttractorComponent;
