import * as React from "react";

import { ConfigConsumer, ConfigInterface, TimerInterface } from "../../store";
import LauncherComponent, { Action } from "../../components/global/Launcher";
import Gesture from "../../components/Menu/Gesture";

import { HomeContent, Footer, Grid, Pour, CustomizeBeverageCard, InfoCard, CustomizeBeverageWrap, ChoiceBeverageWrap, Slide, ToggleSlide, HeaderAnimated } from "./home.style";
import { ReplaySubscription } from "../../components/global/Subscription";
import { ButtonGroup } from "../../components/global/ButtonGroup";
import { CircleBtn } from "../../components/global/CircleBtn";
import { IBeverageConfig, IBeverage } from "../../models";
import { __ } from "../../utils/lib/i18n";
import SlideComponent from "../../components/global/Slide";
import { Button, ButtonTypes } from "../../components/global/Button";
import { Beverages, Pages, AlarmsOutOfStock } from "../../utils/constants";
import { BeveragesAnimated, Beverage, BeverageIndicators, BeverageTypes } from "../../components/global/Beverage";
import { ConsumerInterface } from "../../store/consumer.store";
import { IdentificationConsumerTypes, IConsumerBeverage } from "../../utils/APIModel";
import { BeverageStatus } from "../../models/beverage.model";
import { Alert, AlertProps, AlertTypes } from "../../components/global/Alert";
import { mergeMap, first } from "rxjs/operators";

interface HomeProps {
  history: any;
  configConsumer: ConfigInterface;
  timerConsumer: TimerInterface;
  consumerConsumer: ConsumerInterface;
}

interface HomeState {
  isSparkling: boolean;
  beverageSelected: number;
  indexFavoritePouring_: number;
  beverageConfig: IBeverageConfig;
  slideOpen: boolean;
  alert: AlertProps;
}

export class Home extends React.Component<HomeProps, HomeState> {

  readonly state: HomeState;

  // actionsLauncher: Action[];
  levels: any = null;
  types: any = null;

  constructor(props) {
    super(props);

    this.levels = {
      flavor: [
        {label: "light", value: 1},
        {label: "full", value: 2},
        {label: "bold", value: 3}
      ],
      carbonation: [
        {label: "light", value: 20},
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

    this.state = {
      isSparkling: false,
      beverageSelected: null,
      slideOpen: false,
      indexFavoritePouring_: null,
      alert: undefined,
      beverageConfig: {
        flavor_level: null,
        carbonation_level: null,
        temperature_level: this.levels.temperature[2].value,
        b_complex: false,
        antioxidants: false
      }
    };

    this.types = [
      {label: "Still", value: false},
      {label: "Sparkling", value: true}
    ];

    // this.actionsLauncher = [
    //   {
    //     title: "TEST QR CODE",
    //     event: () => this.props.history.push("/prepay")
    //   },
    //   {
    //     title: "CREW MENU",
    //     event: () => this.props.history.push("/menu/crew")
    //   },
    //   {
    //     title: "TECH MENU",
    //     event: () => this.props.history.push("/menu/tech")
    //   }
    // ];
  }

  componentDidMount() {
    this.props.timerConsumer.startTimer();
  }

  componentWillUnmount() {
    this.props.timerConsumer.resetTimer();
  }

  /* ==== BEVERAGE ==== */
  /* ======================================== */

  private selectBeverage(beverage: IBeverage) {
    const { beverages } = this.props.configConsumer;
    this.setState(prevState => ({
      ...prevState,
      beverageSelected: beverages.indexOf(beverage),
      beverageConfig: {
        ...prevState.beverageConfig,
        flavor_level: beverage.beverage_type !== Beverages.Plain ? this.levels.flavor[0].value : null,
        b_complex: false,
        antioxidants: false
      }
    }));
  }

  private getBeverageSelected(): IBeverage {
    const { beverages } = this.props.configConsumer;
    return beverages ? beverages[this.state.beverageSelected] : null;
  }

  private startPour() {
    const beverageSelected =  this.getBeverageSelected();
    const beverageConfig = {...this.state.beverageConfig};
    if (beverageConfig.carbonation_level == null) {
      beverageConfig.carbonation_level = 0;
    }
    console.log(this.props.configConsumer.socketAlarms$);
    this.props.timerConsumer.resetTimer();
    const startPour = this.props.configConsumer.onStartPour(beverageSelected, beverageConfig)
    .pipe(
      mergeMap(() => this.props.configConsumer.socketAlarms$.pipe(first()))
    )
    .subscribe(data => {
      if (data.value === true && data.name in AlarmsOutOfStock) { // Object.values(AlarmsOutOfStock).includes(data.name)
        startPour.unsubscribe();
        this.resetBeverage();
        this.handleAlert({
          type: AlertTypes.OutOfStock,
          timeout: true,
          onDismiss: () => {
            this.handleAlert();
          }
        });
      }
    });
  }

  private stopPour() {
    this.props.timerConsumer.startTimer();
    this.props.configConsumer.onStopPour()
    .subscribe(data => console.log(data));
  }

  private resetBeverage() {
    this.setState({
      beverageSelected: null
    });
  }

  /* ==== BEVERAGE CONSUMER ==== */
  /* ======================================== */

  private startConsumerPour(consumerBeverage: IConsumerBeverage, index: number) {
    console.log("START", consumerBeverage);
    this.setState({indexFavoritePouring_: index});
    const beverageSelected: any = { beverage_id: Number(consumerBeverage.flavours[0].product.flavorUpc) };
    const beverageConfig: IBeverageConfig = {
      flavor_level: Number(consumerBeverage.flavours[0].flavorStrength),
      carbonation_level: Number(consumerBeverage.carbLvl),
      temperature_level: Number(consumerBeverage.coldLvl),
    };
    this.props.configConsumer.onStartPour(beverageSelected, beverageConfig)
    .pipe(
      mergeMap(() => this.props.configConsumer.socketAlarms$.pipe(first()))
    )
    .subscribe(data => {
      if (data.value === true && data.name in AlarmsOutOfStock) {
        this.handleAlert({
          type: AlertTypes.OutOfStock,
          timeout: true,
          onDismiss: () => {
            this.handleAlert();
          }
        });
      }
    });
  }

  private stopConsumerPour(consumerBeverage: IConsumerBeverage) {
    console.log("STOP", consumerBeverage);
    this.setState({indexFavoritePouring_: null});
    this.stopPour();
  }

  /* ==== HANDLE ==== */
  /* ======================================== */

  private handleType = (value) => {
    this.setState(prevState => ({
      ...prevState,
      isSparkling: value,
      beverageConfig: {
        ...prevState.beverageConfig,
        carbonation_level: value ? this.levels.carbonation[2].value : null,
        temperature_level: this.levels.temperature[0].value
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

  private handleSlide = () => {
    this.setState(prevState => ({
      ...prevState,
      slideOpen: !prevState.slideOpen
    }));
  }

  /* ==== ROUTING ==== */
  /* ======================================== */

  onGesture = (gestureType) => {
    if (gestureType === "p")
      this.props.history.push(Pages.MenuTech);
    else if (gestureType === "v")
      this.props.history.push(Pages.MenuCrew);
  }

  private goToPrepay = () => {
    this.props.history.push(Pages.Prepay);
  }

  /* ==== LAYOUT ==== */
  /* ======================================== */

  private Slide = () => {
    const { slideOpen, indexFavoritePouring_ } = this.state;
    const { dataConsumer, consumerBeverages } = this.props.consumerConsumer;
    return (
      <React.Fragment>
        <Slide pose={slideOpen ? "open" : "close"}>
          <HeaderAnimated className={slideOpen && "open"}>
            <h2>Good morning, {dataConsumer.consumer_nick}!</h2>
          </HeaderAnimated>
          <h1 id="title">Your Drinks</h1>
          <Grid numElement={consumerBeverages.length}>
            {consumerBeverages.map((b, i) => {
              const BeverageAnimated = BeveragesAnimated[i];
              return (
                <BeverageAnimated
                  pouring={i === indexFavoritePouring_}
                  onTouchStart={() => this.startConsumerPour(b, i)} onTouchEnd={() => this.stopConsumerPour(b)}
                  key={i}
                  indicators={i === 0 || i === 2 ? [BeverageIndicators.Heart] : [BeverageIndicators.Rewind]}
                  label={i === 0 && !slideOpen && b.$type === BeverageTypes.Info ? "Save favorites from smartphone" : null}
                  status_id={b.$status_id}
                  title={b.flavorTitle}
                  type={b.$type}
                />
              );
            })}
          </Grid>
          {consumerBeverages[0].$type === BeverageTypes.Info && <h3 id="info">Save favorites from smartphone</h3>}
          <ToggleSlide onClick={() => this.handleSlide()} src={"icons/arrow-circle.svg"} />
        </Slide>
      </React.Fragment>
    );
  }

  private ChoiceBeverage = () => {
    const { beverages } = this.props.configConsumer;
    const { isLogged, resetConsumer } = this.props.consumerConsumer;
    return (
      <React.Fragment>
        <ChoiceBeverageWrap>
          <Gesture onGesture={this.onGesture} />
          <Grid numElement={beverages.length}>
            {beverages.map((b, i) => {
              return (
                <Beverage
                  key={i}
                  type={this.state.isSparkling ? BeverageTypes.Sparkling : null}
                  beverage={b}
                  status_id={b.status_id}
                  title={b.beverage_label_id}
                  onClick={() => this.selectBeverage(b)}
                />
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
          {/* <LauncherComponent actions={this.actionsLauncher} /> */}
        </ChoiceBeverageWrap>
        <Footer>
          {!isLogged && <Button type={ButtonTypes.Transparent} onClick={() => this.goToPrepay()} text="SIGN IN" icon="logout" />}
          {isLogged && <Button type={ButtonTypes.Transparent} onClick={() => resetConsumer()} text="SIGN OUT" icon="logout" />}
        </Footer>
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

  /* ==== HANDLE ==== */
  /* ======================================== */

  private handleAlert = (alert?: AlertProps) => {
    this.setState(prevState => ({
      ...prevState,
      alert: alert
    }));
  }


  /* ==== MAIN ==== */
  /* ======================================== */

  render() {
    const { beverages } = this.props.configConsumer;
    const { consumerBeverages } = this.props.consumerConsumer;
    const { isSparkling, alert } = this.state;
    const presentSlide = consumerBeverages.length > 0;

    return (
      <React.Fragment>
        {presentSlide && <this.Slide />}
        <HomeContent isLogged={presentSlide} beverageIsSelected={Boolean(this.getBeverageSelected())}>
          {beverages.length > 0 && (
            <React.Fragment>
              <this.ChoiceBeverage />
              <div id="types-group">
                <ButtonGroup
                  options={this.types}
                  value={isSparkling}
                  onChange={(value) => this.handleType(value)}>
                </ButtonGroup>
              </div>
            </React.Fragment>
          )}
          {this.getBeverageSelected() && <this.CustomizeBeverage />}
        </HomeContent>
        {alert && <Alert {...alert} />}
      </React.Fragment>
    );
  }
}

export default Home;