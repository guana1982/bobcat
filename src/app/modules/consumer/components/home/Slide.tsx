import * as React from "react";
import { __ } from "@utils/lib/i18n";
import styled, { css } from "styled-components";
import { ConsumerContext, PaymentContext, AccessibilityContext } from "@core/containers";

import { BeveragesAnimated, BeverageTypes, Beverage, BeveragesTransition } from "../beverage/Beverage";
import { Footer } from "../common/Footer";
import { Grid } from "../common/Grid";
import { MessageInfo } from "../common/MessageInfo";
import { motion } from "framer-motion";
import { PourFrom, IPourConsumerConfig } from "@core/models/vendor.model";
import { IPromotionTypes } from "@core/utils/APIModel";

export const _sizeSlide = "325px";
export const _sizeSlideFull = "5vw";

/* ==== ANIMATIONS ==== */
/* ======================================== */

const ToggleSlideAnimated = {
  close: {
    transform: "rotate(0deg)"
  },
  fullClose: {
    transform: "rotate(0deg)"
  },
  open: {
    transform: "rotate(180deg)"
  }
};

const AnimationSlider = {
  fullClose: {
    translateX: "-1200px",
  },
  close: {
    translateX: "-951px",
  },
  open: {
    translateX: "-51px",
  }
};

/* ==== COMPONENTS ==== */
/* ======================================== */
const AlertSLide = styled.div`
  position: absolute;
  top: 255px;
  left: 515px;
  display: flex;
  flex-direction: column;
  width: 310px;
  justify-content: center;
  align-items: center;
  &>img {

  }
  &>#title {
    font-family: NeuzeitGro-Bol;
    width: 310px;
    text-transform: uppercase;
    line-height: 1.5;
    letter-spacing: 1.6px;
    text-align: center;
    font-size: 20px;
    margin-top: 25px;
  }
  &>#sub-title {
    margin-top: 10px;
    width: 310px;
    font-size: 20px;
    line-height: 1.5;
    text-align: center;
  }
`;

const HeaderSlide = styled.div`
  padding: 1.5rem;
  position: absolute;
  right: 0;
  word-wrap: break-word;
  width: 329px;
  margin-top: .3rem;
  &[disabled] {
    visibility: hidden;
  }
  &.open {
    width: 96vw;
    padding: 3.5rem;
    h2 {
      max-width: 500px;
      display: block;
      font-size: 20px;
      /* padding: 20px; */
      #gift {
        margin-left: 20px;
        vertical-align: bottom;
      }
    }
    #premium-label {
      margin-top: 5px;
    }
  }
  h2 {
    margin: 1rem 0 0 1rem;
    font-family: NeuzeitGro-Bol;
    text-transform: uppercase;
    font-size: 16px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.88;
    letter-spacing: 1.3px;
    color: ${props => props.theme.slateGrey};
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    span {
      width: 85%;
      line-height: 17px;
    }
    #gift {
      width: 37px;
      height: 37px
    }
  }
  #premium-label {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin: 0 1rem;
    img {
      position: relative;
      bottom: 3px;
    }
    span {
      font-family: NeuzeitGro-Bol;
      color: #b39850;
      font-size: 14px;
      margin-left: 6px;
      line-height: 18px;
      letter-spacing: 1.5px;
    }
  }
`;

/* disabled?: boolean */
export const SlideStyled = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  left:0;
  height: 100%;
  z-index: 5;
  background-color: ${props => props.disabled ? "#fff" : null};
  & .sliderBg {
    /* content: " "; */
    position: absolute;
    top: 0;
    left: 31px;
    width: 1188px;
    height: 111%;
    background-color: #fff;
    &.disabled {
      visibility: hidden;
    }
  }
  & .sliderBorder {
    /* content: " "; */
    position: absolute;
    top: 3px;
    left: 1212px;
    width: 100px;
    height: 111%;
    /* background-image: ${props => props.disabled ? null : " url(img/slider-bg.webp)"}; */
    background-image: url("img/drawer/drawer.webp");
    /* background-size: 1387px; */
    background-repeat: no-repeat;
    &.disabled {
      visibility: hidden;
    }
  }
  #message-status {
    position: absolute;
    width: 100%;
    text-align: center;
    text-transform: uppercase;
    bottom: 6rem;
    right: 0;
    font-size: 16px;
    font-family: NeuzeitGro-Reg;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    letter-spacing: 1.28px;
    color: ${props => props.theme.slateGrey};
  }
  ${Footer} {
    width: 329px;
    right: 0;
    padding: 1.5rem;
    button {
      margin: auto;
    }
  }
  ${Grid} {
    position: absolute;
    top: 5.4rem;
    right: 0;
    width: 100%;
    max-width: 80%;
    margin: 0% 10%;
    justify-content: space-around;
  }
`;

export const ToggleSlide = styled.button`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  box-shadow: 5px 2px 24px 0 rgba(157,164,167,0.17), 0 -2px 1px 0 rgba(157,164,167,0.1);
  &:before {
    content: " ";
    position: absolute;
    top: -20%;
    left: -20%;
    width: 140%;
    height: 140%;
  }
  &[hidden] {
    visibility: hidden;
  }
`;

/* ==== ELEMENT ==== */
/* ======================================== */

interface SlideProps {
  slideOpen: boolean;
  indexFavoritePouring_: number;
  beverageSelected: any;
  selectConsumerBeverage: (b) => void;
  startConsumerPour: (config: IPourConsumerConfig) => any;
  stopConsumerPour: any;
  handleSlide: any;
  fullMode: boolean;
  disabled?: boolean;
  nutritionFacts: boolean;
  alarmConnectivity_: boolean;
  handleDisabled: (d) => void;
}

export const Slide = (props: SlideProps) => {
  const { slideOpen, indexFavoritePouring_, beverageSelected, selectConsumerBeverage, startConsumerPour, stopConsumerPour, handleSlide, fullMode, disabled, handleDisabled, alarmConnectivity_ } = props;
  const { dataConsumer, consumerBeverages } = React.useContext(ConsumerContext);

  const beverageIsSelected = beverageSelected !== undefined && beverageSelected !== null;
  const animationSlide = () => slideOpen ? "open" : fullMode ? "fullClose" : "close";

  const paymentConsumer = React.useContext(PaymentContext);
  const { promotionEnabled } = paymentConsumer;
  const slideToggleDisabled = React.useRef(false);

  const accessibilityConsumer = React.useContext(AccessibilityContext);
  const { setPauseKeyDown } = accessibilityConsumer;

  const toggleAction = () => {
    handleSlide();
    const btn = document.getElementById("slide-toogle");
    btn.setAttribute("style", "pointer-events: none");
    setPauseKeyDown(true);
    setTimeout(() => {
      btn.setAttribute("style", "pointer-events: initial");
      setPauseKeyDown(false);
    }, 500);
  };


  return (
    <React.Fragment>
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          width: "100vw",
          zIndex: 5,
          height: "100vh",
          willChange: "transform"
        }}
        initial={fullMode ? "fullClose" : "close"}
        transition={{ ease: "easeInOut", duration: 0.5 }}
        variants={AnimationSlider}
        animate={animationSlide()}
      >
        <SlideStyled disabled={disabled} beverageIsSelected={beverageIsSelected}>
          <div className={`sliderBg ${disabled ? "disabled" : ""}`} />
          <div className={`sliderBorder ${disabled ? "disabled" : ""}`} />
          <HeaderSlide disabled={disabled} className={(slideOpen || fullMode) && "open"}>
            <h2>
              <span>{__("c_welcome")}, {dataConsumer.consumer_nick}!</span>
              {promotionEnabled === IPromotionTypes.PromotionFreePours && <img id="gift" src="icons/gift.svg" />}
            </h2>
            {promotionEnabled === IPromotionTypes.SubscriptionDailyAmount &&
              <div id="premium-label">
                <img src="icons/subscription.svg" />
                <span>{__("c_premium")}</span>
              </div>
            }
          </HeaderSlide>
          {
            alarmConnectivity_ ?
            <AlertSLide>
              <img src="img/cannot-connect-to-cloud.svg" />
              <span id="title">{__("c_no_connectivity")}</span>
              <span id="sub-title">{__("c_no_connectivity_subtitle")}</span>
            </AlertSLide> :
            <Grid numElement={consumerBeverages.length}>
              {consumerBeverages.map((b, i) => {
                const BeverageAnimated = BeveragesAnimated[i];
                const BeverageTransition = BeveragesTransition[i];
                return (
                  <motion.div style={{willChange: "transform"}} key={i} variants={BeverageAnimated} transition={BeverageTransition}>
                    <Beverage
                      pouring={i === indexFavoritePouring_}
                      onStart={() => selectConsumerBeverage(b)}
                      onHoldStart={(from: PourFrom) => startConsumerPour({params: { consumerBeverage: b, indexFavorite: i }, from: from})}
                      onHoldEnd={() => stopConsumerPour(b)}
                      detectValue={"slide-beverage"}
                      logoId={b.$logo_id || b.$beverage.beverage_logo_id}
                      color={b.$beverage.beverage_font_color}
                      status_id={b.$status_id}
                      title={b.flavorTitle}
                      types={b.$types}
                      $sparkling={b.$sparkling}
                      disabled={disabled}
                      beverage={b.$beverage}
                      levels={b.$levels}
                      slideOpen={slideOpen || fullMode}
                      // nutritionFacts={nutritionFacts}
                      handleDisabled={handleDisabled}
                    />
                  </motion.div>
                );
              })}
            </Grid>
          }
          <MessageInfo disabled={disabled} />
          <motion.div
          transition={{ duration: 0.3 }}
          variants={ToggleSlideAnimated}
          style={{
            position: "absolute",
            top: "calc(50% - 11px)",
            borderRadius: "50%",
            height: "48px",
            width: "48px",
            right: "-15px",
            willChange: "transform"
          }}>
            <ToggleSlide
              id="slide-toogle"
              hidden={disabled}
              disabled={disabled || slideToggleDisabled.current}
              onClick={() => toggleAction()}>
              <img src={"icons/arrow-circle.webp"} />
            </ToggleSlide>
          </motion.div>
        </SlideStyled>
      </motion.div>
    </React.Fragment>
  );
};