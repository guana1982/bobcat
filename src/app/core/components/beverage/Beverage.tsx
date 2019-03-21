
import * as React from "react";
import styled, { css } from "styled-components";
import posed from "react-pose";
import { __ } from "@utils/lib/i18n";
import { IBeverage } from "@models/index";
import { forwardRef } from "react";
import { BeverageStatus } from "@models/beverage.model";
import ClickNHold from "../global/ClickNHold";
import { AccessibilityContext } from "@core/containers";
import ReactDOM = require("react-dom");
import { Nutrition } from "./Nutrition";
import { OutOfStock } from "./OutOfStock";
import { Blur } from "./Blur";
import { Logo } from "./Logo";
import { Basic } from "./Basic";
import { Info } from "./Info";

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

const BeverageWrap_ = posed.div({
  close: {
    position: "relative",
    transform: "scale(1)"
  },
  open: {
    position: "absolute",
    transform: "scale(2)"
  },
});

/* show: boolean; color: string; enableOpacity: boolean; */
export const BeverageWrap = styled(BeverageWrap_)`
  /* transition: 1s all; */
  /* transition-property: width, height, left, top; */
  /* will-change: transform; */
  text-align: center;
  pointer-events: default;
  opacity: ${props => props.enableOpacity ? .2 : null};
  display: ${props => props.show ? "block" : "none"};
  button {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 17px;
    /* background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.96) 50%, #fff); */
    &:before {
      content: " ";
      position: absolute;
      top: -26%;
      left: -22.1%;
      width: 145%;
      height: 149%;
      background-image: url("img/flavor-card-bg.png");
      background-size: contain;
      background-repeat: no-repeat;
      background-position: bottom;
    }
  }
`;

/* size: BeverageSize */
const BeverageContent = styled.div`
  position: relative;
  margin: 10px 23px;
  &, ${BeverageWrap} {
    width: 218px;
    height: 304px;
  }
  ${({ size }) => size === BeverageSize.Tiny && css`
    margin: 10px 18px;
    &, ${BeverageWrap} {
      width: 196px;
      height: 279px;
    }
    ${Logo} {
      width: 196px;
      height: 198px;
    }
  `}
`;

interface BeverageProps {
  beverage?: IBeverage;
  type: BeverageTypes;
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
}

export const Beverage = forwardRef((props: BeverageProps , innerRef: any) => {

  const { title, type, pouring, status_id, disabled, color, nutritionFacts, size } = props;

  const $outOfStock: boolean = status_id === BeverageStatus.EmptyBib;
  const $blur: boolean = disabled && !pouring;
  const $disabledTouch: boolean = type === BeverageTypes.Info || $outOfStock;
  const $specialCard: boolean = type === BeverageTypes.LastPour || type === BeverageTypes.Favorite;
  const $info: boolean = type === BeverageTypes.Info;

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

  const disabledButton = type === BeverageTypes.Info || $outOfStock || (disabled && !pouring);

  const start = () => {
    if (disabledButton) return;

    if (pouring)
      onHoldStart();
  };

  const end = (e, enough) => {
    if (disabledButton) return;

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
    if (disabledButton) return;

    if (!pouring)
      onHoldStart();
  };

  return (
    <BeverageContent size={size} ref={innerRef}>
      <ClickNHold
        time={0.5}
        onStart={start}
        onClickNHold={clickHold}
        onEnd={end}>
        <BeverageWrap posed={"open"} enableOpacity={$outOfStock} show={!($blur || $info)} color={color}>
          <button ref={buttonEl} disabled={disabledButton}>
            <Nutrition show={nutritionFacts} title={title} color={color} />
            <Basic show={!nutritionFacts} specialCard={$specialCard} {...props} />
          </button>
        </BeverageWrap>
      </ClickNHold>
      <OutOfStock show={$outOfStock && !($blur || $info)} {...props} />
      <Info show={$info && !$blur} {...props} />
      <Blur show={$blur} {...props} />
    </BeverageContent>
  );
});

export const BeveragesAnimated = [
  posed(Beverage)({
    close: {
      transform: "scale(1) translate3d(62.8vw, -10rem, 0px)",
      delay: 100
    },
    open: {
      transform: "scale(1.14) translate3d(0vw, 0rem, 0px)",
      delay: 50
    }
  }),
  posed(Beverage)({
    close: {
      transform: "scale(1) translate3d(36.5vw, 12rem, 0px)",
      delay: 75
    },
    open: {
      transform: "scale(1.14) translate3d(0vw, 0rem, 0px)",
      delay: 75
    }
  }),
  posed(Beverage)({
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