
import * as React from "react";
import styled, { keyframes } from "styled-components";

interface IOption {
  label: string;
  value: any;
}

interface ButtonGroupProps {
  options: IOption[];
  value?: any;
  label?: string;
  onChange: (value) => void;
  className?: any;
  icon?: string;
}

const ButtonGroup = (props: ButtonGroupProps) => {
  const { className, label, options, onChange, value, icon } = props;
  return (
    <div className={className}>
      <div id="details">
        {icon && <img src={`icons/${icon}.svg`} />}
        {label && <label>{label}</label>}
      </div>
      <div id="buttons">
        {options ? options.map((e, i) =>
          <button key={i} onClick={() => onChange(e.value)} className={value === e.value ? "selected" : ""} type="button">{e.label}</button>
        ) : " --- " }
      </div>
    </div>
  );
};

export const ButtonGroupFull = styled(ButtonGroup)`
  margin: 15px;
  #buttons {
    position: relative;
    display: -ms-inline-flexbox;
    display: inline-flex;
    vertical-align: middle;
    border-radius: 2rem;
    button {
      position: relative;
      width: 5.6rem;
      flex: 1;
      background: ${props => props.theme.lightSail};
      color: ${props => props.theme.darkSail};
      padding: 1.2rem .8rem;
      font-size: 1rem;
      &:first-child {
        border-bottom-left-radius: 2rem;
        border-top-left-radius: 2rem;
      }
      &:last-child {
        border-bottom-right-radius: 2rem;
        border-top-right-radius: 2rem;
        &:before {
          border-right: 0;
        }
      }
      &.selected {
        box-shadow: 0px 0px 18px -1px rgba(0,0,0,0.2);
        background: ${props => props.theme.light} !important;
        color: ${props => props.theme.dark} !important;
        font-weight: 600;
      }
      &:active {
        color: ${props => props.theme.dark};
        font-weight: 600;
      }
    }
  }
`;

export const ButtonGroupBorder = styled(ButtonGroup)`
  display: flex;
  #details {
    display: flex;
    flex-direction: column;
    text-align: center;
    background: ${props => props.theme.lightSail};
    padding: 28px 10px;
    label {
      color: ${props => props.theme.dark};
      width: 6.5rem;
      font-size: .9rem;
      padding-top: .5rem;
    }
  }
  #buttons {
    position: relative;
    display: -ms-inline-flexbox;
    display: inline-flex;
    vertical-align: middle;
    padding: 30px;
    button {
      position: relative;
      width: 5.6rem;
      flex: 1;
      color: ${props => props.theme.primary};
      text-transform: capitalize;
      padding: .5rem;
      font-size: .9rem;
      border-radius: 2rem;
      &:before {
        content: '';
        position: absolute;
        top: 6.5px;
        width: 100%;
        right: -1px;
        height: calc(100% - 14px);
        z-index: 1;
      }
      &.selected {
        color: ${props => props.theme.primary} !important;
        border: 1px solid ${props => props.theme.darkSail};
        font-weight: 600;
      }
      &:active {
        color: ${props => props.theme.primary};
        border: 1px solid ${props => props.theme.darkSail};
      }
    }
  }
`;