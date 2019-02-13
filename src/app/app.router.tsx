import * as React from "react";
import { Route } from "react-router";

/* ==== PAGES ==== */
import HomeComponent from "../layout/home/home.component";
import PrepayComponent from "../layout/prepay/prepay.component";
import MenuComponent from "../layout/menu/menu.component";

/* ==== STORES ==== */
import { ConfigConsumer } from "../store";
import { TimerConsumer } from "../store/timer.store";
import { GlobalStyle } from "./app.style";
import AttractorComponent from "../layout/attractor/attractor.component";
import { Pages } from "../utils/constants";
import { ConsumerConsumer, ConsumerStore } from "../store/consumer.store";
import { AccessibilityConsumer, FocusElm } from "../store/accessibility.store";

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
            <ConsumerConsumer>
              {consumer =>
                <Comp
                  {...props}
                  configConsumer={config}
                  timerConsumer={timer}
                  consumerConsumer={consumer}
                />
              }
            </ConsumerConsumer>
          }
        </TimerConsumer>
      }
    </ConfigConsumer>
  )

  render() {
    return (
      <React.Fragment>
          <GlobalStyle />
          <Route exact path={Pages.Attractor} component={this.withGlobalConsumer(AttractorComponent)}/>
          <Route path={Pages.Home} component={HomeComponent}/>
          <Route path={Pages.Prepay} component={this.withGlobalConsumer(PrepayComponent)}/>
          <Route path={Pages.Menu} component={this.withGlobalConsumer(MenuComponent)}/>
      </React.Fragment>
    );
  }

}

export default AppRouter;