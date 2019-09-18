import * as React from "react";
import styled from "styled-components";
import { IBeverageConfig, IBeverage } from "@models/index";
import { __ } from "@utils/lib/i18n";
import { Pages, LEVELS, MESSAGE_STOP_EROGATION } from "@utils/constants";
import { ConsumerContext } from "@containers/consumer.container";
import { IConsumerBeverage } from "@utils/APIModel";
import { Subscription } from "rxjs";
import { ConfigContext } from "@containers/config.container";
import { TimerContext, StatusTimer, DistanceTypes } from "@containers/timer.container";
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
import { first, finalize, tap, flatMap, map } from "rxjs/operators";
import { IPourConfig, PourFrom, IPourConsumerConfig } from "@core/models/vendor.model";

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
  #message-status {
    position: absolute;
    width: 100%;
    text-align: center;
    text-transform: uppercase;
    bottom: 1.5rem;
    right: 0;
    font-size: 16px;
    font-family: NeuzeitGro-Reg;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    letter-spacing: 1.28px;
    color: ${props => props.theme.slateGrey};
  }
`;

export const HomeContent = styled.section`
  background-color: #fff;
  &.slide-is-open {
    #logout-btn {
      z-index: 5;
      /* transition-delay: 400ms; */
      width: 48px;
      right: 7px;
      #icon {
        /* transition-delay: 400ms; */
        margin-left: 5px;
      }
    }
  }
  &:not(.slide-is-open) {
    #logout-btn {
      /* transition-delay: 100ms; */
      #icon {
        /* transition-delay: 100ms; */
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
  consumerCustomBeverageSelected: any;
  indexBeverageForLongPressPour_: number;
  idBeveragePouring_: number;
  indexFavoritePouring_: number;
  beverageConfig: IBeverageConfig;

  showCardsInfo: boolean;
}

export enum StatusEndSession {
  Start = "start",
  Finish = "finish",
  ProximityEnd = "proximity-end",
}

export const Home = (props: HomeProps) => {

  const socketAlarms_ =  React.useRef<Subscription>(null);
  const socketPayment_ =  React.useRef<Subscription>(null);
  const timer_ =  React.useRef<Subscription>(null);
  const endSession_ =  React.useRef<Subscription>(null);
  const pourCheck_ =  React.useRef<any>(null);

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
    consumerCustomBeverageSelected: null,
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

  const stillTemperature = React.useRef(0);
  const sparklingLevel = React.useRef(levels.carbonation[2].value);

  const [nutritionFacts, setNutritionFacts] = React.useState(false);
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
  const { timerBoot$, statusProximity$ } = timerConsumer;
  const { isLogged } = consumerConsumer;

  function alertIsLogged(event) {
    if (isLogged) {
      paymentConsumer.resetPromotion();
      mediumLevel.product.sessionEnded().subscribe();
      setSlideOpen(false);
      alertConsumer.show({
        type: AlertTypes.SignedOut,
        timeout: true,
        onDismiss: event
      });
    } else {
      event();
    }
  }

  const startTimer_ = () => {
    resetTimer_();
    const { vendorConfig } = configConsumer;
    timer_.current = timerBoot$(vendorConfig.timer_home)
    .subscribe(
      val => {
        if (val === StatusTimer.TimerActive || val === StatusTimer.TimerInactive) {
          const event_ = () => consumerConsumer.resetConsumer();
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
      if (configConsumer.authService === true) {
        configConsumer.setAuthService(false);
      }
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

  /* ==== ALARMS ==== */
  /* ======================================== */

  const { alarmSuper_, alarmSparkling_, alarmConnectivity_, alarmWebcam_, alarmADAPanel_, alarmPayment_ } = configConsumer.statusAlarms;

  const showAlarmWebcam = () => {
    alertConsumer.show({
      type: AlertTypes.ErrorWebcam,
      img: "img/alerts/wrench.webp",
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

  const { needToPay, canPour, socketPayment$, restartPayment, promotionEnabled, paymentModeEnabled } = paymentConsumer;

  const showPayment = (call_?: any) => {
    setDisabled(true);
    alertConsumer.show({
      type: AlertTypes.NeedPayment,
      img: "img/alerts/pay.svg",
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
          img: "img/alerts/payment-system-down.svg",
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

    return allBeverages ? allBeverages.find(beverage => beverage.beverage_id === beverageSelectedId_) : null;
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

  const startPour = (config: IPourConfig = { params: {}, from: null }) => {

    const { params, from } = config;

    const { beverageSelected, beverageConfig, indexFavorite } = params;

    const needToPay_ = needToPay(beverageSelected || getBeverageSelected());
    if (needToPay_ && !promotionEnabled) {
      if (alarmPayment_) {
        alertConsumer.show({
          type: AlertTypes.ErrorPaymentDown,
          img: "img/alerts/payment-system-down.svg",
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
      bevConfig = {...state.beverageConfig};
    }

    const pour_ = configConsumer.onStartPour(bevSelected, bevConfig);

    const startErogation = () => {
      if (beverageSelected) {
        setState(prevState => ({
          ...prevState,
          indexBeverageForLongPressPour_: !validFavorite ? beverages.indexOf(beverageSelected) : null,
          idBeveragePouring_: !validFavorite ? bevSelected.beverage_id : null,
          indexFavoritePouring_: !validFavorite ? null : indexFavorite
        })); // <= Rapid mode
      } else {
        setState({
          ...state,
          showCardsInfo: true
        }); // <= Slow mode
      }
      console.log("__START_POUR =>", { config });
      setEndSession(StatusEndSession.Start);
      pour_.subscribe();
      if (from === PourFrom.Touch) { // <= CHECK VALID TOUCH
        if (pourCheck_.current) {
          clearInterval(pourCheck_.current);
        }
        pourCheck_.current = setInterval(() => {
          console.log("/___ CHECK POUR => CHECKING ___/");
          const activeElement_ = document.querySelector(":active");
          if (activeElement_ === null) {
            console.log("/___ CHECK POUR => NO ACTIVE ELEMENT ___/");
            stopPour();
            if (pourCheck_.current)
              clearInterval(pourCheck_.current);
            return;
          }
        }, 2000);
      }
    };

    if (needToPay_ && !promotionEnabled && endSession !== StatusEndSession.Start) {
      mediumLevel.payment.vendRequest({ beverage_id: bevSelected.beverage_id })
      .subscribe(
        data => {
          if (data.status === 0) {
            startErogation();
          } else {
            alertConsumer.show({
              type: AlertTypes.PaymentDeclined,
              img: "img/alerts/payment-alert.svg",
              subTitle: true,
              timeout: true,
              onDismiss: paymentConsumer.cancelPayment
            });
          }
        }
      );
    } else {
      startErogation();
    }
  };

  const stopPour = React.useCallback(() => {
    configConsumer.onStopPour().subscribe(); // => TEST MODE
    if (pourCheck_.current) { // <= CHECK VALID TOUCH
      console.log("/___ CHECK POUR => STOP ___/");
      clearInterval(pourCheck_.current);
    }
    if (!endSession_.current) { // if (endSession === StatusEndSession.Start)
       startTimerEnd_();
    }
  }, [endSession]);

  /* ==== END POUR ==== */
  /* ======================================== */

  const startTimerEnd_ = () => {
    resetTimerEnd_();
    const { vendorConfig } = configConsumer;
    endSession_.current = timerBoot$(vendorConfig.timer_pouring)
    .subscribe(
      val => {
        if (val === StatusTimer.TimerActive || val === StatusTimer.TimerInactive) {
          setEndSession(StatusEndSession.ProximityEnd);
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
    .pipe(
      first(),
      flatMap(value => configConsumer.onStopPour().pipe(map(() => value))) // <= FIX STOP POUR
    )
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
      statusProximity$.current
      .pipe(first())
      .subscribe((status: DistanceTypes) => {
        alertConsumer.show({
          type: AlertTypes.EndSession,
          timeout: true,
          onDismiss: () => stopEndSession(status === DistanceTypes.None),
          backgroung: "img/fruits-bg.webp"
        });
      });
    } else if (endSession === StatusEndSession.ProximityEnd) {
      alertConsumer.show({
        type: AlertTypes.EndSession,
        timeout: true,
        onDismiss: () => stopEndSession(true),
        backgroung: "img/fruits-bg.webp"
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
        setSlideOpen(false);
        handleType(false);
        resetTimerEnd_();
        mediumLevel.product.sessionEnded().subscribe();
        restartPayment();
        if (pourCheck_.current) { // <= CHECK VALID TOUCH
          console.log("/___ CHECK POUR => STOP ___/");
          clearInterval(pourCheck_.current);
        }
        if (socketStopErogation_) {
          socketStopErogation_.unsubscribe();
        }
      }
    };
  }, [endSession]);

  /* ==== RESET ==== */
  /* ======================================== */

  const resetBeverage = () => {
    stillTemperature.current = 0;
    sparklingLevel.current = levels.carbonation[2].value;
    setState(prevState => ({
      ...prevState,
      beverageSelectedId: null,
      indexBeverageForLongPressPour_: null,
      indexFavoritePouring_: null,
      idBeveragePouring_: null,
      showCardsInfo: false,
      beverageConfig: {
        flavor_level: null,
        carbonation_level: null,
        temperature_level: null,
        b_complex: false,
        antioxidants: false,
        isConsumerBeverage: false
      }
    }));
  };

  /* ==== BEVERAGE CONSUMER ==== */
  /* ======================================== */

  const MAX_CONSUMER_BEVERAGE = 3;
  const validConsumerBeverage = consumerConsumer.consumerBeverages.filter(beverage => beverage.$types[0] !== BeverageTypes.Info);
  const lengthConsumerBeverages = validConsumerBeverage.length;
  const fullModeCondition_ = lengthConsumerBeverages === MAX_CONSUMER_BEVERAGE;
  const fullMode = fullModeCondition_ || alarmConnectivity_;

  const [slideOpen, setSlideOpen] = React.useState(false);

  React.useEffect(() => {
    if (fullModeCondition_) {
      setTimeout(() => {
        handleSlide();
      }, 500);
    }
  }, [fullModeCondition_]);

  const selectConsumerBeverage = (consumerBeverage: IConsumerBeverage) => {
    const needToPay_ = needToPay(consumerBeverage.$beverage);
    if (needToPay_ && !promotionEnabled) {
      if (alarmPayment_) {
        alertConsumer.show({
          type: AlertTypes.ErrorPaymentDown,
          img: "img/alerts/payment-system-down.svg",
          subTitle: true,
          timeout: true,
          onDismiss: () => {}
        });
        return;
      }
    }

    stillTemperature.current = Number(consumerBeverage.coldLvl);
    sparklingLevel.current = Number(consumerBeverage.carbLvl);

    setState(prevState => ({
      ...prevState,
      isSparkling: consumerBeverage.$sparkling,
      beverageSelectedId: consumerBeverage.$beverage.beverage_id,
      consumerCustomBeverageSelected: consumerBeverages.find(b => b === consumerBeverage),
      beverageConfig: {
        flavor_level: Number(consumerBeverage.flavors[0].flavorStrength),
        carbonation_level: consumerBeverage.$sparkling ? Number(consumerBeverage.carbLvl) : 0,
        temperature_level: Number(consumerBeverage.coldLvl),
        isConsumerBeverage: true
      }
    }));
  };

  const startConsumerPour = (config: IPourConsumerConfig = { params: {}, from: null }) => {

    const { params, from } = config;
    const { consumerBeverage , indexFavorite } = params;

    const beverageSelected = consumerBeverage.$beverage;

    const beverageConfig: IBeverageConfig = {
      flavor_level: Number(consumerBeverage.flavors[0].flavorStrength),
      carbonation_level: Number(consumerBeverage.carbLvl),
      temperature_level: Number(consumerBeverage.coldLvl),
      isConsumerBeverage: true
    };

    startPour({params: { beverageSelected, beverageConfig, indexFavorite }, from });
  };

  const stopConsumerPour = (consumerBeverage?: IConsumerBeverage) => {
    stopPour();
  };

  function signedOut() {
    statusProximity$.current
    .pipe(first())
    .subscribe((status: DistanceTypes) => {
      const event_ = () => {
        consumerConsumer.resetConsumer(status !== DistanceTypes.None);
      };
      alertIsLogged(event_);
    });
  }

  /* ==== HANDLE ==== */
  /* ======================================== */

  const handleType = (value) => { // TRUE => isSparkling
    if (beverageSelected && beverageSelected.beverage_id === 9 && value) {
      const needToPay_ = needToPay(allBeverages[1]); // => TO IMPROVE
      if (needToPay_ && !promotionEnabled) {
        if (alarmPayment_) {
          alertConsumer.show({
            type: AlertTypes.ErrorPaymentDown,
            img: "img/alerts/payment-system-down.svg",
            subTitle: true,
            timeout: true,
            onDismiss: () => {}
          });
          return;
        }
      }
    }


    const carbonationValue = () => {
      if (value) {
        if (state.beverageConfig.isConsumerBeverage) {
          if (Number(state.consumerCustomBeverageSelected.carbLvl) === 0) {
            if (sparklingLevel.current !== 0) {
              return sparklingLevel.current;
            } else {
              return levels.carbonation[2].value;
            }
          }
        }
        if (state.beverageConfig.carbonation_level === null) {
          return levels.carbonation[2].value;
        } else {
          return sparklingLevel.current;
        }
      } else {
        return levels.noCarbonation[0].value;
      }
    };

    const temperatureValue = () => {
      if (state.beverageConfig.temperature_level === null || value) {
        if (state.beverageConfig.isConsumerBeverage && !value) {
          return Number(state.consumerCustomBeverageSelected.coldLvl);
        }
        return levels.temperature[2].value;
      } else {
        return stillTemperature.current;
      }
    };

    const flavorValue = () => {
      if (state.beverageConfig.flavor_level === null) {
        if (state.beverageConfig.isConsumerBeverage) {
          return Number(state.consumerCustomBeverageSelected.flavors[0].flavorStrength);
        } else {
          return levels.flavor[1].value;
        }
      } else {
        return state.beverageConfig.flavor_level;
      }
    };


    setState(prevState => ({
      ...prevState,
      isSparkling: value,
      beverageConfig: {
        ...prevState.beverageConfig,
        flavor_level: flavorValue(),
        carbonation_level: carbonationValue(),
        temperature_level: temperatureValue()
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
        sparklingLevel.current = value;
        beverageConfig.carbonation_level = value;
        break;
      case "temperature":
        stillTemperature.current = value;
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

  /* ==== ROUTING ==== */
  /* ======================================== */

  // const gestureTimeout =  React.useRef<any>(false);
  // const gestureInterval =  React.useRef<boolean>(false);
  const onGesture = (gestureType) => {
    if (gestureType === "p") {
      return configConsumer.setAuthService(true);
      // if (gestureInterval.current) {
      //   clearTimeout(gestureTimeout.current);
      //   gestureInterval.current = false;
      // }
      // gestureInterval.current = true;
      // gestureTimeout.current = setTimeout(() => {
      //   gestureInterval.current = false;
      // }, 4000);
    }
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
          beverageSelected={beverageSelected}
          handleChange={handleChange}
          startPour={startPour}
          stopPour={stopPour}
          segmentButton={segmentButton} // => _SegmentButton
          nutritionFacts={nutritionFacts}
          isLogged={presentSlide}
        />
      }
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
            signedOut={signedOut}
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
    </HomeContent>
  );

};