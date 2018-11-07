import * as React from "react";
import i18n from "../../i18n";

import { ActionButton } from "../../components/global/ActionButton";
import { ConfigConsumer, ConfigInterface } from "../../models";
import LauncherComponent, { Action } from "../../components/global/Launcher";
import Gesture from "../../components/Menu/Gesture";
import { InactivityTimerInterface } from "../../models/InactivityTimer";

import { HomeContent, Header, Footer, Grid, Beverage, Pour, CustomizeBeverageCard, InfoCard, TimerLabel, CustomizeBeverageWrap, ChoiceBeverageWrap } from "./home.style";
import { ReplaySubscription } from "../../components/global/Subscription";
import { ButtonGroup } from "../../components/global/ButtonGroup";
import { IBeverageConfig, IBeverage } from "../../models/Config";

interface HomeProps {
  history: any;
  configConsumer: ConfigInterface;
  inactivityTimerConsumer: InactivityTimerInterface;
}

interface HomeState {
  isSparkling: boolean;
  beverageSelected: number;
  beverageConfig: IBeverageConfig;
}

export class Home extends React.Component<HomeProps, HomeState> {

  actionsLauncher: Action[];
  beverages: IBeverage[];
  levels: any = null;
  types: any = null;

  constructor(props) {
    super(props);
    console.log(props);

    this.state = {
      isSparkling: false,
      beverageSelected: null,
      beverageConfig: {
        flavor_level: null,
        carbonation_level: null,
        temperature_level: 100,
        b_complex: false,
        antioxidants: false
      }
    };

    this.beverages = [
      {label: "Water", id: 9, type: "water"},
      {label: "Lemon Lime", id: 1},
      {label: "Raspberry Lime", id: 2},
      {label: "Lemon Mint", id: 3},
      {label: "Ginger Lemon", id: 4},
      {label: "Peach", id: 5},
      {label: "Cucumber", id: 6}
    ];
    console.log(this.beverages);

    this.types = [
      {label: "Still", value: false},
      {label: "Sparkling", value: true}
    ];

    this.actionsLauncher = [
      // {
      //   title: "TEST QR CODE",
      //   event: () => this.props.history.push("/prepay")
      // },
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
    // this.props.inactivityTimerConsumer.startTimer();

    this.levels = {
      flavor: [
        {label: "light", value: 0},
        {label: "full", value: 50},
        {label: "bold", value: 100}
      ],
      carbonation: [
        {label: "light", value: 50},
        {label: "medium", value: 75},
        {label: "full", value: 100}
      ],
      temperature: [
        {label: "ambient", value: 0},
        {label: "cool", value: 50},
        {label: "ice-cold", value: 100},
      ],
      carbTemperature: [
        {label: "ice-cold", value: 100},
      ]
    };
  }

  componentWillUnmount() {
    this.props.inactivityTimerConsumer.resetTimer();
  }

  /* ==== BEVERAGE ==== */
  /* ======================================== */

  private selectBeverage(beverage: IBeverage) {
    this.setState(prevState => ({
      ...prevState,
      beverageSelected: this.beverages.indexOf(beverage),
      beverageConfig: {
        ...prevState.beverageConfig,
        flavor_level: beverage.type !== "water" ? 50 : null,
        b_complex: false,
        antioxidants: false
      }
    }));
  }

  private getBeverageSelected(): IBeverage {
    return this.beverages ? this.beverages[this.state.beverageSelected] : null;
  }

  private startPour() {
    const beverageSelected =  this.getBeverageSelected();
    this.props.configConsumer.onStartPour(beverageSelected, this.state.beverageConfig)
    .subscribe(data => console.log(data));
  }

  private stopPour() {
    this.props.configConsumer.onStopPour()
    .subscribe(data => console.log(data));
  }

  private resetBeverage() {
    this.setState({
      beverageSelected: null
    });
  }

  /* ==== HANDLE ==== */
  /* ======================================== */

  private handleType = (value) => {
    this.setState(prevState => ({
      ...prevState,
      isSparkling: value,
      beverageConfig: {
        ...prevState.beverageConfig,
        carbonation_level: value ? 100 : null,
        temperature_level: 100
      }
    }));
  }

  private handleChange = (value: any, type: string) => {
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

  /* ==== ROUTING ==== */
  /* ======================================== */

  onGesture = (gestureType) => {
    if (gestureType === "p")
      this.props.history.push("/menu/tech");
    else if (gestureType === "v")
      this.props.history.push("/menu/crew");
  }

  private goToScreenSaver = () => {
    this.props.history.push("/");
  }

  /* ==== LAYOUT ==== */
  /* ======================================== */

  private ChoiceBeverage = () => {
    return (
      <React.Fragment>
        <ChoiceBeverageWrap>
          <Gesture onGesture={this.onGesture} />
          <Header>
            <h2>Good morning!</h2>
          </Header>
          <Grid numElement={this.beverages.length}>
          {this.beverages.map((b, i) => {
            return (
            <Beverage key={i} type={this.state.isSparkling ? "sparkling" : null} onClick={() => this.selectBeverage(b)}>
              <div id="element">
                <h3>{b.label}</h3>
                <h6>0-CALS</h6>
                <h5>Tap to customize</h5>
              </div>
            </Beverage>
            );
          })}
          </Grid>
          <Footer>
            <ReplaySubscription source={this.props.inactivityTimerConsumer.time$}>
              {time =>
                <TimerLabel>Timer: {time ? time.s : "-"}</TimerLabel>
              }
            </ReplaySubscription>
            {/* <button type="button" onClick={() => this.goToScreenSaver()}>Screen</button> */}
          </Footer>
          <LauncherComponent actions={this.actionsLauncher} />
        </ChoiceBeverageWrap>
      </React.Fragment>
    );
  }

  private CustomizeBeverage = () => {
    return(
      <React.Fragment>
        <CustomizeBeverageWrap>
          <div id="backdrop" onClick={() => this.resetBeverage()}></div>
          {/* <InfoCard>
            <h4>/</h4>
          </InfoCard> */}
          <CustomizeBeverageCard type={this.state.isSparkling ? "sparkling" : null}>
            <header>
              <h2>{this.getBeverageSelected().label}</h2>
              <h6>0-CALS</h6>
            </header>
            <aside>
              {this.state.beverageConfig.flavor_level != null &&
                <ButtonGroup
                  label={"Flavor"}
                  options={this.levels.flavor}
                  value={this.state.beverageConfig.flavor_level}
                  onChange={(value) => this.handleChange(value, "flavor")}
                ></ButtonGroup>
              }
              {this.state.beverageConfig.carbonation_level != null &&
                <ButtonGroup
                  label={"Sparkling"}
                  options={this.levels.carbonation}
                  value={this.state.beverageConfig.carbonation_level}
                  onChange={(value) => this.handleChange(value, "carbonation")}>
                </ButtonGroup>
              }
              <ButtonGroup
                label={"Temp"}
                options={this.state.isSparkling ? this.levels.carbTemperature : this.levels.temperature}
                value={this.state.beverageConfig.temperature_level}
                onChange={(value) => this.handleChange(value, "temperature")}>
              </ButtonGroup>
            </aside>

            {/* <p>flavor_level: {this.state.beverageConfig.flavor_level}</p>
            <p>carbonation_level: {this.state.beverageConfig.carbonation_level}</p>
            <p>temperature_level: {this.state.beverageConfig.temperature_level}</p> */}

            {/* <div>
              <button type="button">add b-complex</button>
              <button type="button">add antioxidants</button>
            </div> */}
          </CustomizeBeverageCard>
          {/* <InfoCard>
            <h4>/</h4>
          </InfoCard> */}
          <Pour onTouchStart={() => this.startPour()} onTouchEnd={() => this.stopPour()}>Hold to Pour</Pour>
        </CustomizeBeverageWrap>
      </React.Fragment>
    );
  }

  /* ==== MAIN ==== */
  /* ======================================== */

  render() {
    return (
      <HomeContent beverageIsSelected={Boolean(this.getBeverageSelected())}>
        <this.ChoiceBeverage />
        <div id="types-group">
          <ButtonGroup
            options={this.types}
            value={this.state.isSparkling}
            onChange={(value) => this.handleType(value)}>
          </ButtonGroup>
        </div>
        {this.getBeverageSelected() && <this.CustomizeBeverage />}
      </HomeContent>
    );
  }
}

export default Home;