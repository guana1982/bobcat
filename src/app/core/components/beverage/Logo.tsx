import * as React from "react";
import { __ } from "@utils/lib/i18n";
import styled from "styled-components";
import { BeverageTypes } from "./Beverage";

interface LogoProps {
  className: any;
  show: boolean;
  logoId?: any;
  type: BeverageTypes;
  $sparkling: boolean;
}

export const Logo_ = (props: LogoProps) => {
  const { className, logoId, type, $sparkling } = props;

  const logo = type === BeverageTypes.Info ? `icons/${logoId}.png` : `img/logos/${logoId}.png`;
  const logoSparkling = type === BeverageTypes.Info ? null : `img/logos/${logoId}@sparkling.png`;

  const sparkling_ = type === BeverageTypes.Sparkling || $sparkling; // <= CONDITION

  if (logoId === undefined) return null;

  return (
    <div className={className}>
      <img src={sparkling_ ? logoSparkling : logo} />
    </div>
  );
};

export const Logo = styled<LogoProps>(Logo_)`
  position: absolute;
  top: 0;
  left: 0;
  width: 218px;
  height: 220px;
  object-fit: contain;
`;