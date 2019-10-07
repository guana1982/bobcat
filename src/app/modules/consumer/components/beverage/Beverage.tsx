
import * as React from "react";
import styled, { css } from "styled-components";
import { __ } from "@utils/lib/i18n";
import { IBeverage } from "@models/index";
import { memo } from "react";
import { BeverageStatus } from "@models/beverage.model";
import { AccessibilityContext, ConfigContext, PaymentContext } from "@core/containers";
import ReactDOM = require("react-dom");
import { Nutrition } from "./Nutrition";
import { OutOfStock } from "./OutOfStock";
import { Blur } from "./Blur";
import { Logo } from "./Logo";
import { Basic } from "./Basic";
import { Info } from "./Info";
import { componentWillAppendToBody } from "react-append-to-body";
import { ILevelsModel } from "@core/utils/APIModel";
import { CloseBtnWrap, CloseBtn } from "../common/CloseBtn";
import ClickNHold from "../common/ClickNHold";
import { PourFrom } from "@core/models/vendor.model";
import { motion } from "framer-motion";
import { areEqual, checkExpiringDate } from "@core/utils/constants";
import * as _ from "underscore";

export enum BeverageTypes {
  Info = "info",
  Sparkling = "sparkling",
  OutOfStock = "out-of-stock",
  LastPour = "last_pour",
  Favorite = "favorite",
  Blur = "blur",
  NutritionFacts = "nutrition-facts"
}

export enum BeverageSize {
  Tiny = "tiny",
  Normal = "normal"
}

export const BeverageExtra = styled.div`
  position: relative;
`;

/* show: boolean; color: string; enableOpacity: boolean; */
export const BeverageWrap = styled.div`
  will-change: transform;
  text-align: center;
  pointer-events: default;
  opacity: ${props => props.enableOpacity ? .2 : null};
  display: ${props => props.show ? "block" : "none"};
  z-index: -1;
  &:before {
    content: " ";
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 50%;
    border-radius: 0 0 17px 17px;
    box-shadow: 0px 19px 41px -4px rgba(0,0,0,0.07);
  }
  &.long-press {
    transform: scale(0.98);
    &:before {
      box-shadow: 0px 1px 8px 0px rgba(0,0,0,0.07);
    }
  }
  button {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 17px;
    background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.96) 50%, #fff);
  }
`;

const BeverageFull = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  #backdrop {
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  ${BeverageWrap} {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -60%);
    margin: auto;
    z-index: 10;
    zoom: 200%;
  }
`;

/* size: BeverageSize */
export const BeverageContent = styled.div`
  position: relative;
  margin: 10px 23px;
  z-index: ${props => props.pouring ? 10 : "inherit"};
  &, ${BeverageWrap}, ${BeverageExtra} {
    width: 218px;
    height: 304px;
  }
  ${({ size }) => size === BeverageSize.Tiny && css`
    margin: 10px 18px;
    &, ${BeverageWrap}, ${BeverageExtra} {
      width: 196px;
      height: 279px;
    }
    ${Logo} {
      width: 196px;
      height: 198px;
    }
  `}
  ${CloseBtnWrap} {
    position: absolute;
    top: 26.5px;
    right: 27px;
  }
`;

interface BeverageProps {
  beverage: IBeverage;
  types: BeverageTypes[];
  size?: BeverageSize;
  logoId?: any;
  color?: string;
  onStart?: () => void;
  onHoldStart?: (from?: PourFrom) => void;
  onHoldEnd?: () => void;
  label?: string;
  pouring?: boolean;
  status_id?: BeverageStatus;
  title?: string;
  disabled?: boolean;
  detectValue?: string;
  $sparkling?: boolean;
  nutritionFacts?: boolean;
  levels?: ILevelsModel;
  slideOpen?: boolean;
  handleDisabled: (d) => void;
}

export const Beverage = (props: BeverageProps) => {

  const [zoomNutrition, setZoomNutrition] = React.useState(false);
  const [longPress, setLongPress] = React.useState(false);

  const { title, types, pouring, status_id, disabled, color, nutritionFacts, size, handleDisabled, beverage, levels, detectValue } = props;

  const configConsumer = React.useContext(ConfigContext);
  const { isPouring } = configConsumer;
  const { alarmSparkling_ } = configConsumer.statusAlarms;

  const paymentConsumer = React.useContext(PaymentContext);

  const $specialCard: boolean = types && types[0] === BeverageTypes.LastPour || types && types[0] === BeverageTypes.Favorite;
  const $outOfStock: boolean = status_id === BeverageStatus.EmptyBib || beverage.line_id <= 0 || beverage.$lock || ($specialCard && (beverage.$lock || (levels.carbonation_perc != null && alarmSparkling_))) || (beverage.beverage_type !== "plain" && beverage.beverage_type !== "soda" && beverage.beverage_type !== "amb" && beverage.bib_expiring_date && checkExpiringDate(beverage.bib_expiring_date));
  const $blur: boolean = disabled && !pouring;
  const $disabledTouch: boolean = types && types[0] === BeverageTypes.Info || $outOfStock;
  const $info: boolean = types && types[0] === BeverageTypes.Info;

  const timeoutStart_ = React.useRef(null);
  const timeoutHoldStart_ = React.useRef(null);

  let  onStart, onHoldStart, onHoldEnd  = null;
  if (!$disabledTouch) {
    onStart = props.onStart || null;
    onHoldStart = props.onHoldStart || null;
    onHoldEnd = props.onHoldEnd || null;
  }

  //  ==== ACCESSIBILITY FUNCTION ====>
  const buttonEl = React.useRef(null);
  const accessibilityConsumer = React.useContext(AccessibilityContext);
  const { enter, pour, changeStateLayout } = accessibilityConsumer;

  React.useEffect(() => {
    const button = buttonEl.current;
    if (!button) return;

    const isFocus = document.activeElement === ReactDOM.findDOMNode(button);
    if (!isFocus) return;

    if (enter === true) {
      if (nutritionFacts) {
        handleZoomNutrition(true);
        changeStateLayout({
          alertShow: true
        });
        return;
      }
      if (pouring) {
        onHoldStart(PourFrom.Ada);
        return;
      }
      if (onStart) {
        onStart();
        return;
      }
      return;
    } else if (enter === false) {
      if (pouring) {
        onHoldEnd();
        return;
      }
    }
  }, [buttonEl, enter]);

  React.useEffect(() => {
    const button = buttonEl.current;
    if (!button) return;

    const isFocus = document.activeElement === ReactDOM.findDOMNode(button);
    if (!isFocus || nutritionFacts) return;

    if (pour === true) {
      console.log("POUR");
      if (onHoldStart) {
        onHoldStart(PourFrom.Ada);
      }
    } else if (pour === false) {
      console.log("STOP");
      if (onHoldEnd) {
        onHoldEnd();
      }
    }
  }, [buttonEl, pour]);
  //  <=== ACCESSIBILITY FUNCTION ====

  const disabledButton = types && types[0] === BeverageTypes.Info || $outOfStock || (disabled && !pouring);

  // React.useEffect(() => {
  //   if (!nutritionFacts) {
  //     handleZoomNutrition(false);
  //   }
  // }, [nutritionFacts]);

  const handleZoomNutrition = (status: boolean) => {
    setZoomNutrition(status);
    handleDisabled(status);
  };

  const closeZoomNutrition = React.useMemo(() =>
    _.debounce(() => {
      changeStateLayout({
        alertShow: false
      }); //  <=== ACCESSIBILITY FUNCTION ====
      handleZoomNutrition(false);
    }, 500, false)
  , []);

  const startPour_ = React.useMemo(() => _.debounce(onHoldStart, 500, true), []);

  const start = () => {
    if (disabledButton) return;

    setLongPress(true);

    if (timeoutHoldStart_.current)
      clearTimeout(timeoutHoldStart_.current);

    if (!pouring) {
      timeoutHoldStart_.current = setTimeout(() => {
        if (timeoutStart_.current)
          clearTimeout(timeoutStart_.current);
        onHoldStart();
      }, 225);
    } else {
      startPour_();
    }
  };

  const end = () => {
    if (disabledButton) return;

    if (nutritionFacts) {
      handleZoomNutrition(true);
      return null;
    }

    setLongPress(false);

    if (isPouring) {
      onHoldEnd();
      return;
    }

    if (timeoutStart_.current)
      clearTimeout(timeoutStart_.current);

    if (!pouring)
      timeoutStart_.current = setTimeout(() => {
        onStart();
        if (timeoutHoldStart_.current)
          clearTimeout(timeoutHoldStart_.current);
      }, 25);
  };

  const clickHold = (e) => {
    if (disabledButton || nutritionFacts) return;
    onHoldStart(PourFrom.Touch);
  };


  return (
    <BeverageContent size={size} pouring={pouring}>
        <React.Fragment>
          {zoomNutrition &&
            <AppendedFullBeverage {...props}>
              <BeverageFull>
                <div id="backdrop" onClick={closeZoomNutrition}></div>
                <CloseBtn detectValue={"alert_close"} icon={"close"} onClick={closeZoomNutrition} />
                <BeverageWrap show={true} color={color}>
                  <Nutrition show={nutritionFacts} title={title} color={color} beverage={beverage} />
                </BeverageWrap>
              </BeverageFull>
            </AppendedFullBeverage>
          }
          {(!($blur || $info) && !zoomNutrition) &&
            <BeverageWrap
              enableOpacity={$outOfStock} show={true} color={color}
              className={longPress ? "long-press" : ""}
              onTouchStart={!nutritionFacts ? start : () => {}}
              onTouchEnd={end}
            >
              <button id={detectValue} disabled={disabledButton} ref={buttonEl}>
                <Nutrition show={nutritionFacts} title={title} color={color} beverage={beverage} />
                <Basic paymentConsumer={paymentConsumer} levels={levels} show={!nutritionFacts} calories={beverage.calories} specialCard={$specialCard} {...props} />
              </button>
            </BeverageWrap>
          }
          {($outOfStock || $blur || $info) &&
            <BeverageExtra>
              <OutOfStock show={$outOfStock && !($blur || $info)} {...props} />
              <Info show={$info && !$blur} {...props} />
              <Blur show={$blur} nutritionFacts={nutritionFacts} {...props} />
            </BeverageExtra>
          }
        </React.Fragment>
    </BeverageContent>
  );
};

/* ==== FULL MODE ==== */
/* ======================================== */

const FullBeverage = ({children}) => (
  <BeverageContent style={{zIndex: 100}}>
    {children}
  </BeverageContent>
);

const AppendedFullBeverage = componentWillAppendToBody(FullBeverage);

/* ==== ANIMATIONS ==== */
/* ======================================== */

export const BeveragesAnimated = [{
  fullClose: {
    translateX: "0vw",
    translateY:  "0rem",
    scale: 1
  },
  close: {
    translateX: "56.3vw",
    translateY:  "12rem",
    scale: 1
  },
  open: {
    translateX: "0vw",
    translateY:  "0rem",
    scale: 1
  }
}, {
  fullClose: {
    translateX: "0vw",
    translateY:  "0rem",
    scale: 1.07,
  },
  close: {
    translateX: "34.5vw",
    translateY:  "-10rem",
    scale: 1
  },
  open: {
    translateX: "0vw",
    translateY:  "0rem",
    scale: 1.07
  }
}, {
  fullClose: {
    translateX: "0vw",
    translateY:  "0rem",
    scale: 1
  },
  close: {
    translateX: "10vw",
    translateY:  "38rem",
    scale: 1
  },
  open: {
    translateX: "0vw",
    translateY:  "0rem",
    scale: 1
  }
}];

export const BeveragesTransition = [{
  ease: "easeOut",
  duration: 0.8
}, {
  ease: "easeOut",
  duration: 0.8
}, {
  ease: "easeOut",
  duration: 0.8
}];