
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
      background: ${props => props.theme.primary};
      color: ${props => props.theme.light};
    }
    &:active {
      background: ${props => props.theme.secondary};
      color: ${props => props.theme.primary};
    }
  }
`;

interface IButton {
  label: string;
  value: any;
}

interface ButtonGroupProps {
  buttons: IButton[];
  selected?: number;
  tapButton: () => void;
}

interface ButtonGroupState {

}

export class ButtonGroup extends React.Component<ButtonGroupProps, ButtonGroupState> {

  onSelect = (index: number) => {
    // this.props.selected = index;
    console.log(index);
  }

  componentWillUpdate(nextProps, nextState) {
    console.log({nextProps, nextState});
  }

  render() {
    return (
      <ButtonGroupWrapper>
        {this.props.buttons ? this.props.buttons.map((b, i) =>
          <button key={i} onClick={() => this.onSelect(i)} className={this.props.selected === i ? "selected" : ""} type="button">{b.label}</button>
        ) : " --- " }
      </ButtonGroupWrapper>
    );
  }
}