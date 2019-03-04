
import * as React from "react";
import styled from "styled-components";
import posed from "react-pose";
import { __ } from "@utils/lib/i18n";
import { IBeverage } from "@models/index";
import { forwardRef } from "react";
import { BeverageStatus } from "@models/beverage.model";
import { FocusElm } from "@containers/accessibility.container";
import ClickNHold from "./ClickNHold";
import { beverageItem } from "@core/Menu/Custom/BeveragesDropdown.scss";
import { BeverageColor } from "@core/utils/constants";

export enum BeverageTypes {
  Info = "info",
  Sparkling = "sparkling"
}

const _sizeBeverage = 11.5;
/* size?: string; pouring?: boolean; status?: string; type?: BeverageTypes; dataBtnFocus?: FocusElm; beverage_logo_id: string; */
export const BeverageWrap = styled.button.attrs(props => ({
  "data-btn-focus": props.dataBtnFocus
}))`
  padding: 1rem .7rem;
  transition: 1s all;
  transition-property: width, height, left, top;
  will-change: width, height, left, top;
  text-align: center;
  pointer-events: default;
  height: ${_sizeBeverage * 1.6}rem;
  width: ${_sizeBeverage * 1.4}rem;
  margin: 2rem .5rem 1.5rem .5rem;
  #element {
    box-shadow: 0px 10px 20px -6px rgba(0,0,0,0.17);
    background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.96) 50%, #fff);
    position: relative;
    /* border: ${props => `2px ${props.type === BeverageTypes.Info ? "dashed" : "solid"} ${props.theme.primary}`}; */
    /* background-color: ${props => props.type === BeverageTypes.Info ? "rgba(255, 255, 255, 0.3)" : props.theme["light"] }; */
    /* box-shadow: 0px 113px 280px -42px rgba(0,0,0,0.12); */
    /* background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.96) 50%, #ffffff); */
    background: #fff;
    /* #logo {
      background-image: url("img/logos/${props => props.beverage_logo_id}.png");
      background-repeat: no-repeat;
      background-position: center;
      background-size: 95% 100%;
    }  */

    #logo {
      position: absolute;
      top: -40px;
      width: 90%;
      height: 80%;
      left: 5%;
      background-image: url("img/logos/${props => props.beverage_logo_id}${props => props.type ? "@" : null}${props => props.type}.png");
      background-repeat: no-repeat;
      background-position: center;
      background-size: 95% 100%;
    }

    width: 100%;
    border-radius: 17px;
    color: #0034B0;
    height: 100%;
    text-align: left;
    * {
      opacity: ${props => props.type === BeverageTypes.Info ? .6 : 1 };
    }
    /* &:before {
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
    } */
    h3 {
      text-transform: uppercase;
      /* position: relative; */
      word-wrap: break-word;
      top: ${_sizeBeverage / 2.5}rem;
      left: .7rem;
      font-size: ${_sizeBeverage / 8}rem;
      color: ${props => BeverageColor[`_${props.beverage_logo_id}`]};
      margin: .5rem;
      left: 0;
      /* &:before {
        position: absolute;
        top: -20px;
        content: "${props => props.type === BeverageTypes.Sparkling ? props.type : null} ";
        display: block;
        text-transform: capitalize;
        font-size: 1rem;
        font-weight: 500;
      } */
    }
    #text {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 10px;
      h6 {
        /* position: relative; */
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
    background: rgba(0, 0, 0, .6);
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
        <BeverageWrap beverage_logo_id={beverage.beverage_logo_id} dataBtnFocus={dataBtnFocus} pouring={pouring} type={type}> { /* onClick={onClick} */ } { /* onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} */ }
          <div id="element">
            <div id="logo" />
            {/* <img id="logo" src={`img/logos/${beverage.beverage_logo_id}.png`} /> */}

            {/* <div id="indicators">
              {indicators && indicators.map((indicator, index) => <img key={index} src={`icons/${indicator}.svg`} />)}
            </div> */}
            <div id="text">
              <h3>{__(title)}</h3>
              <h6>0-CALS</h6>
            </div>
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
      transform: "translate3d(62.8vw, -7.5rem, 0px)", // scale(1)
      delay: 100
    },
    open: {
      transform: "translate3d(0vw, 0rem, 0px)", // scale(1.2)
      delay: 50
    }
  }),
  posed(Beverage)({
    close: {
      transform: "translate3d(36.5vw, 10.2rem, 0px)", // scale(1)
      delay: 75
    },
    open: {
      transform: "translate3d(0vw, 0rem, 0px)", // scale(1.4)
      delay: 75
    }
  }),
  posed(Beverage)({
    close: {
      transform: "translate3d(10vw, 38rem, 0px)", // scale(1)
      delay: 50
    },
    open: {
      transform: "translate3d(0vw, 0rem, 0px)", // scale(1.2)
      delay: 100
    }
  })
];