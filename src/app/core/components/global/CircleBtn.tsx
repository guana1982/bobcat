
import * as React from "react";
import styled, { keyframes } from "styled-components";
import { FocusElm } from "@containers/accessibility.container";

const _sizeCircleBtn = 60;
export const CircleBtnWrapper = styled.div`
  position: relative;
  background: ${props => props.theme[props.bgColor]};
  width: ${_sizeCircleBtn}px;
  height: ${_sizeCircleBtn}px;
  margin: auto;
  border-radius: 50%;
  border: ${props => props.border ? `1px solid ${props.theme[props.color]}` : null};
  &:before {
    position: absolute;
    display: flex;
    width: 50%;
    height: 50%;
    margin-top: 25%;
    margin-left: 25%;
    content: "";
    mask-size: cover;
    mask: url(${props => props.icon}) no-repeat 0 0;
    background-size: 100%;
    background-position: center;
    background-color: ${props => props.theme[props.color]};
  }
`;

interface CircleBtnContentProps { dataBtnFocus: FocusElm; onClick?: any; }
/* dataBtnFocus: FocusElm; onClick?: any; */
export const CircleBtnContent = styled.button.attrs(props => ({
  "data-btn-focus": props.dataBtnFocus
}))`
    background: transparent;
    text-align: center;
    &:active {
      background: transparent;
      ${CircleBtnWrapper} {
        background: ${props => props.theme.primary};
        &:before {
          background-color: #fff;
        }
      }
    }
    small {
      color: ${props => props.theme.primary};
      font-weight: 500;
      font-size: 1rem;
    }
`;

interface CircleBtnProps {
  bgColor?: string;
  border?: boolean;
  label?: string;
  color?: string;
  icon: string;
  onClick?: any;
  dataBtnFocus?: FocusElm;
}

interface CircleBtnState {

}

export class CircleBtn extends React.Component<CircleBtnProps, CircleBtnState> {
  render() {
    const { dataBtnFocus, label, onClick } = this.props;
    return (
      <CircleBtnContent onClick={onClick} dataBtnFocus={dataBtnFocus}>
        <CircleBtnWrapper {...this.props} />
        <small>{label}</small>
      </CircleBtnContent>
    );
  }
}