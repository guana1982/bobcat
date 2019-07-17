import * as React from "react";
import { __ } from "@utils/lib/i18n";
import styled from "styled-components";
import { BeverageTypes } from "./Beverage";

interface BlurProps {
  className: any;
  show: boolean;
  logoId?: any;
  types: BeverageTypes[];
  nutritionFacts?: boolean;
}

export const Blur_ = (props: BlurProps) => {
  const { className, logoId, types, nutritionFacts } = props;
  const logoBlur = (types && types[0]) === BeverageTypes.Info ? `icons/${logoId}@blur.webp` : `img/logos/${logoId}@${nutritionFacts ? "nutrition-" : ""}blur.webp`;

  if (logoId === undefined) return null;

  return (
    <div className={className}>
      <img className={nutritionFacts ? "nutrition-mode" : ""} src={logoBlur} />
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
  img.nutrition-mode {
    position: absolute;
    bottom: 0;
    width: 130%;
    left: -15%;
    height: 87%;
  }
`;