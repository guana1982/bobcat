import styled from "styled-components";

export const HomeContent = styled.div`
  background-color: ${props => props.theme.light};
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
`;

export const Header = styled.div`
  padding: 3rem;
  h2 {
    margin: 0;
    color: ${props => props.theme.primary};
  }
`;

interface BeverageProps { size?: string; status?: string; }
export const Beverage = styled<BeverageProps, "div">("div")`
  padding: 1rem;
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
    background-color: ${props => props.theme[props.status === "active" ? "primary" : "secondary"] };
    width: 100%;
    border-radius: 8px;
    color: #0034B0;
    height: 100%;
    h3 {
      position: absolute;
      bottom: 0;
      color: ${props => props.status === "active" ? "#fff" : props.theme.primary };
      margin: 1rem;
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
  padding: .5rem 6rem;
  height: 65%;
  width: 100%;
  ${Col} {
    /* height: 25rem;
    width: 14rem; */
    height: 100%;
    width: 25%;
  }
`;

export const Footer = styled.div`
  h2 {
    color: ${props => props.theme.primary};
  }
`;