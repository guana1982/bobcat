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

interface HomeState {}

export class Home extends React.Component<HomeProps, HomeState> {

  actionsLauncher: Action[];

  constructor(props) {
    super(props);
    console.log(props);
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
    else
      alert(gestureType);
  }

  render() {
    return (
      <HomeContent>
        <Gesture onGesture={this.onGesture} />
        <Header>
          <h2>Good morning!</h2>
        </Header>
        <Grid>
          <Col>
            <Beverage size={"large"}> {/* onTouchEnd={} onTouchStart={} */}
              <div id="element">
                <h3>Test 1</h3>
              </div>
            </Beverage>
          </Col>
          <Col>
            <Beverage status={"active"}>
              <div id="element">
                <h3>Test 2</h3>
              </div>
            </Beverage>
            <Beverage>
              <div id="element">
                <h3>Test 3</h3>
              </div>
            </Beverage>
          </Col>
          <Col>
            <Beverage>
              <div id="element">
                <h3>Test 4</h3>
              </div>
            </Beverage>
            <Beverage>
              <div id="element">
                <h3>Test 5</h3>
              </div>
            </Beverage>
          </Col>
          <Col>
            <Beverage>
              <div id="element">
                <h3>Test 6</h3>
              </div>
            </Beverage>
            <Beverage>
              <div id="element">
                <h3>Test 7</h3>
              </div>
            </Beverage>
          </Col>
        </Grid>
        <Footer>
        <ReplaySubscription source={this.props.inactivityTimerConsumer.time$}>
          {time =>
            <p>test {time ? time.s : ""}</p>
          }
        </ReplaySubscription>
        </Footer>
        {/* <div>
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
        </div> */}
        {/* <LauncherComponent actions={this.actionsLauncher} /> */}
      </HomeContent>
    );
  }
}

export default Home;