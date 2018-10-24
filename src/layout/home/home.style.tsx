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
  padding: 2.5rem;
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

export const ButtonGroup = styled.div`
  position: relative;
  display: -ms-inline-flexbox;
  display: inline-flex;
  vertical-align: middle;
  border: 2px solid ${props => props.theme.primary};
  button {
    color: ${props => props.theme.primary};
    background: ${props => props.theme.light};
    padding: 1rem;
    &.selected {
      background: ${props => props.theme.primary};
      color: ${props => props.theme.light};
    }
    &:active {
      background: ${props => props.theme.secondary};
      color: ${props => props.theme.primary};
    }
  }
`;

export const Footer = styled.div`
  h2 {
    color: ${props => props.theme.primary};
  }
`;