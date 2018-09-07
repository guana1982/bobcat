import * as React from "react";
import { compose, mapProps } from "recompose";
import * as styles from "./Beverage.scss";
import { COLORS } from "../config";

const enhance = compose(
  mapProps(props => ({
    ...props
  }))
);

export default enhance(({ index, beverage, onSelect, animatedId, onStop }) => {
  const selectedColor = animatedId === beverage.beverage_id ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.2)"; // COLORS[beverage.beverage_logo_id];
  return (
    <div
      className={`${styles.beverage}`}
      onTouchEnd={onStop}
      onTouchStart={() => onSelect(beverage)}
      style={{ backgroundColor: selectedColor }}
    >
      {beverage.status_id === "empty_bib" && <div>Syrup sold out</div>}
      {beverage.status_id === "soda_alarm" && <div>CO2 is over</div>}
      {beverage.status_id === "plain_alarm" && <div>Water is over</div>}
      <h1>{beverage.type_id}</h1>
      <h2>{beverage.flavor_id}</h2>
    </div>
  );
});
