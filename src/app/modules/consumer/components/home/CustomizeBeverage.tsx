import * as React from "react";
import styled from "styled-components";
import ReactDOM = require("react-dom");
import { IBeverage } from "@core/models";
import { NumberCard } from "../cards/NumberCard";
import { CircleCard } from "../cards/CircleCard";
import { PhoneCard } from "../cards/PhoneCard";
import posed from "react-pose";
import { AccessibilityContext, ConfigContext } from "@core/containers";
import { __ } from "@core/utils/lib/i18n";
import { CloseBtnWrap, CloseBtn } from "../common/CloseBtn";
import { SegmentButtonProps, SegmentButton } from "../common/SegmentButton";
import { Button } from "../common/Button";
import { ButtonGroup } from "../common/ButtonGroup";
import ClickNHold from "../common/ClickNHold";

const _sizePour = 105;

/* color: string; */
export const Pour = styled.button`
  @keyframes shadow-pulse
  {
      0% {
        zoom: 500%;
        box-shadow: 0 0 0 0px rgba(0, 0, 0, 0.1);
      }
      100% {
        zoom: 500%;
        box-shadow: 0 0 0 35px rgba(0, 0, 0, 0);
      }
  }
  &.pulse {
    &:before, &:after {
      content: " ";
      height: ${_sizePour}px;
      width: ${_sizePour * 2}px;
      border-top-left-radius: ${_sizePour * 2}px;
      border-top-right-radius: ${_sizePour * 2}px;
      position: absolute;
      top: 0;
      left: 0;
      display: block;
      animation: "shadow-pulse 1.5s linear infinite";
    }
  }
  &:after {
    animation-delay: .5s;
  }
  position: absolute;
  bottom: 0; /* ${-_sizePour / 5}px; */
  line-height: 6;
  right: calc(50% - ${_sizePour}px);
  height: ${_sizePour}px;
  width: ${_sizePour * 2}px;
  border-top-left-radius: ${_sizePour * 2}px;
  border-top-right-radius: ${_sizePour * 2}px;
  font-size: ${_sizePour / 5}px;
  font-weight: 600;
  opacity: ${props => props.isPouring ? .7 : 1};
  font-family: NeuzeitGro-Bol;
  &, &:active {
    color: ${props => props.theme.light};
    background: ${props => props.color};
  }
`;

/* ==== LOGO ==== */
/* ======================================== */

const _logoBeverage = posed.img({
  normal: {
    zoom: "100%",
    transform: "translate(-50%, -105%)"
  },
  zoom: {
    zoom: "180%",
    transform: "translate(-50%, -62%)",
    transition: {
      duration: 500
    }
  }
});

export const LogoBeverage = styled(_logoBeverage)`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 305px;
  height: 308px;
  z-index: 99;
`;

/* ==== CARDS ==== */
/* ======================================== */

// color: string;
/* CLASS => type?: string; */
export const CustomizeBeverageCard = styled.div`
  position: absolute;
  bottom: 132px;
  width: 550px;
  height: 598px;
  border-radius: 0 0 20px 20px;
  left: 50%;
  transform: translateX(-50%);
  background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.96) 50%, #fff);
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
  #title {
    position: absolute;
    left: 26.5px;
    bottom: 263px;
    width: 278px;
    font-size: 28px;
    font-family: NeuzeitGro-Bol;
    text-transform: uppercase;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.11;
    letter-spacing: 4.9px;
    color: ${props => props.color};
  }
  #cal {
    position: absolute;
    left: 26.5px;
    bottom: 234px;
    width: 84px;
    font-size: 14px;
    text-transform: uppercase;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: 1.1px;
    color: ${props => props.theme.slateGrey};
  }
  #group {
    position: absolute;
    top: 370px;
  }
`;

/* ==== WRAPPER ==== */
/* ======================================== */

export const CustomizeBeverageWrap = styled.section`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 5;
  #backdrop {
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    /* background: #f9f9f9;
    opacity: 0.2; */
  }
  ${CloseBtnWrap} {
    position: absolute;
    top: 26.5px;
    right: 27px;
  }
  #exit-btn {
    position: absolute;
    right: 10px;
    bottom: 10px;
  }
`;

/* ==== ELEMENT ==== */
/* ======================================== */

interface CustomizeBeverageProps {
  levels: any;
  isSparkling: boolean;
  slideOpen: boolean;
  showCardsInfo: boolean;
  endPourEvent: any;
  beverageConfig: any;
  resetBeverage: any;
  getBeverageSelected: any;
  handleChange: any;
  startPour: any;
  stopPour: any;
  segmentButton: SegmentButtonProps; // => _SegmentButton
  nutritionFacts: boolean;
  isLogged?: boolean;
}

export const CustomizeBeverage = (props: CustomizeBeverageProps) => {
  const { beverageConfig, isSparkling, startPour, stopPour, levels, resetBeverage, getBeverageSelected, handleChange, endPourEvent, nutritionFacts } = props;

  //  ==== ACCESSIBILITY FUNCTION ====>
  const buttonPourEl = React.useRef(null);
  const accessibilityConsumer = React.useContext(AccessibilityContext);
  const configConsumer = React.useContext(ConfigContext);
  const { pour, enter } = accessibilityConsumer;

  const { isPouring } = configConsumer;

  React.useEffect(() => {
    const button = buttonPourEl.current;
    const isFocus = document.activeElement === ReactDOM.findDOMNode(button);
    if (!isPouring) {
      if (pour === true || enter === true && isFocus) {
        startPour();
      }
    } else {
      if (pour === false || enter === false && isFocus) {
        stopPour();
      }
    }
  }, [pour, buttonPourEl, enter]);
  //  <=== ACCESSIBILITY FUNCTION ====

  const beverageSelected: IBeverage = getBeverageSelected();

  return(
    <React.Fragment>
      <CustomizeBeverageWrap>
        {!props.showCardsInfo && <SegmentButton {...props.segmentButton} />}

        {!props.showCardsInfo ?
          <CloseBtn detectValue={"beverage_close"} icon={"close"} onClick={() => resetBeverage()} /> :
          <Button detectValue="exit-btn" onClick={() => endPourEvent()} text="Done" icon="log-out" />
        }

        {/* <div id="backdrop"></div>  */} {/* onClick={() => resetBeverage()} */}

        {props.showCardsInfo &&
          <React.Fragment>
            {props.isLogged ?
              <CircleCard color={beverageSelected.beverage_font_color} /> :
              <PhoneCard color={beverageSelected.beverage_font_color} />
            }
            <NumberCard color={beverageSelected.beverage_font_color} />
          </React.Fragment>
        }

        <LogoBeverage pose={props.showCardsInfo ? "zoom" : "normal"} src={`img/logos/${beverageSelected.beverage_logo_id}${isSparkling ? "@sparkling" : ""}.png`} />
        {!props.showCardsInfo &&
          <CustomizeBeverageCard color={beverageSelected.beverage_font_color}>
            <div id="beverage-card">
              <div>
                <span id="title">{__(beverageSelected.beverage_label_id)}</span>
                <span id="cal">0 {__("c_cal")}.</span>
                <div id="group">
                  {beverageConfig.carbonation_level != null &&
                    <ButtonGroup
                      color={beverageSelected.beverage_font_color}
                      detectValue={"sparkling"}
                      icon={"sparkling"}
                      label={"c_sparkling"}
                      options={levels.carbonation}
                      value={beverageConfig.carbonation_level}
                      onChange={(value) => handleChange(value, "carbonation")}>
                    </ButtonGroup>
                  }
                  {beverageConfig.flavor_level != null &&
                    <ButtonGroup
                      color={beverageSelected.beverage_font_color}
                      detectValue={"flavor"}
                      icon={"flavor"}
                      label={"c_flavor"}
                      options={levels.flavor}
                      value={beverageConfig.flavor_level}
                      onChange={(value) => handleChange(value, "flavor")}
                    ></ButtonGroup>
                  }
                  <ButtonGroup
                    color={beverageSelected.beverage_font_color}
                    detectValue={"temperature"}
                    icon={"temperature"}
                    label={"c_temperature"}
                    disabled={isSparkling}
                    options={levels.temperature}
                    value={beverageConfig.temperature_level}
                    onChange={(value) => handleChange(value, "temperature")}>
                  </ButtonGroup>
                </div>
              </div>
            </div>
          </CustomizeBeverageCard>
        }
        <ClickNHold
          time={0.250}
          onStart={() => console.log("pd1")}
          onClickNHold={() => startPour()}
          onEnd={(e, enough) => enough && stopPour()}
        >
          <Pour
            color={beverageSelected.beverage_font_color}
            isPouring={isPouring}
            ref={buttonPourEl}

            // onTouchStart={() => startPour()}
            // onTouchEnd={() => stopPour()}
            // onTouchMove={() => stopPour()}
            // onTouchCancel={() => stopPour()}

            // onMouseDown={() => startPour()} // => DESKTOP MODE
            // onMouseUp={() => stopPour()} // => DESKTOP MODE
          >
            {__("c_pour")}
          </Pour>
        </ClickNHold>
      </CustomizeBeverageWrap>
    </React.Fragment>
  );
};