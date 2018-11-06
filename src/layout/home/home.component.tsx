import * as React from "react";
import i18n from "../../i18n";

import { ActionButton } from "../../components/global/ActionButton";
import { ConfigConsumer, ConfigInterface } from "../../models";
import LauncherComponent, { Action } from "../../components/global/Launcher";
import Gesture from "../../components/Menu/Gesture";
import { InactivityTimerInterface } from "../../models/InactivityTimer";

import { HomeContent, Header, Footer, Grid, Beverage, Col, Pour, CircleBtn, CustomizeBeverageCard, InfoCard, TimerLabel, CustomizeBeverageWrap } from "./home.style";
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
      beverageConfig: null
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
        {label: "middle", value: 50},
        {label: "full", value: 100}
      ],
      noCarbonation: [
        {label: "light", value: 0},
        {label: "middle", value: 25},
        {label: "strong", value: 50}
      ],
      carbonation: [
        {label: "light", value: 50},
        {label: "middle", value: 75},
        {label: "strong", value: 100}
      ],
      temperature: [
        {label: "room", value: 100},
        {label: "middle", value: 50},
        {label: "cold", value: 0}
      ],
    };
  }

  componentWillUnmount() {
    this.props.inactivityTimerConsumer.resetTimer();
  }

  onGesture = (gestureType) => {
    if (gestureType === "p")
      this.props.history.push("/menu/tech");
    else if (gestureType === "v")
      this.props.history.push("/menu/crew");
  }

  private selectBeverage(beverage: IBeverage) {
    this.setState({
      beverageSelected: this.beverages.indexOf(beverage),
      beverageConfig: {
        isSparkling: this.state.isSparkling,
        flavor_level: beverage.type !== "water" ? 100 : null,
        carbonation_level: this.state.isSparkling ? 100 : 0,
        temperature_level: 100,
        b_complex: false,
        antioxidants: false
      }
    });
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

  private ChoiceBeverage = () => {
    return (
      <React.Fragment>
        <Gesture onGesture={this.onGesture} />
        <Header>
          <h2>Good morning!</h2>
          <div id="content">
            <ButtonGroup
              options={this.types}
              value={this.state.isSparkling}
              onChange={(value) => this.setState({isSparkling: value})}>
            </ButtonGroup>
          </div>
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
        <LauncherComponent actions={this.actionsLauncher} />
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
        <CustomizeBeverageWrap>
          <div id="backdrop"></div>
          <Header>
            <CircleBtn bgColor="primary" icon={"icons/left-arrow.svg"} onClick={() => this.resetBeverage()}></CircleBtn>
          </Header>
          <Grid>
            <InfoCard>
              <h4>/</h4>
            </InfoCard>
            <CustomizeBeverageCard>
              {this.state.beverageConfig.isSparkling &&
                <div>
                  <img src="img/sparkling.svg" />
                  <h4>sparkling</h4>
                </div>
              }

              <h2>{this.getBeverageSelected().label}</h2>

              {this.state.beverageConfig.flavor_level != null &&
                <ButtonGroup
                  label={"Flavor"}
                  options={this.levels.flavor}
                  value={this.state.beverageConfig.flavor_level}
                  onChange={(value) => this.handleChange(value, "flavor")}
                ></ButtonGroup>
              }
              <ButtonGroup
                label={"Sparkling"}
                options={this.levels[this.state.beverageConfig.isSparkling ? "carbonation" : "noCarbonation"]}
                value={this.state.beverageConfig.carbonation_level}
                onChange={(value) => this.handleChange(value, "carbonation")}>
              </ButtonGroup>
              <ButtonGroup
                label={"Temp"}
                options={this.levels.temperature}
                value={this.state.beverageConfig.temperature_level}
                onChange={(value) => this.handleChange(value, "temperature")}>
              </ButtonGroup>

              <p>flavor_level: {this.state.beverageConfig.flavor_level}</p>
              <p>carbonation_level: {this.state.beverageConfig.carbonation_level}</p>
              <p>temperature_level: {this.state.beverageConfig.temperature_level}</p>

              {/* <div>
                <button type="button">add b-complex</button>
                <button type="button">add antioxidants</button>
              </div> */}
            </CustomizeBeverageCard>
            <InfoCard>
              <h4>/</h4>
            </InfoCard>
          </Grid>
          <Pour onTouchStart={() => this.startPour()} onTouchEnd={() => this.stopPour()}>Hold to Pour</Pour>
        </CustomizeBeverageWrap>
      </React.Fragment>
    );
  }

  render() {
    return (
      <HomeContent>
        <this.ChoiceBeverage />
        {this.getBeverageSelected() && <this.CustomizeBeverage />}
        <Footer>
          <ReplaySubscription source={this.props.inactivityTimerConsumer.time$}>
            {time =>
              <TimerLabel>Timer: {time ? time.s : "-"}</TimerLabel>
            }
          </ReplaySubscription>
          {/* <button type="button" onClick={() => this.goToScreenSaver()}>Screen</button> */}
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