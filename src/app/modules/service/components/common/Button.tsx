import styled from "styled-components";

export enum MTypes {
  INFO_SUCCESS = "success",
  INFO_WARNING = "warning",
  INFO_DANGER = "danger"
}

const _size = 6;
interface MButtonProps { info?: any; type?: MTypes; light: boolean; visibled: boolean; }
export const MButton = styled<MButtonProps, "button">("button")`
  position: relative;
  width: ${_size * 1.5}rem;
  height: ${_size}rem;
  background: ${props => props.theme[props.light ? "light" : "secondary"]};
  opacity: ${props => props.visibled ? 1 : null};
  color: ${props => props.theme.dark};
  font-size: 1rem;
  font-weight: 500;
  margin: .7rem;
  border-radius: 1rem;
  border: 1px solid ${props => props.theme.dark};
  text-transform: uppercase;
  padding: .3rem;
  white-space: pre-wrap;
  &:disabled &:active  {
    background: ${props => props.theme[props.light ? "light" : "secondary"]};
  }
  &:active {
    background: ${props => props.theme.secondary};
    color: ${props => props.theme.dark};
    opacity: .8;
  }
  &.small {
    width: ${_size * 1.2}rem;
    height: ${_size}rem;
    font-size: 0.9rem;
    /* font-weight: 600; */
  }
  &:before {
    display: ${props => props.info ? null : "none"};
    content: "${props => props.info !== true ? props.info : null} ";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    color: ${props => props.theme.light};
    background: ${props => props.theme[props.type ? props.type : "dark"]};
    border-radius: 0 0 .9rem .9rem;
    height: 1.6rem;
    padding-top: .5rem;
    font-size: 0.9rem;
    font-weight: 500;
  }
  p {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  padding-bottom: ${props => props.info ? "2.5rem" : null};
`;