import * as React from "react";
import { __ } from "@utils/lib/i18n";
import { Grid } from "../global/Grid";
import styled from "styled-components";
import posed from "react-pose";
import { Footer } from "../global/Footer";
import { BeverageTypes, BeveragesAnimated, BeverageIndicators, Beverage } from "../global/Beverage";
import { ConsumerContext } from "@core/containers";

export const _sizeSlide = "25vw";
export const _sizeSlideFull = "5vw";

/* ==== ANIMATIONS ==== */
/* ======================================== */

const _Slide = posed.div({
  fullClose: {
    transform: "translate3d(-93.5vw, 0, 0)",
    transition: {
      duration: 300,
    }
  },
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
  fullClose: {
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
  position: absolute;
  right: 0;
  word-wrap: break-word;
  width: 25vw;
  &.open {
    width: 98vw;
  }
  h2 {
    margin: 1rem;
    color: ${props => props.theme.primary};
  }
`;

export const SlideStyled = styled(_Slide)`
  position: absolute;
  top: 0;
  width: 98.6vw;
  z-index: 5;
  background: ${props => props.theme.spindle};
  height: 100vh;
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
  fullMode: boolean;
}

export const Slide = (props: SlideProps) => {
  const { slideOpen, indexFavoritePouring_, beverageSelected, startConsumerPour, stopConsumerPour, handleSlide, fullMode } = props;
  const { dataConsumer, consumerBeverages } = React.useContext(ConsumerContext);

  const timeText = () => {
    const today = new Date();
    const curHr = today.getHours();
    let text = "";
    if (curHr < 12) {
      text = "Good morning";
    } else if (curHr < 18) {
      text = "Good afternoon";
    } else {
      text = "Good evening";
    }
    return __(text);
  };

  const animationSlide = () => slideOpen ? "open" : fullMode ? "fullClose" : "close";

  return (
    <React.Fragment>
      <SlideStyled pose={animationSlide()}>
        <HeaderSlide className={slideOpen && "open"}>
          <h2>{timeText()}, {dataConsumer.consumer_nick}!</h2>
        </HeaderSlide>
        <h1 id="title">Your Drinks</h1>
        <Grid numElement={consumerBeverages.length}>
          {consumerBeverages.map((b, i) => {
            const BeverageAnimated = BeveragesAnimated[i];
            return (
                !props.fullMode ?
                <BeverageAnimated
                  pouring={i === indexFavoritePouring_}
                  onHoldStart={() => startConsumerPour(b, i)} onHoldEnd={() => stopConsumerPour(b)}
                  key={i}
                  indicators={i === 0 || i === 2 ? [BeverageIndicators.Heart] : [BeverageIndicators.Rewind]}
                  label={i === 0 && !slideOpen && b.$type === BeverageTypes.Info ? "Save favorites from smartphone" : null}
                  status_id={b.$status_id}
                  title={b.flavorTitle}
                  type={b.$type}
                /> :
                <Beverage
                  disabled={!slideOpen}
                  pouring={i === indexFavoritePouring_}
                  onHoldStart={() => startConsumerPour(b, i)} onHoldEnd={() => stopConsumerPour(b)}
                  key={i}
                  indicators={i === 0 || i === 2 ? [BeverageIndicators.Heart] : [BeverageIndicators.Rewind]}
                  label={i === 0 && !slideOpen && b.$type === BeverageTypes.Info ? "Save favorites from smartphone" : null}
                  status_id={b.$status_id}
                  title={b.flavorTitle}
                  type={b.$type}
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