import styled from "styled-components";
import { MButton } from "../common/Button";

export const SIZE_GROUP_LINES = 61;
export const SIZE_FULL_GROUP_LINES = 94;
export const SIZE_GROUP_WATERS = 32;

export const SIZE_GROUP_ALARM = 50;
export const SIZE_FULL_GROUP_ALARM = 84;
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
  background: ${props => props.theme.primary};
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
    top: 17px;
    left: 1.5rem;
    font-size: 1.2rem;
    text-transform: uppercase;
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