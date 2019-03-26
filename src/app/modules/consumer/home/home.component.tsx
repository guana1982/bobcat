import * as React from "react";

import { HomeContent, HomeWrap } from "./home.style";
import { IBeverageConfig, IBeverage } from "@models/index";
import { __ } from "@utils/lib/i18n";
import { Beverages, Pages, AlarmsOutOfStock, LEVELS, CONSUMER_TIMER } from "@utils/constants";
import { ConsumerContext } from "@containers/consumer.container";
import { IConsumerBeverage } from "@utils/APIModel";
import { Subscription, Subject } from "rxjs";
import { ChoiceBeverage } from "@components/consumer/ChoiceBeverage";
import { CustomizeBeverage } from "@components/consumer/CustomizeBeverage";
import { Slide } from "@components/consumer/Slide";
import { ConfigContext } from "@containers/config.container";
import { TimerContext } from "@containers/timer.container";
import { AlertTypes, AlertContext } from "@core/containers/alert.container";
import { BeverageTypes } from "@core/components/beverage/Beverage";
import { AccessibilityContext } from "@core/containers";
import { SegmentButtonProps } from "@core/components/global/SegmentButton";
import { CardsWrap } from "@core/components/consumer/CardsWrap";
// import { SegmentButton } from "@core/components/global/SegmentButton";

interface HomeProps {
  history: any;
}

export interface HomeState {
  isSparkling: boolean;
  beverageSelected: number;
  indexBeverageForLongPressPour_: number;
  idBeveragePouring_: number;
  indexFavoritePouring_: number;
  beverageConfig: IBeverageConfig;

  slideOpen: boolean;

  showCardsInfo: boolean;
}

const TimerEnd = {
  timer_: null,
  clearTimer() {
    clearInterval(TimerEnd.timer_);
    TimerEnd.timer_ = null;
  },
  startTimer(endEvent) {
    TimerEnd.clearTimer();
    TimerEnd.timer_ = setInterval(endEvent, CONSUMER_TIMER.END_POUR);
  }
};

let socketAlarms_: Subscription;

export const Home = (props: HomeProps) => {

  const levels = LEVELS;
  const types = [
    {
      label: "Still",
      icon: "still",
      value: false
    }, {
      label: "Sparkling",
      icon: "sparkling",
      value: true
    }
  ];

  const [state, setState] = React.useState<HomeState>({
    isSparkling: false,
    slideOpen: false,
    beverageSelected: null,
    indexBeverageForLongPressPour_: null,
    idBeveragePouring_: null,
    indexFavoritePouring_: null,
    showCardsInfo: false,
    beverageConfig: {
      flavor_level: null,
      carbonation_level: null,
      temperature_level: levels.temperature[2].value,
      b_complex: false,
      antioxidants: false
    }
  });
  const [nutritionFacts, setNutritionFacts] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);

  const alertConsumer = React.useContext(AlertContext);
  const configConsumer = React.useContext(ConfigContext);
  const timerConsumer = React.useContext(TimerContext);
  const consumerConsumer = React.useContext(ConsumerContext);

  React.useEffect(() => {
    timerConsumer.startTimer();
    TimerEnd.clearTimer();
    return () => {
      timerConsumer.resetTimer();
    };
  }, []);

  //  ==== ACCESSIBILITY FUNCTION ====>
  const accessibilityConsumer = React.useContext(AccessibilityContext);
  const { changeStateLayout } = accessibilityConsumer;

  React.useEffect(() => {
    changeStateLayout({
      beverageSelected: state.beverageSelected,
      slideOpen: state.slideOpen,
      buttonGroupSelected: null
    });
  }, [state.beverageSelected, state.slideOpen]);
  //  <=== ACCESSIBILITY FUNCTION ====

  /* ==== ALARMS ==== */
  /* ======================================== */

  const alarmDetect = (data) => {
    if (!(data.value === true && data.name in AlarmsOutOfStock)) { // Object.values(AlarmsOutOfStock).includes(data.name)
      return null;
    }
    const { idBeveragePouring_, indexFavoritePouring_, beverageSelected } = state;
    if (beverageSelected || idBeveragePouring_ != null || indexFavoritePouring_ != null) {
      resetBeverage();
      alertConsumer.show({
        type: AlertTypes.OutOfStock,
        timeout: true,
        onDismiss: () => {
          consumerConsumer.updateConsumerBeverages(); // => TO IMPROVE
        }
      });
    }
  };

  React.useEffect(() => {
    socketAlarms_ = configConsumer.socketAlarms$.subscribe(data => alarmDetect(data));
      return () => {
        socketAlarms_.unsubscribe();
      };
    },
    [state.beverageSelected, state.idBeveragePouring_, state.indexFavoritePouring_],
  );

  /* ==== BEVERAGE ==== */
  /* ======================================== */

  const selectBeverage = (beverage: IBeverage) => {
    const { beverages } = configConsumer;
    handleType(state.isSparkling);
    setState(prevState => ({
      ...prevState,
      beverageSelected: beverages.indexOf(beverage),
      beverageConfig: {
        ...prevState.beverageConfig,
        flavor_level: beverage.beverage_type !== Beverages.Plain ? levels.flavor[0].value : null,
        b_complex: false,
        antioxidants: false
      }
    }));
  };

  const getBeverageSelected = (): IBeverage => {
    const { beverages } = configConsumer;
    // console.log(beverages);
    return beverages ? beverages[state.beverageSelected] : null;
  };

  const getBeverageColorOnLongPressPour = (): string => {
    const { beverages } = configConsumer;

    let color: string;

    if (state.indexBeverageForLongPressPour_ !== null && state.indexBeverageForLongPressPour_ >= 0) {
      color = beverages[state.indexBeverageForLongPressPour_].beverage_font_color;
    }

    if (state.indexFavoritePouring_ !== null && state.indexFavoritePouring_ >= 0) {
      color = consumerBeverages[state.indexFavoritePouring_].$beverage.beverage_font_color;
    }

    return color;
  };

  const startPour = (beverageSelected?: IBeverage, beverageConfig?: IBeverageConfig, indexFavorite?: number) => {

    let bevSelected, bevConfig = null;

    const validFavorite = Boolean(indexFavorite !== null && indexFavorite >= 0);

    if (beverageSelected) { // => TO IMPROVE
      bevSelected = beverageSelected;
      setState(prevState => ({
        ...prevState,
        indexBeverageForLongPressPour_: !validFavorite ? beverages.indexOf(beverageSelected) : null,
        idBeveragePouring_: !validFavorite ? bevSelected.beverage_id : null,
        indexFavoritePouring_: !validFavorite ? null : indexFavorite
      })); // <= Rapid mode
    } else {
      bevSelected = getBeverageSelected();
      setState({
        ...state,
        showCardsInfo: true
      }); // <= Slow mode
    }

    if (beverageConfig) {
      bevConfig = beverageConfig;
    } else {
      bevConfig = {...state.beverageConfig};
      if (bevConfig.carbonation_level == null) {
        bevConfig.carbonation_level = 0;
      }
    }

    timerConsumer.resetTimer();
    configConsumer.onStartPour(bevSelected, bevConfig).subscribe(); // => TEST MODE

  };

  const stopPour = () => {
    timerConsumer.startTimer();
    configConsumer.onStopPour().subscribe(); // => TEST MODE
    if (getBeverageSelected() || state.idBeveragePouring_ !== null) {
      startPourEvent();
    }
  };

  /* ==== END POUR ==== */
  /* ======================================== */

  const startTimerEnd = () => TimerEnd.startTimer(endPourEvent);

  function startPourEvent() {
    if (TimerEnd.timer_ === null) {
      TimerEnd.startTimer(endPourEvent);
      document.addEventListener("touchstart", TimerEnd.clearTimer);
      document.addEventListener("touchend", startTimerEnd);
      // document.addEventListener("mousedown", TimerEnd.clearTimer); // => DESKTOP MODE
      // document.addEventListener("mouseup", startTimerEnd); // => DESKTOP MODE
      document.addEventListener("keydown", TimerEnd.clearTimer); // => ACCESSIBILITY
      document.addEventListener("keyup", startTimerEnd); // => ACCESSIBILITY
    }
  }

  function endPourEvent() {
    document.removeEventListener("touchstart", TimerEnd.clearTimer);
    document.removeEventListener("touchend", startTimerEnd);
    // document.removeEventListener("mousedown", TimerEnd.clearTimer); // => DESKTOP MODE
    // document.removeEventListener("mouseup", startTimerEnd); // => DESKTOP MODE
    document.removeEventListener("keydown", TimerEnd.clearTimer); // => ACCESSIBILITY
    document.removeEventListener("keyup", startTimerEnd); // => ACCESSIBILITY
    TimerEnd.clearTimer();
    alertConsumer.show({
      type: AlertTypes.EndBeverage,
      timeout: true,
      onDismiss: () => {
        resetBeverage();
        consumerConsumer.resetConsumer(false);
      }
    });
  }

  /* ==== RESET ==== */
  /* ======================================== */

  const resetBeverage = () => {
    TimerEnd.clearTimer();
    setState(prevState => ({
      ...prevState,
      beverageSelected: null,
      indexBeverageForLongPressPour_: null,
      indexFavoritePouring_: null,
      idBeveragePouring_: null,
      showCardsInfo: false
    }));
  };

  /* ==== BEVERAGE CONSUMER ==== */
  /* ======================================== */
  const MAX_CONSUMER_BEVERAGE = 3;
  const validConsumerBeverage = consumerConsumer.consumerBeverages.filter(beverage => beverage.$types[0] !== BeverageTypes.Info);
  const lengthConsumerBeverages = validConsumerBeverage.length;
  const fullMode = lengthConsumerBeverages === MAX_CONSUMER_BEVERAGE;

  React.useEffect(() => {
    if (fullMode) {
      handleSlide();
    }
  }, [consumerConsumer.consumerBeverages]);

  const selectConsumerBeverage = (consumerBeverage: IConsumerBeverage) => {
    const { beverages } = configConsumer;
    setState(prevState => ({
      ...prevState,
      isSparkling: consumerBeverage.$sparkling,
      beverageSelected: beverages.indexOf(consumerBeverage.$beverage),
      beverageConfig: {
        flavor_level: Number(consumerBeverage.flavors[0].flavorStrength),
        carbonation_level: Number(consumerBeverage.carbLvl),
        temperature_level: Number(consumerBeverage.coldLvl),
      }
    }));
  };

  const startConsumerPour = (consumerBeverage: IConsumerBeverage, index: number) => {
    const beverageSelected: any = { beverage_id: Number(consumerBeverage.flavors[0].product.flavorUpc) };
    const beverageConfig: IBeverageConfig = {
      flavor_level: Number(consumerBeverage.flavors[0].flavorStrength),
      carbonation_level: Number(consumerBeverage.carbLvl),
      temperature_level: Number(consumerBeverage.coldLvl),
    };
    startPour(beverageSelected, beverageConfig, index);
  };

  const stopConsumerPour = (consumerBeverage?: IConsumerBeverage) => {
    // resetBeverage();
    stopPour();
  };

  /* ==== HANDLE ==== */
  /* ======================================== */

  const handleType = (value) => { // TRUE => isSparkling
    setState(prevState => ({
      ...prevState,
      isSparkling: value,
      beverageConfig: {
        ...prevState.beverageConfig,
        carbonation_level: value ? levels.carbonation[2].value : null,
        temperature_level:  levels.temperature[2].value // value ? levels.carbTemperature[0].value : levels.temperature[2].value
      }
    }));
  };

  const handleChange = (value: any, type: string) => {
    let beverageConfig = state.beverageConfig;
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
    setState(prevState => ({...prevState, beverageConfig}));
  };

  function handleSlide() {
    setState(prevState => ({
      ...prevState,
      slideOpen: !prevState.slideOpen
    }));
  }

  const handleNutritionFacts = () => setNutritionFacts(prevState => !prevState);
  const handleDisabled = () => setDisabled(prevState => !prevState);

  /* ==== ROUTING ==== */
  /* ======================================== */

  const onGesture = (gestureType) => {
    if (gestureType === "p")
      props.history.push(Pages.MenuTech);
    else if (gestureType === "v")
      props.history.push(Pages.MenuCrew);
  };

  const goToPrepay = () => {
    props.history.push(Pages.Prepay);
  };

  /* ==== MAIN ==== */
  /* ======================================== */

  const { beverages } = configConsumer;
  const { consumerBeverages } = consumerConsumer;
  const { isSparkling } = state;
  const presentSlide = consumerBeverages.length > 0;
  const beverageSelected = getBeverageSelected();
  const beverageIsSelected = beverageSelected !== undefined && beverageSelected !== null;

  const segmentButton: SegmentButtonProps = { // => _SegmentButton
    options: types,
    value: isSparkling,
    onChange: (value) => handleType(value),
  };

  const disabledMode = beverageSelected !== undefined || state.idBeveragePouring_ != null || state.indexFavoritePouring_ != null || disabled;

  return (
    <HomeContent>
      {presentSlide &&
        <Slide
          slideOpen={state.slideOpen}
          indexFavoritePouring_={state.indexFavoritePouring_}
          beverageSelected={state.beverageSelected}
          selectConsumerBeverage={selectConsumerBeverage}
          startConsumerPour={startConsumerPour}
          stopConsumerPour={stopConsumerPour}
          handleSlide={handleSlide}
          fullMode={fullMode}
          handleDisabled={handleDisabled}
          disabled={disabledMode}
          nutritionFacts={nutritionFacts}
        />
      }
      <HomeWrap isLogged={presentSlide} fullMode={fullMode} beverageIsSelected={beverageIsSelected}>
        {beverages.length > 0 && (
          <ChoiceBeverage
            onGesture={onGesture}
            selectBeverage={selectBeverage}
            startPour={startPour}
            stopPour={stopPour}
            goToPrepay={goToPrepay}
            idBeveragePouring_={state.idBeveragePouring_}
            isSparkling={state.isSparkling}
            disabled={disabledMode} // || presentSlide && state.slideOpen
            segmentButton={segmentButton} // => _SegmentButton
            handleNutritionFacts={handleNutritionFacts}
            handleDisabled={handleDisabled}
            nutritionFacts={nutritionFacts}
          />
        )}
      </HomeWrap>
      <CardsWrap
        presentSlide={presentSlide}
        slideOpen={state.slideOpen}
        indexBeverageForLongPressPour_={state.indexBeverageForLongPressPour_}
        indexFavoritePouring_={state.indexFavoritePouring_}
        color={getBeverageColorOnLongPressPour()}
        endPourEvent={endPourEvent}
      />
      {beverageSelected &&
        <CustomizeBeverage
          levels={levels}
          isSparkling={isSparkling}
          slideOpen={state.slideOpen}
          showCardsInfo={state.showCardsInfo}
          endPourEvent={endPourEvent}
          beverageConfig={state.beverageConfig}
          resetBeverage={resetBeverage}
          getBeverageSelected={getBeverageSelected}
          handleChange={handleChange}
          startPour={startPour}
          stopPour={stopPour}
          segmentButton={segmentButton} // => _SegmentButton
          nutritionFacts={nutritionFacts}
          isLogged={presentSlide}
        />
      }
    </HomeContent>
  );

};

export default Home;