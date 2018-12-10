import * as React from "react";
import { SreenWrapper } from "../../components/global/ScreenWrapper";
import mediumLevel from "../../utils/MediumLevel";
import { TimerInterface } from "../../store/timer.service";
import { ConfigInterface } from "../../store/config.service";

import Lottie from "react-lottie";
import { map, tap, mergeMap } from "rxjs/operators";
import { Subscription } from "rxjs";
import { SOCKET_ATTRACTOR } from "../../utils/constants";
// const animationData = require("./bubbles.json");

interface AttractorProps {
  history: any;
  configConsumer: ConfigInterface;
  timerConsumer: TimerInterface;
}

interface AttractorState {}

class AttractorComponent extends React.Component<AttractorProps, AttractorState> {

  readonly state: AttractorState;

  wsSub_: Subscription;

  constructor(props) {
    super(props);
    console.log(props);
  }

  componentWillMount() {
    this.wsSub_ = this.startVideo()
    .subscribe(value => {
      let page = "";
      if (value === "stop_video")
        page = "home";
      else if (value === "start_camera")
        page = "prepay";

      this.props.history.push(`/${page}`);
    });
  }

  componentWillUnmount() {
    mediumLevel.config.stopVideo()
    .pipe(
      tap(() => this.wsSub_.unsubscribe())
    )
    .subscribe();
  }

  goToHome() {
    this.props.history.push("/home");
  }

  startVideo() {
    return mediumLevel.config.startVideo()
    .pipe(
      mergeMap(() => {
        const { ws } = this.props.configConsumer;
        const onmessage = ws
        .multiplex(
          () => console.info(`Start => ${SOCKET_ATTRACTOR}`),
          () => console.info(`End => ${SOCKET_ATTRACTOR}`),
          (data) => data && data.message_type === SOCKET_ATTRACTOR
        )
        .pipe(
          map(data => data.value)
        );
        return onmessage;
      })
    );
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
