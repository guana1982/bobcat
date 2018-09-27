import * as React from "react";
import { SreenWrapper } from "../../components/global/ScreenWrapper";
import mediumLevel from "../../utils/MediumLevel";

interface ScreenSaverProps {
  history: any;
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
    return (
      <SreenWrapper onClick={ () => this.goToHome() }></SreenWrapper>
    );
  }
}

export default ScreenSaverComponent;
