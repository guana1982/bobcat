
import * as React from "react";
import styled from "styled-components";
import { AccessibilityContext } from "@core/containers";

export const ButtonGroupWrapper = styled.div`
  position: relative;
  display: -ms-inline-flexbox;
  display: inline-flex;
  vertical-align: middle;
  border: 2px solid ${props => props.theme.primary};
  /* width: 17rem; */
  border-radius: 12px;
  button {
    &:first-child {
      border-bottom-left-radius: 10px;
      border-top-left-radius: 10px;
    }
    &:last-child {
      border-bottom-right-radius: 10px;
      border-top-right-radius: 10px;
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
      z-index: 1;
    }
    position: relative;
    width: 5.6rem;
    flex: 1;
    color: ${props => props.theme.primary};
    background: ${props => props.theme.light};
    padding: 1rem .8rem;
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

const ButtonGroupContent = styled.div`
  margin: 15px;
  label {
    display: inline-block;
    color: ${props => props.theme.primary};
    text-transform: capitalize;
    width: 6.5rem;
    padding: .8rem 0;
    font-size: 1.2rem;
    text-align: left;
    font-weight: 600;
  }
`;

interface IOption {
  label: string;
  value: any;
}

interface ButtonGroupProps {
  detectValue?: string;
  options: IOption[];
  value?: any;
  label?: string;
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


    return (
      <ButtonGroupContent>
        {props.label &&
          <button id={enableId ? `${props.detectValue}-button_group` : null} disabled={props.disabled} onClick={() => enableAccessibility()}>
            <label>{props.label}</label>
          </button>
        }
        <ButtonGroupWrapper>
          {props.options ? props.options.map((e, i) =>
            <button
              disabled={props.disabled}
              type="button"
              id={enableId ? `${props.detectValue}-option` : null} key={i}
              onClick={() => props.onChange(e.value)}
              className={props.value === e.value ? "selected" : ""}
            >
              {e.label}
            </button>
          ) : " --- " }
        </ButtonGroupWrapper>
      </ButtonGroupContent>
    );

};