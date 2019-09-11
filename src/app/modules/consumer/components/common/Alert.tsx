import * as React from "react";
import styled from "styled-components";
import { __ } from "@utils/lib/i18n";
import { AlertContext, DEFAULT_TIMEOUT_ALERT, AlertOptions, AlertTypes } from "@core/containers/alert.container";
import { AccessibilityContext } from "@core/containers";
import { CloseBtn, CloseBtnWrap } from "./CloseBtn";
import { MessageInfo } from "./MessageInfo";

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
    img.type-img {
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
  &.${AlertTypes.EndSession} {
    width: 200px !important;
    height: 200px  !important;
    top: 48% !important;
  }
  &.${AlertTypes.LoadingDataQr} {
    img.type-img {
      width: 200px;
      height: 200px;
      margin-bottom: 40px;
    }
  }
  &.${AlertTypes.NeedPayment} {
    top: 125px;
    left: 382px;
    transform: none !important;
    &, img.type-img {
      position: absolute;
      top: 65px;
      width: 516px;
      height: 550px;
      margin: 0;
    }
    #title {
      display: none;
    }
    #message-status {
      font-family: NeuzeitGro-Bol;
      text-transform: uppercase;
      position: fixed;
      font-size: 16px;
      line-height: 2.34;
      letter-spacing: 1.28px;
      text-align: left;
      vertical-align: center;
      top: 347px;
      right: 108px;
      width: 300px;
      height: 38px;
    }
    #Icon-Left {
      position: fixed;
      width: 27px;
      height: 47px;
      top: 370.5px;
      right: 468.5px;
    }
    #Icon-CreditCard {
      position: fixed;
      top: 401px;
      right: 374px;
      width: 34px;
      height: 22px;
    }
    #Icon-ApplePay {
      position: fixed;
      top: 402px;
      right: 283px;
      width: 47px;
      height: 20px;
    }
    #Icon-AndroidPay {
      position: fixed;
      top: 394px;
      right: 210px;
      width: 29px;
      height: 35px;
    }
    #Icon-SamsungPay {
      position: fixed;
      top: 401px;
      right: 117px;
      width: 49px;
      height: 22px;
    }
  }
  &.${AlertTypes.Promotion} {
    &:before {
      width: 70%;
      height: 70%;
      left: 15%;
    }
    .number {
      font-family: NeuzeitGro-Bol;
      font-size: 120px;
      color: #2b9cda;
      height: 125px;
      margin-bottom: 75px;
      margin-top: 65px;
    }
  }
  .block {
    span {
      display: inline;
    }
  }
`;

const Overlay = styled.div`
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: ${props => props.background ? `url(${props.background})` : props.theme.backgroundLight};
  background-size: contain;
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
        <Overlay background={options.backgroung}  className={transparent ? "transparent" : null} onTouchEnd={dismiss} />
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
  const {type, onDismiss, timeout, transparent, onConfirm, subTitle, lock, img, backgroung, promotion} = props.options;

    //  ==== ACCESSIBILITY FUNCTION ====>
    const accessibilityConsumer = React.useContext(AccessibilityContext);
    const { changeStateLayout } = accessibilityConsumer;

    React.useEffect(() => {
      changeStateLayout({
        alertShow: true
      });
      return () => {
        changeStateLayout({
          alertShow: false
        });
      };
    }, []);

    //  <=== ACCESSIBILITY FUNCTION ====

  React.useEffect(() => {
    if (timeout) {
      timeout_ = setTimeout((props.onDismiss_ || onDismiss), typeof timeout === "boolean" ? DEFAULT_TIMEOUT_ALERT : timeout);
    }
  }, [timeout]);

  return (
    <AlertWrap className={`${img ? "with-img" : ""} ${type}`}>
      {img && <img className="type-img" src={img} />}
      {type !== AlertTypes.Promotion && <span className={type} id="title">{__(type)}</span>}
      {subTitle && type !== AlertTypes.Promotion && <span id="sub-title">{__(`${type}_subtitle`)}</span>}
      {onConfirm && <button id="confirm-btn" onClick={onConfirm}>OK</button>}
      {/* CUSTOM BY TYPE => */}
      {type === AlertTypes.NeedPayment &&
        <div className={"custom-elements"}>
          <MessageInfo />
          <img id="Icon-Left" src={"icons/left.svg"} />
          <img id="Icon-CreditCard" src={"icons/credit-card.svg"} />
          <img id="Icon-ApplePay" src={"icons/apple-pay.webp"} />
          <img id="Icon-AndroidPay" src={"icons/android-pay.svg"} />
          <img id="Icon-SamsungPay" src={"icons/samsung-pay.webp"} />
        </div>
      }
      {type === AlertTypes.Promotion &&
        <>
          <span className="number">{promotion}</span>
          <span className={type} id="title">{__(type)}, {promotion.nickname}!</span>
          <span id="sub-title">{__(`${type}_subtitle1`)} {promotion.erogations} {__(`${type}_subtitle2`)}</span>
        </>
      }
    </AlertWrap>
  );
};