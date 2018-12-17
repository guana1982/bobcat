import * as React from "react";

import { ConfigConsumer, ConfigInterface, TimerInterface } from "../../store";
import LauncherComponent, { Action } from "../../components/global/Launcher";
import Gesture from "../../components/Menu/Gesture";

import { HomeContent, Header, Footer, Grid, Beverage, Pour, CustomizeBeverageCard, InfoCard, TimerLabel, CustomizeBeverageWrap, ChoiceBeverageWrap } from "./home.style";
import { ReplaySubscription } from "../../components/global/Subscription";
import { ButtonGroup } from "../../components/global/ButtonGroup";
import { CircleBtn } from "../../components/global/CircleBtn";
import { IBeverageConfig, IBeverage } from "../../models";
import { __ } from "../../utils/lib/i18n";
import SlideComponent from "../../components/global/Slide";

interface HomeProps {
  history: any;
  configConsumer: ConfigInterface;
  timerConsumer: TimerInterface;
}

interface HomeState {
  isSparkling: boolean;
  beverageSelected: number;
  beverageConfig: IBeverageConfig;
}

const beveragePlain = "plain";
const beverageBev = "bev";

export class Home extends React.Component<HomeProps, HomeState> {

  readonly state: HomeState;

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
        temperature_level: 0,
        b_complex: false,
        antioxidants: false
      }
    };

    this.beverages = this.props.configConsumer.beverages.filter(beverage => {
      const { beverage_type, line_id } = beverage;
      return beverage_type === beveragePlain || beverage_type === beverageBev && line_id > 0;
    });
    // this.beverages = [
    //   {label: "Water", id: 9, type: "water"},
    //   {label: "Lemon Lime", id: 1},
    //   {label: "Raspberry Lime", id: 2},
    //   {label: "Lemon Mint", id: 3},
    //   {label: "Ginger Lemon", id: 4},
    //   {label: "Peach", id: 5},
    //   {label: "Cucumber", id: 6}
    // ];
    console.log(this.beverages);

    this.types = [
      {label: "Still", value: false},
      {label: "Sparkling", value: true}
    ];

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
    this.props.timerConsumer.startTimer();

    this.levels = {
      flavor: [
        {label: "light", value: 0},
        {label: "full", value: 50},
        {label: "bold", value: 100}
      ],
      carbonation: [
        {label: "light", value: 0},
        {label: "medium", value: 50},
        {label: "full", value: 100}
      ],
      temperature: [
        {label: "ambient", value: 100},
        {label: "cool", value: 50},
        {label: "ice-cold", value: 0},
      ],
      carbTemperature: [
        {label: "ice-cold", value: 100},
      ]
    };
  }

  componentWillUnmount() {
    this.props.timerConsumer.resetTimer();
  }

  /* ==== BEVERAGE ==== */
  /* ======================================== */

  private selectBeverage(beverage: IBeverage) {
    this.setState(prevState => ({
      ...prevState,
      beverageSelected: this.beverages.indexOf(beverage),
      beverageConfig: {
        ...prevState.beverageConfig,
        flavor_level: beverage.beverage_type !== beveragePlain ? 50 : null,
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
    const beverageConfig = {...this.state.beverageConfig};
    if (beverageConfig.carbonation_level == null) {
      beverageConfig.carbonation_level = 0;
    }
    this.props.configConsumer.onStartPour(beverageSelected, beverageConfig)
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

  private goToPrepay = () => {
    this.props.history.push("/prepay");
  }

  /* ==== LAYOUT ==== */
  /* ======================================== */

  private ChoiceBeverage = () => {
    return (
      <React.Fragment>
        <SlideComponent />
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
                <h3>{__(b.beverage_label_id)}</h3>
                <h6>0-CALS</h6>
                <h5>Tap to Customize</h5>
              </div>
            </Beverage>
            );
          })}
          </Grid>
          <Footer>
            {/* <CircleBtn label={"Nutrition"} color={"primary"} border={true} icon={"icons/info.svg"} />
            <CircleBtn onClick={() => this.goToPrepay()} label={"Sign In"} color={"primary"} border={true} icon={"icons/qr-code.svg"} /> */}
            {/* <ReplaySubscription source={this.props.timerConsumer.time$}>
              {time =>
                <TimerLabel>Timer: {time ? time.s : "-"}</TimerLabel>
              }
            </ReplaySubscription> */}
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
          <InfoCard className={"right"}>
            <header>
              <h3>Sign-up to track your hydration</h3>
            </header>
            <aside>
              <img src={"icons/smartphone.svg"} />
            </aside>
            <footer>
              <h4>Now available in App Stores</h4>
            </footer>
          </InfoCard>
          <CustomizeBeverageCard type={this.state.isSparkling ? "sparkling" : null}>
            <header>
              <h2>{__(this.getBeverageSelected().beverage_label_id)}</h2>
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
          <InfoCard className={"left"}>
            <header>
              <h3>This office<br/> saved</h3>
            </header>
            <aside>
              <img src={"icons/bottle.svg"} />
            </aside>
            <footer>
              <h2>239</h2>
              <h4>Plastic Bottles</h4>
            </footer>
          </InfoCard>
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