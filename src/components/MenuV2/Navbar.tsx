import * as React from "react";
import { __ } from "../../lib/i18n";
import * as styles from "../../VendorComponents/Menu/MenuNavigator.scss";
const noop = () => {};
const Navbar = ({ onExit, onJumpTo, canExit, breadcrumbs = [] }) => {
  const jumpTo = event => () => {
    onJumpTo(event);
  };
  return (
    <header className={styles.header}>
      <nav className={styles.breadcrumb}>
        {breadcrumbs.map((b, i) => {
          return (
            <div
              onClick={b.event ? jumpTo(b.event) : noop}
              // className={styles.breadcrumbItem}
              key={i}
            >
              <span>{__(b.title)}</span>
              {i < breadcrumbs.length - 1 && (
                <span className={styles.breadcrumbSeparator}>&gt;</span>
              )}
            </div>
          );
        })}
      </nav>
      <button
        onClick={onExit}
        style={{
          marginLeft: "auto",
          fontSize: "1.25em",
          textTransform: "capitalize",
          opacity: canExit ? 1 : 0.5
        }}
      >
        {__("exit")}
      </button>
    </header>
  );
};
export default Navbar;
