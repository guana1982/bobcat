import * as React from "react";
import styled from "styled-components";
import { __ } from "@utils/lib/i18n";

export const DEFAULT_TIMEOUT_ALERT = 6000;

export enum AlertTypes {
  Success = "success",
  Error = "error",
  OutOfStock = "Out Of Stock"
}

const AlertWrap = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 350px;
  height: 200px;
  box-shadow: 0px 0px 24px -4px ${props => props.theme.primary};
  background-color: ${props => props.theme.light};
  color: ${props => props.theme.primary};
  border-radius: 1rem;
  padding: 1rem;
  font-weight: 600;
  font-size: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const Overlay = styled.div`
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,91,195,.6);
`;

const AlertContent = styled.div`
  z-index: 999;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

export interface AlertProps {
  type: AlertTypes;
  timeout?: boolean | number;
  onDismiss?: () => void;
}

export const Alert = (props: AlertProps) => {
  const {type, onDismiss, timeout} = props;
  let timeout_ = null;
  if (timeout) {
    timeout_ = setTimeout(onDismiss, typeof timeout === "boolean" ? DEFAULT_TIMEOUT_ALERT : timeout);
  }

  // console.log(timeout_);
  const stopTimeout = () => {
    if (timeout_) {
      window.clearTimeout(timeout_);
    }
  };

  const dismiss = () => {
    stopTimeout();
    onDismiss();
  };

  return (
    <AlertContent>
      <Overlay onClick={dismiss} />
      <AlertWrap>
        {__(type)}
      </AlertWrap>
    </AlertContent>
  );
};