import * as React from "react";
import styled from "styled-components";
import { __ } from "@core/utils/lib/i18n";

const PromotionWrap = styled.div`
  position: absolute;
  background-image: url("img/promotion-bg.png");
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-size: contain;
  z-index: 6;
  .freeDrinksN {
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
      font-size: 120px;
      color: #2b9cda;
      height: 125px;
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
      &.user {
        text-transform: uppercase;
        font-weight: bold;
        font-size: 16px;
        font-family: NeuzeitGro-Bol;
      }
      &.freeDrinks {
        font-size: 20px;
      }
    }
  }
`;

export const Promotion = (props) => {
  return (
    <PromotionWrap>
      <div className="freeDrinksN">
        <span>5</span>
      </div>
      <div className="textBox">
        <span className="user">{__("c_welcome")}, {"{user_name}"}</span>
        <span className="freeDrinks">
          {__("c_you_have")} {"{free_drinks_number}"} {__("c_free_drinks")}
        </span>
      </div>
    </PromotionWrap>
  );
};