import * as React from "react";
import { __ } from "@utils/lib/i18n";
import styled from "styled-components";
import { BeverageTypes } from "./Beverage";

interface LogoProps {
  className: any;
  show: boolean;
  logoId?: any;
  types: BeverageTypes[];
  $sparkling: boolean;
}

export const Logo_ = (props: LogoProps) => {
  const { className, logoId, types, $sparkling } = props;

  const logo = (types && types[0] === BeverageTypes.Info) ? `icons/${logoId}.png` : `img/logos/${logoId}.png`;
  const logoSparkling = (types && types[0] === BeverageTypes.Info) ? null : `img/logos/${logoId}@sparkling.png`;

  const sparkling_ = (types && types[0] === BeverageTypes.Sparkling) || $sparkling; // <= CONDITION

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