import * as React from "react";
import * as styles from "../../assets/scss/ui/Keyboard.scss";

const Line = ({ line, onKeyPress, onKeyDown, onKeyUp }) => {
  return (
    <div className={styles.line}>
      {line.map((d, i) => {
        return (
          <button
            key={i}
            type="button"
            onClick={onKeyPress(d)}
            onMouseDown={onKeyDown(d)}
            onMouseUp={onKeyUp(d)}
            className={[styles.key, styles["key" + d.replace(" ", "")]].join(
              " "
            )}
          >
            {d && <label>{d}</label>}
          </button>
        );
      })}
    </div>
  );
};

const Keyboard = ({
  activeKey,
  layout,
  onKeyPress,
  onKeyDown,
  onKeyUp
}) => {
  // const layoutKey = Object.keys(layouts).find(key => layouts[key] === layout)
  // console.log('layoutKey', layoutKey);
  return (
    <div className={styles.keyboard}>
      {layout.map((line, i) => {
        return (
          <Line
            key={i}
            line={line}
            // activeKey={activeKey}
            onKeyPress={onKeyPress}
            onKeyDown={onKeyDown}
            onKeyUp={onKeyUp}
          />
        );
      })}
    </div>
  );
};
export default Keyboard;
