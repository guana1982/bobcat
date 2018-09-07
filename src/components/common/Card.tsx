import * as React from "react";
import * as styles from "../../assets/scss/ui/Card.scss";
export default ({ title, children }) => {
  return (
    <div className={styles.card}>
      {title && <h3 className={styles.title}>{title}</h3>}
      {children}
    </div>
  );
};
