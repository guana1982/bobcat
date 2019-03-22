import * as React from "react";
import { __ } from "@utils/lib/i18n";
import styled from "styled-components";
import { BeverageTypes } from "./Beverage";

interface BlurProps {
  className: any;
  show: boolean;
  logoId?: any;
  types: BeverageTypes[];
}

export const Blur_ = (props: BlurProps) => {
  const { className, logoId, types } = props;
  const logoBlur = (types && types[0]) === BeverageTypes.Info ? `icons/${logoId}@blur.png` : `img/logos/${logoId}@blur.png`;
  return (
    <div className={className}>
      <img src={logoBlur} />
    </div>
  );
};

export const Blur = styled<BlurProps>(Blur_)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  visibility: ${props => props.show ? "visible" : "hidden"};
  z-index: 2;
`;