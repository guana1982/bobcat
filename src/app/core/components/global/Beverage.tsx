
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

export enum BeverageSize {
  Tiny = "tiny",
  Normal = "normal"
}

/* size?: string; pouring?: boolean; status?: string; color: string; */
// CLASS => type?: BeverageTypes; size?: BeverageSize;
export const BeverageWrap = styled.div`
  transition: 1s all;
  transition-property: width, height, left, top;
  will-change: width, height, left, top;
  text-align: center;
  pointer-events: default;
  width: 218px;
  height: 304px;
  margin: 10px 23px;
  &.${BeverageSize.Tiny} {
    width: 196px;
    height: 279px;
    margin: 10px 18px;
    #element {
      #logo, #logo-sparkling {
        width: 196px;
        height: 198px;
      }
    }
  }
  &.${BeverageTypes.Sparkling} #element #logo-sparkling {
    display: block;
  }
  &:not(.${BeverageTypes.Sparkling}) #element #logo {
    display: block;
  }
  button {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 17px;
    background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.96) 50%, #fff);
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
  #element {
    position: relative;
    width: 100%;
    height: 100%;
    color: ${props => props.theme.slateGrey};
    text-transform: uppercase;
    #logo, #logo-sparkling {
      display: none;
      position: absolute;
      top: 0;
      left: 0;
      width: 218px;
      height: 220px;
      object-fit: contain;
    }
    #title {
      position: absolute;
      color: ${props => props.color};
      width: calc(100% - 46px);
      right: 23px;
      bottom: 43px;
      font-size: 18px;
      line-height: 1.1;
      letter-spacing: 3.2px;
      text-align: left;
    }
    #cal {
      position: absolute;
      left: 23px;
      bottom: 14px;
      font-size: 12.6px;
      letter-spacing: 1px;
      text-align: left;
    }
    #price {
      position: absolute;
      right: 23px;
      bottom: 14px;
      font-size: 12.6px;
      letter-spacing: 1px;
      text-align: right;
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
  size?: BeverageSize;
  logoId?: number;
  color?: string;
  onStart?: () => void;
  onHoldStart?: () => void;
  onHoldEnd?: () => void;
  indicators?: BeverageIndicators[];
  label?: string;
  pouring?: boolean;
  status_id?: BeverageStatus;
  title?: string;
  disabled?: boolean;
}

export const Beverage = forwardRef((props: BeverageProps , innerRef: any) => {
  const { title, type, indicators, label, pouring, status_id, disabled, size, logoId, color } = props;
  const $outOfStock: boolean = status_id === BeverageStatus.EmptyBib;
  const $disabledTouch: boolean = type === BeverageTypes.Info || $outOfStock;

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
        <BeverageWrap pouring={pouring} className={[type, size]} color={color}>
          <button ref={buttonEl} disabled={type === BeverageTypes.Info || $outOfStock || disabled}>
            <div id="element">
              <img id="logo" src={`img/logos/${logoId}.png`} />
              <img id="logo-sparkling" src={`img/logos/${logoId}@sparkling.png`} />
              <span id="title">{__(title)}</span>
              <span id="cal">0 Cal.</span>
              <span id="price">75¢</span>
            </div>
            {/* <div id="element">
              <div id="indicators">
                {indicators && indicators.map((indicator, index) => <img key={index} src={`icons/${indicator}.svg`} />)}
              </div>
              <h3>{__(title)}</h3>
              <h6>0-CALS</h6>
              {label && <h5>{__(label)}</h5>}
              {$outOfStock && <div className="overlay"><h4>{__("Out Of Stock")}</h4></div>}
              {pouring && <div className="overlay"><h4>{__("Pouring")}</h4></div>}
            </div> */}
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