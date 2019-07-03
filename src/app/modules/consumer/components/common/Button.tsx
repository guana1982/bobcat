
import * as React from "react";
import styled from "styled-components";
import { __ } from "@core/utils/lib/i18n";

export const ButtonWrap = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  font-family: NeuzeitGro-Bol;
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
    #icon {
      margin-bottom: 15px;
    }
  }
  #icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
  }
  #text {
    color: ${props => props.theme.slateGrey};
    font-size: 16px;
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
    <ButtonWrap className={text ? "large" : "small"} id={detectValue} disabled={disabled} onTouchStart={onClick}>
      <div id="icon">
        <img src={`icons/${icon}.svg`} />
      </div>
      <span id="text">{__(text)}</span>
    </ButtonWrap>
  );
};