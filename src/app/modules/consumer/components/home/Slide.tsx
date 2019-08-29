import * as React from "react";
import { __ } from "@utils/lib/i18n";
import styled from "styled-components";
import { ConsumerContext, PaymentContext } from "@core/containers";
import { memo } from "react";

import { BeveragesAnimated, BeverageTypes, Beverage, BeveragesTransition } from "../beverage/Beverage";
import { Footer } from "../common/Footer";
import { Grid } from "../common/Grid";
import { PaymentInfo } from "../common/PaymentInfo";
import { motion } from "framer-motion";
import { PourFrom, IPourConsumerConfig } from "@core/models/vendor.model";
import { areEqual } from "@core/utils/constants";

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
    translateX: "-41px",
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
  &.open {
    width: 98vw;
    h2 {
      max-width: 500px;
      display: block;
      font-size: 20px;
      padding: 20px;
      #gift {
        margin-left: 20px;
        vertical-align: bottom;
      }
    }
  }
  h2 {
    margin: 1rem;
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
    span {
      width: 85%;
    }
    #gift {
      width: 37px;
      height: 37px
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
  &:before {
    content: " ";
    position: absolute;
    top: 0;
    left: 31px;
    width: 1275px;
    height: 111%;
    background-image: url("img/slider-bg.webp");
    background-size: 1387px;
    background-repeat: no-repeat;
    background-position: bottom;
  }
  #payment-status {
    position: absolute;
    width: 100%;
    text-align: center;
    text-transform: uppercase;
    bottom: 6rem;
    right: 0;
    font-size: 16px;
    font-family: NeuzeitGro-Bol;
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
  &:disabled {
    opacity: .2;
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
  nutritionFacts: boolean;
  alarmConnectivity_: boolean;
  handleDisabled: (d) => void;
}

export const Slide = memo((props: SlideProps) => {
  const { slideOpen, indexFavoritePouring_, selectConsumerBeverage, startConsumerPour, stopConsumerPour, handleSlide, fullMode, handleDisabled, alarmConnectivity_ } = props;
  const { dataConsumer, consumerBeverages } = React.useContext(ConsumerContext);

  const animationSlide = () => slideOpen ? "open" : fullMode ? "fullClose" : "close";

  const paymentConsumer = React.useContext(PaymentContext);
  const { promotionEnabled } = paymentConsumer;

  return (
    <motion.div
      id="slide-animation"
      style={{
        position: "absolute",
        top: 0,
        width: "100vw",
        height: "100vh",
        willChange: "transform"
      }}
      initial={fullMode ? "fullClose" : "close"}
      transition={{ ease: "easeInOut", duration: 0.5 }}
      variants={AnimationSlider}
      animate={animationSlide()}
    >
      <SlideStyled id="slide-main">
        <HeaderSlide id="slide-header" className={(slideOpen || fullMode) && "open"}>
          <h2>
            <span>{__("c_welcome")}, {dataConsumer.consumer_nick}!</span>
            {promotionEnabled && <img id="gift" src="icons/gift.svg" />}
          </h2>
        </HeaderSlide>
        <>
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
                  disabled={false}
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
        </>
        {slideOpen && <PaymentInfo />}
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
          <ToggleSlide id="slide-toogle" onClick={() => handleSlide()}>
            <img src={"icons/arrow-circle.png"} />
          </ToggleSlide>
        </motion.div>
      </SlideStyled>
    </motion.div>
  );
}, areEqual);

export default Slide;