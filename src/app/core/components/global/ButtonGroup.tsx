
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
}

const ButtonGroup = (props: ButtonGroupProps) => {
  const { className, label, options, onChange, value } = props;
  return (
    <div className={className}>
      {label && <label>{label}</label>}
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
  #buttons {
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
  }
`;