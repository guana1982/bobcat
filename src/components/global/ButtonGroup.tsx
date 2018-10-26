
import * as React from "react";
import styled, { keyframes } from "styled-components";

export const ButtonGroupWrapper = styled.div`
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
      background: ${props => props.theme.primary} !important;
      color: ${props => props.theme.light} !important;
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