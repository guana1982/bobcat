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
import { Beverages, debounce, areEqual } from "@core/utils/constants";
import { Alert } from "../common/Alert";
import { MessageInfo } from "../common/MessageInfo";
import { ReplaySubscription } from "../common/Subscription";
import { motion } from "framer-motion";
import { IPourConfig, PourFrom } from "@core/models/vendor.model";
import { memo } from "react";
import { IPromotionTypes } from "@core/utils/APIModel";
import * as _ from "underscore";

/* ==== POUR BUTTON ==== */
/* ======================================== */

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
  &.pouring {
    opacity: .7;
    &::before {
      opacity: .3;
    }
  }
`;

const PourBtn = (props) => {

  const { startPour, stopPour, beverageSelected } = props;

  //  ==== ACCESSIBILITY FUNCTION ====>
  const buttonPourEl = React.useRef(null);
  const accessibilityConsumer = React.useContext(AccessibilityContext);
  const configConsumer = React.useContext(ConfigContext);
  const paymentConsumer = React.useContext(PaymentContext);
  const { pour, enter } = accessibilityConsumer;

  const { isPouring, statusAlarms } = configConsumer;
  const { socketPayment$, needToPay, promotionEnabled } = paymentConsumer;

  React.useEffect(() => {
    if (!(buttonPourEl.current && buttonPourEl.current.node)) {
      return;
    }
    const button = buttonPourEl.current.node;
    const isFocus = document.activeElement === ReactDOM.findDOMNode(button);
    if (!isFocus) {
      return;
    }
    if (enter === true) {
      startPour({ params: {}, from: PourFrom.Ada });
    } else if (enter === false) {
      stopPour();
    }
  }, [buttonPourEl, enter]);

  React.useEffect(() => {
    if (pour === true) {
      startPour({ params: {}, from: PourFrom.Ada });
    } else if (pour === false) {
      stopPour();
    }
  }, [pour]);
  //  <=== ACCESSIBILITY FUNCTION ====

  return (
    <ReplaySubscription source={socketPayment$.current}>
      {(status: PaymentStatus) => {
        if ((status in PaymentStatusPour || !needToPay(beverageSelected)) || promotionEnabled)
          return(
            <ClickNHold
              time={0.250}
              onStart={() => {}}
              onClickNHold={() => startPour({ params: {}, from: PourFrom.Touch })}
              onEnd={(e, enough) => enough && stopPour()}
              className="pour-btn"
              ref={buttonPourEl}
            >
              <Pour
                color={beverageSelected.beverage_font_color}
                className={isPouring ? "pouring" : ""}
              >
                {__("c_pour")}
              </Pour>
            </ClickNHold>
          );

        return (
          <MessageInfo />
        );
      }}
    </ReplaySubscription>
  );
};

/* ==== LOGO ==== */
/* ======================================== */

const AnimationLogoBeverage = {
  normal: {
    translateY:  "-75%",
    scale: 0.5
  },
  zoom: {
    translateY: "-60%",
    scale: 0.9
  }
};

const StyleLogoBeverage: any = {
  position: "absolute",
  top: "50%",
  left: "50%",
  translateX: "-50%",
  zIndex: 99,
  willChange: "transform",
  height: "660px",
  width: "660px"
};

interface LogoBeverageProps {
  show: boolean;
  isSparkling: boolean;
  beverage_logo_id: any;
}

const LogoBeverage = memo((props: LogoBeverageProps) => {
  const { show, beverage_logo_id, isSparkling } = props;
  return (
    <motion.img
      style={StyleLogoBeverage}
      initial={"normal"}
      transition={{ ease: "easeOut", duration: 0.8 }}
      animate={show ? "zoom" : "normal"}
      variants={AnimationLogoBeverage}
      src={`img/logos/${beverage_logo_id}/${isSparkling ? "logo-sparkling@2x" : "logo@2x"}.webp`}
    />
  );
}, areEqual);

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
  z-index: 6;
  #backdrop {
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
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
  #message-status {
    position: absolute;
    width: 100%;
    text-align: center;
    text-transform: uppercase;
    bottom: 3rem;
    right: 0;
    font-size: 16px;
    font-family: NeuzeitGro-Reg;
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
  handleChange: any;
  startPour: (config: IPourConfig) => any;
  stopPour: any;
  segmentButton: SegmentButtonProps; // => _SegmentButton
  nutritionFacts: boolean;
  isLogged?: boolean;
  beverageSelected: IBeverage;
  handleType: (b: boolean) => void;
}

export const CustomizeBeverage = (props: CustomizeBeverageProps) => {
  const { beverageConfig, isSparkling, startPour, stopPour, levels, resetBeverage, beverageSelected, handleChange, endPourEvent, handleType } = props;

  //  ==== PAYMENT MODE ====>
  const paymentConsumer = React.useContext(PaymentContext);
  const { displayPriceBeverage, paymentModeEnabled, promotionEnabled } = paymentConsumer;
  //  <=== PAYMENT MODE ====

  //  ==== DISABLE SPARKLING ====>
  const configConsumer = React.useContext(ConfigContext);
  const { statusAlarms } = configConsumer;
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

  const resetBeverage_ = React.useMemo(() => _.throttle(resetBeverage, 500, { leading: false }), []);

  return(
    <React.Fragment>
      <CustomizeBeverageWrap>

        {!props.showCardsInfo &&
          <>
            <SegmentButton {...props.segmentButton} />
            <CloseBtn detectValue={"beverage_close"} icon={"close"} onClick={resetBeverage} />
            <div id="backdrop" onClick={resetBeverage_} />
          </>
        }

        {props.showCardsInfo &&
          <>
            {props.isLogged ?
              <CircleCard color={beverageSelected.beverage_font_color} /> :
              <PhoneCard color={beverageSelected.beverage_font_color} />
            }
            <NumberCard color={beverageSelected.beverage_font_color} />
            <Button detectValue="exit-btn" onClick={endPourEvent} text="Done" icon="log-out" />
          </>
        }

        <LogoBeverage
          show={props.showCardsInfo}
          beverage_logo_id={beverageSelected.beverage_logo_id}
          isSparkling={isSparkling}
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
                {(paymentModeEnabled && promotionEnabled !== IPromotionTypes.SubscriptionDailyAmount) &&
                  <div id="footer">
                      {/* {beverageSelected.$price > 0 && <span id="total">{__("c_total")}</span>} */}
                    <div id="limit-erogation">
                      <span className="info">MAX</span> {"32oz"}
                    </div>
                    <div id="price" className={promotionEnabled === IPromotionTypes.PromotionFreePours  ? "promotion-enabled" : null}>
                      {displayPriceBeverage(beverageSelected.$price, true)}
                    </div>
                  </div>
                }
              </div>
            </div>
          </CustomizeBeverageCard>
        }

        <PourBtn
          startPour={startPour}
          stopPour={stopPour}
          beverageSelected={beverageSelected}
        />

      </CustomizeBeverageWrap>
    </React.Fragment>
  );
};