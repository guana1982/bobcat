import * as React from "react";
import {Route, HashRouter, withRouter} from "react-router";
import AuthComponent from "./auth/auth.component";
import { LauncherComponent } from "./launcher/launcher.component";

class MenuRouter extends React.Component<any, any> {

  constructor(props) {
    super(props);
    console.log(props);
  }

  render() {
    const { path } = this.props.match;
    return (
      <div>
        <Route path={`${path}/auth`} component={AuthComponent}/>
        <Route path={`${path}/launcher`} component={LauncherComponent}/>
      </div>
    );
  }

}

export default withRouter(MenuRouter);