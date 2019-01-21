
import * as React from "react";
import styled from "styled-components";

const _sizeButton = 60;

export enum ButtonTypes {
  Primary = "primary",
  Secondary = "secondary",
  Transparent = "transparent"
}

export const ButtonWrap = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${_sizeButton}px;
  width: ${_sizeButton * 2}px;
  border-radius: 30px;
  font-size: ${_sizeButton / 3.5}px;
  font-weight: 600;
  img {
    width: ${_sizeButton / 2}px;
    margin-left: .5rem;
  }
  &.${ButtonTypes.Primary} {
    background: ${props => props.theme.primary};
    color: ${props => props.theme.light};
  }
  &.${ButtonTypes.Secondary} {
    background: ${props => props.theme.secondary};
    color: ${props => props.theme.primary};
  }
  &.${ButtonTypes.Transparent} {
    background: ${props => props.theme.transparent};
    color: ${props => props.theme.primary};
  }
  &:active {
    opacity: .7;
  }
`;

interface ButtonProps {
  type: ButtonTypes;
  text?: string;
  icon?: string;
}

export const Button = (props: ButtonProps) => (
  <ButtonWrap className={props.type}>
    {props.text}
    <img src={`icons/${props.icon}.svg`} />
  </ButtonWrap>
);