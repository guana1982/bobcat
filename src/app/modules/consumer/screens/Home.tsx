import * as React from "react";
import styled from "styled-components";
import { IBeverageConfig, IBeverage } from "@models/index";
import { __ } from "@utils/lib/i18n";
import { Beverages, Pages, LEVELS, MESSAGE_STOP_EROGATION, TIMER_HOME } from "@utils/constants";
import { ConsumerContext } from "@containers/consumer.container";
import { IConsumerBeverage } from "@utils/APIModel";
import { Subscription } from "rxjs";
import { ConfigContext } from "@containers/config.container";
import { TimerContext, StatusTimer } from "@containers/timer.container";
import { AlertTypes, AlertContext } from "@core/containers/alert.container";
import { BeverageTypes } from "@modules/consumer/components/beverage/Beverage";
import { AccessibilityContext, PaymentContext, PaymentStatus, PaymentStatusPour } from "@core/containers";
import mediumLevel from "@core/utils/lib/mediumLevel";
import { Slide, _sizeSlideFull, _sizeSlide } from "../components/home/Slide";
import { ChoiceBeverage } from "../components/home/ChoiceBeverage";
import { CardsWrap } from "../components/home/CardsWrap";
import { CustomizeBeverage } from "../components/home/CustomizeBeverage";
import { Grid } from "../components/common/Grid";
import { SegmentButtonProps } from "../components/common/SegmentButton";
import { first, tap } from "rxjs/operators";

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
    padding-top: 78px;
  }
  #payment-status {
    position: absolute;
    width: 100%;
    text-align: center;
    text-transform: uppercase;
    bottom: 1.5rem;
    right: 0;
    font-size: 16px;
    font-family: NeuzeitGro-Bol;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    letter-spacing: 1.28px;
    color: ${props => props.theme.slateGrey};
  }
`;

export const HomeContent = styled.section`
  background-image: ${props => props.theme.backgroundLight};
  &.slide-is-open {
    #logout-btn {
      z-index: 5;
      transition-delay: 400ms;
      right: -22px;
    }
  }
  &:not(.slide-is-open) {
    #logout-btn {
      transition-delay: 100ms;
      #text {
        transition-delay: 100ms;
      }
    }
  }
`;

/* ==== PAGE ==== */
/* ======================================== */

interface HomeProps {
  history: any;
}

export interface HomeState {
  isSparkling: boolean;
  beverageSelectedId: number;
  indexBeverageForLongPressPour_: number;
  idBeveragePouring_: number;
  indexFavoritePouring_: number;
  beverageConfig: IBeverageConfig;

  showCardsInfo: boolean;
}

enum StatusEndSession {
  Start = "start",
  Finish = "finish",
  FinishForce = "finishForce"
}

export const Home = (props: HomeProps) => {

  const socketAlarms_ =  React.useRef<Subscription>(null);
  const socketPayment_ =  React.useRef<Subscription>(null);
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
    beverageSelectedId: null,
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
  const [endSession, setEndSession] = React.useState<StatusEndSession | MESSAGE_STOP_EROGATION>(null);

  const alertConsumer = React.useContext(AlertContext);
  const configConsumer = React.useContext(ConfigContext);
  const paymentConsumer = React.useContext(PaymentContext);
  const timerConsumer = React.useContext(TimerContext);
  const consumerConsumer = React.useContext(ConsumerContext);

  const beverages = React.useMemo(() => configConsumer.beverages[state.isSparkling ? "sparkling" : "still"], [state.isSparkling]);
  const { allBeverages } = configConsumer;

  //  ==== TIMER ====>
  const { timerBoot$ } = timerConsumer;
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

  const startTimer_ = () => {
    resetTimer_();
    timer_.current = timerBoot$(TIMER_HOME, true)
    .subscribe(
      val => {
        console.log("=== startTimer_ ===");
        console.log({val});
        console.log("=== startTimer_ ===");
        if (val === StatusTimer.TimerInactive || val === StatusTimer.ProximityExit) {
          const event_ = () => consumerConsumer.resetConsumer();
          alertIsLogged(event_);
        } else if (val === StatusTimer.TimerActive) {
          const event_ = () => {
            consumerConsumer.resetConsumer(true);
            handleType(false);
            setNutritionFacts(false);
            resetBeverage();
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
    startTimer_();
    return () => {
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
      beverageSelected: state.beverageSelectedId,
      nutritionFacts: nutritionFacts,
      slideOpen: slideOpen,
      fullMode: fullMode,
      buttonGroupSelected: null,
      endSession: endSession
    });
  }, [state.beverageSelectedId, slideOpen, nutritionFacts, endSession]);
  //  <=== ACCESSIBILITY FUNCTION ====

  /* ==== ALARMS ==== */
  /* ======================================== */

  const { alarmSuper_, alarmSparkling_, alarmConnectivity_, alarmWebcam_, alarmADAPanel_, alarmPayment_ } = configConsumer.statusAlarms;

  const showAlarmWebcam = () => {
    alertConsumer.show({
      type: AlertTypes.ErrorWebcam,
      subTitle: true,
      timeout: true,
      onDismiss: () => console.log("Close showAlarmWebcam")
    });
  };

  // const showAlarmADAPanel = () => {
  //   alertConsumer.show({
  //     type: AlertTypes.ErrorADAPanelDown,
  //     subTitle: true,
  //     timeout: true,
  //     onDismiss: () => console.log(null)
  //   });
  // };

  /* ==== PAYMENT ==== */
  /* ======================================== */

  const { needToPay, canPour, socketPayment$, restartPayment, promotionEnabled } = paymentConsumer;

  const showPayment = (call_?: any) => {
    setDisabled(true);
    alertConsumer.show({
      type: AlertTypes.NeedPayment,
      img: "img/pay.svg",
      timeout: false,
      transparent: true,
      onDismiss: () => {
        setDisabled(false);
        call_();
      }
    });
  };

  const checkPayment = () => {
    let needToPay_ = false;
    socketPayment_.current = socketPayment$.current
    .subscribe(
      status => {
        if (!(status in PaymentStatusPour)) {
          if (needToPay_ === false) {
            showPayment(() => socketPayment_.current.unsubscribe());
            needToPay_ = true;
          }
        } else if (status in PaymentStatusPour) {
          if (socketPayment_.current) {
            setDisabled(false);
            alertConsumer.hide();
            socketPayment_.current.unsubscribe();
          }
        } else if (status === PaymentStatus.Declined) {
          // console.log("ERROR => PaymentStatus.Declined");
          // setDisabled(false);
          // socketPayment_.current.unsubscribe();
        }
      }
    );
  };

  /* ==== BEVERAGE ==== */
  /* ======================================== */

  const selectBeverage = (beverage: IBeverage) => {
    const needToPay_ = needToPay(beverage);
    if (needToPay_ && !promotionEnabled) {
      if (alarmPayment_) {
        alertConsumer.show({
          type: AlertTypes.ErrorPaymentDown,
          img: "img/payment_system_down.png",
          subTitle: true,
          timeout: true,
          onDismiss: () => {}
        });
        return;
      }
    }

    handleType(state.isSparkling);
    setState(prevState => ({
      ...prevState,
      beverageSelectedId: beverage.beverage_id,
      beverageConfig: {
        ...prevState.beverageConfig,
        flavor_level: levels.flavor[1].value,
        b_complex: false,
        antioxidants: false
      }
    }));
  };

  const getBeverageSelected = (): IBeverage => {
    const { beverageSelectedId } = state;

    let beverageSelectedId_ = beverageSelectedId;

    /* === STILL & SODA WATER ===> */
    if (state.isSparkling && beverageSelectedId === 9)
      beverageSelectedId_ = 10;
    else if (!state.isSparkling && beverageSelectedId === 10)
      beverageSelectedId_ = 9;
    /* <=== STILL & SODA WATER === */

    return allBeverages ? allBeverages.find(beverage => beverage.beverage_id ===  beverageSelectedId_) : null;
  };

  const getBeverageColorOnLongPressPour = (): string => {
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

    const needToPay_ = needToPay(beverageSelected || getBeverageSelected());
    if (needToPay_ && !promotionEnabled) {
      if (alarmPayment_) {
        alertConsumer.show({
          type: AlertTypes.ErrorPaymentDown,
          img: "img/payment_system_down.png",
          subTitle: true,
          timeout: true,
          onDismiss: () => {}
        });
        return;
      }
      if (!canPour()) {
        checkPayment();
        return;
      }
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
      if (beverageConfig) {
        bevConfig = beverageConfig;
      } else {
        bevConfig = {
          carbonation_level: !isSparkling ? levels.noCarbonation[0].value : levels.carbonation[2].value,
          temperature_level: levels.temperature[2].value,
          flavor_level: levels.flavor[1].value
        };
      }
    } else {
      bevSelected = getBeverageSelected();
      setState({
        ...state,
        showCardsInfo: true
      }); // <= Slow mode
      bevConfig = {...state.beverageConfig};
    }

    setEndSession(StatusEndSession.Start);

    const pour_ = configConsumer.onStartPour(bevSelected, bevConfig);

    if (needToPay_ && !promotionEnabled) {
      mediumLevel.payment.vendRrequest({ beverage_id: bevSelected.beverage_id })
      .subscribe(
        data => {
          if (data.status === 0) {
            pour_.subscribe();
          } else {
            console.log("ERROR => VendRrequest");
          }
        }
      );
    } else {
      pour_.subscribe(); // => TEST MODE
    }
  };

  const stopPour = React.useCallback(() => {
    configConsumer.onStopPour().subscribe(); // => TEST MODE

    if (!endSession_.current) {
       startTimerEnd_();
    } // if (endSession === StatusEndSession.Start)

  }, [endSession]);

  /* ==== END POUR ==== */
  /* ======================================== */

  const startTimerEnd_ = () => {
    resetTimerEnd_();
    endSession_.current = timerBoot$(TIMER_HOME)
    .subscribe(
      val => {
        if (val === StatusTimer.TimerActive) {
          setEndSession(StatusEndSession.Finish);
        } else if (val === StatusTimer.TimerInactive || val === StatusTimer.ProximityExit) {
          setEndSession(StatusEndSession.FinishForce);
        }
      }
    );
  };

  const resetTimerEnd_ = () => {
    if (endSession_.current) {
      endSession_.current.unsubscribe();
      endSession_.current = null;
    }
  };

  const detectStopErogation = () => {
    const { socketStopErogation$ } = configConsumer;
    return socketStopErogation$
    .pipe(first())
    .subscribe(
      value => setEndSession(value)
    );
  };

  const stopEndSession = (force?: boolean) => {
    resetBeverage();
    consumerConsumer.updateConsumerBeverages();
    consumerConsumer.resetConsumer(!force);
    if (!force) {
      startTimer_();
    }
  };

  React.useEffect(() => {
    let socketStopErogation_: Subscription = null;

    if (endSession === StatusEndSession.Start) {
      resetTimer_();
      socketStopErogation_ = detectStopErogation();
    } else if (endSession === StatusEndSession.Finish) {
      alertConsumer.show({
        type: AlertTypes.EndBeverage,
        timeout: true,
        onDismiss: () => stopEndSession()
      });
    } else if (endSession === StatusEndSession.FinishForce) {
      alertConsumer.show({
        type: AlertTypes.EndBeverage,
        timeout: true,
        onDismiss: () => stopEndSession(true)
      });
    } else if (endSession === MESSAGE_STOP_EROGATION.OUT_OF_SODA || endSession === MESSAGE_STOP_EROGATION.OUT_OF_STOCK || endSession === MESSAGE_STOP_EROGATION.EROGATION_LIMIT) {
      const alertType_: any = `c_${endSession}`;
      alertConsumer.show({
        type: alertType_,
        timeout: true,
        onDismiss: () => stopEndSession()
      });
    } else if (endSession === MESSAGE_STOP_EROGATION.OUT_OF_ORDER) {
      alertConsumer.show({
        type: AlertTypes.OutOfOrder,
        timeout: true,
        onDismiss: () => stopEndSession(true)
      });
    }

    return () => {
      if (endSession === StatusEndSession.Start) {
        handleType(false);
        resetTimerEnd_();
        mediumLevel.product.sessionEnded().subscribe();
        restartPayment();
        if (socketStopErogation_) {
          socketStopErogation_.unsubscribe();
        }
      }
    };
  }, [endSession]);

  /* ==== RESET ==== */
  /* ======================================== */

  const resetBeverage = () => {
    setState(prevState => ({
      ...prevState,
      beverageSelectedId: null,
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
    const needToPay_ = needToPay(consumerBeverage.$beverage);
    if (needToPay_ && !promotionEnabled) {
      if (alarmPayment_) {
        alertConsumer.show({
          type: AlertTypes.ErrorPaymentDown,
          img: "img/payment_system_down.png",
          subTitle: true,
          timeout: true,
          onDismiss: () => {}
        });
        return;
      }
    }

    setState(prevState => ({
      ...prevState,
      isSparkling: consumerBeverage.$sparkling,
      beverageSelectedId: consumerBeverage.$beverage.beverage_id,
      beverageConfig: {
        flavor_level: Number(consumerBeverage.flavors[0].flavorStrength),
        carbonation_level: consumerBeverage.$sparkling ? Number(consumerBeverage.carbLvl) : 0,
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
    if (beverageSelected && beverageSelected.beverage_id === 9 && value) {
      console.log({beverageSelected, value});
      const needToPay_ = needToPay(allBeverages[1]); // => TO IMPROVE
      if (needToPay_ && !promotionEnabled) {
        if (alarmPayment_) {
          alertConsumer.show({
            type: AlertTypes.ErrorPaymentDown,
            img: "img/payment_system_down.png",
            subTitle: true,
            timeout: true,
            onDismiss: () => {}
          });
          return;
        }
      }
    }

    setState(prevState => ({
      ...prevState,
      isSparkling: value,
      beverageConfig: {
        ...prevState.beverageConfig,
        carbonation_level: value ? levels.carbonation[2].value : levels.noCarbonation[0].value,
        temperature_level: value ? levels.temperature[2].value : levels.temperature[2].value
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
    <HomeContent className={slideOpen ? "slide-is-open" : ""}>
      {presentSlide &&
        <Slide
          slideOpen={slideOpen}
          indexFavoritePouring_={state.indexFavoritePouring_}
          beverageSelected={state.beverageSelectedId}
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
            beverages={beverages}
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
            disabled={disabledMode}
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