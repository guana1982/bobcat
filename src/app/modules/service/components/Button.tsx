import styled from "styled-components";

const _size = 6;
interface MButtonProps { info?: string; }
export const MButton = styled<MButtonProps, "button">("button")`
  position: relative;
  width: ${_size * 1.5}rem;
  height: ${_size}rem;
  background: #D9D9D9;
  color: #1C1C1C;
  font-size: 1.2rem;
  font-weight: 500;
  margin: 1rem;
  border-radius: 1rem;
  border: 1px solid #1C1C1C;
  text-transform: uppercase;
  padding: .5rem;
  &:active {
    background: #D9D9D9;
    color: #1C1C1C;
    opacity: .8;
  }
  &.small {
    width: ${_size * 1.2}rem;
    height: ${_size}rem;
    font-size: 0.9rem;
    font-weight: 600;
  }
  &:before {
    display: ${props => !props.info ? "none" : null};
    content: "${props => props.info} ";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    color: #FCFCFC;
    background: #1C1C1C;
    border-radius: 0 0 .8rem .8rem;
    height: 1.6rem;
    padding-top: .5rem;
    font-size: 0.9rem;
    font-weight: 500;
  }
  padding-bottom: ${props => props.info ? "2.5rem" : null};
`;