
import * as React from "react";
import styled, { keyframes } from "styled-components";

const ButtonGroupContent = styled.div`
  margin: 20px;
  label {
    display: inline-block;
    color: ${props => props.theme.primary};
    text-transform: capitalize;
    width: 8rem;
    font-size: 1.1rem;
    text-align: left
  }
`;

export const ButtonGroupWrapper = styled.div`
  position: relative;
  display: -ms-inline-flexbox;
  display: inline-flex;
  vertical-align: middle;
  border: 2px solid ${props => props.theme.primary};
  width: 15rem;
  border-radius: 12px;
  button {
    &:first-child {
      border-radius: 10px 0 0 10px;
    }
    &:last-child {
      border-radius: 0 10px 10px 0;
      &:before {
        border-right: 0;
      }
    }
    &:before {
      content: '';
      position: absolute;
      top: 6.5px;
      width: 100%;
      right: -1px;
      height: calc(100% - 14px);
      border-right: ${props =>  `2px solid ${props.theme.primary}` };
      z-index: 100;
    }
    position: relative;
    flex: 1;
    color: ${props => props.theme.primary};
    background: ${props => props.theme.light};
    padding: .8rem;
    font-size: 1rem;
    &.selected {
      background: ${props => props.theme.sail} !important;
      color: ${props => props.theme.primary} !important;
      font-weight: 600;
    }
    &:active {
      color: ${props => props.theme.primary};
      background: ${props => props.theme.light};
    }
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
      <ButtonGroupContent>
        {this.props.label && <label>{this.props.label}</label>}
        <ButtonGroupWrapper>
          {this.props.options ? this.props.options.map((e, i) =>
            <button key={i} onClick={() => this.props.onChange(e.value)} className={this.props.value === e.value ? "selected" : ""} type="button">{e.label}</button>
          ) : " --- " }
        </ButtonGroupWrapper>
      </ButtonGroupContent>
    );
  }
}