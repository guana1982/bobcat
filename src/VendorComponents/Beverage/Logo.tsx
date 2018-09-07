import * as React from "react";

const SIZES = {
  default: {
    width: 120,
    height: 120
  },
  large: {
    width: 220,
    height: 220
  }
};

const BeverageLogo = (beverage, size? ) => {
  return (
    <img
      src={`pepsi/imgs/logos/${beverage.beverage_logo_id}_big.png`}
      {...SIZES[size ? "default" : size]}
    />
  );
};

export default BeverageLogo;
