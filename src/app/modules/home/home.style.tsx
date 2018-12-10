import styled from "styled-components";
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

const _sizePour = 105;
export const Pour = styled.button`
  position: absolute;
  bottom: ${-_sizePour / 5}px;
  right: calc(50vw - ${_sizePour}px);
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
  &:active {
    opacity: .7;
  }
`;

/* ==== GRID ==== */
/* ======================================== */

const _sizeBeverage = 14.2;
interface BeverageProps { size?: string; status?: string; type?: string; }
export const Beverage = styled<BeverageProps, "div">("div")`
  padding: 1rem .7rem;
  transition: 1s all;
  transition-property: width, height, left, top;
  will-change: width, height, left, top;
  text-align: center;
  pointer-events: default;
  height: ${_sizeBeverage}rem;
  width: ${_sizeBeverage * 1.4}rem;
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
      right: 1rem;
      bottom: .5rem;
      width: 100%;
      height: ${_sizeBeverage / 2.5}rem;
      background-position: right;
      background-repeat: no-repeat;
      background-image: url("img/${props => props.type}.svg");
    }
    h3 {
      position: relative;
      top: ${_sizeBeverage / 8}rem;
      left: .5rem;
      font-size: ${_sizeBeverage / 7}rem;
      margin: .5rem;
      &:before {
        position: absolute;
        top: -20px;
        content: "${props => props.type} ";
        display: block;
        text-transform: capitalize;
        font-size: 1rem;
        font-weight: 500;
      }
    }
    h6 {
      position: relative;
      top: 1.5rem;
      left: .5rem;
      font-size: ${_sizeBeverage / 15}rem;
      bottom: 0;
      color: ${props => props.status === "active" ? "#fff" : props.theme.primary };
      margin: .7rem;
      text-align: left;
    }
    h5 {
      position: absolute;
      font-size: ${_sizeBeverage / 14}rem;
      font-weight: 600;
      right: .5rem;
      bottom: .5rem;
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
  margin-top: 4rem;
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
  top: 9rem;
  left: calc(50% - 15rem);
  background-color: ${props => props.theme.light};
  border: 1px solid ${props => props.theme.primary};
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
  position: absolute;
  background: rgb(166, 202, 237);
  color: rgb(37, 107, 192);
  text-align: center;
  top: 11rem;
  width: 18rem;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  padding: 15px;
  border: 1px solid ${props => props.theme.primary};
  &.right {
    left: calc(15% - 9rem);
  }
  &.left {
    right: calc(15% - 9rem);
    footer {
      padding-top: 0rem;
    }
  }
  header {
    min-height: 9rem;
  }
  aside {
    display: flex;
    justify-content: center;
    min-height: 10rem;
    img {
      height: 10rem;
    }
  }
  footer {
    padding-top: 1rem;
    min-height: 8rem
  }
  h3 {
    font-size: 2rem;
    font-weight: 600;
  }
  h2 {
    font-size: 2.3rem;
    font-weight: 600;
    margin: 0;
  }
  h4 {
    font-size: 1.7rem;
    font-weight: 500;
    margin: 0;
  }
`;

/* ==== LAYOUT ==== */
/* ======================================== */

export const Header = styled.div`
  padding: 1.5rem;
  h2 {
    margin: 1rem;
    color: ${props => props.theme.primary};
  }
`;

export const Footer = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 3rem 6rem;
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
    top: 2rem;
    left: calc(50% - 13.5rem);
    margin: auto;
    ${ButtonGroupWrapper} {
      width: 25rem;
    }
  }
`;