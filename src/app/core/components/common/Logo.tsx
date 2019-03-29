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

  let logo_id = beverage.beverage_logo_id;
  if (logo_id === 10) {
    logo_id = "9@sparkling";
  } else if (logo_id === 11) {
    logo_id = "9";
  }

  return (
    <img
      src={logo_id === "0" ? `img/still_water_big 2.png` : `img/logos/${logo_id}.png`}
      width={"160px"} height={"160px"}
      // {...SIZES[size ? "default" : size]}
    />
  );
};

export default BeverageLogo;
