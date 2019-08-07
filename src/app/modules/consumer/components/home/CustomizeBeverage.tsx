import * as React from "react";
import styled from "styled-components";
import ReactDOM = require("react-dom");
import { IBeverage } from "@core/models";
import { NumberCard } from "../cards/NumberCard";
import { CircleCard } from "../cards/CircleCard";
import { PhoneCard } from "../cards/PhoneCard";
import { AccessibilityContext, ConfigContext, AlertTypes, PaymentContext, PaymentStatus, PaymentStatusPour } from "@core/containers";
import { __ } from "@core/utils/lib/i18n";
import { CloseBtnWrap, CloseBtn } from "../common/CloseBtn";
import { SegmentButtonProps, SegmentButton } from "../common/SegmentButton";
import { Button } from "../common/Button";
import { ButtonGroup } from "../common/ButtonGroup";
import ClickNHold from "../common/ClickNHold";
import { Beverages, debounce } from "@core/utils/constants";
import { Alert } from "../common/Alert";
import { PaymentInfo } from "../common/PaymentInfo";
import { ReplaySubscription } from "../common/Subscription";
import { motion } from "framer-motion";

/* color: string; */
/* @keyframes shadow-pulse
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
} */
export const Pour = styled.button`
  position: absolute;
  width: 206px;
  height: 100px;
  box-shadow: 20px -25px 34px -14px rgba(51, 56, 73, 0.08), 5px 2px 10px 0 rgba(190, 190, 190, 0.22), 0 -9px 34px 0 rgba(108, 163, 0, 0.04);
  font-family: NeuzeitGro-Bol;
  font-size: 20px;
  letter-spacing: 3px;
  text-align: center;
  color: #ffffff;
  text-transform: uppercase;
  bottom: 0;
  left: calc(50% - (206px / 2));
  border-radius: 200px 200px 0 0;
  line-height: 6.3;
  &, &:active {
    color: ${props => props.theme.light};
    background: ${props => props.color};
  }
  &:before {
    content: " ";
    z-index: -1;
    position: absolute;
    width: 120%;
    height: 120%;
    background: ${props => props.color};
    opacity: 0.2;
    top: -20%;
    left: -10%;
    border-radius: 200px 200px 0 0;
    box-shadow: 20px -25px 34px -14px rgba(51, 56, 73, 0.08), 5px 2px 10px 0 rgba(190, 190, 190, 0.22);
  }
`;

/* ==== LOGO ==== */
/* ======================================== */

const AnimationLogoBeverage = {
  normal: {
    translateX: "-50%",
    translateY:  "-75%",
    scale: 0.5
  },
  zoom: {
    translateX: "-50%",
    translateY: "-60%",
    scale: 0.9
  }
};

const StyleLogoBeverage: any = {
  position: "absolute",
  top: "50%",
  left: "50%",
  zIndex: 99,
  willChange: "transform"
};

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
    top: 360px;
    /* top: 370px; */
  }
  #footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 53px;
    border-radius: 0 0 20px 20px;
    box-shadow: 0 20px 40px 8px rgba(89, 96, 118, 0.15);
    background-image: #fff;
    text-transform: uppercase;
    * {
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
    }
    #limit-erogation {
      position: absolute;
      left: 31.5px;
      bottom: 8px;
      font-family: NeuzeitGro-Reg;
      font-size: 24px;
      letter-spacing: normal;
      text-align: right;
      color: #292929;
      .info {
        font-family: NeuzeitGro-Reg;
        font-size: 14px;
        letter-spacing: 1px;
        text-align: right;
        color: #565657;
      }
    }
    #price {
      position: absolute;
      right: 31.5px;
      bottom: 8px;
      font-size: 24px;
      color: #292929;
      #gift {
        vertical-align: bottom;
        width: 41px;
        height: 40px
      }
      &.promotion-enabled {
        #value {
          color: #c5c5c5;
          text-decoration: line-through;
        }
      }
      #info {
        font-size: 14px;
        color: #565657;
      }
    }
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
  .pour-btn:not(.cnh_ended):not(.cnh_holding) {
    button {
      opacity: .7;
      &::before {
        opacity: .3;
      }
    }
  }
  #payment-status {
    position: absolute;
    width: 100%;
    text-align: center;
    text-transform: uppercase;
    bottom: 3rem;
    right: 0;
    font-size: 16px;
    font-family: NeuzeitGro-Bol;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    letter-spacing: 1.28px;
    color: ${props => props.theme.slateGrey};
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
  handleType: (b: boolean) => void;
}

export const CustomizeBeverage = (props: CustomizeBeverageProps) => {
  const { beverageConfig, isSparkling, startPour, stopPour, levels, resetBeverage, getBeverageSelected, handleChange, endPourEvent, nutritionFacts, handleType } = props;

  //  ==== ACCESSIBILITY FUNCTION ====>
  const buttonPourEl = React.useRef(null);
  const accessibilityConsumer = React.useContext(AccessibilityContext);
  const configConsumer = React.useContext(ConfigContext);
  const paymentConsumer = React.useContext(PaymentContext);
  const { pour, enter } = accessibilityConsumer;

  const { isPouring, statusAlarms } = configConsumer;
  const { getPriceBeverage, paymentModeEnabled, socketPayment$, needToPay, promotionEnabled } = paymentConsumer;

  React.useEffect(() => {
    if (!(buttonPourEl.current && buttonPourEl.current.node)) {
      return;
    }
    const button = buttonPourEl.current.node;
    const isFocus = document.activeElement === ReactDOM.findDOMNode(button);
    // if (!isPouring) {
      if (pour === true || enter === true && isFocus) {
        startPour();
      }
    // } else {
      if (pour === false || enter === false && isFocus) {
        stopPour();
      }
    // }
  }, [pour, buttonPourEl, enter]);
  //  <=== ACCESSIBILITY FUNCTION ====

  //  ==== DISABLE SPARKLING ====>
  const disableSparkling_ = isSparkling && statusAlarms.alarmSparkling_;
  if (disableSparkling_) {
    return (
      <>
        <CustomizeBeverageWrap>
          {!props.showCardsInfo && <SegmentButton {...props.segmentButton} />}
          {/* {!props.showCardsInfo ?
            <CloseBtn detectValue={"beverage_close"} icon={"close"} onClick={() => resetBeverage()} /> :
            <Button detectValue="exit-btn" onClick={() => endPourEvent()} text="Done" icon="log-out" />
          } */}
          <Alert
            options = {{
              type: AlertTypes.EndSparkling,
              subTitle: true,
              timeout: true,
              transparent: true,
              onConfirm: () => handleType(false),
              onDismiss: () => handleType(false),
            }}
          />
        </CustomizeBeverageWrap>
      </>
    );
  }
  //  <=== DISABLE SPARKLING ====

  const beverageSelected: IBeverage = getBeverageSelected();

  return(
    <React.Fragment>
      <CustomizeBeverageWrap>
        {!props.showCardsInfo && <SegmentButton {...props.segmentButton} />}

        {!props.showCardsInfo ?
          <CloseBtn detectValue={"beverage_close"} icon={"close"} onClick={() => resetBeverage()} /> :
          <Button detectValue="exit-btn" onClick={() => endPourEvent()} text="Done" icon="log-out" />
        }

        {!props.showCardsInfo && <div id="backdrop" onClick={resetBeverage} />}

        {props.showCardsInfo &&
          <React.Fragment>
            {props.isLogged ?
              <CircleCard color={beverageSelected.beverage_font_color} /> :
              <PhoneCard color={beverageSelected.beverage_font_color} />
            }
            <NumberCard color={beverageSelected.beverage_font_color} />
          </React.Fragment>
        }

        <motion.img
          style={StyleLogoBeverage}
          initial={"normal"}
          transition={{ ease: "easeOut", delay: 0.1, duration: 0.8 }}
          animate={props.showCardsInfo ? "zoom" : "normal"}
          variants={AnimationLogoBeverage}
          src={`img/logos/${beverageSelected.beverage_logo_id}${isSparkling ? "@sparkling" : ""}.webp`}
        />

        {!props.showCardsInfo &&
          <CustomizeBeverageCard color={beverageSelected.beverage_font_color}>
            <div id="beverage-card">
              <div>
                <span id="title">{__(beverageSelected.beverage_label_id)}</span>
                <span id="cal">{beverageSelected.calories} {__("c_cal")}.</span>
                <div id="group">
                  {isSparkling &&
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
                  {beverageSelected.beverage_type === Beverages.Bev &&
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
                {paymentModeEnabled &&
                  <div id="footer">
                      {/* {beverageSelected.$price > 0 && <span id="total">{__("c_total")}</span>} */}
                    <div id="limit-erogation">
                      <span className="info">MAX</span> {"32oz"}
                    </div>
                    <div id="price" className={promotionEnabled ? "promotion-enabled" : null}>
                      {getPriceBeverage(beverageSelected.$price, true)}
                    </div>
                  </div>
                }
              </div>
            </div>
          </CustomizeBeverageCard>
        }
        <ReplaySubscription source={socketPayment$.current}>
          {(status: PaymentStatus) => {
            if ((status in PaymentStatusPour || !needToPay(beverageSelected)) || promotionEnabled)
              return(
                <ClickNHold
                  time={0.250}
                  onStart={() => {}}
                  onClickNHold={() => startPour()}
                  onEnd={(e, enough) => enough && stopPour()}
                  className="pour-btn"
                  ref={buttonPourEl}
                >
                  <Pour
                    color={beverageSelected.beverage_font_color}
                    // isPouring={isPouring}
                    // ref={buttonPourEl}
                  >
                    {__("c_pour")}
                  </Pour>
                </ClickNHold>
              );

            return (
              <PaymentInfo />
            );
          }}
        </ReplaySubscription>
      </CustomizeBeverageWrap>
    </React.Fragment>
  );
};