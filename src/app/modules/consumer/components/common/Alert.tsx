import * as React from "react";
import styled from "styled-components";
import { __ } from "@utils/lib/i18n";
import { AlertContext, DEFAULT_TIMEOUT_ALERT, AlertOptions, AlertTypes } from "@core/containers/alert.container";
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
  &.with-img {
    img {
      width: 260px;
      height: 260px;
      margin-bottom: 40px;
    }
    &:before {
      content: none;
    }
  }
  &>#title {
    font-family: NeuzeitGro-Bol;
    width: 433px;
    text-transform: uppercase;
    line-height: 1.5;
    letter-spacing: 1.6px;
    text-align: center;
    font-size: 22px;
  }
  &>#sub-title {
    margin-top: 5px;
    width: 433px;
    font-size: 20px;
    line-height: 1.5;
    text-align: center;
  }
  &>#confirm-btn {
    margin-top: 22px;
    width: 92px;
    height: 47px;
    border-radius: 23.5px;
    background: #fff;
    font-size: 20px;
    font-family: NeuzeitGro-Bol;
    letter-spacing: 1.6px;
    padding-top: 7px;
    text-align: center;
    box-shadow: 7px 13px 28px 0 rgba(199, 200, 204, 0.3);
    color: ${props => props.theme.slateGrey};
  }
  .${AlertTypes.NeedPayment} {
    width: 480px;
    height: 589px;
    #Icon-Down {
      position: absolute;
      bottom: 56.3px;
      right: 386.3px;
    }
  }
`;

const Overlay = styled.div`
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: ${props => props.theme.backgroundLight};
  &.transparent {
    background-image: none;
  }
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

export interface AlertFullProps {}

let timeout_ = null;

export const AlertFull = (props: AlertFullProps) => {

  const alertConsumer = React.useContext(AlertContext);
  const {show, options} = alertConsumer.state;
  const {type, onDismiss, timeout, transparent, onConfirm, subTitle, lock, img} = options;

  //  ==== ACCESSIBILITY FUNCTION ====>
  const accessibilityConsumer = React.useContext(AccessibilityContext);
  const { changeStateLayout, enter } = accessibilityConsumer;

  React.useEffect(() => {
    changeStateLayout({
      alertShow: show
    });
  }, [show]);

  // React.useEffect(() => {
  //   if (enter && show) {
  //     onDismiss_();
  //   }
  // }, [enter, show]);
  //  <=== ACCESSIBILITY FUNCTION ====

  const onConfirm_ = () => {
    onConfirm();
    alertConsumer.hide();
  };

  const onDismiss_ = () => {
    onDismiss();
    alertConsumer.hide();
  };

  const stopTimeout = () => {
    if (timeout_) {
      window.clearTimeout(timeout_);
    }
  };

  const dismiss = () => {
    if (lock) {
      return;
    }
    stopTimeout();
    onDismiss_();
  };

  return (
    <React.Fragment>
      {show && <AlertContent>
        <Overlay className={transparent ? "transparent" : null} onTouchEnd={dismiss} />
        {!lock && <CloseBtn detectValue={"alert_close"} icon={"close"} onClick={dismiss} />}
        <Alert options={options} onDismiss_={onDismiss_} />
      </AlertContent>}
    </React.Fragment>
  );
};

export interface AlertProps {
  options: AlertOptions;
  onDismiss_?: () => void;
}

export const Alert = (props: AlertProps) => {
  const {type, onDismiss, timeout, transparent, onConfirm, subTitle, lock, img} = props.options;

  React.useEffect(() => {
    if (timeout) {
      timeout_ = setTimeout((props.onDismiss_ || onDismiss), typeof timeout === "boolean" ? DEFAULT_TIMEOUT_ALERT : timeout);
    }
  }, [timeout]);

  return (
    <AlertWrap className={`${img ? "with-img" : ""} ${type}`}>
      {img && <img src={img} />}
      <span className={type} id="title">{__(type)}</span>
      {subTitle && <span id="sub-title">{__(`${type}_subtitle`)}</span>}
      {onConfirm && <button id="confirm-btn" onClick={onConfirm}>OK</button>}
      {/* CUSTOM BY TYPE => */}
      {type === AlertTypes.NeedPayment &&
        <>
          <img id="Icon-Down" src={"icons/down.svg"} />
        </>
      }
    </AlertWrap>
  );
};