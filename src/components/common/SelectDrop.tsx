import * as React from "react";
import { compose, withHandlers, withState } from "recompose";
import withDropdown from "./dropdown";
import * as styles from "./SelectDrop.scss";
// import withToggle from 'enhancers/toggle'
const SelectDrop = withDropdown(
  ({
    toggle,
    show,
    title,
    selected,
    onSelect: select,
    onChange,
    labels,
    handleClickOutside,
    options = []
  }) => {
    const selectOption = opt => () => {
      select(opt);
      onChange && onChange(opt);
      // onSelectOption(opt)
    };
    return (
      <div {...handleClickOutside()} className={styles.optionDropdown}>
        <button onClick={toggle} className={styles.title}>
          {title}
          <span className={styles.caret}>
            <span>{selected || options[0]}</span>
            <small>{show ? "▲" : "▼"}</small>
          </span>
        </button>
        <React.Fragment>
          {show && (
            <div className={styles.optionList}>
              {options.map((opt, i) => {
                return (
                  <div
                    onClick={selectOption(opt)}
                    key={i}
                    className={styles.optionListEl}
                  >
                    {opt}
                  </div>
                );
              })}
            </div>
          )}
        </React.Fragment>
      </div>
    );
  }
);
export default SelectDrop;
