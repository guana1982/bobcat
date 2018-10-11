import * as React from "react";
import { Route } from "react-router";

/* ==== PAGES ==== */
import ScreenSaverComponent from "../layout/screen-saver/screen-saver.component";
import HomeComponent from "../layout/home/home.component";
import PrepayComponent from "../layout/prepay/prepay.component";
import MenuComponent from "../layout/menu/menu.component";

/* ==== STORES ==== */
import { PaymentStore, PaymentConsumer } from "../models/Payment";
import { MenuStore, MenuConsumer } from "../models/Menu";
import { ConfigConsumer } from "../models";
import { InactivityTimerConsumer } from "../models/InactivityTimer";

class AppRouter extends React.Component<any, any> {

  constructor(props) {
    super(props);
    console.log(props);
  }

  /* DEFINE CONSUMER */
  withGlobalConsumer = Comp => props => (
    <ConfigConsumer>
      {config =>
        <InactivityTimerConsumer>
           {inactivityTimer =>
            <Comp {...props} configConsumer={config} inactivityTimerConsumer={inactivityTimer}></Comp>}
        </InactivityTimerConsumer>
      }
    </ConfigConsumer>
  )

  /* SPECIFY STORE ==> */
  withPaymentStore = Comp => props => (
    <PaymentStore>
      <PaymentConsumer>
        {payment => <Comp {...props} paymentConsumer={payment}></Comp>}
      </PaymentConsumer>
    </PaymentStore>
  )

  withMenuStore = Comp => props => (
    <MenuStore>
      <MenuConsumer>
        {menu => <Comp {...props} menuConsumer={menu}></Comp>}
      </MenuConsumer>
    </MenuStore>
  )
  /* <== SPECIFY STORE */

  render() {
    return (
      <section>
          <Route exact path="/" component={this.withGlobalConsumer(ScreenSaverComponent)}/>
          <Route path="/home" component={this.withGlobalConsumer(HomeComponent)}/>
          <Route path="/prepay" component={this.withPaymentStore(PrepayComponent)}/>
          <Route path="/menu/:typeMenu(tech|crew)" component={this.withMenuStore(MenuComponent)}/>
      </section>
    );
  }

}

export default AppRouter;