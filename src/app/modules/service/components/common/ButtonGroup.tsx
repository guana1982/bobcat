
import * as React from "react";
import styled, { keyframes } from "styled-components";
import { MButton, MTypes } from "./Button";

const ButtonGroupContent = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  /* margin: 15px;
  label {
    display: inline-block;
    color: ${props => props.theme.primary};
    text-transform: capitalize;
    width: 6.5rem;
    font-size: 1.2rem;
    text-align: left;
    font-weight: 600;
  } */
`;

export interface IOption {
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

export const MButtonGroup = (props: MButtonGroupProps) => (
  <ButtonGroupContent>
      {props.options ? props.options.map((e, i) =>
        <MButton
          key={i} light
          onClick={() => props.onChange(e.value)}
          info type={props.value === e.value ? MTypes.INFO_SUCCESS : null}>
          {e.label}
        </MButton>
      ) : " --- " }
  </ButtonGroupContent>
);