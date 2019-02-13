import styled from "styled-components";
import { ButtonGroupWrapper } from "../../components/global/ButtonGroup";
import { Grid } from "../../components/global/Grid";
import { _sizeSlide } from "../../components/consumer/Slide";
import { ChoiceBeverageWrap } from "../../components/consumer/ChoiceBeverage";

/* ==== HOME MAIN ==== */
/* ======================================== */

interface HomeContentProps { beverageIsSelected?: boolean; isLogged: boolean; }
export const HomeContent = styled<HomeContentProps, "div">("div")`
  background-color: ${props => props.theme.secondary};
  width: ${props => props.isLogged ? "75vw" : "100vw"};
  height: 100vh;
  position: absolute;
  left: ${props => props.isLogged ? _sizeSlide : 0};
  top: 0;
  ${Grid} {
    padding-top: 8.1rem;
  }
  ${ChoiceBeverageWrap} {
    &:after {
      display: ${props => !props.beverageIsSelected ? "none" : null};
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: ${props => props.theme.primary};
      opacity: 0.3
    }
  }
  #types-group {
    position: absolute;
    top: 2rem;
    left: calc(50% - 13.5rem);
    margin: auto;
    z-index: 1;
    ${ButtonGroupWrapper} {
      width: 25rem;
    }
  }
`;