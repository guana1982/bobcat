import * as React from "react";
import { Route } from "react-router";

/* ==== PAGES ==== */
import HomeComponent from "@modules/main/pages/home/home.component";
import PrepayComponent from "@modules/main/pages/prepay/prepay.component";
// import MenuComponent from "@modules/main/pages/menu/menu.component";

/* ==== STORES ==== */
import { ConfigConsumer, TimerConsumer } from "@containers/index";
import { GlobalStyle } from "@style";
import AttractorComponent from "@modules/main/pages/attractor/attractor.component";
import { MenuComponent } from "@modules/service/pages/menu/menu.component";

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
          {/* <Route exact path="/" component={this.withGlobalConsumer(MenuComponent)}/> */}
          <Route exact path="/" component={this.withGlobalConsumer(AttractorComponent)}/>
          <Route path="/home" component={this.withGlobalConsumer(HomeComponent)}/>
          <Route path="/prepay" component={this.withGlobalConsumer(this.withGlobalConsumer(PrepayComponent))}/>
          {/* <Route path="/menu/:typeMenu(tech|crew)" component={this.withGlobalConsumer(MenuComponent)}/> */}
          <Route path="/service" component={this.withGlobalConsumer(MenuComponent)}/>
      </section>
    );
  }

}

export default AppRouter;