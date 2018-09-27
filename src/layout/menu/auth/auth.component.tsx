import * as React from "react";
import i18n from "../../../i18n";

import { ActionButton } from "../../../components/global/ActionButton";
import { ConfigConsumer } from "../../../models";
import Auth from "../../../components/MenuV2/Auth";

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
        <Auth
          menuId={"tech"}
          onError={() => alert("error")}
          onSuccess={() => alert("ok")}
          failed={false}
        />
      </div>
    );
  }
}

export default AuthComponent;