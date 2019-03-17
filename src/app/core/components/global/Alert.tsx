import * as React from "react";
import styled from "styled-components";
import { __ } from "@utils/lib/i18n";
import { AlertContext, DEFAULT_TIMEOUT_ALERT } from "@core/containers/alert.container";
import { AccessibilityContext } from "@core/containers";
import { CloseBtn, CloseBtnWrap } from "./CloseBtn";

const AlertWrap = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 267.7px;
  height: 268px;
  color: ${props => props.theme.slateGrey};
  border-radius: 1rem;
  padding: 1rem;
  font-weight: 600;
  font-size: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 999;
  &:before {
    content: " ";
    z-index: -1;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    opacity: 0.2;
    background-image: linear-gradient(to bottom, #eeeeee, #cbcfda);
  }
  &>#title {
    width: 433px;
    text-transform: uppercase;
    line-height: 1.5;
    letter-spacing: 1.6px;
    text-align: center;
    height: 30px;
    font-size: 22px;
  }
  &>#sub-title {
    margin-top: 5px;
    width: 433px;
    font-size: 20px;
    line-height: 1.5;
    text-align: center;
  }
`;

const Overlay = styled.div`
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: ${props => props.theme.backgroundLight};
`;

const AlertContent = styled.div`
  z-index: 999;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  ${CloseBtnWrap} {
    position: absolute;
    top: 26.5px;
    right: 27px;
  }
`;

export interface AlertProps {}

let timeout_ = null;

export const Alert = (props: AlertProps) => {

  const alertConsumer = React.useContext(AlertContext);
  const {show, options} = alertConsumer.state;
  const {type, onDismiss, timeout, title, subTitle} = options;

  //  ==== ACCESSIBILITY FUNCTION ====>
  const accessibilityConsumer = React.useContext(AccessibilityContext);
  const { changeStateLayout, enter } = accessibilityConsumer;

  React.useEffect(() => {
    changeStateLayout({
      alertShow: show
    });
  }, [show]);

  React.useEffect(() => {
    if (enter && show) {
      onDismiss_();
    }
  }, [enter, show]);
  //  <=== ACCESSIBILITY FUNCTION ====

  const onDismiss_ = () => {
    onDismiss();
    alertConsumer.hide();
  };

  if (timeout) {
    timeout_ = setTimeout(onDismiss_, typeof timeout === "boolean" ? DEFAULT_TIMEOUT_ALERT : timeout);
  }

  const stopTimeout = () => {
    if (timeout_) {
      window.clearTimeout(timeout_);
    }
  };

  const dismiss = () => {
    stopTimeout();
    onDismiss_();
  };

  return (
    <React.Fragment>
      {show && <AlertContent>
        <Overlay onClick={dismiss} />
        <CloseBtn detectValue={"alert_close"} icon={"close"} onClick={dismiss} />
        <AlertWrap>
          <span id="title">{__(title || type)}</span>
          {subTitle && <span id="sub-title">{__(subTitle)}</span>}
        </AlertWrap>
      </AlertContent>}
    </React.Fragment>
  );
};