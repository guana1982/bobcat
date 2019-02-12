import * as React from "react";

import { ConfigConsumer, ConfigInterface, TimerInterface } from "../../store";
import Gesture from "../../components/Menu/Gesture";

import { HomeContent, Footer, Grid, Pour, CustomizeBeverageCard, InfoCard, CustomizeBeverageWrap, ChoiceBeverageWrap, Slide, ToggleSlide, HeaderAnimated, EndWrap } from "./home.style";
import { ButtonGroup } from "../../components/global/ButtonGroup";
import { IBeverageConfig, IBeverage } from "../../models";
import { __ } from "../../utils/lib/i18n";
import { Button, ButtonTypes } from "../../components/global/Button";
import { Beverages, Pages, AlarmsOutOfStock, LEVELS, CONSUMER_TIMER } from "../../utils/constants";
import { BeveragesAnimated, Beverage, BeverageIndicators, BeverageTypes } from "../../components/global/Beverage";
import { ConsumerInterface } from "../../store/consumer.store";
import { IdentificationConsumerTypes, IConsumerBeverage } from "../../utils/APIModel";
import { Alert, AlertProps, AlertTypes } from "../../components/global/Alert";
import { Subscription } from "rxjs";
import { FocusElm } from "../../store/accessibility.store";
import { CircleBtn } from "../../components/global/CircleBtn";

interface HomeProps {
  history: any;
  configConsumer: ConfigInterface;
  timerConsumer: TimerInterface;
  consumerConsumer: ConsumerInterface;
}

interface HomeState {
  isSparkling: boolean;
  beverageSelected: number;
  idBeveragePouring_: number;
  indexFavoritePouring_: number;
  beverageConfig: IBeverageConfig;

  slideOpen: boolean;
  alert: AlertProps;

  showCardsInfo: boolean;
  showEnd: boolean;
}

export class Home extends React.Component<HomeProps, HomeState> {

  readonly state: HomeState;

  pouring_: Subscription = null;
  levels: any = null;
  types: any = null;

  timerEnd_: any = null;

  constructor(props) {
    super(props);

    this.levels = LEVELS;

    this.state = {
      isSparkling: false,
      beverageSelected: null,
      slideOpen: false,
      idBeveragePouring_: null,
      indexFavoritePouring_: null,
      alert: undefined,
      showCardsInfo: false,
      showEnd: false,
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

  private startPour(beverageSelected?: IBeverage, beverageConfig?: IBeverageConfig) {

    let bevSelected, bevConfig = null;

    if (beverageSelected) { // => TO IMPROVE
      bevSelected = beverageSelected;
      if (this.state.indexFavoritePouring_ === null) {
        this.setState({
          idBeveragePouring_: bevSelected.beverage_id
        }); // <= Rapid mode
      }
    } else {
      bevSelected = this.getBeverageSelected();
      this.setState({
        showCardsInfo: true
      }); // <= Slow mode
    }

    if (beverageConfig) {
      bevConfig = beverageConfig;
    } else {
      bevConfig = {...this.state.beverageConfig};
      if (bevConfig.carbonation_level == null) {
        bevConfig.carbonation_level = 0;
      }
    }

    this.props.timerConsumer.resetTimer();
    this.pouring_ = this.props.configConsumer.onStartPour(bevSelected, bevConfig)
    .subscribe(data => {
      if (data.value === true && data.name in AlarmsOutOfStock) { // Object.values(AlarmsOutOfStock).includes(data.name)
        this.pouring_ && this.pouring_.unsubscribe();
        this.resetBeverage();
        this.handleAlert({
          type: AlertTypes.OutOfStock,
          timeout: true,
          onDismiss: () => {
            this.props.consumerConsumer.updateConsumerBeverages();  // => TO IMPROVE
            this.handleAlert();
          }
        });
      }
    });

  }

  private stopPour() {
    this.props.timerConsumer.startTimer();
    this.pouring_ && this.pouring_.unsubscribe();
    this.setState({idBeveragePouring_: null});
    this.props.configConsumer.onStopPour()
    .subscribe(data => console.log(data));
    if (this.getBeverageSelected()) {
      this.endPour();
    }
  }

  private endPour() {
    if (this.timerEnd_ === null) {

      const endEvent = () => {
        this.setState({showEnd: true});
        clearTimer();
        this.timerEnd_ = null;
        document.removeEventListener("touchstart", clearTimer);
        document.removeEventListener("touchend", startTimer);
      };

      const clearTimer = () => {
        clearTimeout(this.timerEnd_);
      };

      const startTimer = () => {
        clearTimer();
        this.timerEnd_ = setTimeout(endEvent, CONSUMER_TIMER.END_POUR);
      };
      startTimer();

      document.addEventListener("touchstart", clearTimer);
      document.addEventListener("touchend", startTimer);
    }
  }

  private resetBeverage() {
    this.setState({
      beverageSelected: null,
      indexFavoritePouring_: null,
      idBeveragePouring_: null,
      showCardsInfo: false,
      showEnd: false
    });
  }

  /* ==== BEVERAGE CONSUMER ==== */
  /* ======================================== */

  private startConsumerPour(consumerBeverage: IConsumerBeverage, index: number) {
    console.log("START", consumerBeverage);
    this.setState({indexFavoritePouring_: index});
    const beverageSelected: any = { beverage_id: Number(consumerBeverage.flavors[0].product.flavorUpc) };
    const beverageConfig: IBeverageConfig = {
      flavor_level: Number(consumerBeverage.flavors[0].flavorStrength),
      carbonation_level: Number(consumerBeverage.carbLvl),
      temperature_level: Number(consumerBeverage.coldLvl),
    };
    this.startPour(beverageSelected, beverageConfig);
  }

  private stopConsumerPour(consumerBeverage: IConsumerBeverage) {
    console.log("STOP", consumerBeverage);
    this.resetBeverage();
    this.stopPour();
  }

  /* ==== HANDLE ==== */
  /* ======================================== */

  private handleType = (value) => { // TRUE => isSparkling
    this.setState(prevState => ({
      ...prevState,
      isSparkling: value,
      beverageConfig: {
        ...prevState.beverageConfig,
        carbonation_level: value ? this.levels.carbonation[2].value : null,
        temperature_level: value ? this.levels.carbTemperature[0].value : this.levels.temperature[2].value
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
    const beverageSelected = this.getBeverageSelected();

    const timeText = () => {
      const today = new Date();
      const curHr = today.getHours();
      let text = "";
      if (curHr < 12) {
        text = "Good morning";
      } else if (curHr < 18) {
        text = "Good afternoon";
      } else {
        text = "Good evening";
      }
      return __(text);
    };

    const slideFocus = () => {
      if (slideOpen) {
        return FocusElm.Controller;
      }
      if (beverageSelected) {
        return FocusElm.Extra;
      }
      return null;
    };

    const checkBtnFocus = (i) => {
      if (!slideOpen && i === 2) {
          return FocusElm.Disable;
      }
      if (slideOpen && i === 0) {
          return FocusElm.Init;
      }
      return null;
    };

    return (
      <React.Fragment>
        <Slide dataFocus={slideFocus()} pose={slideOpen ? "open" : "close"}>
          <HeaderAnimated className={slideOpen && "open"}>
            <h2>{timeText()}, {dataConsumer.consumer_nick}!</h2>
          </HeaderAnimated>
          <h1 id="title">Your Drinks</h1>
          <Grid numElement={consumerBeverages.length}>
            {consumerBeverages.map((b, i) => {
              const BeverageAnimated = BeveragesAnimated[i];
              return (
                <BeverageAnimated
                  pouring={i === indexFavoritePouring_}
                  onHoldStart={() => this.startConsumerPour(b, i)} onHoldEnd={() => this.stopConsumerPour(b)}
                  key={i}
                  indicators={i === 0 || i === 2 ? [BeverageIndicators.Heart] : [BeverageIndicators.Rewind]}
                  label={i === 0 && !slideOpen && b.$type === BeverageTypes.Info ? "Save favorites from smartphone" : null}
                  status_id={b.$status_id}
                  title={b.flavorTitle}
                  type={b.$type}
                  dataBtnFocus={checkBtnFocus(i)}
                />
              );
            })}
          </Grid>
          {consumerBeverages[0].$type === BeverageTypes.Info && <h3 id="info">Save favorites from smartphone</h3>}
          <ToggleSlide onClick={() => this.handleSlide()}>
            <img src={"icons/arrow-circle.svg"} />
          </ToggleSlide>
        </Slide>
      </React.Fragment>
    );
  }

  private ChoiceBeverage = () => {
    const { idBeveragePouring_ } = this.state;
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
                  pouring={b.beverage_id === idBeveragePouring_}
                  type={this.state.isSparkling ? BeverageTypes.Sparkling : null}
                  beverage={b}
                  status_id={b.status_id}
                  title={b.beverage_label_id}
                  onStart={() => this.selectBeverage(b)}
                  onHoldStart={() => this.startPour(b)}
                  onHoldEnd={() => this.stopPour()}
                  dataBtnFocus={i === 0 ? FocusElm.Init : null}
                />
              );
            })}
          </Grid>
        </ChoiceBeverageWrap>
        <Footer>
          {!isLogged && <Button data-focus={[3, 0]} type={ButtonTypes.Transparent} onClick={() => this.goToPrepay()} text="SIGN IN" icon="logout" />}
          {isLogged && <Button data-focus={[3, 0]} type={ButtonTypes.Transparent} onClick={() => resetConsumer()} text="SIGN OUT" icon="logout" />}
        </Footer>
      </React.Fragment>
    );
  }

  private CustomizeBeverage = () => {
    const { slideOpen, showCardsInfo, showEnd } = this.state;
    return(
      <React.Fragment>
        <CustomizeBeverageWrap dataFocus={!slideOpen ? FocusElm.Controller : null}>
          <CircleBtn onClick={() => this.resetBeverage()} bgColor={"primary"} color={"light"} icon={"icons/cancel.svg"} />
          <div id="backdrop" onClick={() => this.resetBeverage()}></div>
          {showCardsInfo && <InfoCard className={"right"}>
            <header>
              <h3>Sign-up to track your hydration</h3>
            </header>
            <aside>
              <img src={"icons/smartphone.svg"} />
            </aside>
            <footer>
              <h4>Now available in App Stores</h4>
            </footer>
          </InfoCard>}
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
            {/* <div>
              <button type="button">add b-complex</button>
              <button type="button">add antioxidants</button>
            </div> */}
          </CustomizeBeverageCard>
          {showCardsInfo && <InfoCard className={"left"}>
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
          </InfoCard>}
          <Pour dataBtnFocus={FocusElm.Init} onTouchStart={() => this.startPour()} onTouchEnd={() => this.stopPour()}>Hold to Pour</Pour>
        </CustomizeBeverageWrap>
        {showEnd && <this.EndBeverage />}
      </React.Fragment>
    );
  }

  private EndBeverage = () => {
    const endBeverageTimeout = setTimeout(() => this.resetBeverage(), CONSUMER_TIMER.END_VIEW);
    const closeEndBeverage = () => {
      clearTimeout(endBeverageTimeout);
      this.resetBeverage();
    };
    return (
      <React.Fragment>
        <EndWrap onClick={() => closeEndBeverage()}>
          <h1>{__("Enjoy!")}</h1>
        </EndWrap>
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
    const beverageSelected = this.getBeverageSelected();
    return (
      <section data-focus={FocusElm.Controller}>
        {presentSlide && <this.Slide />}
        <HomeContent isLogged={presentSlide} beverageIsSelected={Boolean(this.getBeverageSelected())}>
          {beverages.length > 0 && (
            <React.Fragment>
              <this.ChoiceBeverage />
              <div data-focus={beverageSelected ? FocusElm.Extra : null} id="types-group">
                <ButtonGroup
                  options={this.types}
                  value={isSparkling}
                  onChange={(value) => this.handleType(value)}>
                </ButtonGroup>
              </div>
            </React.Fragment>
          )}
          {beverageSelected && <this.CustomizeBeverage />}
        </HomeContent>
        {alert && <Alert {...alert} />}
      </section>
    );
  }
}

export default Home;