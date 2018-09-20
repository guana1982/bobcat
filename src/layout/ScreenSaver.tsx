import * as React from "react";
import { SreenWrapper } from "../components/global/ScreenWrapper";
import mediumLevel from "../utils/MediumLevel";
import { RouterConsumer } from "../models";

interface ScreenSaverProps {}

interface ScreenSaverState {}

class ScreenSaver extends React.Component<ScreenSaverProps, ScreenSaverState> {

  componentWillMount() {
    mediumLevel.config.startVideo()
    .subscribe(() => console.log("Video Start!"));
  }

  componentWillUnmount() {
    mediumLevel.config.stopVideo()
    .subscribe(() => console.log("Video Stop!"));
  }

  render() {
    return (
      <RouterConsumer>
        {({ setPage }) => (
          <SreenWrapper onClick={ () => setPage("HOME") }></SreenWrapper>
        )}
      </RouterConsumer>
    );
  }
}
export default ScreenSaver;
