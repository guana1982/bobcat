import * as React from "react";
import { Route } from "react-router";

/* ==== PAGES ==== */
import HomeComponent from "../layout/home/home.component";
import PrepayComponent from "../layout/prepay/prepay.component";
import MenuComponent from "../layout/menu/menu.component";

/* ==== STORES ==== */
import { ConfigConsumer } from "../store";
import { TimerConsumer } from "../store/timer.service";
import { GlobalStyle } from "./app.style";
import AttractorComponent from "../layout/attractor/attractor.component";

class AppRouter extends React.Component<any, any> {

  constructor(props) {
    super(props);
    console.log(props);
  }

  /* DEFINE CONSUMER */
  withGlobalConsumer = Comp => props => (
    <ConfigConsumer>
      {config =>
        <TimerConsumer>
           {timer =>
            <Comp {...props} configConsumer={config} timerConsumer={timer}></Comp>}
        </TimerConsumer>
      }
    </ConfigConsumer>
  )

  render() {
    return (
      <section>
          <GlobalStyle />
          <Route exact path="/" component={this.withGlobalConsumer(AttractorComponent)}/>
          <Route path="/home" component={this.withGlobalConsumer(HomeComponent)}/>
          <Route path="/prepay" component={this.withGlobalConsumer(this.withGlobalConsumer(PrepayComponent))}/>
          <Route path="/menu/:typeMenu(tech|crew)" component={this.withGlobalConsumer(MenuComponent)}/>
      </section>
    );
  }

}

export default AppRouter;