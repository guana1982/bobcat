import * as React from "react";
import {Route} from "react-router";
import AuthComponent from "./auth/auth.component";
import { LauncherComponent } from "./launcher/launcher.component";
import MenuComponent from "./menu.component";


class MenuRouter extends React.Component {
    render() {
        return (
            <div>
                <Route path="/" component={MenuComponent}/>
                <Route path="/auth" component={AuthComponent}/>
                <Route path="/launcher" component={LauncherComponent}/>
            </div>
        );
    }
}

export default MenuRouter;