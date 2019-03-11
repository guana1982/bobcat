import * as React from "react";
import styled from "styled-components";
import { __ } from "@utils/lib/i18n";
import { AlertContext, DEFAULT_TIMEOUT_ALERT } from "@core/containers/alert.container";
import { AccessibilityContext } from "@core/containers";

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

export interface AlertProps {}

let timeout_ = null;

export const Alert = (props: AlertProps) => {

  const alertConsumer = React.useContext(AlertContext);
  const {show, options} = alertConsumer.state;
  const {type, onDismiss, timeout} = options;

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
        <AlertWrap>
          {__(type)}
        </AlertWrap>
      </AlertContent>}
    </React.Fragment>
  );
};