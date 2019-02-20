import * as React from "react";

import { HomeContent} from "./home.style";
import { ButtonGroupFull } from "@components/global/ButtonGroup";
import { IBeverageConfig, IBeverage } from "@models/index";
import { __ } from "@utils/lib/i18n";
import { Beverages, Pages, AlarmsOutOfStock, LEVELS, CONSUMER_TIMER } from "@utils/constants";
import { ConsumerContext } from "@containers/consumer.container";
import { IConsumerBeverage } from "@utils/APIModel";
import { Alert, AlertProps, AlertTypes } from "@components/global/Alert";
import { Subscription } from "rxjs";
import { FocusElm } from "@containers/accessibility.container";
import { ChoiceBeverage } from "@components/consumer/ChoiceBeverage";
import { CustomizeBeverage } from "@components/consumer/CustomizeBeverage";
import { Slide } from "@components/consumer/Slide";
import { ConfigContext } from "@containers/config.container";
import { TimerContext } from "@containers/timer.container";

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
  alert: AlertProps;

  showCardsInfo: boolean;
  showEnd: boolean;
}

export const Home = (props: HomeProps) => {

  const levels = LEVELS;
  const types = [
    {label: "Still", value: false},
    {label: "Sparkling", value: true}
  ];

  const [state, setState] = React.useState<HomeState>({
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
      temperature_level: levels.temperature[2].value,
      b_complex: false,
      antioxidants: false
    }
  });

  const configConsumer = React.useContext(ConfigContext);
  const timerConsumer = React.useContext(TimerContext);
  const consumerConsumer = React.useContext(ConsumerContext);

  let pouring_: Subscription = null;

  let timerEnd_: any = null;

  React.useEffect(() => {
    // timerConsumer.startTimer();
    return () => {
      timerConsumer.resetTimer();
    };
  }, []);

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
    pouring_ = configConsumer.onStartPour(bevSelected, bevConfig)
    .subscribe(data => {
      if (data.value === true && data.name in AlarmsOutOfStock) { // Object.values(AlarmsOutOfStock).includes(data.name)
        pouring_ && pouring_.unsubscribe();
        resetBeverage();
        handleAlert({
          type: AlertTypes.OutOfStock,
          timeout: true,
          onDismiss: () => {
            consumerConsumer.updateConsumerBeverages();  // => TO IMPROVE
            handleAlert();
          }
        });
      }
    });

  };

  const stopPour = () => {
    timerConsumer.startTimer();
    pouring_ && pouring_.unsubscribe();
    setState(prevState => ({...prevState, idBeveragePouring_: null}));
    configConsumer.onStopPour()
    .subscribe(data => console.log(data));
    if (getBeverageSelected()) {
      endPour();
    }
  };

  const endPour = () => {
    if (timerEnd_ === null) {

      const endEvent = () => {
        setState(prevState => ({...prevState, showEnd: true}));
        clearTimerEnd();
        document.removeEventListener("touchstart", clearTimer);
        document.removeEventListener("touchend", startTimer);
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
    }
  };

  const resetBeverage = () => {
    clearTimerEnd();
    setState(prevState => ({
      ...prevState,
      beverageSelected: null,
      indexFavoritePouring_: null,
      idBeveragePouring_: null,
      showCardsInfo: false,
      showEnd: false
    }));
  };

  const clearTimerEnd = () => {
    clearTimeout(timerEnd_);
    timerEnd_ = null;
  };

  /* ==== BEVERAGE CONSUMER ==== */
  /* ======================================== */

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
        temperature_level: value ? levels.carbTemperature[0].value : levels.temperature[2].value
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

  const handleSlide = () => {
    setState(prevState => ({
      ...prevState,
      slideOpen: !prevState.slideOpen
    }));
  };

  const handleAlert = (alert?: AlertProps) => {
    setState(prevState => ({
      ...prevState,
      alert: alert
    }));
  };

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
  const { isSparkling, alert } = state;
  const presentSlide = consumerBeverages.length > 0;
  const beverageSelected = getBeverageSelected();

  return (
    <section data-focus={FocusElm.Controller}>
      {presentSlide &&
        <Slide
          slideOpen={state.slideOpen}
          indexFavoritePouring_={state.indexFavoritePouring_}
          beverageSelected={state.beverageSelected}
          startConsumerPour={startConsumerPour}
          stopConsumerPour={stopConsumerPour}
          handleSlide={handleSlide}
        />
      }
      <HomeContent isLogged={presentSlide} beverageIsSelected={Boolean(getBeverageSelected())}>
        {beverages.length > 0 && (
          <React.Fragment>
            <ChoiceBeverage
              onGesture={onGesture}
              selectBeverage={selectBeverage}
              startPour={startPour}
              stopPour={stopPour}
              goToPrepay={goToPrepay}
              idBeveragePouring_={state.idBeveragePouring_}
              isSparkling={state.isSparkling}
            />
            <div data-focus={beverageSelected ? FocusElm.Extra : null} id="types-group">
              <ButtonGroupFull
                options={types}
                value={isSparkling}
                onChange={(value) => handleType(value)}>
              </ButtonGroupFull>
            </div>
          </React.Fragment>
        )}
        {beverageSelected &&
          <CustomizeBeverage
            levels={levels}
            isSparkling={isSparkling}
            slideOpen={state.slideOpen}
            showCardsInfo={state.showCardsInfo}
            showEnd={state.showEnd}
            beverageConfig={state.beverageConfig}
            resetBeverage={resetBeverage}
            getBeverageSelected={getBeverageSelected}
            handleChange={handleChange}
            startPour={startPour}
            stopPour={stopPour}
          />
        }
      </HomeContent>
      {alert && <Alert {...alert} />}
    </section>
  );

};

export default Home;