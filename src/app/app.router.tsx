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

class AppRouter extends React.Component<any, any> {

  constructor(props) {
    super(props);
    console.log(props);
  }

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

  render() {
    return (
      <section>
          <Route exact path="/" component={ScreenSaverComponent}/>
          <Route path="/home" component={HomeComponent}/>
          <Route path="/prepay" component={this.withPaymentStore(Prepay)}/>
          <Route path="/menu/:typeMenu(tech|crew)" component={this.withPaymentStore(MenuComponent)}/>
      </section>
    );
  }

}

export default AppRouter;