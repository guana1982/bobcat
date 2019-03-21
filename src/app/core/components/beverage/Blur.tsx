import * as React from "react";
import { __ } from "@utils/lib/i18n";
import styled from "styled-components";
import { BeverageTypes } from "./Beverage";

interface BlurProps {
  className: any;
  show: boolean;
  logoId?: any;
  type: BeverageTypes;
}

export const Blur_ = (props: BlurProps) => {
  const { className, logoId, type } = props;
  const logoBlur = type === BeverageTypes.Info ? `icons/${logoId}@blur.png` : `img/logos/${logoId}@blur.png`;
  return (
    <img className={className} src={logoBlur} />
  );
};

export const Blur = styled<BlurProps>(Blur_)`
  position: absolute;
  visibility: ${props => props.show ? "visible" : "hidden"};
  z-index: 2;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
`;