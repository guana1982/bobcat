import * as React from "react";

const SIZES = {
  tiny: {
    width: 50,
    height: 50
  },
  default: {
    width: 160,
    height: 160
  },
  large: {
    width: 200,
    height: 220
  }
};

const BeverageLogo = (props) => {

  const { beverage, size } = props;

  let logo_id = beverage.beverage_logo_id;
  if (logo_id === 11) {
    logo_id = "9";
  }

  return (
    <img
      src={logo_id === "0" ? `img/still_water_big 2.wepb` : `img/logos/${logo_id}/logo.webp`}
      {...SIZES[!size ? "default" : size]}
    />
  );
};

export default BeverageLogo;
