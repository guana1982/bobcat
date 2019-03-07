
import * as React from "react";
import styled from "styled-components";
import posed from "react-pose";
import { __ } from "@utils/lib/i18n";
import { IBeverage } from "@models/index";
import { forwardRef } from "react";
import { BeverageStatus } from "@models/beverage.model";
import ClickNHold from "./ClickNHold";
import { AccessibilityContext } from "@core/containers";
import ReactDOM = require("react-dom");

export enum BeverageTypes {
  Info = "info",
  Sparkling = "sparkling"
}

const _sizeBeverage = 11;
/* size?: string; pouring?: boolean; status?: string; type?: BeverageTypes; dataBtnFocus?: FocusElm; */
export const BeverageWrap = styled.div.attrs(props => ({
  "data-btn-focus": 0
}))`
  padding: 1rem .7rem;
  transition: 1s all;
  transition-property: width, height, left, top;
  will-change: width, height, left, top;
  text-align: center;
  pointer-events: default;
  height: ${_sizeBeverage * 1.6}rem;
  width: ${_sizeBeverage * 1.4}rem;
  button {
    width: 100%;
    height: 100%;
    padding: 5px;
  }
  #element {
    position: relative;
    border: ${props => `2px ${props.type === BeverageTypes.Info ? "dashed" : "solid"} ${props.theme.primary}`};
    background-color: ${props => props.type === BeverageTypes.Info ? "rgba(255, 255, 255, 0.3)" : props.theme["light"] };
    width: 100%;
    border-radius: 1rem;
    color: #0034B0;
    height: 100%;
    text-align: left;
    * {
      opacity: ${props => props.type === BeverageTypes.Info ? .6 : 1 };
    }
    &:before {
      content: " ";
      opacity: .7;
      position: absolute;
      right: .5rem;
      bottom: .1rem;
      width: 100%;
      height: 5.4rem !important;
      height: ${_sizeBeverage / 2.5}rem;
      background-position: right;
      background-repeat: no-repeat;
      background-image: url("img/${props => props.type}.svg");
    }
    h3 {
      position: relative;
      word-wrap: break-word;
      top: ${_sizeBeverage / 2.5}rem;
      left: .7rem;
      font-size: ${_sizeBeverage / 7}rem;
      margin: .5rem;
      left: 0;
      &:before {
        position: absolute;
        top: -20px;
        content: "${props => props.type === BeverageTypes.Sparkling ? props.type : null} ";
        display: block;
        text-transform: capitalize;
        font-size: 1rem;
        font-weight: 500;
      }
    }
    h6 {
      position: relative;
      top: ${_sizeBeverage / 2.5}rem;
      left: .5rem;
      font-size: ${_sizeBeverage / 13.5}rem;
      bottom: 0;
      color: ${props => props.status === "active" ? "#fff" : props.theme.primary };
      margin: .7rem;
      text-align: left;
      left: 0;
    }
    h5 {
      position: absolute;
      text-align: center;
      font-size: ${_sizeBeverage / 10}rem;
      opacity: 1 !important;
      font-weight: 600;
      right: .5rem;
      bottom: .5rem;
      color: ${props => props.status === "active" ? "#fff" : props.theme.primary };
      margin: .7rem;
    }
  }
  #indicators {
    position: absolute;
    right: 0;
    top: 10px;
    width: 3rem;
    img {
      width: 2rem;
      margin-right: 10px;
    }
  }
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 91, 195, .9);
    border-radius: 0.7rem;
    h4 {
      word-wrap: break-word;
      margin-top: calc(50% - .75rem);
      color: #fff;
      text-align: center;
      font-size: 1.5rem;
    }
  }
`;

export enum BeverageIndicators {
  Heart = "heart",
  Rewind = "rewind"
}

interface BeverageProps {
  beverage?: IBeverage;
  type: BeverageTypes;
  onStart?: () => void;
  onHoldStart?: () => void;
  onHoldEnd?: () => void;
  // onTouchStart?: () => void;
  // onTouchEnd?: () => void;
  indicators?: BeverageIndicators[];
  label?: string;
  pouring?: boolean;
  status_id?: BeverageStatus;
  title?: string;
}

export const Beverage = forwardRef((props: BeverageProps , innerRef: any) => {
  const { title, type, indicators, label, pouring, status_id } = props;
  const $outOfStock: boolean = status_id === BeverageStatus.EmptyBib;
  const $disabledTouch: boolean = type === BeverageTypes.Info || $outOfStock;

  let  onStart, onHoldStart, onHoldEnd  = null; // onTouchStart, onTouchEnd
  if (!$disabledTouch) {
    onStart = props.onStart || null;
    onHoldStart = props.onHoldStart || null;
    onHoldEnd = props.onHoldEnd || null;
    // onTouchStart = props.onTouchStart;
    // onTouchEnd = props.onTouchEnd;
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
      onStart();
      return;
    }

    if (pour === true) {
      onHoldStart();
    } else if (pour === false) {
      onHoldEnd();
    }

  }, [buttonEl, enter, pour]);

  //  <=== ACCESSIBILITY FUNCTION ====

  const end = (e, enough) => {
    if (!enough) { // START
      onStart();
    } else {
      onHoldEnd();
    }
  };

  const clickHold = (e) => {
    onHoldStart();
  };

  return (
    <div ref={innerRef}>
      <ClickNHold
        time={0.5}
        onClickNHold={clickHold}
        onEnd={end}>
        <BeverageWrap pouring={pouring} type={type}> { /* onClick={onClick} */ } { /* onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} */ }
          <button ref={buttonEl} disabled={type === BeverageTypes.Info || $outOfStock}>
            <div id="element">
              <div id="indicators">
                {indicators && indicators.map((indicator, index) => <img key={index} src={`icons/${indicator}.svg`} />)}
              </div>
              <h3>{__(title)}</h3>
              <h6>0-CALS</h6>
              {label && <h5>{__(label)}</h5>}
              {$outOfStock && <div className="overlay"><h4>{__("Out Of Stock")}</h4></div>}
              {pouring && <div className="overlay"><h4>{__("Pouring")}</h4></div>}
            </div>
          </button>
        </BeverageWrap>
      </ClickNHold>
    </div>
  );
});

export const BeveragesAnimated = [
  posed(Beverage)({
    close: {
      transform: "scale(1) translate3d(62.8vw, -7.5rem, 0px)",
      delay: 100
    },
    open: {
      transform: "scale(1.2) translate3d(0vw, 0rem, 0px)",
      delay: 50
    }
  }),
  posed(Beverage)({
    close: {
      transform: "scale(1) translate3d(36.5vw, 10.2rem, 0px)",
      delay: 75
    },
    open: {
      transform: "scale(1.4) translate3d(0vw, 0rem, 0px)",
      delay: 75
    }
  }),
  posed(Beverage)({
    close: {
      transform: "scale(1) translate3d(10vw, 38rem, 0px)",
      delay: 50
    },
    open: {
      transform: "scale(1.2) translate3d(0vw, 0rem, 0px)",
      delay: 100
    }
  })
];