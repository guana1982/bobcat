import * as React from "react";
import * as styles from "../../scss/ui/Field.scss";

const concat = styles => {
  return styles.join(" ");
};
const Field = ({id, children, label, theme}) => { // = { field : null, label: null, input: null }
  return (
    <div className={concat([styles.field, theme.field])}>
      {label && (
        <label htmlFor={id} className={concat([styles.label, theme.label])}>
          {label}
        </label>
      )}
      <div className={concat([styles.input, theme.input])}>{children}</div>
    </div>
  );
};

export default Field;
