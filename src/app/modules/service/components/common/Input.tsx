
import * as React from "react";
import styled, { keyframes } from "styled-components";

export enum InputTheme {
  Dark = "dark",
  Light = "light"
}

export const InputWrapper = styled.div`
  position: relative;
  display: -ms-inline-flexbox;
  display: inline-flex;
  vertical-align: middle;
  input {
    text-align: center;
    border: 1px solid  ${props => props.theme.dark};
    /* width: 100%;
    height: 100px; */
    border-radius: 12px;
    padding: 7px;
    /* margin: 30px; */
    font-size: 20px;
    box-sizing: border-box;
    &:disabled {
      background: #fff;
    }
  }
`;

export const InputContent = styled.div`
  /* margin: 15px; */
  display: flex;
  justify-content: flex-end;
  align-items: center;
  &.${InputTheme.Light} {
    label {
      color: ${props => props.theme.light} !important;
    }
  }
  label {
    display: inline-block;
    color: ${props => props.theme.dark};
    text-transform: capitalize;
    text-align: right;
    /* width: 6.5rem; */
    font-size: 1.2rem;
    /* text-align: left; */
    font-weight: 600;
    margin-right: 10px;
  }
  &.selected {
    input {
      border: 3px solid  darkblue;
    }
  }
  &.small {
    ${InputWrapper} {
      height: 30px;
      input {
        width: 200px;
        border-radius: 10px;
      }
    }
  }
`;

interface MInputProps {
  value?: any;
  label?: string;
  type?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
  themeMode?: InputTheme;
  selected?: boolean;
  onChange?: (value) => void;
  click?: () => void;
}

interface MInputState {

}

export const MInput = (props: MInputProps) => {
    const { label, value, type, onChange, disabled, className, themeMode, selected, required } = props;
    return (
      <InputContent className={`${themeMode} ${className} ${selected ? "selected" : null}`}>
        {label && <label>{label}{required && "*"}</label>}
        <InputWrapper onClick={props.click}>
          <input
            // disabled={disabled} // <= TO FIX
            disabled
            value={value}
            type={type}
            onChange={onChange}
          />
        </InputWrapper>
      </InputContent>
    );
};