
import * as React from "react";
import styled, { keyframes } from "styled-components";

export const ButtonGroupWrapper = styled.div`
  position: relative;
  display: -ms-inline-flexbox;
  display: inline-flex;
  vertical-align: middle;
  background: rgba(231, 231, 231, .7);
  border-radius: 0 0 37px 37px;
  button {
    &:first-child {
      border-radius: 0 0 37px 37px;
    }
    &:last-child {
      border-radius: 0 0 37px 37px;
    }
    position: relative;
    width: 5.6rem;
    flex: 1;
    color: ${props => props.theme.primary};
    padding: 1rem .8rem;
    font-size: 1rem;
    &.selected {
      box-shadow: 0px 0px 18px 8px rgba(0,0,0,0.05);
      background: ${props => props.theme.light} !important;
      color: ${props => props.theme.primary} !important;
      font-weight: 600;
      text-transform: uppercase;
    }
    /* &:active {
      color: ${props => props.theme.primary};
      background: ${props => props.theme.light};
    } */
  }
`;

interface IOption {
  label: string;
  value: any;
}

interface ButtonGroupProps {
  options: IOption[];
  value?: any;
  label?: string;
  onChange: (value) => void;
}

interface ButtonGroupState {

}

export class ButtonGroup extends React.Component<ButtonGroupProps, ButtonGroupState> {

  render() {
    return (
      <ButtonGroupWrapper>
        {this.props.options ? this.props.options.map((e, i) =>
          <button key={i} onClick={() => this.props.onChange(e.value)} className={this.props.value === e.value ? "selected" : ""} type="button">{e.label}</button>
        ) : " --- " }
      </ButtonGroupWrapper>
    );
  }
}