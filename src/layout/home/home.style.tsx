import styled from "styled-components";

export const HomeContent = styled.div`
  background-color: ${props => props.theme.secondary};
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
`;

export const Header = styled.div`
  padding: 1.5rem;
  h2 {
    margin: 0;
    color: ${props => props.theme.primary};
  }
`;

interface BeverageProps { size?: string; status?: string; type?: string; }
export const Beverage = styled<BeverageProps, "div">("div")`
  padding: 1rem .7rem;
  transition: 1s all;
  transition-property: width, height, left, top;
  will-change: width, height, left, top;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  pointer-events: default;
  flex-basis: 100%;
  flex: 10rem;
  height : ${props => props.size === "large" ? "100%" : "50%" };
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
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 30%;
      background-repeat: no-repeat;
      background-image: url("img/${props => props.type}.svg");
    }
    h3 {
      padding-top: 50%;
      margin: .5rem;
      &:before {
        content: "${props => props.type} ";
        display: block;
        text-transform: uppercase;
        font-size: 80%;
        font-weight: 400;
      }
    }
    h5 {
      position: absolute;
      bottom: 0;
      color: ${props => props.status === "active" ? "#fff" : props.theme.primary };
      margin: .7rem;
      text-align: left;
    }
  }
`;

export const Col = styled.div``;

export const Grid = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  text-align: center;
  justify-content: space-around;
  padding: .5rem 3rem;
  height: 68vh;
  width: 100%;
  ${Col} {
    /* height: 25rem;
    width: 14rem; */
    height: 100%;
    width: 14.2%;
  }
`;

export const Footer = styled.div`
  h2 {
    color: ${props => props.theme.primary};
  }
`;


export const CustomizeBeverageCard = styled.div`
  img {
    max-width: 25vw;
  }
  h2 {
    color: ${props => props.theme.primary};
    font-size: 3rem;
    margin: 2rem 0;
  }
`;

export const InfoCard = styled.div`

`;

const _sizePour = 105;
export const Pour = styled.button`
  position: absolute;
  bottom: ${-_sizePour / 10}px;
  right: calc(50vw - ${_sizePour}px);
  color: ${props => props.theme.primary};
  background: ${props => props.theme.sail};
  height: ${_sizePour}px;
  width: ${_sizePour * 2}px;
  border-top-left-radius: ${_sizePour * 2}px;
  border-top-right-radius: ${_sizePour * 2}px;
  font-size: ${_sizePour / 5}px;
  font-weight: 600;
  &:active {
    color: ${props => props.theme.light};
    background: ${props => props.theme.primary};
  }
`;


const _sizeCircleBtn = 40;
interface CircleBtnProps { bgColor?: string; color?: string; icon: string; }
export const CircleBtn = styled<CircleBtnProps, "div">("div")`
  background: ${props => props.theme[props.bgColor]};
  width: ${_sizeCircleBtn}px;
  height: ${_sizeCircleBtn}px;
  border-radius: 50%;
  &:before {
    display: inline-block;
    width: 50%;
    height: 50%;
    margin-top: 25%;
    margin-left: 25%;
    content: "";
    background: url(${props => props.icon}) no-repeat 0 0;
    background-size: 100%;
    background-position: center;
  }
`;