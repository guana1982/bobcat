import * as React from "react";

const SIZES = {
  default: {
    width: 100,
    height: 120
  },
  large: {
    width: 200,
    height: 220
  }
};

const BeverageLogo = (beverage, size? ) => {
  return (
    // <img
    //   src={`pepsi/imgs/logos/${beverage.beverage_logo_id}_big.png`}
    //   {...SIZES[size ? "default" : size]}
    // />
    <img
      src={`/img/drink.png`}
      {...SIZES[size ? "default" : size]}
    />
  );
};

export default BeverageLogo;
