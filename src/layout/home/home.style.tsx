import styled from "styled-components";
import { ButtonGroupWrapper } from "../../components/global/ButtonGroup";
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

// export const TimerLabel = styled.p`
//   position: absolute;
//   right: 0;
//   bottom: 0;
//   background-color: ${props => props.theme.primary};
//   color: #fff;
//   padding: .5rem;
//   font-size: 1rem;
//   margin: 0;
// `;

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

/* ==== GRID ==== */
/* ======================================== */

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
      default:
        return "1150px";
        break;
    }
  }};
`;

/* ==== CARDS ==== */
/* ======================================== */
const _sizeBeverageCard = 410;
interface CustomizeBeverageProps { type?: string; }
export const CustomizeBeverageCard = styled<CustomizeBeverageProps, "div">("div")`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  left: calc(50% - ${_sizeBeverageCard / 2}px);
  background-color: ${props => props.theme.light};
  border: 1px solid ${props => props.theme.primary};
  border-radius: 15px;
  width: ${_sizeBeverageCard}px;
  padding: 10px;
  min-height: ${_sizeBeverageCard * 1.2}px;
  header {
    position: relative;
    padding: 1rem;
    &:before {
      content: " ";
      opacity: .7;
      position: absolute;
      left: calc(50% - 8rem);
      top: 20%;
      width: 100%;
      max-width: 16rem;
      height: 100%;
      background-repeat: no-repeat;
      background-image: url("img/${props => props.type}.svg");
    }
    h2 {
      position: relative;
      padding-top: 2rem;
      font-size: 3rem;
      margin: .5rem;
      color: ${props => props.theme.primary };
      &:before {
        position: absolute;
        content: "${props => props.type} ";
        font-size: 1.8rem;
        top: 0;
        display: block;
        text-transform: uppercase;
        font-weight: 400;
      }
    }
    h6 {
      position: relative;
      font-size: 1rem;
      left: .7rem;
      margin: 0;
      color: ${props => props.theme.primary };
    }
  }
  aside {
    min-height: 246px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-bottom: 1rem;
  }
`;

export const InfoCard = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgb(166, 202, 237);
  color: rgb(37, 107, 192);
  text-align: center;
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
  justify-content: flex-end;
  padding: 2rem;
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
  /* height: 100vh;
  width: 75vw; */
  #backdrop {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
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