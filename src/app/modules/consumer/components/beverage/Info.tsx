import * as React from "react";
import { __ } from "@utils/lib/i18n";
import styled from "styled-components";
import { BeverageTypes } from "./Beverage";
import { Logo } from "./Logo";

interface InfoProps {
  className: any;
  show: boolean;
  logoId?: any;
  types: BeverageTypes[];
  specialCard: any;
  title: any;
}

export const Info_ = (props: InfoProps) => {
  const { className, title, show } = props;

  if (!show)
    return null;

  return (
    <div className={className}>
      <Logo {...props} />
      <span id="title">{__(title)}</span>
    </div>
  );
};

export const Info = styled<InfoProps>(Info_)`
  width: 100%;
  height: 100%;
  border-radius: 17px;
  border: solid 1px #f1f1f1;
  ${Logo} {
    border: none;
    width: 141px;
    height: 141.5px;
    top: 43.5px;
    left: 36px;
  }
  #title {
    position: absolute;
    font-family: NeuzeitGro-Bol;
    font-size: 18px;
    line-height: 1.1;
    letter-spacing: 3.2px;
    text-align: left;
    width: 100%;
    font-size: 16px;
    letter-spacing: 1px;
    width: 173px;
    left: 23px;
    bottom: 23px;
    height: 70px;
    display: flex;
    align-items: center;
    right: 0;
    text-transform: none;
    text-align: center;
    color: ${props => props.theme.slateGrey};
  }
`;