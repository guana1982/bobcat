import * as React from "react";

export const SignalIcon = (props) => {
  const { power, active } = props;
  const db = 100 - Math.abs(Number(power.replace("dBm", "")));
  const ratio = Math.round(db / 100 * 5);
  return (
    <label>
      {[...Array(5).keys()].map((d, i) => {
        return (
          <div
            style={{
              display: "inline-block",
              marginRight: 2,
              width: 2,
              height: (i + 1) * 3,
              background: !active ? (i < ratio ? "#555" : "#ddd") : i < ratio ? "#fff" : "#999"
            }}
            key={i}
          />
        );
      })}
    </label>
  );
};

export const CheckmarkIcon = ({ width = 20, height = 20, fill = "inherit" }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24">
      <path fill={fill} d="M0 11.522l1.578-1.626 7.734 4.619 13.335-12.526 1.353 1.354-14 18.646z" />
    </svg>
  );
};

export const LockIcon = ({ width = 20, height = 20, fill = "inherit" }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24">
      <path fill={fill} d="M6 8v-2c0-3.313 2.686-6 6-6 3.312 0 6 2.687 6 6v2h-2v-2c0-2.206-1.795-4-4-4s-4 1.794-4 4v2h-2zm15 2v14h-18v-14h18zm-2 2h-14v10h14v-10z" />
    </svg>
  );
};