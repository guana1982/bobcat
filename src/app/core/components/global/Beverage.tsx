
import * as React from "react";
import styled from "styled-components";
import posed from "react-pose";
import { __ } from "@utils/lib/i18n";
import { IBeverage } from "@models/index";
import { forwardRef } from "react";
import { BeverageStatus } from "@models/beverage.model";
import { FocusElm } from "@containers/accessibility.container";
import ClickNHold from "./ClickNHold";
import { BeverageColor } from "@core/utils/constants";
import { IConsumerBeverage } from "@core/utils/APIModel";

export enum BeverageTypes {
  Info = "info",
  Sparkling = "sparkling"
}

const _sizeBeverage = 12;
/* size?: string; pouring?: boolean; status?: string; type?: BeverageTypes; dataBtnFocus?: FocusElm; beverage_logo_id: number; */
export const BeverageWrap = styled.button.attrs(props => ({
  "data-btn-focus": props.dataBtnFocus
}))`
  margin: .5rem;
  padding: 3rem .7rem;
  transition: 1s all;
  transition-property: width, height, left, top;
  will-change: width, height, left, top;
  text-align: center;
  pointer-events: default;
  height: ${_sizeBeverage * 1.6}rem;
  width: ${_sizeBeverage * 1.4}rem;
  background-image: url("img/logos/${props => props.beverage_logo_id}.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 95% 100%;
  position: relative;
  &:before {
    content: " ";
    position: absolute;
    background: inherit;
    background-size: 95% 200%;
    filter: blur(20px);
    width: 100%;
    height: 50%;
    top: 25%;
    left: 0;
    opacity: .3;
  }
  #element {
    background-color: ${props => props.theme.secondary};
    color: ${props => BeverageColor[`_${props.beverage_logo_id}`]};
    width: 90%;
    margin: auto;
    border-radius: .3rem;
    height: 50%;
    box-shadow: 0px 0px 13px -1px rgba(0,0,0,0.1);
    text-align: left;
    * {
      opacity: ${props => props.type === BeverageTypes.Info ? .6 : 1 };
    }
    h3 {
      position: relative;
      word-wrap: break-word;
      top: 10px;
      left: .7rem;
      font-size: 1.2rem;
      letter-spacing: 4px;
      text-transform: uppercase;
      margin: .5rem;
      left: 0;
      text-align: center;
      height: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    h6 {
      position: absolute;
      bottom: 30%;
      left: 1.5rem;
      font-size: ${_sizeBeverage / 12}rem;
      font-weight: 400;
      /* color: ${props => props.status === "active" ? "#fff" : props.theme.primary }; */
      margin: .7rem;
      text-align: left;
    }
    h5 {
      position: absolute;
      text-align: center;
      font-size: ${_sizeBeverage / 10}rem;
      opacity: 1 !important;
      font-weight: 600;
      right: .5rem;
      bottom: .5rem;
      /* color: ${props => props.status === "active" ? "#fff" : props.theme.primary }; */
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
  dataBtnFocus?: FocusElm;
}

export const Beverage = forwardRef((props: BeverageProps , innerRef: any) => {
  const { title, type, indicators, label, pouring, status_id, dataBtnFocus, beverage } = props;
  const $outOfStock: boolean = status_id === BeverageStatus.EmptyBib;
  const $disabledTouch: boolean = type === BeverageTypes.Info || $outOfStock;

  let beverage_logo_id = null;
  if (beverage && beverage.beverage_logo_id) {
    beverage_logo_id = beverage.beverage_logo_id;
  }

  let  onStart, onHoldStart, onHoldEnd  = null; // onTouchStart, onTouchEnd
  if (!$disabledTouch) {
    onStart = props.onStart || null;
    onHoldStart = props.onHoldStart || null;
    onHoldEnd = props.onHoldEnd || null;
    // onTouchStart = props.onTouchStart;
    // onTouchEnd = props.onTouchEnd;
  }

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
        <BeverageWrap beverage_logo_id={beverage_logo_id} dataBtnFocus={dataBtnFocus} pouring={pouring} type={type}> { /* onClick={onClick} */ } { /* onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} */ }
          <div id="element">
            {/* <div id="indicators">
              {indicators && indicators.map((indicator, index) => <img key={index} src={`icons/${indicator}.svg`} />)}
            </div> */}
            <h3>{__(title)}</h3>
            <h6>{`${0} ${ __("CAL.")}`}</h6>
            {label && <h5>{__(label)}</h5>}
            {$outOfStock && <div className="overlay"><h4>{__("Out Of Stock")}</h4></div>}
            {pouring && <div className="overlay"><h4>{__("Pouring")}</h4></div>}
          </div>
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