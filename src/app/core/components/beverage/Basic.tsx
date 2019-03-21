import * as React from "react";
import { __ } from "@utils/lib/i18n";
import styled, { css } from "styled-components";
import { BeverageTypes } from "./Beverage";
import { Logo } from "./Logo";

interface BasicProps {
  className: any;
  show: boolean;
  logoId?: any;
  type: BeverageTypes;
  specialCard: any;
  title: any;
}

export const Basic_ = (props: BasicProps) => {
  const { className, type, specialCard, title } = props;
  return (
    <div className={className}>
        {(specialCard) && <div id="indicator"><span>{type}</span></div>}
        <Logo {...props} />
        <span id="title">{__(title)}</span>
        <span id="cal">0 Cal.</span>
        <span id="price">75¢</span>
    </div>
  );
};

export const Basic = styled<BasicProps>(Basic_)`
  position: relative;
  width: 100%;
  height: 100%;
  color: ${props => props.theme.slateGrey};
  visibility: ${props => props.show ? "visible" : "hidden"};
  text-transform: uppercase;
  &>#indicator {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    left: 20px;
    top: 20px;
    width: 72px;
    height: 18.1px;
    background: ${props => props.color};
    border-radius: 9px;
    span {
      text-transform: lowercase;
      font-size: 12px;
      color: #fff;
    }
  }
  &>#title {
    position: absolute;
    font-family: NeuzeitGro-Bol;
    color: ${props => props.color};
    width: calc(100% - 46px);
    right: 23px;
    bottom: 43px;
    font-size: 18px;
    line-height: 1.1;
    letter-spacing: 3.2px;
    text-align: left;
  }
  &>#cal {
    position: absolute;
    left: 23px;
    bottom: 14px;
    font-size: 14px;
    letter-spacing: 1px;
    text-align: left;
  }
  &>#price {
    position: absolute;
    right: 23px;
    bottom: 14px;
    font-size: 12.6px;
    letter-spacing: 1px;
    text-align: right;
  }
  ${({ specialCard }) => specialCard && css`
    ${Logo} {
      position: absolute;
      top: 10px;
      right: -19px;
      left: auto;
      width: 203px;
      height: 220px;
    }
  `}
`;