import * as React from "react";
import i18n from "../../../i18n";

import { ActionButton } from "../../../components/global/ActionButton";
import { ConfigConsumer } from "../../../models";

interface LauncherProps {
  history: any;
}

interface LauncherState {
    date: Date;
}

export class LauncherComponent extends React.Component<LauncherProps, LauncherState> {

  timerID: any;

  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
        date: new Date()
    };
  }

  componentDidMount() { }

  componentWillUnmount() { }

  render() {
    return (
      <div>
        LauncherComponent
      </div>
    );
  }
}

export default LauncherComponent;