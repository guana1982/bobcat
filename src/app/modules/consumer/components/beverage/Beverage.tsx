
import * as React from "react";
import styled, { css } from "styled-components";
import posed from "react-pose";
import { __ } from "@utils/lib/i18n";
import { IBeverage } from "@models/index";
import { forwardRef } from "react";
import { BeverageStatus } from "@models/beverage.model";
import { AccessibilityContext } from "@core/containers";
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

export enum BeverageTypes {
  Info = "info",
  Sparkling = "sparkling",
  OutOfStock = "out-of-stock",
  LastPour = "last-pour",
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
    box-shadow: 0px 19px 31px -4px rgba(0,0,0,0.1);
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
const BeverageContent = styled.div`
  position: relative;
  margin: 10px 23px;
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
  onHoldStart?: () => void;
  onHoldEnd?: () => void;
  label?: string;
  pouring?: boolean;
  status_id?: BeverageStatus;
  title?: string;
  disabled?: boolean;
  $sparkling?: boolean;
  nutritionFacts?: boolean;
  levels?: ILevelsModel;
  slideOpen?: boolean;
  handleDisabled: (d) => void;
}

export const Beverage = forwardRef((props: BeverageProps , innerRef: any) => {

  const [zoomNutrition, setZoomNutrition] = React.useState(false);

  const { title, types, pouring, status_id, disabled, color, nutritionFacts, size, handleDisabled, beverage, levels, slideOpen } = props;

  const $outOfStock: boolean = status_id === BeverageStatus.EmptyBib || beverage.line_id <= 0;
  const $blur: boolean = disabled && !pouring;
  const $disabledTouch: boolean = types && types[0] === BeverageTypes.Info || $outOfStock;
  const $specialCard: boolean = types && types[0] === BeverageTypes.LastPour || types && types[0] === BeverageTypes.Favorite;
  const $info: boolean = types && types[0] === BeverageTypes.Info;

  let  onStart, onHoldStart, onHoldEnd  = null;
  if (!$disabledTouch) {
    onStart = props.onStart || null;
    onHoldStart = props.onHoldStart || null;
    onHoldEnd = props.onHoldEnd || null;
  }

  //  ==== ACCESSIBILITY FUNCTION ====>
  const buttonEl = React.useRef(null);
  const accessibilityConsumer = React.useContext(AccessibilityContext);
  const { enter, pour } = accessibilityConsumer;

  React.useEffect(() => {
    const button = buttonEl.current;
    const isFocus = document.activeElement === ReactDOM.findDOMNode(button);

    if (!isFocus) return;

    if (enter) {
      if (onStart) {
        onStart();
      }
      return;
    }

    if (pour === true) {
      if (onHoldStart) {
        onHoldStart();
      }
    } else if (pour === false) {
      if (onHoldEnd) {
        onHoldEnd();
      }
    }

  }, [buttonEl, enter, pour]);
  //  <=== ACCESSIBILITY FUNCTION ====

  const disabledButton = types && types[0] === BeverageTypes.Info || $outOfStock || (disabled && !pouring);

  const handleZoomNutrition = (status: boolean) => {
    setZoomNutrition(status);
    handleDisabled(status);
  };

  const start = () => {
    if (disabledButton) return;

    if (nutritionFacts) {
      handleZoomNutrition(true);
      return null;
    }

    if (pouring)
      onHoldStart();
  };

  const end = (e, enough) => {
    if (disabledButton || nutritionFacts) return;

    if (!enough) { // START
      if (pouring)
        onHoldEnd();
      else
        onStart();
    } else {
      onHoldEnd();
    }
  };

  const clickHold = (e) => {
    if (disabledButton || nutritionFacts) return;

    if (!pouring)
      onHoldStart();
  };

  return (
    <BeverageContent size={size} ref={innerRef}>
        <React.Fragment>
          {zoomNutrition &&
            <AppendedFullBeverage {...props}>
              <BeverageFull>
                <CloseBtn detectValue={"nutrition_close"} icon={"close"} onClick={() => handleZoomNutrition(false)} />
                <BeverageWrap show={true} color={color}>
                  <Nutrition show={nutritionFacts} title={title} color={color} />
                </BeverageWrap>
              </BeverageFull>
            </AppendedFullBeverage>
          }
          {(!($blur || $info) && !zoomNutrition) &&
            <ClickNHold
              time={0.5}
              onStart={start}
              onClickNHold={clickHold}
              onEnd={end}
            >
              <BeverageWrap enableOpacity={$outOfStock} show={true} color={color}>
                <button ref={buttonEl} disabled={disabledButton}>
                  <Nutrition show={nutritionFacts} title={title} color={color} />
                  <Basic levels={levels} show={!nutritionFacts} specialCard={$specialCard} {...props} />
                </button>
              </BeverageWrap>
            </ClickNHold>
          }
          {($outOfStock || $blur || $info) &&
            <BeverageExtra>
              <OutOfStock show={$outOfStock && !($blur || $info)} {...props} />
              <Info show={$info && !$blur} {...props} />
              <Blur show={$blur} {...props} />
            </BeverageExtra>
          }
        </React.Fragment>
    </BeverageContent>
  );
});

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

export const BeveragesAnimated = [
  posed(Beverage)({
    fullClose: {
      transform: "scale(1.14) translate3d(0vw, 0rem, 0px)",
      delay: 75
    },
    close: {
      transform: "scale(1) translate3d(62.8vw, 12rem, 0px)",
      delay: 100
    },
    open: {
      transform: "scale(1.14) translate3d(0vw, 0rem, 0px)",
      delay: 50
    }
  }),
  posed(Beverage)({
    fullClose: {
      transform: "scale(1.14) translate3d(0vw, 0rem, 0px)",
      delay: 75
    },
    close: {
      transform: "scale(1) translate3d(36.5vw, -10rem, 0px)",
      delay: 75
    },
    open: {
      transform: "scale(1.14) translate3d(0vw, 0rem, 0px)",
      delay: 75
    }
  }),
  posed(Beverage)({
    fullClose: {
      transform: "scale(1.14) translate3d(0vw, 0rem, 0px)",
      delay: 75
    },
    close: {
      transform: "scale(1) translate3d(10vw, 38rem, 0px)",
      delay: 50
    },
    open: {
      transform: "scale(1.14) translate3d(0vw, 0rem, 0px)",
      delay: 100
    }
  })
];