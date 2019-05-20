import * as React from "react";
import styled from "styled-components";
import { IBeverageConfig, IBeverage } from "@models/index";
import { __ } from "@utils/lib/i18n";
import { Beverages, Pages, AlarmsOutOfStock, LEVELS, CONSUMER_TIMER } from "@utils/constants";
import { ConsumerContext } from "@containers/consumer.container";
import { IConsumerBeverage } from "@utils/APIModel";
import { Subscription } from "rxjs";
import { ConfigContext } from "@containers/config.container";
import { TimerContext } from "@containers/timer.container";
import { AlertTypes, AlertContext } from "@core/containers/alert.container";
import { BeverageTypes } from "@modules/consumer/components/beverage/Beverage";
import { AccessibilityContext } from "@core/containers";
import mediumLevel from "@core/utils/lib/mediumLevel";
import { TIMEOUT_ATTRACTOR } from "./Attractor";
import { Slide, _sizeSlideFull, _sizeSlide } from "../components/home/Slide";
import { ChoiceBeverage } from "../components/home/ChoiceBeverage";
import { CardsWrap } from "../components/home/CardsWrap";
import { CustomizeBeverage } from "../components/home/CustomizeBeverage";
import { Grid } from "../components/common/Grid";
import { SegmentButtonProps } from "../components/common/SegmentButton";

/* ==== STYLE ==== */
/* ======================================== */

const sizeHome = (props) => props.isLogged ? props.fullMode ? _sizeSlideFull : _sizeSlide : "0vw";

export const HomeWrap = styled.div`
  width: calc( 100vw - ${props => sizeHome(props)});
  height: 100vh;
  position: absolute;
  left: ${props => sizeHome(props)};
  top: 0;
  ${Grid} {
    padding-top: 5.5rem;
  }
`;

export const HomeContent = styled.section`
  background-image: ${props => props.theme.backgroundLight};
`;

/* ==== PAGE ==== */
/* ======================================== */

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
enum StatusEndSession {
  Start = "start",
  Finish = "finish",
  OutOfStock = "outOfStock"
}

let socketAlarms_: Subscription;

export const Home = (props: HomeProps) => {

  const levels = LEVELS;
  const types = [
    {
      label: "c_still_water",
      icon: "still",
      value: false
    }, {
      label: "c_sparkling_water",
      icon: "sparkling",
      value: true
    }
  ];

  const [state, setState] = React.useState<HomeState>({
    isSparkling: false,
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
  const [slideOpen, setSlideOpen] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);
  const [endSession, setEndSession] = React.useState<"start" | "finish" | "outOfStock">(null);

  const alertConsumer = React.useContext(AlertContext);
  const configConsumer = React.useContext(ConfigContext);
  const timerConsumer = React.useContext(TimerContext);
  const consumerConsumer = React.useContext(ConsumerContext);

  React.useEffect(() => {
    const stopVideo_ = setTimeout(() => {
      mediumLevel.config.stopVideo().subscribe();
    }, TIMEOUT_ATTRACTOR); // <= STOP ATTRACTOR
    timerConsumer.startTimer();
    TimerEnd.clearTimer();
    return () => {
      clearTimeout(stopVideo_); // <= STOP ATTRACTOR
      configConsumer.setAuthService(false);
      timerConsumer.resetTimer();
    };
  }, []);

  //  ==== ACCESSIBILITY FUNCTION ====>
  const accessibilityConsumer = React.useContext(AccessibilityContext);
  const { changeStateLayout } = accessibilityConsumer;

  React.useEffect(() => {
    changeStateLayout({
      beverageSelected: state.beverageSelected,
      nutritionFacts: nutritionFacts,
      slideOpen: slideOpen,
      buttonGroupSelected: null
    });
  }, [state.beverageSelected, slideOpen, nutritionFacts]);
  //  <=== ACCESSIBILITY FUNCTION ====

  /* ==== PROXIMITY SENSOR ==== */
  /* ======================================== */

  // const { socketAttractor$ } = configConsumer;
  // React.useEffect(() => {
  //   const { idBeveragePouring_, indexFavoritePouring_, beverageSelected } = state;
  //   if (socketAttractor$ === undefined || consumerConsumer.isLogged || (beverageSelected != null || idBeveragePouring_ != null || indexFavoritePouring_ != null)) {
  //     return () => null;
  //   }
  //   const socketAttractor_ = socketAttractor$
  //   .subscribe(value => {
  //     if (value === MESSAGE_START_CAMERA) {
  //       goToPrepay();
  //     }
  //   });
  //   return () => {
  //     socketAttractor_.unsubscribe();
  //   };
  // }, [socketAttractor$, state.beverageSelected, state.idBeveragePouring_, state.indexFavoritePouring_, consumerConsumer.isLogged]); // => TO IMPROVE

  /* ==== ALARMS ==== */
  /* ======================================== */

  const alarmDetect = (data) => {
    if (!(data.value === true && data.name in AlarmsOutOfStock)) { // Object.values(AlarmsOutOfStock).includes(data.name)
      return null;
    }
    const { idBeveragePouring_, indexFavoritePouring_, beverageSelected } = state;
    if (beverageSelected != null || idBeveragePouring_ != null || indexFavoritePouring_ != null) {
      resetBeverage();
      setEndSession(StatusEndSession.OutOfStock);
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
    [state.beverageSelected, state.idBeveragePouring_, state.indexFavoritePouring_] // => TO IMPROVE
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
    setEndSession(StatusEndSession.Start);
  };

  /* ==== END POUR ==== */
  /* ======================================== */

  React.useEffect(
    () => {
      const startTimerEnd = () => TimerEnd.startTimer(() => setEndSession(StatusEndSession.Finish));
      if (endSession !== null) {
        console.log(`${endSession} | End Session`);
      }

      if (endSession === StatusEndSession.Start) {

        startTimerEnd();

        document.addEventListener("touchstart", TimerEnd.clearTimer);
        document.addEventListener("touchend", startTimerEnd);
        // document.addEventListener("mousedown", TimerEnd.clearTimer); // => DESKTOP MODE
        // document.addEventListener("mouseup", startTimerEnd); // => DESKTOP MODE
        document.addEventListener("keydown", TimerEnd.clearTimer); // => ACCESSIBILITY
        document.addEventListener("keyup", startTimerEnd); // => ACCESSIBILITY

      } else if (endSession === StatusEndSession.Finish) {

        TimerEnd.clearTimer();
        mediumLevel.product.sessionEnded().subscribe();

        if (StatusEndSession.Finish) {
          alertConsumer.show({
            type: AlertTypes.EndBeverage,
            timeout: true,
            onDismiss: () => {
              resetBeverage();
              consumerConsumer.resetConsumer();
            }
          });
        }

      } else if (endSession === StatusEndSession.OutOfStock) {
        TimerEnd.clearTimer();
        mediumLevel.product.sessionEnded().subscribe();
        consumerConsumer.resetConsumer();
      }

      return () => {
        if (endSession === StatusEndSession.Start) {
          document.removeEventListener("touchstart", TimerEnd.clearTimer);
          document.removeEventListener("touchend", startTimerEnd);
          // document.removeEventListener("mousedown", TimerEnd.clearTimer); // => DESKTOP MODE
          // document.removeEventListener("mouseup", startTimerEnd); // => DESKTOP MODE
          document.removeEventListener("keydown", TimerEnd.clearTimer); // => ACCESSIBILITY
          document.removeEventListener("keyup", startTimerEnd); // => ACCESSIBILITY
        }
      };

    }, [endSession]);

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
        carbonation_level: consumerBeverage.$sparkling ? Number(consumerBeverage.carbLvl) : null,
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
    setSlideOpen(prevState => !prevState);
  }

  const handleNutritionFacts = () => setNutritionFacts(prevState => !prevState);
  const handleDisabled = () => setDisabled(prevState => !prevState);

  /* ==== ROUTING ==== */
  /* ======================================== */

  const onGesture = (gestureType) => {
    if (gestureType === "p")
      configConsumer.setAuthService(true);
    // if (gestureType === "p")
    //   props.history.push(Pages.MenuTech);
    // else if (gestureType === "v")
    //   props.history.push(Pages.MenuCrew);
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
          slideOpen={slideOpen}
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
            fullMode={fullMode}
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
        lengthBeverages={beverages.length}
        presentSlide={presentSlide}
        slideOpen={slideOpen}
        fullMode={fullMode}
        indexBeverageForLongPressPour_={state.indexBeverageForLongPressPour_}
        indexFavoritePouring_={state.indexFavoritePouring_}
        color={getBeverageColorOnLongPressPour()}
        endPourEvent={() => setEndSession(StatusEndSession.Finish)}
      />
      {beverageSelected &&
        <CustomizeBeverage
          levels={levels}
          isSparkling={isSparkling}
          slideOpen={slideOpen}
          showCardsInfo={state.showCardsInfo}
          endPourEvent={() => setEndSession(StatusEndSession.Finish)}
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