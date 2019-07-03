import * as React from "react";
import styled from "styled-components";
import { IBeverageConfig, IBeverage } from "@models/index";
import { __ } from "@utils/lib/i18n";
import { Beverages, Pages, AlarmsOutOfStock, LEVELS, CONSUMER_TIMER } from "@utils/constants";
import { ConsumerContext } from "@containers/consumer.container";
import { IConsumerBeverage } from "@utils/APIModel";
import { Subscription } from "rxjs";
import { ConfigContext } from "@containers/config.container";
import { TimerContext, StatusProximity } from "@containers/timer.container";
import { AlertTypes, AlertContext } from "@core/containers/alert.container";
import { BeverageTypes } from "@modules/consumer/components/beverage/Beverage";
import { AccessibilityContext, PaymentContext } from "@core/containers";
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

export const Home = (props: HomeProps) => {

  const socketAlarms_ =  React.useRef<Subscription>(null);
  const timer_ =  React.useRef<Subscription>(null);
  const endSession_ =  React.useRef<Subscription>(null);

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
      temperature_level: null,
      b_complex: false,
      antioxidants: false,
      isConsumerBeverage: false
    }
  });

  const [nutritionFacts, setNutritionFacts] = React.useState(false);
  const [slideOpen, setSlideOpen] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);
  const [endSession, setEndSession] = React.useState<"start" | "finish" | "finishForce" | "outOfStock">(null);

  const alertConsumer = React.useContext(AlertContext);
  const configConsumer = React.useContext(ConfigContext);
  const paymentConsumer = React.useContext(PaymentContext);
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
    resetTimer_();
    timer_.current = restartBrightness$
    .subscribe(val => {
      if (val === StatusProximity.TimerRestart) {
        startTimer_();
      } else if (val === StatusProximity.ProximityStop) {
        const event_ = () => consumerConsumer.resetConsumer();
        alertIsLogged(event_);
      }
    });
  };

  const startTimer_ = () => {
    resetTimer_();
    timer_.current = timerFull$.subscribe(
      val => {
        if (val === StatusProximity.TapDetect) {
          startTimer_();
        } else if (val === StatusProximity.ProximityStop) {
          const event_ = () => consumerConsumer.resetConsumer(true);
          alertIsLogged(event_);
        } else if (val === StatusProximity.TouchStop) {
          const event_ = () => consumerConsumer.resetConsumer();
          alertIsLogged(event_);
        } else if (val === StatusProximity.TimerStop) {
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
    if (timer_.current)
      timer_.current.unsubscribe();
  };
  //  <=== TIMER ====

  React.useEffect(() => {
    const stopVideo_ = setTimeout(() => {
      mediumLevel.config.stopVideo().subscribe();
    }, TIMEOUT_ATTRACTOR); // <= STOP ATTRACTOR
    // if (timerStop) {
    //   restartBrightness_();
    // } else {
    //   startTimer_();
    // }
    return () => {
      clearTimeout(stopVideo_); // <= STOP ATTRACTOR
      configConsumer.setAuthService(false);
      resetTimer_();

      if (socketAlarms_.current)
        socketAlarms_.current.unsubscribe();
      if (timer_.current)
        timer_.current.unsubscribe();
      if (endSession_.current)
        endSession_.current.unsubscribe();

      alertConsumer.hide();
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
      fullMode: fullMode,
      buttonGroupSelected: null,
      endSession: endSession
    });
  }, [state.beverageSelected, slideOpen, nutritionFacts, endSession]);
  //  <=== ACCESSIBILITY FUNCTION ====

  /* ==== ALARMS ==== */
  /* ======================================== */

  const { alarmSuper_, alarmSparkling_, alarmConnectivity_, alarmWebcam_, alarmADAPanel_ } = configConsumer.statusAlarms;

  // const showAlarmSparkling = () => {
  //   if (!state.beverageConfig.isConsumerBeverage)
  //     resetBeverage();
  //   const evtSparkling_ = () => {
  //     // consumerConsumer.resetConsumer(true);
  //     handleType(false);
  //   };
  //   alertConsumer.show({
  //     type: AlertTypes.EndSparkling,
  //     subTitle: true,
  //     timeout: false,
  //     transparent: true,
  //     onConfirm: evtSparkling_,
  //     onDismiss: evtSparkling_
  //   });
  // };

  const showAlarmWebcam = () => {
    alertConsumer.show({
      type: AlertTypes.ErrorWebcam,
      subTitle: true,
      timeout: true,
      onDismiss: () => console.log("Close showAlarmWebcam")
    });
  };

  const showAlarmADAPanel = () => {
    alertConsumer.show({
      type: AlertTypes.ErrorADAPanelDown,
      subTitle: true,
      timeout: true,
      onDismiss: () => console.log(null)
    });
  };

  // React.useEffect(() => {
  //   if (alarmSparkling_) {
  //     if (endSession !== StatusEndSession.Start && isSparkling) {
  //       showAlarmSparkling();
  //     }
  //   }
  // }, [alarmSparkling_]);

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
    socketAlarms_.current = configConsumer.socketAlarms$.subscribe(data => alarmDetect(data));
      return () => {
        if (socketAlarms_.current)
          socketAlarms_.current.unsubscribe();
      };
    },
    [state.beverageSelected, state.idBeveragePouring_, state.indexFavoritePouring_] // => TO IMPROVE
  );

  /* ==== PAYMENT ==== */
  /* ======================================== */

  const { paymentEnabled } = paymentConsumer;

  const showPayment = () => {
    setDisabled(true);
    alertConsumer.show({
      type: AlertTypes.NeedPayment,
      img: "img/pay.svg",
      timeout: false,
      transparent: true,
      onDismiss: () => {
        console.log("tao");
        setDisabled(false);
      }
    });
  };

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
        flavor_level: beverage.beverage_type !== Beverages.Plain ? levels.flavor[1].value : null,
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

    if (paymentEnabled || true) {
      showPayment();
      return;
    }

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
      if (bevConfig.carbonation_level == null || bevConfig.temperature_level || bevConfig.flavor_level) {
        bevConfig.carbonation_level = bevSelected.carbonation_levels.values[1];
        bevConfig.temperature_level = 50;
        bevConfig.flavor_level = 2;
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
    endSession_.current = timerFull$
    .subscribe(
      val => {
        if (val === StatusProximity.TapDetect) {
          startTimerEnd_();
        } else if (val === StatusProximity.TimerStop) {
          setEndSession(StatusEndSession.Finish);
        } else if (val === StatusProximity.ProximityStop || val === StatusProximity.TouchStop) {
          setEndSession(StatusEndSession.FinishForce);
        }
      }
    );
  };

  const resetTimerEnd_ = () => {
    if (endSession_.current)
      endSession_.current.unsubscribe();
  };

  React.useEffect(() => {
    if (endSession === StatusEndSession.Start) {
      resetTimer_();
      startTimerEnd_();
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
  const fullModeCondition_ = lengthConsumerBeverages === MAX_CONSUMER_BEVERAGE;
  const fullMode = fullModeCondition_ || alarmConnectivity_;

  React.useEffect(() => {
    setTimeout(() => {
      if (fullModeCondition_) {
        handleSlide();
      }
    } , 200);
  }, [consumerConsumer.consumerBeverages]);

  const selectConsumerBeverage = (consumerBeverage: IConsumerBeverage) => {
    const { beverages } = configConsumer;
    const indexBeverage_ = beverages.findIndex(beverage => beverage.beverage_id === consumerBeverage.$beverage.beverage_id);
    setState(prevState => ({
      ...prevState,
      isSparkling: consumerBeverage.$sparkling,
      beverageSelected: indexBeverage_,
      beverageConfig: {
        flavor_level: Number(consumerBeverage.flavors[0].flavorStrength),
        carbonation_level: consumerBeverage.$sparkling ? Number(consumerBeverage.carbLvl) : null,
        temperature_level: Number(consumerBeverage.coldLvl),
        isConsumerBeverage: true
      }
    }));
  };

  const startConsumerPour = (consumerBeverage: IConsumerBeverage, index: number) => {
    const beverageSelected: any = { beverage_id: Number(consumerBeverage.flavors[0].product.flavorUpc) };
    const beverageConfig: IBeverageConfig = {
      flavor_level: Number(consumerBeverage.flavors[0].flavorStrength),
      carbonation_level: Number(consumerBeverage.carbLvl),
      temperature_level: Number(consumerBeverage.coldLvl),
      isConsumerBeverage: true
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
      // showAlarmSparkling();
    }

    setState(prevState => ({
      ...prevState,
      isSparkling: value,
      beverageConfig: {
        ...prevState.beverageConfig,
        carbonation_level: value ? levels.carbonation[1].value : null,
        temperature_level: value ? levels.temperature[2].value : levels.temperature[1].value
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
    if (alarmWebcam_) {
      showAlarmWebcam();
      return;
    }
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
            showPayment={showPayment}
            beverageSelected={beverageSelected}
            handleType={handleType}
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
          handleType={handleType}
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
  //     if (socketAttractor_.current)
  //      socketAttractor_.current.unsubscribe();
  //   };
  // }, [socketAttractor$, state.beverageSelected, state.idBeveragePouring_, state.indexFavoritePouring_, consumerConsumer.isLogged]); // => TO IMPROVE