
import * as React from "react";
import styled, { keyframes } from "styled-components";
import { MButton } from "./Button";

const ButtonGroupContent = styled.div`
  margin: 15px;
  label {
    display: inline-block;
    color: ${props => props.theme.primary};
    text-transform: capitalize;
    width: 6.5rem;
    font-size: 1.2rem;
    text-align: left;
    font-weight: 600;
  }
`;

interface IOption {
  label: string;
  value: any;
}

interface MButtonGroupProps {
  options: IOption[];
  value?: any;
  label?: string;
  onChange: (value) => void;
}

interface MButtonGroupState {

}

export class MButtonGroup extends React.Component<MButtonGroupProps, MButtonGroupState> {

  render() {
    return (
      <div>
          {this.props.options ? this.props.options.map((e, i) =>
            <MButton key={i} onClick={() => this.props.onChange(e.value)} type="button">{e.label}</MButton>
          ) : " --- " }
      </div>
    );
  }
}