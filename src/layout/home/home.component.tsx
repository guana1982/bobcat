import * as React from "react";
import i18n from "../../i18n";

import { ActionButton } from "../../components/global/ActionButton";
import { ConfigConsumer, ConfigInterface } from "../../models";
import LauncherComponent, { Action } from "../../components/global/Launcher";
import Gesture from "../../components/Menu/Gesture";
import { InactivityTimerInterface } from "../../models/InactivityTimer";

import { HomeContent, Header, Footer, Grid, Beverage, Col, Pour, CircleBtn, CustomizeBeverageCard, InfoCard } from "./home.style";
import { ReplaySubscription } from "../../components/global/Subscription";
import { ButtonGroup } from "../../components/global/ButtonGroup";

interface Beverage {
  label: string;
  flavor: string;
}

interface BeverageConfig {
  flavor_level: number;
  carbonation_level: number;
  temperature_level: number;
  b_complex?: boolean;
  antioxidants?: boolean;
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
  beverages: Beverage[];
  levels: any = null;

  constructor(props) {
    super(props);
    console.log(props);

    this.state = {
      beverageSelected: null,
      beverageConfig: null
    };

    this.beverages = [
      {label: "Water", flavor: null},
      {label: "Lemon Lime", flavor: "F1"},
      {label: "Raspberry Lime", flavor: "F2"},
      {label: "Lemon Mint", flavor: "F3"},
      {label: "Ginger Lemon", flavor: "F4"},
      {label: "Peach", flavor: "F5"},
      {label: "Cucumber", flavor: "F6"}
    ];
    console.log(this.beverages);

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

    this.levels = {
      flavor: [
        {label: "light", value: 0},
        {label: "middle", value: 50},
        {label: "full", value: 100}
      ],
      carbonation: [
        {label: "light", value: 0},
        {label: "middle", value: 50},
        {label: "strong", value: 100}
      ],
      temperature: [
        {label: "room", value: 100},
        {label: "middle", value: 50},
        {label: "cold", value: 0}
      ],
    };
  }

  componentWillUnmount() {}

  onGesture = (gestureType) => {
    if (gestureType === "p")
      this.props.history.push("/menu/tech");
    else if (gestureType === "v")
      this.props.history.push("/menu/crew");
  }

  private selectBeverage(beverage: Beverage, sparkling?: boolean) {
    this.setState({
      beverageSelected: this.beverages.indexOf(beverage),
      beverageConfig: {
        flavor_level: beverage.flavor ? 100 : null,
        carbonation_level: sparkling ? 100 : 0,
        temperature_level: 100,
        b_complex: false,
        antioxidants: false
      }
    });
  }

  private getBeverage(): Beverage {
    return this.beverages ? this.beverages[this.state.beverageSelected] : null;
  }

  private resetBeverage() {
    this.setState({
      beverageSelected: null
    });
  }

  private pourBeverage() {
    console.log("POUR");
  }

  private Col = (b) => {

  }

  private ChoiceBeverage = () => {
    return (
      <React.Fragment>
        <Gesture onGesture={this.onGesture} />
        <Header>
          <h2>Good morning!</h2>
        </Header>
        <Grid>
        {this.beverages.map((b, i) => {
          return (
            <Col key={i}>
              <Beverage onClick={() => this.selectBeverage(b)}> {/* onTouchEnd={} onTouchStart={} */}
                <div id="element">
                  <h3>{b.label}</h3>
                  <h5>0-CALS</h5>
                </div>
              </Beverage>
              <Beverage onClick={() => this.selectBeverage(b, true)} type={"sparkling"}>
                <div id="element">
                  <h3>{b.label}</h3>
                  <h5>0-CALS</h5>
                </div>
              </Beverage>
            </Col>
          );
        })}
        </Grid>
      </React.Fragment>
    );
  }

  handleChange = (value: any, type: string) => {
    let beverageConfig = this.state.beverageConfig;
    switch (type) {
      case "flavor":
        beverageConfig.flavor_level = value;
        break;
      case "carbonation":
        beverageConfig.carbonation_level = value;
        break;
      case "temperature":
        beverageConfig.temperature_level = value;
        break;
      default:
        break;
    }
    this.setState({beverageConfig});
  }

  goToScreenSaver = () => {
    this.props.history.push("/");
  }

  private CustomizeBeverage = () => {
    return(
      <React.Fragment>
        <Header>
          <CircleBtn bgColor="primary" icon={"icons/left-arrow.svg"} onClick={() => this.resetBeverage()}></CircleBtn>
        </Header>
        <Grid>
          <InfoCard>
            <h4>/</h4>
          </InfoCard>
          <CustomizeBeverageCard>
            <img src="img/sparkling.svg" />
            <h2>{this.getBeverage().label}</h2>
            { this.state.beverageConfig.flavor_level != null && <ButtonGroup label={"Flavor"} options={this.levels.flavor} value={this.state.beverageConfig.flavor_level} onChange={(value) => this.handleChange(value, "flavor")}></ButtonGroup>}
            <ButtonGroup label={"Sparkling"} options={this.levels.carbonation} value={this.state.beverageConfig.carbonation_level} onChange={(value) => this.handleChange(value, "carbonation")}></ButtonGroup>
            <ButtonGroup label={"Temp"} options={this.levels.temperature} value={this.state.beverageConfig.temperature_level} onChange={(value) => this.handleChange(value, "temperature")}></ButtonGroup>
            <p>flavor_level: {this.state.beverageConfig.flavor_level}, carbonation_level: {this.state.beverageConfig.carbonation_level}, temperature_level: {this.state.beverageConfig.temperature_level}</p>
            {/* <div>
              <button type="button">add b-complex</button>
              <button type="button">add antioxidants</button>
            </div> */}
          </CustomizeBeverageCard>
          <InfoCard>
            <h4>/</h4>
          </InfoCard>
        </Grid>
        <Pour onClick={() => this.pourBeverage()}>Pour</Pour>
      </React.Fragment>
    );
  }

  render() {
    return (
      <HomeContent>
        {!this.getBeverage() ? <this.ChoiceBeverage /> : <this.CustomizeBeverage />}
        <Footer>
          {/* <ReplaySubscription source={this.props.inactivityTimerConsumer.time$}>
            {time =>
              <p>test {time ? time.s : ""}</p>
            }
          </ReplaySubscription>
          <button type="button" onClick={() => this.goToScreenSaver()}>Screen</button> */}
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