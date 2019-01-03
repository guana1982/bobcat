import styled from "styled-components";
import posed from "react-pose";
import { MButton } from "../../components/Button";

/* ==== COMPONENTS ==== */
/* ======================================== */

// const _sizeButton = 60;
// interface ButtonProps { icon?: string; text?: string; }
// export const Button = styled<ButtonProps, "button">("button")`
//   height: ${_sizeButton}px;
//   width: ${_sizeButton * 2}px;
//   border-radius: 30px;
//   font-size: ${_sizeButton / 4}px;
//   font-weight: 600;
//   &:before {
//     content: "${props => props.text}";
//   }
//   &, &:active {
//     color: ${props => props.theme.light};
//     background: ${props => props.theme.primary};
//   }
//   &:active {
//     opacity: .7;
//   }
// `;


/* ==== GRID ==== */
/* ======================================== */

export const SIZE_GROUP_ALARM = 50;
export const SIZE_GROUP_INFO = 33;

export const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: auto;
  height: 98%;
  padding-top: 1%;
  #exit-btn {
    height: auto;
    margin: .5rem;
    width: ${92 - SIZE_GROUP_ALARM - SIZE_GROUP_INFO}%;
  }
`;

interface GroupProps { size?: number; title?: string; }
export const Group = styled<GroupProps, "div">("div")`
  /* max-height: 25%; */
  position: relative;
  background: #E7E7E7;
  border-radius: 1rem;
  margin: .5rem;
  padding: .5rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  align-items: center;
  width: ${props => props.size ? `${props.size}%` : `94%`};
  padding-top: 2.5rem;
  &:before {
    position: absolute;
    top: 10%;
    left: 1.5rem;
    font-size: 1.2rem;
    content: "${props => props.title} ";
  }
  &:first-child {
    ${MButton} {
      margin-right: .3rem;
    }
  }
  &#info-group {
    padding: 0;
    ul {
      list-style-type: none;
      padding-left: 2rem;
      margin: 0;
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      flex-direction: column;
      li {
        margin: 0rem;
        font-size: 1.1rem;
      }
    }
  }
`;

/* ==== LAYOUT ==== */
/* ======================================== */

/* ==== MENU MAIN ==== */
/* ======================================== */

interface HomeContentProps { beverageIsSelected?: boolean; }
export const MenuContent = styled<HomeContentProps, "div">("div")`
  background: #1C1C1C;
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
`;