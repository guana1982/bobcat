import styled from "styled-components";
import { Grid } from "@components/global/Grid";
import { _sizeSlide, _sizeSlideFull } from "@components/consumer/Slide";
import { ChoiceBeverageWrap } from "@components/consumer/ChoiceBeverage";
import posed from "react-pose";

/* ==== HOME MAIN ==== */
/* ======================================== */

const sizeHome = (props) => props.isLogged ? props.fullMode ? _sizeSlideFull : _sizeSlide : "0vw";


/* beverageIsSelected?: boolean; isLogged: boolean; fullMode: boolean */
export const HomeWrap = styled.div`
  /* background-image: ${props => props.theme.backgroundLight}; */
  width: calc( 100vw - ${props => sizeHome(props)});
  height: 100vh;
  position: absolute;
  left: ${props => sizeHome(props)};
  top: 0;
  /* &:before {
    content: " ";
    position: absolute;
    left: -35px;
    width: 35px;
    height: 100vh;
    background-image: ${props => props.theme.backgroundLight};
  } */
  ${Grid} {
    padding-top: 5.5rem;
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

export const HomeContent = styled.section`
  background-image: ${props => props.theme.backgroundLight};
`;