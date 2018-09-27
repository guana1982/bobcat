import * as React from "react";
import {Route, HashRouter, withRouter} from "react-router";

import { Home } from "../layout";
import { Prepay } from "../layout/Prepay";
import { MenuComponent } from "../layout/menu/menu.component";
import ScreenSaver from "../VendorComponents/ScreenSaver";
import { PaymentStore, PaymentConsumer } from "../models";

class AppRouter extends React.Component<any, any> {

  constructor(props) {
    super(props);
    console.log(props);
  }

  withConsumer = Comp => props => (
    <PaymentStore> { /* To FIX */}
      <PaymentConsumer>
        {payment => (
          <Comp {...props} paymentConsumer={payment}></Comp>
        )}
      </PaymentConsumer>
    </PaymentStore>
  )

  render() {
    const { path } = this.props.match;
    return (
      <section>
          <Route exact path="/" component={ScreenSaver}/>
          <Route path="/home" component={Home}/>
          <Route path="/prepay" component={this.withConsumer(Prepay)}/>
          <Route path="/menu/:typeMenu(tech|crew)" component={MenuComponent}/>
      </section>
    );
  }

}

export default withRouter(AppRouter);