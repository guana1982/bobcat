import * as React from "react";
import i18n from "../../i18n";

import { ActionButton } from "../../components/global/ActionButton";
import { ConfigConsumer, ConfigInterface } from "../../models";
import LauncherComponent, { Action } from "../../components/global/Launcher";
import Gesture from "../../components/Menu/Gesture";
import { InactivityTimerInterface } from "../../models/InactivityTimer";

import { HomeContent, Header, Footer, Grid, Beverage, Col } from "./home.style";
import { ReplaySubscription } from "../../components/global/Subscription";

interface HomeProps {
  history: any;
  configConsumer: ConfigInterface;
  inactivityTimerConsumer: InactivityTimerInterface;
}

interface HomeState {
  beverageSelected: number;
}

export class Home extends React.Component<HomeProps, HomeState> {

  actionsLauncher: Action[];
  beverages: any[] = ["Water", "Lemon Lime", "Raspberry Lime", "Lemon Mint", "Ginger Lemon", "Peach", "Cucumber"];

  constructor(props) {
    super(props);
    console.log(props);

    this.state = {
      beverageSelected: null
    };

    this.actionsLauncher = [
      {
        title: "TEST QR CODE",
        event: () => this.props.history.push("/prepay")
      },
      {
        title: "CREW MENU",
        event: () => this.props.history.push("/menu/crew")
      },
      {
        title: "TECH MENU",
        event: () => this.props.history.push("/menu/tech")
      }
    ];
  }

  componentDidMount() {
    this.props.inactivityTimerConsumer.startTimer();
  }

  componentWillUnmount() {}

  onGesture = (gestureType) => {
    if (gestureType === "p")
      this.props.history.push("/menu/tech");
    if (gestureType === "v")
      this.props.history.push("/menu/crew");
    else
      alert(gestureType);
  }

  private selectBeverage(beverage: any, sparkling?: boolean) {
    this.setState({
      beverageSelected: this.beverages.indexOf(beverage)
    });
  }

  private getBeverage() {
    return this.beverages[this.state.beverageSelected];
  }

  private resetBeverage() {
    this.setState({
      beverageSelected: null
    });
  }

  private ChoiceBeverage = () => {
    return (
      <div>
        <Header>
          <h2>Good morning!</h2>
        </Header>
        <Grid>
        {this.beverages.map((b, i) => {
          return (
            <Col key={i}>
              <Beverage onClick={() => this.selectBeverage(b)}> {/* onTouchEnd={} onTouchStart={} */}
                <div id="element">
                  <h3>{b}</h3>
                  <h5>0-CALS</h5>
                </div>
              </Beverage>
              <Beverage onClick={() => this.selectBeverage(b, true)} type={"sparkling"}>
                <div id="element">
                  <h3>{b}</h3>
                  <h5>0-CALS</h5>
                </div>
              </Beverage>
            </Col>
          );
        })}
        </Grid>
      </div>
    );
  }

  private CustomizeBeverage = () => {
    return(
      <div>
        <button onClick={() => this.resetBeverage()}>Reset</button>
        <p>{this.getBeverage()}</p>
      </div>
    );
  }

  render() {
    return (
      <HomeContent>
        <Gesture onGesture={this.onGesture} />
        {!this.getBeverage() ? <this.ChoiceBeverage /> : <this.CustomizeBeverage />}
        <Footer>
          <ReplaySubscription source={this.props.inactivityTimerConsumer.time$}>
            {time =>
              <p>test {time ? time.s : ""}</p>
            }
          </ReplaySubscription>
        </Footer>
      </HomeContent>
    );
  }
}

export default Home;

/* <div>
  <h1>{i18n.t("home.label")}</h1>
  <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
  <ActionButton />
  <ConfigConsumer>
    {({ isLit, onToggleLight }) => (
      <div className={`room ${isLit ? "lit" : "dark"}`}>
        The room is {isLit ? "lit" : "dark"}.
        <br />
        <button onClick={onToggleLight}>Flip</button>
      </div>
    )}
  </ConfigConsumer>
</div> */
/* <LauncherComponent actions={this.actionsLauncher} /> */