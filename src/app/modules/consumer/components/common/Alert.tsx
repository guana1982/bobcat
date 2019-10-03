import * as React from "react";
import styled from "styled-components";
import { __ } from "@utils/lib/i18n";
import { AlertContext, DEFAULT_TIMEOUT_ALERT, AlertOptions, AlertTypes } from "@core/containers/alert.container";
import { AccessibilityContext } from "@core/containers";
import { CloseBtn, CloseBtnWrap } from "./CloseBtn";
import { MessageInfo } from "./MessageInfo";
import * as _ from "underscore";
import Spritesheet from "react-responsive-spritesheet";

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
    background-image: linear-gradient(to bottom, #fcfcfc, #f5f6f8);
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
      line-height: 1.5;
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
      width: 500px;
      height: 500px;
      &::before {
        width: 200px;
        height: 200px;
        top: 115px;
        left: 150px;
      }
      .erogations {
        font-family: NeuzeitGro-Bol;
        font-size: 120px;
        color: #2b9cda;
        text-align: center;
        margin: 30px;
        line-height: 2;
        width: 200px;
        height: 200px;
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
  const debouncedDismiss = React.useRef(null);

  const onConfirm_ = () => {
    onConfirm();
    alertConsumer.hide();
  };

  const onDismiss_ = () => {
    if (debouncedDismiss.current) {
      debouncedDismiss.current.cancel();
    }
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

  const dismiss_ = React.useMemo(() => debouncedDismiss.current = _.debounce(dismiss, 500, false), [onDismiss]);

  return (
    <React.Fragment>
      {show && <AlertContent>
        <Overlay background={options.backgroung}  className={transparent ? "transparent" : null} onClick={dismiss_} />
        {options.backgroungAnimated &&
          <Spritesheet
            image={options.backgroungAnimated}
            widthFrame={1280}
            heightFrame={800}
            steps={33}
            fps={10}
            style={{ position: "absolute", top: "0px" }}
            autoplay={true}
            loop={false}
          />
        }
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
  const {type, onDismiss, timeout, transparent, onConfirm, subTitle, lock, img, backgroung, data} = props.options;

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

  if (type === AlertTypes.Promotion)
    return (
      <AlertWrap className={`${img ? "with-img" : ""} ${type}`}>
        <span className="erogations">{data.erogations}</span>
        <span className={type} id="title">{__(type)}, {data.nickname}!</span>
        <span id="sub-title">{__(`c_promotion_subtitle_1`)} {data.erogations} {__(`c_promotion_subtitle_2`)}</span>
      </AlertWrap>
    );

  return (
    <AlertWrap className={`${img ? "with-img" : ""} ${type}`}>
      {img && <img className="type-img" src={img} />}
      <span className={type} id="title">{__(type)}</span>
      {subTitle && <span id="sub-title">{__(`${type}_subtitle`)}</span>}
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
    </AlertWrap>
  );
};