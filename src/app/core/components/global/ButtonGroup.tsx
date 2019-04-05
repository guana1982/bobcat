
import * as React from "react";
import styled from "styled-components";
import { AccessibilityContext } from "@core/containers";

const ButtonGroupContent = styled.div`
  display: flex;
  align-items: center;
  width: 550px;
  height: 37px;
  margin: 20px 0;
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
        font-family: NeuzeitGro-Bol;
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
    margin-right: 16px;
    width: 375px;
    border-radius: 22px;
    height: 33px;
    box-shadow: inset 0 1px 4px 0 rgba(212, 212, 212, 0.5);
    background-color: #f3f3f3;
    button {
      position: relative;
      flex: 1;
      width: 125px;
      height: 33px;
      width: 125px;
      height: 33px;
      display: flex;
      justify-content: center;
      align-items: center;
      &.active:disabled {
        span {
          display: none;
        }
      }
      &:first-child{
        border-top-left-radius: 17px;
        border-bottom-left-radius: 17px;
      }
      &.selected {
        border-top-right-radius: 17px;
        border-bottom-right-radius: 17px;
        text-transform: uppercase;
      }
      &.active, &.selected {
        background: ${props => props.color};
        /* box-shadow: 20px -25px 34px -14px rgba(51, 56, 73, 0.08), 5px 2px 10px 0 rgba(190, 190, 190, 0.22), 0 3px 6px 0 ${props => props.color}; */
        span {
          color: #fff;
        }
      }
      span {
        font-family: NeuzeitGro-Bol;
        font-size: 16px;
        height: 13px;
        color: ${props => props.theme.slateGrey};
      }
    }
  }
  /* #value {
    text-align: right;
    width: 77px;
    font-size: 12px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: ${props => props.theme.slateGrey} !important
  } */
`;

interface IOption {
  label: string;
  value: any;
}

interface ButtonGroupProps {
  detectValue?: string;
  icon?: string;
  label?: string;
  color?: string;
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
    <ButtonGroupContent color={props.color}>
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
            className={`${i < indexValue && "active"} ${i === indexValue && "selected"}`}
          >
            <span>{props.options && props.options[i].label}</span>
          </button>
        ) : " --- " }
      </div>
      {/* <div id="value">
        <span>{props.options && props.options[indexValue].label}</span>
      </div> */}
    </ButtonGroupContent>
  );

};