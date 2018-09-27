import * as React from "react";
import { SreenWrapper } from "../../components/global/ScreenWrapper";
import mediumLevel from "../../utils/MediumLevel";
import { RouterConsumer, RouterInterface } from "../../models";

interface ScreenSaverProps {
  routerConsumer: RouterInterface;
}

interface ScreenSaverState {}

class ScreenSaver extends React.Component<ScreenSaverProps, ScreenSaverState> {

  constructor(props) {
    super(props);
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
    this.props.routerConsumer.setPage("HOME");
  }

  render() {
    return (
      <SreenWrapper onClick={ () => this.goToHome() }></SreenWrapper>
    );
  }
}

const withConsumer = Comp => props => (
  <RouterConsumer>
    {router => (
      <Comp {...props} routerConsumer={router}></Comp>
    )}
  </RouterConsumer>
);

export default withConsumer(ScreenSaver);
