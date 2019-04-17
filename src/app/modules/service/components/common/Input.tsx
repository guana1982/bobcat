
import * as React from "react";
import styled, { keyframes } from "styled-components";

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
  }
`;

export const InputContent = styled.div`
  /* margin: 15px; */
  label {
    display: inline-block;
    color: ${props => props.theme.dark};
    text-transform: capitalize;
    /* width: 6.5rem; */
    font-size: 1.2rem;
    text-align: left;
    font-weight: 600;
    margin-right: 10px;
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
  onChange?: (value) => void;
}

interface MInputState {

}

export const MInput = (props: MInputProps) => {
    const { label, value, type, onChange, disabled, className } = props;
    return (
      <InputContent className={className}>
        {label && <label>{label}</label>}
        <InputWrapper>
          <input
            disabled={disabled}
            value={value}
            type={type}
            onChange={onChange}
          />
        </InputWrapper>
      </InputContent>
    );
};