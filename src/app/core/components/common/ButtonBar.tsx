import * as React from "react";
import * as styles from "./ButtonBar.scss";

export default ({ title, children }) => {
  return <div className={styles.bar}>{children}</div>;
};
