import styled from "styled-components";
import { ButtonGroupWrapper } from "../../components/ButtonGroup";
import posed from "react-pose";

/* ==== ANIMATIONS ==== */
/* ======================================== */

const _sizeSlide = "25vw";
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
const _toggleSlide = posed.img({
  close: {
    transform: "rotate(0deg)"
  },
  open: {
    transform: "rotate(180deg)"
  }
});

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
  right: calc(50% - ${_sizePour}px);
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

const _sizeButton = 60;
interface ButtonProps { icon?: string; text?: string; }
export const Button = styled<ButtonProps, "button">("button")`
  height: ${_sizeButton}px;
  width: ${_sizeButton * 2}px;
  border-radius: 30px;
  font-size: ${_sizeButton / 4}px;
  font-weight: 600;
  &:before {
    content: "${props => props.text}";
  }
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
export enum BeverageType {
  Info = "info",
  Sparkling = "sparkling"
}
const _sizeBeverage = 11;
interface BeverageProps { size?: string; status?: string; type?: string; }
export const Beverage = styled<BeverageProps, "div">("div")`
  padding: 1rem .7rem;
  transition: 1s all;
  transition-property: width, height, left, top;
  will-change: width, height, left, top;
  text-align: center;
  pointer-events: default;
  height: ${_sizeBeverage * 1.6}rem;
  width: ${_sizeBeverage * 1.4}rem;
  #element {
    position: relative;
    border: ${props => `2px ${props.type === BeverageType.Info ? "dashed" : "solid"} ${props.theme.primary}`};
    background-color: ${props => props.type === BeverageType.Info ? "rgba(255, 255, 255, 0.3)" : props.theme["light"] };
    width: 100%;
    border-radius: 1rem;
    color: #0034B0;
    height: 100%;
    text-align: left;
    * {
      opacity: ${props => props.type === BeverageType.Info ? .6 : 1 };
    }
    &:before {
      content: " ";
      opacity: .7;
      position: absolute;
      right: .5rem;
      bottom: .1rem;
      width: 100%;
      height: 5.4rem !important;
      height: ${_sizeBeverage / 2.5}rem;
      background-position: right;
      background-repeat: no-repeat;
      background-image: url("img/${props => props.type}.svg");
    }
    h3 {
      position: relative;
      word-wrap: break-word;
      top: ${_sizeBeverage / 2.5}rem;
      left: .7rem;
      font-size: ${_sizeBeverage / 7}rem;
      margin: .5rem;
      left: 0;
      &:before {
        position: absolute;
        top: -20px;
        content: "${props => props.type === BeverageType.Sparkling ? props.type : null} ";
        display: block;
        text-transform: capitalize;
        font-size: 1rem;
        font-weight: 500;
      }
    }
    h6 {
      position: relative;
      top: ${_sizeBeverage / 2.5}rem;
      left: .5rem;
      font-size: ${_sizeBeverage / 13.5}rem;
      bottom: 0;
      color: ${props => props.status === "active" ? "#fff" : props.theme.primary };
      margin: .7rem;
      text-align: left;
      left: 0;
    }
    h5 {
      position: absolute;
      text-align: center;
      font-size: ${_sizeBeverage / 10}rem;
      opacity: 1 !important;
      font-weight: 600;
      right: .5rem;
      bottom: .5rem;
      color: ${props => props.status === "active" ? "#fff" : props.theme.primary };
      margin: .7rem;
    }
  }
  #indicators {
    position: absolute;
    right: 0;
    top: 10px;
    img {
      width: 2rem;
      margin-right: 10px;
    }
  }
  #overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 91, 195, .9);
    border-radius: 0.7rem;
    h4 {
      word-wrap: break-word;
      margin-top: calc(50% - .75rem);
      color: #fff;
      text-align: center;
      font-size: 1.5rem;
    }
  }
`;

interface GridProps { numElement?: number; }
export const Grid = styled<GridProps, "div">("div")`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: auto;
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

export const BeveragesAnimated = [
  posed(Beverage)({
    close: {
      transform: "scale(1) translate3d(62.8vw, -7.5rem, 0px)",
      delay: 100
    },
    open: {
      transform: "scale(1.2) translate3d(0vw, 0rem, 0px)",
      delay: 50
    }
  }),
  posed(Beverage)({
    close: {
      transform: "scale(1) translate3d(36.5vw, 10.2rem, 0px)",
      delay: 75
    },
    open: {
      transform: "scale(1.4) translate3d(0vw, 0rem, 0px)",
      delay: 75
    }
  }),
  posed(Beverage)({
    close: {
      transform: "scale(1) translate3d(10vw, 38rem, 0px)",
      delay: 50
    },
    open: {
      transform: "scale(1.2) translate3d(0vw, 0rem, 0px)",
      delay: 100
    }
  })
];


/* ==== CARDS ==== */
/* ======================================== */

interface CustomizeBeverageProps { type?: string; }
export const CustomizeBeverageCard = styled<CustomizeBeverageProps, "div">("div")`
  position: absolute;
  top: 10rem;
  left: calc(50% - 13.5rem);
  background-color: ${props => props.theme.light};
  border: 1px solid ${props => props.theme.primary};
  border-radius: 15px;
  max-width: 40vw;
  padding: 10px;
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
  top: 12rem;
  width: 14rem;
  height: 27rem;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  padding: 15px;
  border: 1px solid ${props => props.theme.primary};
  &.right {
    left: calc(15% - 6.5rem);
  }
  &.left {
    right: calc(15% - 6.5rem);
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
    font-size: 1.6rem;
    font-weight: 600;
  }
  h2 {
    font-size: 1.9rem;
    font-weight: 600;
    margin: 0;
  }
  h4 {
    font-size: 1.3rem;
    font-weight: 500;
    margin: 0;
  }
`;

/* ==== LAYOUT ==== */
/* ======================================== */

const _HeaderSlide = styled.div`
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

export const HeaderAnimated = posed(_HeaderSlide)({
  close: {
    // transform: "translate3d(0, 0px, 0)",
  },
  open: {
    // transform: "translate3d(0, 10px, 0)",
  }
});

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
  width: 75vw;
  #backdrop {
    top: 0;
    left: 0;
    height: 100vh;
    width: 75vw;
    background: rgba(0, 91, 195, .6);
  }
`;

export const ChoiceBeverageWrap = styled.section`

`;

/* ==== SLIDE ==== */
/* ======================================== */

export const Slide = styled(_Slide)`
  position: absolute;
  top: 0;
  width: 98.6vw;
  z-index: 2;
  background: ${props => props.theme.spindle};
  height: 100vh;
  #title {
    position: absolute;
    top: 7rem;
    left: 5rem;
    font-size: 2rem;
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


/* ==== HOME MAIN ==== */
/* ======================================== */

interface HomeContentProps { beverageIsSelected?: boolean; }
export const HomeContent = styled<HomeContentProps, "div">("div")`
  background-color: ${props => props.theme.secondary};
  width: "calc(100% - ${_sizeSlide})";
  height: 100vh;
  position: absolute;
  top: 0;
  left: ${_sizeSlide};
  ${Grid} {
    padding-top: 8.1rem;
  }
  ${ChoiceBeverageWrap} {
    /* filter: ${props => props.beverageIsSelected ? "blur(5px)" : null}; */
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