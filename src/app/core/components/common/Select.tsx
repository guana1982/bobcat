import * as React from "react";
import { compose, withHandlers, withState } from "recompose";
// import withToggle from 'enhancers/toggle'
const enhance = compose(
  withState("selected", "setSelected", props => {
    return props.defaultValue;
  }),
  // withToggle,
  withHandlers({
    onSelect: ({ setSelected, onChange, selected, multi }) => value => {
      if (!multi) {
        return setSelected(value === selected ? undefined : value, () => {
          onChange && onChange(value);
        });
      }
      const nextSelected = selected.slice();
      selected.indexOf(value) > -1
        ? nextSelected.splice(selected.indexOf(value), 1)
        : nextSelected.push(value);
      return setSelected(nextSelected, () => {
        onChange && onChange(nextSelected);
      });
    }
  })
);
const select = (value, multi, onSelect) => evt => {
  onSelect(value, multi);
};
const Select = enhance(
  ({
    multi,
    options,
    onSelect,
    selected,
    show,
    name,
    label,
    asDropdown,
    onToggle
  }) => {
    return (
      <div
        style={{
          display: "flex"
        }}
      >
        {asDropdown ? (
          <select>
            {options.map((opt, i) => {
              return (
                <option
                  value={opt}
                  onClick={select(opt, multi, onSelect)}
                  key={i}
                >
                  {opt}
                </option>
              );
            })}
          </select>
        ) : (
          options.map((opt, i) => {
            return (
              <div
                style={{
                  marginRight: "1em",
                  padding: "1em",
                  border: "1px solid",
                  lineHeight: 1,
                  borderRadius: 5,
                  fontSize: ".9em",
                  color: multi
                    ? selected.indexOf(opt) > -1 ? "#fff" : "inherit"
                    : selected === opt ? "#fff" : "inherit",
                  background: multi
                    ? selected.indexOf(opt) > -1 ? "#333" : "inherit"
                    : selected === opt ? "#333" : "inherit"
                }}
                onClick={select(opt, multi, onSelect)}
                key={i}
              >
                {opt}
              </div>
            );
          })
        )}
      </div>
    );
  }
);
export default Select;
