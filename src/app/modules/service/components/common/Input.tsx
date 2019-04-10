
import * as React from "react";
import styled, { keyframes } from "styled-components";

export const InputWrapper = styled.div`
  position: relative;
  display: -ms-inline-flexbox;
  display: inline-flex;
  vertical-align: middle;
  input {
    /* width: 100%;
    height: 100px; */
    border-radius: 15px;
    padding: 10px;
    margin: 30px;
    font-size: 20px;
    border: none;
    box-sizing: border-box;
  }
`;

const InputContent = styled.div`
  /* margin: 15px; */
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

interface MInputProps {
  value?: any;
  label?: string;
  type?: string;
  onChange: (value) => void;
}

interface MInputState {

}

export const MInput = (props: MInputProps) => {
    const { label, value, type, onChange } = props;
    return (
      <InputContent>
        {label && <label>{label}</label>}
        <InputWrapper>
          <input
            value={value}
            type={type}
            onChange={onChange}
          />
        </InputWrapper>
      </InputContent>
    );
};