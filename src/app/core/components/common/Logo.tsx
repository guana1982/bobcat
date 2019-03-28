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

const BeverageLogo = ({ beverage }, size? ) => {

  return (
    <img
      src={`img/logos/${beverage.beverage_logo_id}.png`}
      width={"160px"} height={"160px"}
      // {...SIZES[size ? "default" : size]}
    />
  );
};

export default BeverageLogo;
