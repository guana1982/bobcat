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
import { OutOfOrder } from "../components/home/OutOfOrder";
import Gesture from "@core/components/Menu/Gesture";

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

enum StatusEndSession {
  Start = "start",
  Finish = "finish",
  FinishForce = "finishForce",
  OutOfStock = "outOfStock"
}

let socketAlarms_: Subscription;
let timer_: Subscription;
let endSession_: Subscription;

export const Home = (props: HomeProps) => {

  const levels = LEVELS;
  const types = [
    {
      label: __("c_still"),
      icon: "still",
      value: false
    }, {
      label: __("c_sparkling"),
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
  const [blur, setBlur] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);
  const [endSession, setEndSession] = React.useState<"start" | "finish" | "finishForce" | "outOfStock">(null);

  const alertConsumer = React.useContext(AlertContext);
  const configConsumer = React.useContext(ConfigContext);
  const timerConsumer = React.useContext(TimerContext);
  const consumerConsumer = React.useContext(ConsumerContext);

  //  ==== TIMER ====>
  const { timerFull$, timerStop, restartBrightness$ } = timerConsumer;
  const { isLogged } = consumerConsumer;

  function alertIsLogged(event) {
    if (isLogged) {
      alertConsumer.show({
        type: AlertTypes.EndBeverage,
        timeout: true,
        onDismiss: () => {
          consumerConsumer.resetConsumer(true);
          event();
        }
      });
    } else {
      event();
    }
  }

  const restartBrightness_ = () => {
    timer_ = restartBrightness$
    .subscribe(val => {
      if (val === "timer_restart") {
        startTimer_();
      } else if (val === "proximity_stop") {
        const event_ = () => consumerConsumer.resetConsumer();
        alertIsLogged(event_);
      }
    });
  };

  const startTimer_ = () => {
    timer_ = timerFull$.subscribe(
      val => {
        if (val === "tap_detect") {
          startTimer_();
        } else if (val === "proximity_stop") {
          const event_ = () => consumerConsumer.resetConsumer();
          alertIsLogged(event_);
        } else if (val === "timer_stop") {
          const event_ = () => {
            handleType(false);
            setNutritionFacts(false);
            resetBeverage();
            restartBrightness_();
          };
          alertIsLogged(event_);
        }
      }
    );
  };

  const resetTimer_ = () => {
    timer_.unsubscribe();
  };
  //  <=== TIMER ====

  React.useEffect(() => {
    const stopVideo_ = setTimeout(() => {
      mediumLevel.config.stopVideo().subscribe();
    }, TIMEOUT_ATTRACTOR); // <= STOP ATTRACTOR
    if (timerStop) {
      restartBrightness_();
    } else {
      startTimer_();
    }
    return () => {
      clearTimeout(stopVideo_); // <= STOP ATTRACTOR
      configConsumer.setAuthService(false);
      resetTimer_();
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

  /* ==== ALARMS ==== */
  /* ======================================== */

  const { alarms } = configConsumer;
  const [alarmSuper_, setAlarmSuper_] = React.useState(false);
  const [alarmSparkling_, setAlarmSparkling_] = React.useState(false);
  const [alarmConnectivity_, setAlarmConnectivity_] = React.useState(false);

  const showAlarmSparkling = () => {
    resetBeverage();
    setBlur(true);
    const evtSparkling_ = () => {
      consumerConsumer.resetConsumer(true);
      handleType(false);
      setBlur(false);
    };
    alertConsumer.show({
      type: AlertTypes.EndSparkling,
      subTitle: true,
      timeout: true,
      transparent: true,
      onConfirm: evtSparkling_,
      onDismiss: evtSparkling_
    });
  };

  React.useEffect(() => {
    const detectSuperAlarm_ = Boolean(alarms.find(alarm => alarm.alarm_category === "super_alert" && alarm.alarm_enable === true));
    setAlarmSuper_(detectSuperAlarm_);

    const detectSparklingAlarm_ = Boolean(alarms.find(alarm => alarm.alarm_name === "press_co2" && alarm.alarm_enable === true));
    setAlarmSparkling_(detectSparklingAlarm_);
    if (detectSparklingAlarm_) {
      if (endSession !== StatusEndSession.Start && isSparkling) {
        showAlarmSparkling();
      }
    }

    const detectConnectivityAlarm_ = Boolean(alarms.find(alarm => (alarm.alarm_name === "mqtt" || alarm.alarm_name === "mqtt") && alarm.alarm_enable === true));
    setAlarmConnectivity_(detectConnectivityAlarm_);

  }, [alarms]);

  //  ==== ON POUR ====>
  const alarmDetect = (data) => {
    if (!(data.value === true && data.enable === true && data.name in AlarmsOutOfStock)) { // Object.values(AlarmsOutOfStock).includes(data.name)
      return null;
    }
    const { idBeveragePouring_, indexFavoritePouring_, beverageSelected } = state;
    if (beverageSelected != null || idBeveragePouring_ != null || indexFavoritePouring_ != null) {
      resetBeverage();
      setEndSession(StatusEndSession.OutOfStock);
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

    setEndSession(StatusEndSession.Start);

    configConsumer.onStartPour(bevSelected, bevConfig).subscribe(); // => TEST MODE
  };

  const stopPour = (forse?: boolean) => {
    configConsumer.onStopPour().subscribe(); // => TEST MODE
    // if (!forse)
    //  setEndSession(StatusEndSession.Start);
    if (endSession === StatusEndSession.Start)
      startTimerEnd_();
  };

  /* ==== END POUR ==== */
  /* ======================================== */

  const startTimerEnd_ = () => {
    resetTimerEnd_();
    endSession_ = timerFull$
    .subscribe(
      val => {
        if (val === "tap_detect") {
          startTimerEnd_();
        } else if (val === "timer_stop") {
          setEndSession(StatusEndSession.Finish);
        } else if (val === "proximity_stop") {
          setEndSession(StatusEndSession.FinishForce);
        }
      }
    );
  };

  const resetTimerEnd_ = () => {
    if (endSession_)
      endSession_.unsubscribe();
  };

  React.useEffect(() => {
    if (endSession === StatusEndSession.Start) {
      resetTimer_();
      // startTimerEnd_();
    } else if (endSession === StatusEndSession.Finish) {
      alertConsumer.show({
        type: AlertTypes.EndBeverage,
        timeout: true,
        onDismiss: () => {
          resetBeverage();
          consumerConsumer.resetConsumer(true);
          startTimer_();
        }
      });
    } else if (endSession === StatusEndSession.FinishForce) {
      alertConsumer.show({
        type: AlertTypes.EndBeverage,
        timeout: true,
        onDismiss: () => {
          resetBeverage();
          consumerConsumer.resetConsumer();
        }
      });
    } else if (endSession === StatusEndSession.OutOfStock) {
      alertConsumer.show({
        type: AlertTypes.OutOfStock,
        timeout: true,
        onDismiss: () => {
          consumerConsumer.updateConsumerBeverages(); // => TO IMPROVE
          consumerConsumer.resetConsumer(true);
        }
      });
    }

    return () => {
      if (endSession === StatusEndSession.Start) {
        resetTimerEnd_();
        stopPour(true);
        mediumLevel.product.sessionEnded().subscribe();
      }
    };
  }, [endSession]);

  /* ==== RESET ==== */
  /* ======================================== */

  const resetBeverage = () => {
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

    if (alarmSparkling_ && value) {
      showAlarmSparkling();
    }

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

  if (alarmSuper_)
  return (
    <HomeContent>
      <Gesture onGesture={onGesture} />
      <OutOfOrder />
    </HomeContent>
  );

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
          alarmConnectivity_={alarmConnectivity_}
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
            blur={blur}
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