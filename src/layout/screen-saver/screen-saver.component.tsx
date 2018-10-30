import * as React from "react";
import { SreenWrapper } from "../../components/global/ScreenWrapper";
import mediumLevel from "../../utils/MediumLevel";
import { InactivityTimerInterface } from "../../models/InactivityTimer";
import { ConfigInterface } from "../../models/Config";

import Lottie from "react-lottie";
const animationData = require("./bubbles.json");

interface ScreenSaverProps {
  history: any;
  configConsumer: ConfigInterface;
  inactivityTimerConsumer: InactivityTimerInterface;
}

interface ScreenSaverState {}

class ScreenSaverComponent extends React.Component<ScreenSaverProps, ScreenSaverState> {

  constructor(props) {
    super(props);
    console.log(props);
  }

  componentWillMount() {
    mediumLevel.config.startVideo()
    .subscribe(() => console.log("Video Start!"));
  }

  componentWillUnmount() {
    mediumLevel.config.stopVideo()
    .subscribe(() => console.log("Video Stop!"));
  }

  goToHome() {
    this.props.history.push("/home");
  }

  render() {

    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice"
      }
    };

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

export default ScreenSaverComponent;
