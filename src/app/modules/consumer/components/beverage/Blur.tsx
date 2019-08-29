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
      <div id="image-blur" className={`${className} nutritionFacts ? "nutrition-mode" : ""`} style={{ backgroundImage: `url(${logoBlur})` }} />
    </div>
  );
};

export const Blur = styled(Blur_)`
  position: absolute;
  top: 0;
  left: -12%;
  width: 125%;
  z-index: -2;
  #image-blur {
    height: 350px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    left: -12%;
  }
  #image-blur.nutrition-mode {
    position: absolute;
    bottom: 0;
    width: 130%;
    left: -15%;
    height: 87%;
  }
`;