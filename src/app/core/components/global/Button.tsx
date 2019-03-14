
import * as React from "react";
import styled from "styled-components";

export const ButtonWrap = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  &:active {
    opacity: .7;
  }
  &.small {
    margin: 10px;
    width: 44px;
    height: 48px;
  }
  &.large {
    width: 98px;
    height: 93px;
    img {
      padding-bottom: 18px;
    }
  }
  span {
    color: ${props => props.theme.slateGrey};
    text-transform: capitalize;
  }
`;

interface ButtonProps {
  text?: string;
  icon?: string;
  onClick?: () => void;
  disabled?: boolean;
  detectValue?: string;
}

export const Button = (props: ButtonProps) => {
  const {text, icon, onClick, disabled, detectValue} = props;
  return (
    <ButtonWrap className={text ? "large" : "small"} id={detectValue} disabled={disabled} onClick={onClick}>
      <img src={`icons/${icon}.svg`} />
      <span>{text}</span>
    </ButtonWrap>
  );
};