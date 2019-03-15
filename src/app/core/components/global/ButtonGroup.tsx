
import * as React from "react";
import styled from "styled-components";
import { AccessibilityContext } from "@core/containers";

const ButtonGroupContent = styled.div`
  display: flex;
  align-items: center;
  width: 550px;
  height: 37px;
  margin: 13px 0;
  #info {
    width: 182.2px;
    button {
      display: flex;
      align-items: center;
      margin-left: 20.3px;
      padding: 5px;
      border-radius: 8px;
      img {
        width: 25px;
        height: 25px;
      }
      span {
        width: 86.7px;
        height: 16px;
        font-size: 16px;
        margin-left: 20.3px;
        color: ${props => props.theme.slateGrey};
        text-transform: capitalize;
        text-align: left;
      }
    }
  }
  #select {
    position: relative;
    display: -ms-inline-flexbox;
    display: inline-flex;
    vertical-align: middle;
    button {
      position: relative;
      width: 5.6rem;
      flex: 1;
      width: 79.4px;
      height: 25px;
      border-radius: 8px;
      margin: 0 6px 0 0;
      &:disabled {
        opacity: .2;
      }
      &:first-child {
        margin-left: 6px;
      }
      &:before {
        position: absolute;
        left: 0;
        top: 10px;
        content: "";
        background: rgba(241, 241, 241, .8);
        width: 79.4px;
        height: 5px;
      }
      &.selected:before {
        background: ${props => props.theme.slateGrey} !important;
      }
      &:active:before {
        background: rgba(241, 241, 241, .8);
      }
    }
  }
  #value {
    text-align: right;
    width: 77px;
    font-size: 12px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: ${props => props.theme.slateGrey} !important
  }
`;

interface IOption {
  label: string;
  value: any;
}

interface ButtonGroupProps {
  detectValue?: string;
  icon?: string;
  label?: string;
  options: IOption[];
  value?: any;
  disabled?: boolean;
  onChange: (value) => void;
  children?: any;
}

export const ButtonGroup = (props: ButtonGroupProps) => {

  //  ==== ACCESSIBILITY FUNCTION ====>
  const enableId = props.detectValue !== undefined;
  const accessibilityConsumer = React.useContext(AccessibilityContext);
  const { changeStateLayout } = accessibilityConsumer;

  const enableAccessibility = () => {
    changeStateLayout({
      buttonGroupSelected: props.detectValue
    });
  };
  //  <=== ACCESSIBILITY FUNCTION ====

  const indexValue = props.options .map(option => option.value).indexOf(props.value);

  return (
    <ButtonGroupContent>
      <div id="info">
        {props.label &&
          <button id={enableId ? `${props.detectValue}-button_group` : null} disabled={props.disabled} onClick={() => enableAccessibility()}>
            <img src={`icons/${props.icon}.svg`} />
            <span>{props.label}</span>
          </button>
        }
      </div>
      <div id="select">
        {props.options ? props.options.map((e, i) =>
          <button
            disabled={props.disabled}
            type="button" key={i}
            id={enableId ? `${props.detectValue}-option` : null}
            onClick={() => props.onChange(e.value)}
            className={i <= indexValue ? "selected" : ""}
          />
        ) : " --- " }
      </div>
      <div id="value">
        <span>{props.options && props.options[indexValue].label}</span>
      </div>
    </ButtonGroupContent>
  );

};