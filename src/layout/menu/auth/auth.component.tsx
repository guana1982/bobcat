import * as React from "react";
import i18n from "../../../i18n";

import { ActionButton } from "../../../components/global/ActionButton";
import { ConfigConsumer } from "../../../models";

interface AuthProps {
  history: any;
}

interface AuthState {
    date: Date;
}

export class AuthComponent extends React.Component<AuthProps, AuthState> {

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
        AuthComponent
      </div>
    );
  }
}

export default AuthComponent;