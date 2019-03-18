import * as React from "react";
import { __ } from "@utils/lib/i18n";
import { Grid } from "../global/Grid";
import styled from "styled-components";
import posed from "react-pose";
import { Footer } from "../global/Footer";
import { BeverageTypes, BeveragesAnimated, BeverageIndicators, Beverage } from "../global/Beverage";
import { ConsumerContext } from "@core/containers";

export const _sizeSlide = "305px";
export const _sizeSlideFull = "5vw";

/* ==== ANIMATIONS ==== */
/* ======================================== */

const _Slide = posed.div({
  fullClose: {
    transform: "translate3d(-1200px, 0, 0)",
    transition: {
      duration: 300,
    }
  },
  close: {
    transform: "translate3d(-951px, 0, 0)",
    transition: {
      duration: 300,
    }
  },
  open: {
    transform: "translate3d(-31px, 0, 0)",
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
  width: 329px;
  margin-top: .3rem;
  &.open {
    width: 98vw;
    h2 {
      font-size: 20px;
      padding: 20px;
    }
  }
  h2 {
    margin: 1rem;
    text-transform: uppercase;
    font-size: 16px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.88;
    letter-spacing: 1.3px;
    color: ${props => props.theme.slateGrey};
  }
`;

export const SlideStyled = styled(_Slide)`
  position: absolute;
  top: 0;
  width: 100vw;
  z-index: 5;
  /* box-shadow: 9px 27px 45px 0 rgba(163, 165, 166, 0.2); */
  /* background: #fff; */
  height: 100vh;
  filter: ${props => props.beverageIsSelected ? "blur(5px)" : null};
  &:before {
      content: " ";
      position: absolute;
      top: 0%;
      left: 0%;
      width: 100%;
      height: 100%;
      background-image: url("img/slider-bg.png");
      background-size: contain;
      background-repeat: no-repeat;
      background-position: bottom;
    }
  #info {
    position: absolute;
    width: 100%;
    text-align: center;
    bottom: 6rem;
    right: 0;
    font-size: 18px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
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
    top: calc(50% - 9px);
    border-radius: 50%;
    height: 46px;
    width: 46px;
    right: 0;
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

  const beverageIsSelected = beverageSelected !== undefined && beverageSelected !== null;
  const animationSlide = () => slideOpen ? "open" : fullMode ? "fullClose" : "close";

  return (
    <React.Fragment>
      <SlideStyled beverageIsSelected={beverageIsSelected} pose={animationSlide()}>
        <HeaderSlide className={slideOpen && "open"}>
          <h2>{__("HI")}, {dataConsumer.consumer_nick}!</h2>
        </HeaderSlide>
        <Grid numElement={consumerBeverages.length}>
          {consumerBeverages.map((b, i) => {
            const BeverageAnimated = BeveragesAnimated[i];
            return (
                !props.fullMode ?
                <BeverageAnimated
                  pouring={i === indexFavoritePouring_}
                  onHoldStart={() => startConsumerPour(b, i)} onHoldEnd={() => stopConsumerPour(b)}
                  key={i}
                  logoId={b.$logo_id || b.$beverage.beverage_logo_id}
                  color={b.$beverage.beverage_font_color}
                  status_id={b.$status_id}
                  title={b.flavorTitle}
                  type={b.$type}
                /> :
                <Beverage
                  disabled={!slideOpen}
                  pouring={i === indexFavoritePouring_}
                  onHoldStart={() => startConsumerPour(b, i)} onHoldEnd={() => stopConsumerPour(b)}
                  key={i}
                  logoId={b.$logo_id || b.$beverage.beverage_logo_id}
                  color={b.$beverage.beverage_font_color}
                  status_id={b.$status_id}
                  title={b.flavorTitle}
                  type={b.$type}
                />
            );
          })}
        </Grid>
        {consumerBeverages[0].$type === BeverageTypes.Info && <h3 id="info">Save favorites from smartphone</h3>}
        <ToggleSlide onClick={() => handleSlide()}>
          <img src={"icons/arrow-circle.png"} />
        </ToggleSlide>
      </SlideStyled>
    </React.Fragment>
  );
};