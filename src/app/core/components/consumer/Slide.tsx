import * as React from "react";
import { __ } from "@utils/lib/i18n";
import { Grid } from "../global/Grid";
import styled from "styled-components";
import posed from "react-pose";
import { Footer } from "../global/Footer";
import { ConsumerContext, FocusElm } from "@containers/index";
import { BeverageTypes, BeveragesAnimated, BeverageIndicators } from "../global/Beverage";
import BackdropFilter from "react-backdrop-filter";

export const _sizeSlide = "25vw";

/* ==== ANIMATIONS ==== */
/* ======================================== */

const _Slide = posed.div({
  close: {
    transform: "translate3d(-73.5vw, 0, 0)",
    transition: {
      duration: 300,
    }
  },
  open: {
    transform: "translate3d(0vw, 0, 0)",
    transition: {
      duration: 300,
    }
  }
});
const _toggleSlide = posed.button({
  close: {
    transform: "rotate(0deg)"
  },
  open: {
    transform: "rotate(180deg)"
  }
});

/* ==== COMPONENTS ==== */
/* ======================================== */

const HeaderSlide = styled.div`
  padding: 1.5rem;
  padding-top: 3rem;
  padding-left: 2rem;
  position: absolute;
  right: 0;
  word-wrap: break-word;
  width: 25vw;
  &.open {
    width: 98vw;
    top: 5rem;
    left: 2.5rem;
  }
  h2 {
    margin: 1rem;
    font-size: 1.3rem;
    text-transform: uppercase;
    color: ${props => props.theme.primary};
  }
`;

export const SlideStyled = styled(_Slide).attrs(props => ({
  "data-focus": props.dataFocus
}))`
  position: relative;
  /* background: rgba(255, 255, 255, .95); */
  background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0), #fff);
  box-shadow: 9px 27px 45px 0 rgba(163, 165, 166, 0.2);
  top: 0;
  width: 98.6vw;
  z-index: 2;

  /* background: ${props => props.theme.spindle}; */
  height: 100vh;
  .rct-backdrop-filter-wrapper {
    height: 100vh;
  }
  #title {
    position: absolute;
    top: 7rem;
    left: 5rem;
    font-size: 2rem;
    color: ${props => props.theme.primary};
  }
  #info {
    position: absolute;
    width: 100%;
    text-align: center;
    bottom: 7rem;
    right: 0;
    font-size: 1.7rem;
    color: ${props => props.theme.primary};
  }
  ${Footer} {
    width: ${_sizeSlide};
    right: 0;
    padding: 1.5rem;
    button {
      margin: auto;
    }
  }
  ${Grid} {
    position: absolute;
    top: 15.7rem;
    right: 0;
    width: 100%;
    max-width: 80%;
    margin: 0% 10%;
    justify-content: space-around;
  }
`;

export const ToggleSlide = styled(_toggleSlide)`
    position: absolute;
    width: 4rem;
    right: -1.2rem;
    top: calc(50% - 2rem);
`;

/* ==== ELEMENT ==== */
/* ======================================== */

interface SlideProps {
  slideOpen: boolean;
  indexFavoritePouring_: number;
  beverageSelected: any;
  startConsumerPour: any;
  stopConsumerPour: any;
  handleSlide: any;
}

export const Slide = (props: SlideProps) => {
  const { slideOpen, indexFavoritePouring_, beverageSelected, startConsumerPour, stopConsumerPour, handleSlide } = props;
  const { dataConsumer, consumerBeverages } = React.useContext(ConsumerContext);

  // const timeText = () => {
  //   const today = new Date();
  //   const curHr = today.getHours();
  //   let text = "";
  //   if (curHr < 12) {
  //     text = "Good morning";
  //   } else if (curHr < 18) {
  //     text = "Good afternoon";
  //   } else {
  //     text = "Good evening";
  //   }
  //   return __(text);
  // };

  const slideFocus = () => {
    if (slideOpen) {
      return FocusElm.Controller;
    }
    if (beverageSelected) {
      return FocusElm.Extra;
    }
    return null;
  };

  const checkBtnFocus = (i) => {
    if (!slideOpen && i === 2) {
        return FocusElm.Disable;
    }
    if (slideOpen && i === 0) {
        return FocusElm.Init;
    }
    return null;
  };

  return (
    <React.Fragment>
      <SlideStyled dataFocus={slideFocus()} pose={slideOpen ? "open" : "close"}>
        <HeaderSlide className={slideOpen && "open"}>
          <h2>hi, {dataConsumer.consumer_nick}!</h2>
        </HeaderSlide>
        {/* <h1 id="title">Your Drinks</h1> */}
        <Grid numElement={consumerBeverages.length}>
          {consumerBeverages.map((b, i) => {
            const BeverageAnimated = BeveragesAnimated[i];
            return (
              <BeverageAnimated
                pouring={i === indexFavoritePouring_}
                onHoldStart={() => startConsumerPour(b, i)} onHoldEnd={() => stopConsumerPour(b)}
                key={i}
                beverage={b.$beverage}
                indicators={i === 0 || i === 2 ? [BeverageIndicators.Heart] : [BeverageIndicators.Rewind]}
                label={i === 0 && !slideOpen && b.$type === BeverageTypes.Info ? "Save favorites from smartphone" : null}
                status_id={b.$status_id}
                title={b.flavorTitle}
                type={b.$type}
                dataBtnFocus={checkBtnFocus(i)}
              />
            );
          })}
        </Grid>
        {consumerBeverages[0].$type === BeverageTypes.Info && <h3 id="info">Save favorites from smartphone</h3>}
        <ToggleSlide onClick={() => handleSlide()}>
          <img src={"icons/arrow-circle.svg"} />
        </ToggleSlide>
      </SlideStyled>
    </React.Fragment>
  );
};