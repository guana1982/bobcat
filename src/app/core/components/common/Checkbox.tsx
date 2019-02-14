import * as React from "react";
import { __ } from "@utils/lib/i18n";
const change = onChange => evt => {
  onChange(evt.target.checked);
};
const Checkbox = ({
  defaultValue,
  onChange,
  id,
  children,
  labels = [__("active"), __("inactive")],
  ...props
}) => {
  return (
    <div style={{ position: "relative" }}>
      <input
        style={{
          opacity: 0,
          position: "absolute",
          width: "100%"
        }}
        id={id}
        type="checkbox"
        defaultChecked={Boolean(defaultValue)}
        onChange={change(onChange)}
        {...props}
      />
      {typeof children === "function" ? (
        children(Boolean(defaultValue))
      ) : (
        <span style={{ pointerEvents: "none" }}>
          {defaultValue ? <strong>{labels[0]}</strong> : labels[1]}
        </span>
      )}
    </div>
  );
};
export default Checkbox;
