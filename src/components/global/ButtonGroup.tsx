
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

const ButtonGroupWrapper = styled.div`
  position: relative;
  display: -ms-inline-flexbox;
  display: inline-flex;
  vertical-align: middle;
  border: 2px solid ${props => props.theme.primary};
  width: 15rem;
  button {
    flex: 1;
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