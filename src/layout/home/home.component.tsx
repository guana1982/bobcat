import * as React from "react";
import i18n from "../../i18n";

import { ActionButton } from "../../components/global/ActionButton";
import { ConfigConsumer, ConfigInterface } from "../../models";
import LauncherComponent, { Action } from "../../components/global/Launcher";
import Gesture from "../../components/Menu/Gesture";
import { InactivityTimerInterface } from "../../models/InactivityTimer";

import { HomeContent, Header, Footer, Grid, Beverage, Col } from "./home.style";
import { ReplaySubscription } from "../../components/global/Subscription";
import { ButtonGroup } from "../../components/global/ButtonGroup";

interface BeverageConfig {
  flavor_level?: number;
  carbonation_level: number;
  temperature_level: number;
  b_complex: boolean;
  antioxidants: boolean;
}

interface HomeProps {
  history: any;
  configConsumer: ConfigInterface;
  inactivityTimerConsumer: InactivityTimerInterface;
}

interface HomeState {
  beverageSelected: number;
  beverageConfig: BeverageConfig;
}

export class Home extends React.Component<HomeProps, HomeState> {

  actionsLauncher: Action[];
  beverages: any[] = ["Water", "Lemon Lime", "Raspberry Lime", "Lemon Mint", "Ginger Lemon", "Peach", "Cucumber"];
  buttonsTest: any[];

  constructor(props) {
    super(props);
    console.log(props);

    this.state = {
      beverageSelected: null,
      beverageConfig: null
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

    this.buttonsTest = [
      {label: "val1", value: "1"},
      {label: "val2", value: "2"},
      {label: "val3", value: "3"}
    ];
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
      beverageSelected: this.beverages.indexOf(beverage),
      beverageConfig: {
        flavor_level: 0,
        carbonation_level: sparkling ? 100 : 0,
        temperature_level: 100,
        b_complex: false,
        antioxidants: false
      }
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

  private pourBeverage() {
    console.log("POUR");
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

  tapButton = () => {

  }

  private CustomizeBeverage = () => {
    return(
      <div>
        <button onClick={() => this.resetBeverage()}>Reset</button>
        <p>{this.getBeverage()}</p>
        <div>
          <p>flavor_level: {this.state.beverageConfig.flavor_level}</p>
          <ButtonGroup buttons={this.buttonsTest} tapButton={this.tapButton}></ButtonGroup>
        </div>
        <div>
          <p>carbonation_level: {this.state.beverageConfig.carbonation_level}</p>
          <ButtonGroup buttons={this.buttonsTest} tapButton={this.tapButton}></ButtonGroup>
        </div>
        <div>
          <p>temperature_level: {this.state.beverageConfig.temperature_level}</p>
          <ButtonGroup buttons={this.buttonsTest} tapButton={this.tapButton}></ButtonGroup>
        </div>
        <div>
          <button type="button">add b-complex</button>
          <button type="button">add antioxidants</button>
        </div>
        <button onClick={() => this.pourBeverage()}>Pour</button>
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