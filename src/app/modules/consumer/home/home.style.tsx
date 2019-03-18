import styled from "styled-components";
import { Grid } from "@components/global/Grid";
import { _sizeSlide, _sizeSlideFull } from "@components/consumer/Slide";
import { ChoiceBeverageWrap } from "@components/consumer/ChoiceBeverage";
import posed from "react-pose";

/* ==== HOME MAIN ==== */
/* ======================================== */

const sizeHome = (props) => props.isLogged ? props.fullMode ? _sizeSlideFull : _sizeSlide : "0vw";

const _BlurWrap = posed.div({
  disable: {
    "-webkit-filter": "blur(0px)",
    delay: 100,
    transition: {
      duration: 5,
    }
  },
  enable: {
    "-webkit-filter": "blur(40px)",
    delay: 0,
    transition: {
      duration: 0
    }
  }
});

export const BlurWrap = styled(_BlurWrap)`
  -webkit-backface-visibility: hidden;
  -webkit-perspective: 1000;
  -webkit-transform: translate3d(0,0,0);
  -webkit-transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000;
  zoom: 1;
  transform: translate3d(0,0,0);
  transform: translateZ(0);
  will-change: transform;
  /* -webkit-filter: ${props => props.isBlured ? "blur(50px)" : null}; */
`;

/* beverageIsSelected?: boolean; isLogged: boolean; fullMode: boolean */
export const HomeContent = styled.div`
  background-image: ${props => props.theme.backgroundLight};
  width: calc( 100vw - ${props => sizeHome(props)});
  height: 100vh;
  position: absolute;
  left: ${props => sizeHome(props)};
  top: 0;
  &:before {
    content: " ";
    position: absolute;
    left: -35px;
    width: 35px;
    height: 100vh;
    background-image: ${props => props.theme.backgroundLight};
  }
  ${Grid} {
    padding-top: 6.5rem;
  }
  ${ChoiceBeverageWrap} {
    /* filter: ${props => props.beverageIsSelected ? "blur(5px)" : null}; */
    /* &:after {
      display: ${props => !props.beverageIsSelected ? "none" : null};
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: ${props => props.theme.primary};
      opacity: 0.3
    } */
  }
  /* #types-group {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    z-index: 4;
  } */
`;