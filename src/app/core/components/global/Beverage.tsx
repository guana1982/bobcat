
import * as React from "react";
import styled, { css } from "styled-components";
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
  Sparkling = "sparkling",
  OutOfStock = "out-of-stock",
  LastPour = "last-pour",
  Favorite = "favorite",
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
  &.${BeverageTypes.OutOfStock} {
    button:before {
      content: none;
    }
    #element {
      opacity: .2;
    }
  }
  &.${BeverageTypes.Info} {
    button {
      background-image: none;
      border: solid 1px #f1f1f1;
      &:before {
        background-image: none;
      }
      #element {
        #logo {
          width: 141px;
          height: 141.5px;
          top: 43.5px;
          left: 36px;
        }
        #title {
          width: 100%;
          font-size: 14px;
          width: 173px;
          left: 23px;
          bottom: 23px;
          height: 70px;
          display: flex;
          align-items: center;
          right: 0;
          text-transform: none;
          text-align: center;
          color: ${props => props.theme.slateGrey};
        }
      }
    }
    #cal {
      display: none;
    }
  }
  &.${BeverageTypes.Favorite}, &.${BeverageTypes.LastPour} {
    #element {
      #logo, #logo-sparkling {
        top: 10px;
        right: -19px;
        left: auto;
        width: 203px;
        height: 220px;
      }
    }
  }
  button {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 17px;
    background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.96) 50%, #fff);
    box-shadow: ${props => props.pouring ? `0 0 0 6px ${props.color} !important` : null};
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
    #indicator {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      left: 20px;
      top: 20px;
      width: 72px;
      height: 18.1px;
      background: ${props => props.color};
      border-radius: 9px;
      span {
        text-transform: lowercase;
        font-size: 12px;
        color: #fff;
      }
    }
    /* top: 10px;
    right: -21px;
    width: 203px;
    height: 220px; */
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
  #out-of-stock {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    text-transform: uppercase;
    font-size: 16px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.5;
    letter-spacing: 1.3px;
    text-align: center;
    color: ${props => props.theme.slateGrey}
  }
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
}

export const Beverage = forwardRef((props: BeverageProps , innerRef: any) => {
  const { title, type, label, pouring, status_id, disabled, size, logoId, color } = props;
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

  const classNameBeverage = [type, size, $outOfStock ? BeverageTypes.OutOfStock : null];

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

  const logo = type === BeverageTypes.Info ? `icons/${logoId}.png` : `img/logos/${logoId}.png`;
  const logoSparkling = type === BeverageTypes.Info ? null : `img/logos/${logoId}@sparkling.png`;

  return (
    <div ref={innerRef}>
      <ClickNHold
        time={0.5}
        onClickNHold={clickHold}
        onEnd={end}>
        <BeverageWrap pouring={pouring} className={classNameBeverage} color={color}>
          <button ref={buttonEl} disabled={type === BeverageTypes.Info || $outOfStock || disabled}>
            <div id="element">
              {(type === BeverageTypes.LastPour || type === BeverageTypes.Favorite) && <div id="indicator"><span>{type}</span></div>}
              {logo && <img id="logo" src={logo} />}
              {logoSparkling && <img id="logo-sparkling" src={logoSparkling} />}
              <span id="title">{__(title)}</span>
              <span id="cal">0 Cal.</span>
              {/* <span id="price">75¢</span> */}
            </div>
            {$outOfStock && <span id="out-of-stock">{__("Sorry, we're out of that flavor at the moment! ")}</span>}
          </button>
        </BeverageWrap>
      </ClickNHold>
    </div>
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