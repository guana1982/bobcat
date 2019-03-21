import * as React from "react";
import { __ } from "@utils/lib/i18n";
import styled from "styled-components";

interface OutOfStockProps {
  className: any;
  show: boolean;
}

export const OutOfStock_ = (props: OutOfStockProps) => {
  const { className } = props;
  return (
    <div className={className}>
      <span>{__("Sorry, we're out of that flavor at the moment! ")}</span>
    </div>
  );
};

export const OutOfStock = styled(OutOfStock_)`
  position: absolute;
  font-family: NeuzeitGro-Bol;
  padding: 20px;
  top: -50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  text-transform: uppercase;
  font-size: 16px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.5;
  letter-spacing: 1.3px;
  text-align: center;
  color: ${props => props.theme.slateGrey};
  visibility: ${props => props.show ? "visible" : "hidden"};
`;