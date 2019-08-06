
import * as React from "react";
import styled, { keyframes } from "styled-components";

/* onClick?: any; */
export const CloseBtnWrap = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 22px;
    height: 22px;
  }
`;

interface CloseBtnProps {
  // bgColor?: string;
  // border?: boolean;
  // label?: string;
  // color?: string;
  icon: string;
  onClick?: any;
  detectValue?: string;
}

export const CloseBtn = (props: CloseBtnProps) => {
  const { icon, onClick, detectValue } = props;
  return (
    <CloseBtnWrap id={detectValue} onClick={onClick}>
      <img src={`icons/${icon}.svg`} />
    </CloseBtnWrap>
  );
};