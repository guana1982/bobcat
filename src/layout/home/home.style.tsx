import styled, { injectGlobal } from "styled-components";
import { ButtonGroupWrapper } from "../../components/global/ButtonGroup";

/* ==== COMPONENTS ==== */
/* ======================================== */

export const TimerLabel = styled.p`
  position: absolute;
  right: 0;
  bottom: 0;
  background-color: ${props => props.theme.primary};
  color: #fff;
  padding: .5rem;
  font-size: 1rem;
  margin: 0;
`;

// const _sizeCircleBtn = 40;
// interface CircleBtnProps { bgColor?: string; color?: string; icon: string; }
// export const CircleBtn = styled<CircleBtnProps, "div">("div")`
//   background: ${props => props.theme[props.bgColor]};
//   width: ${_sizeCircleBtn}px;
//   height: ${_sizeCircleBtn}px;
//   border-radius: 50%;
//   &:before {
//     display: inline-block;
//     width: 50%;
//     height: 50%;
//     margin-top: 25%;
//     margin-left: 25%;
//     content: "";
//     background: url(${props => props.icon}) no-repeat 0 0;
//     background-size: 100%;
//     background-position: center;
//   }
// `;

const _sizePour = 105;
export const Pour = styled.button`
  position: absolute;
  bottom: ${-_sizePour / 5}px;
  right: calc(50vw - ${_sizePour}px);
  /* color: ${props => props.theme.primary};
  background: ${props => props.theme.sail}; */
  height: ${_sizePour}px;
  width: ${_sizePour * 2}px;
  border-top-left-radius: ${_sizePour * 2}px;
  border-top-right-radius: ${_sizePour * 2}px;
  font-size: ${_sizePour / 5}px;
  font-weight: 600;
  &, &:active {
    color: ${props => props.theme.light};
    background: ${props => props.theme.primary};
  }
`;

/* ==== GRID ==== */
/* ======================================== */

const _sizeBeverage = 13;
interface BeverageProps { size?: string; status?: string; type?: string; }
export const Beverage = styled<BeverageProps, "div">("div")`
  padding: 1rem .7rem;
  transition: 1s all;
  transition-property: width, height, left, top;
  will-change: width, height, left, top;
  text-align: center;
  pointer-events: default;
  height: ${_sizeBeverage}rem;
  width: ${_sizeBeverage * 1.5}rem;
  #element {
    position: relative;
    border: ${props => `2px solid ${props.theme.primary}`};
    background-color: ${props => props.theme[props.status === "active" ? "primary" : "light"] };
    width: 100%;
    border-radius: 1.2rem;
    color: #0034B0;
    height: 100%;
    text-align: left;
    &:before {
      content: " ";
      opacity: .7;
      position: absolute;
      right: -2.5rem;
      bottom: .5rem;
      width: 100%;
      height: 60%;
      background-repeat: no-repeat;
      background-image: url("img/${props => props.type}.svg");
    }
    h3 {
      position: absolute;
      top: ${_sizeBeverage / 8}rem;
      left: ${_sizeBeverage / 12}rem;
      font-size: ${_sizeBeverage / 7}rem;
      margin: .5rem;
      &:before {
        position: absolute;
        top: -20px;
        content: "${props => props.type} ";
        display: block;
        text-transform: capitalize;
        font-size: 1rem;
        font-weight: 400;
      }
    }
    h6 {
      position: absolute;
      top: ${_sizeBeverage / 2.5 - (_sizeBeverage / 14)}rem;
      left: ${_sizeBeverage / 12}rem;
      font-size: ${_sizeBeverage / 14}rem;
      bottom: 0;
      color: ${props => props.status === "active" ? "#fff" : props.theme.primary };
      margin: .7rem;
      text-align: left;
    }
    h5 {
      position: absolute;
      bottom: ${_sizeBeverage / 6}rem;
      right: ${_sizeBeverage / 14}rem;
      font-size: ${_sizeBeverage / 13}rem;
      font-weight: 600;
      bottom: 0;
      color: ${props => props.status === "active" ? "#fff" : props.theme.primary };
      margin: .7rem;
      text-align: left;
    }
  }
`;

interface GridProps { numElement?: number; }
export const Grid = styled<GridProps, "div">("div")`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: auto;
  margin-top: 5rem;
  max-width: ${props => {
    switch (props.numElement) {
      case 4:
        return "600px";
        break;
      case 5:
        return "900px";
        break;
      case 6:
      case 7:
        return "1200px";
        break;
      default:
        return "100%";
        break;
    }
  }};
`;

/* ==== CARDS ==== */
/* ======================================== */

interface CustomizeBeverageProps { type?: string; }
export const CustomizeBeverageCard = styled<CustomizeBeverageProps, "div">("div")`
  position: absolute;
  top: 7rem;
  left: calc(50% - 15rem);
  background-color: ${props => props.theme.light};
  border: 2px solid ${props => props.theme.primary};
  border-radius: 15px;
  max-width: 40vw;
  padding: 20px;
  header {
    position: relative;
    min-height: 10rem;
    &:before {
      content: " ";
      opacity: .7;
      position: absolute;
      left: calc(50% - 8rem);
      top: 1rem;
      width: 100%;
      max-width: 16rem;
      height: 100%;
      background-repeat: no-repeat;
      background-image: url("img/${props => props.type}.svg");
    }
    h2 {
      position: absolute;
      top: 3rem;
      left: 2rem;
      font-size: 3rem;
      margin: .5rem;
      color: ${props => props.theme.primary };
      &:before {
        position: absolute;
        top: -2rem;
        content: "${props => props.type} ";
        font-size: 2rem;
        display: block;
        text-transform: uppercase;
        font-weight: 400;
      }
    }
    h6 {
      position: absolute;
      font-size: 1rem;
      bottom: 0;
      left: 3rem;
      margin: 0;
      color: ${props => props.theme.primary };
    }
  }
  aside {
    min-height: 20rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
`;

export const InfoCard = styled.div`

`;

/* ==== LAYOUT ==== */
/* ======================================== */

export const Header = styled.div`
  padding: 1.5rem;
  h2 {
    margin: .5rem 0;
    color: ${props => props.theme.primary};
  }
`;

export const Footer = styled.div`
  h2 {
    color: ${props => props.theme.primary};
  }
`;

/* ==== WRAPPER ==== */
/* ======================================== */

export const CustomizeBeverageWrap = styled.section`
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  #backdrop {
    position: absolute;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
  }
`;

export const ChoiceBeverageWrap = styled.section`

`;

/* ==== HOME MAIN ==== */
/* ======================================== */

interface HomeContentProps { beverageIsSelected?: boolean; }
export const HomeContent = styled<HomeContentProps, "div">("div")`
  background-color: ${props => props.theme.secondary};
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  ${ChoiceBeverageWrap} {
    filter: ${props => props.beverageIsSelected ? "blur(5px)" : null};
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
    top: 1rem;
    width: 100%;
    left: calc(50% - 13.5rem);
    margin: auto;
    ${ButtonGroupWrapper} {
      width: 25rem;
    }
  }
`;