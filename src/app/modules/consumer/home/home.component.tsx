import * as React from "react";

import { HomeContent } from "./home.style";
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
import { BeverageTypes } from "@core/components/global/Beverage";
import { AccessibilityContext } from "@core/containers";
import { SegmentButtonProps } from "@core/components/global/SegmentButton";
// import { SegmentButton } from "@core/components/global/SegmentButton";

interface HomeProps {
  history: any;
}

export interface HomeState {
  isSparkling: boolean;
  beverageSelected: number;
  idBeveragePouring_: number;
  indexFavoritePouring_: number;
  beverageConfig: IBeverageConfig;

  slideOpen: boolean;

  showCardsInfo: boolean;
}

let timerEnd_: any = null;
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

  const alertConsumer = React.useContext(AlertContext);
  const configConsumer = React.useContext(ConfigContext);
  const timerConsumer = React.useContext(TimerContext);
  const consumerConsumer = React.useContext(ConsumerContext);

  React.useEffect(() => {
    timerConsumer.startTimer();
    timerEnd_ = null;
    clearTimeout(timerEnd_);
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
    return beverages ? beverages[state.beverageSelected] : null;
  };

  const startPour = (beverageSelected?: IBeverage, beverageConfig?: IBeverageConfig) => {

    let bevSelected, bevConfig = null;

    if (beverageSelected) { // => TO IMPROVE
      bevSelected = beverageSelected;
      if (state.indexFavoritePouring_ === null) {
        setState(prevState => ({
          ...prevState,
          idBeveragePouring_: bevSelected.beverage_id
        })); // <= Rapid mode
      }
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
    configConsumer.onStartPour(bevSelected, bevConfig).subscribe();

  };

  const stopPour = () => {
    timerConsumer.startTimer();
    setState(prevState => ({...prevState, idBeveragePouring_: null}));
    configConsumer.onStopPour().subscribe();
    if (getBeverageSelected()) {
      endPour();
    }
  };

  const alertEndPour = () => {
    alertConsumer.show({
      type: AlertTypes.EndBeverage,
      timeout: true,
      onDismiss: () => {
        resetBeverage();
      }
    });
  };

  const endPour = () => {
    if (timerEnd_ === null) {

      const endEvent = () => {
        alertEndPour();
        clearTimerEnd();
        document.removeEventListener("touchstart", clearTimer);
        document.removeEventListener("touchend", startTimer);
        document.removeEventListener("keydown", clearTimer); // => ACCESSIBILITY
        document.removeEventListener("keyup", startTimer); // => ACCESSIBILITY
      };

      const clearTimer = () => {
        clearTimeout(timerEnd_);
      };

      const startTimer = () => {
        clearTimer();
        timerEnd_ = setTimeout(endEvent, CONSUMER_TIMER.END_POUR);
      };
      startTimer();

      document.addEventListener("touchstart", clearTimer);
      document.addEventListener("touchend", startTimer);
      document.addEventListener("keydown", clearTimer); // => ACCESSIBILITY
      document.addEventListener("keyup", startTimer); // => ACCESSIBILITY
    }
  };

  const resetBeverage = () => {
    clearTimerEnd();
    setState(prevState => ({
      ...prevState,
      beverageSelected: null,
      indexFavoritePouring_: null,
      idBeveragePouring_: null,
      showCardsInfo: false
    }));
  };

  const clearTimerEnd = () => {
    clearTimeout(timerEnd_);
    timerEnd_ = null;
  };

  /* ==== BEVERAGE CONSUMER ==== */
  /* ======================================== */
  const MAX_CONSUMER_BEVERAGE = 3;
  const validConsumerBeverage = consumerConsumer.consumerBeverages.filter(beverage => beverage.$type !== BeverageTypes.Info);
  const lengthConsumerBeverages = validConsumerBeverage.length;
  const fullMode = lengthConsumerBeverages === MAX_CONSUMER_BEVERAGE;

  React.useEffect(() => {
    if (fullMode) {
      handleSlide();
    }
  }, [consumerConsumer.consumerBeverages]);

  const startConsumerPour = (consumerBeverage: IConsumerBeverage, index: number) => {
    setState(prevState => ({...prevState, indexFavoritePouring_: index}));
    const beverageSelected: any = { beverage_id: Number(consumerBeverage.flavors[0].product.flavorUpc) };
    const beverageConfig: IBeverageConfig = {
      flavor_level: Number(consumerBeverage.flavors[0].flavorStrength),
      carbonation_level: Number(consumerBeverage.carbLvl),
      temperature_level: Number(consumerBeverage.coldLvl),
    };
    startPour(beverageSelected, beverageConfig);
  };

  const stopConsumerPour = (consumerBeverage?: IConsumerBeverage) => {
    resetBeverage();
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

  return (
    <section>
      {presentSlide &&
        <Slide
          slideOpen={state.slideOpen}
          indexFavoritePouring_={state.indexFavoritePouring_}
          beverageSelected={state.beverageSelected}
          startConsumerPour={startConsumerPour}
          stopConsumerPour={stopConsumerPour}
          handleSlide={handleSlide}
          fullMode={fullMode}
        />
      }
      <HomeContent isLogged={presentSlide} fullMode={fullMode} beverageIsSelected={beverageIsSelected}>
        {beverages.length > 0 && (
          // <React.Fragment>
          //   <div id="types-group">
          //     <SegmentButton
          //       options={types}
          //       value={isSparkling}
          //       disabled={presentSlide && state.slideOpen}
          //       onChange={(value) => handleType(value)}>
          //     </SegmentButton>
          //   </div>
            <ChoiceBeverage
              onGesture={onGesture}
              selectBeverage={selectBeverage}
              startPour={startPour}
              stopPour={stopPour}
              goToPrepay={goToPrepay}
              idBeveragePouring_={state.idBeveragePouring_}
              isSparkling={state.isSparkling}
              disabled={beverageSelected !== undefined || presentSlide && state.slideOpen}
              segmentButton={segmentButton} // => _SegmentButton
            />
          // </React.Fragment>
        )}
      </HomeContent>
      {beverageSelected &&
        <CustomizeBeverage
          levels={levels}
          isSparkling={isSparkling}
          slideOpen={state.slideOpen}
          showCardsInfo={state.showCardsInfo}
          alertEndPour={alertEndPour}
          beverageConfig={state.beverageConfig}
          resetBeverage={resetBeverage}
          getBeverageSelected={getBeverageSelected}
          handleChange={handleChange}
          startPour={startPour}
          stopPour={stopPour}
          segmentButton={segmentButton} // => _SegmentButton
        />
      }
    </section>
  );

};

export default Home;