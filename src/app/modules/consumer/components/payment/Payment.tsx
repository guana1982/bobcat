import * as React from "react";
import styled from "styled-components";
import { __ } from "@core/utils/lib/i18n";

export enum PaymentType {
  Loading,
  Promotion,
  ThankYou
}

interface PaymentProps {
  type: PaymentType;
}

const PaymentWrap = styled.div`
  position: absolute;
  background-image: url("img/fruits-bg.webp");
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-size: contain;
  z-index: 6;
  .icon {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background-color: #fafafa;
    position: absolute;
    top: 258px;
    left: 540px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    span {
      font-family: NeuzeitGro-Bol;
      &.number {
        font-size: 120px;
        color: #2b9cda;
        height: 125px;
      }
      &.span { font-size: 20px; }
    }
  }
  .textBox {
    position: absolute;
    top: 488px;
    left: 50%;
    transform: translateX(-50%);
    span {
      display: block;
      text-align: center;
      &.title {
        font-family: NeuzeitGro-Bol;
        text-transform: uppercase;
        font-size: 16px;
      }
      &.subtitle {
        font-size: 20px;
      }
    }
  }
`;

export const Payment = (props: PaymentProps) => {
  if (props.type === PaymentType.Promotion)
    return (
      <PaymentWrap>
        <div className="icon">
          <span className="number">5</span>
        </div>
        <div className="textBox">
          <span className="title">{__("c_welcome")}, {"{user_name}"}</span>
          <span className="subtitle">
            {__("c_you_have")} {"{free_drinks_number}"} {__("c_free_drinks")}
          </span>
        </div>
      </PaymentWrap>
    );

  if (props.type === PaymentType.Loading)
    return (
      <PaymentWrap>
        <div className="icon">
          <img src="img/static-loading-icon.png"/>
        </div>
        <div className="textBox">
          <span className="title">{__("c_loading_preferences")}</span>
        </div>
      </PaymentWrap>
    );

  if (props.type === PaymentType.ThankYou)
    return (
      <PaymentWrap>
        <div className="icon">
          <span className="span">{__("c_end_session")}</span>
        </div>
      </PaymentWrap>
    );
};