import * as React from "react";
import { __ } from "@utils/lib/i18n";
import styled from "styled-components";

interface OutOfOrderProps {
  className: any;
}

export const OutOfOrder_ = (props: OutOfOrderProps) => {
  const { className } = props;
  return (
    <div className={className}>
      <img id="machine" src={"img/out-of-order.svg"} />
      <h2 id="title">{__("c_out_of_order_title")}</h2>
      <h2 id="text">{__("c_out_of_order_text")}</h2>
    </div>
  );
};

export const OutOfOrder = styled(OutOfOrder_)`
  #machine {
    position: absolute;
    top: 187px;
    left: 250.6px;
    width: 432px;
    height: 458px;
  }
  #title {
    position: absolute;
    top: 324px;
    right: 216.4px;
    width: 271px;
    height: 37.5px;
    color: ${props => props.theme.slateGrey};
    font-family: NeuzeitGro-Bol;
    text-transform: uppercase;
    font-size: 20px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.88;
    letter-spacing: 1.6px;
  }
  #text {
    position: absolute;
    margin: 0;
    line-height: 1.2;
    top: 389px;
    right: 270.4px;
    width: 217px;
    height: 73px;
    color: ${props => props.theme.slateGrey};
    font-family: NeuzeitGro-Reg;
    font-size: 22px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    letter-spacing: normal;
  }
`;