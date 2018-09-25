import * as React from "react";
import withDropdown from "../../../components/common/dropdown";
import * as styles from "./BibSizeDropdown.scss";

const BibSizeDropdown = withDropdown(
  ({
    toggle,
    show,
    title,
    selected,
    onSelect: select,
    onSelectSize,
    sizes,
    labels,
    handleClickOutside
  }) => {
    const selectSize = size => () => {
      select(size);
      onSelectSize(size);
    };
    return (
      <div {...handleClickOutside()} className={styles.sizesDropdown}>
        <button onClick={toggle} className={styles.title}>
          {title}
          <span className={styles.caret}>
            <strong>{labels[sizes.indexOf(selected)]}</strong>
            <small>{show ? "▲" : "▼"}</small>
          </span>
        </button>
        <React.Fragment>
          {show && (
            <div className={styles.sizesList}>
              {sizes.map((size, i) => {
                return (
                  <div
                    key={i}
                    onClick={selectSize(size)}
                    className={styles.sizeDropdownItem}
                    style={{
                      fontWeight: selected === size ? "bold" : "inherit",
                      background: selected === size ? "#333" : "#666"
                    }}
                  >
                    {labels[i]}
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
export default BibSizeDropdown;
