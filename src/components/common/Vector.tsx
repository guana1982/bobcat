import * as React from "react";
import InputWithKeyboard from "./InputWithKeyboard";

const KEYBOARD_LAYOUTS = {
  text: "latin",
  number: "numericAlt"
};

type VectorInputControlState = {
  index: number,
  values: any
};

class VectorInputControl extends React.Component<any> { // {}, VectorInputControlState
  state = {
    index: 0,
    values: this.props.defaultValue
  };
  next = () => {
    this.setState((current: any) => current + 1);
  }
  prev = () => {
    this.setState((current: any) => current - 1);
  }
  onChangeValue = index => value => {
    this.setState(
      (current: any) => {
        const values = current.values.slice();
        values[index] = value;
        return {
          ...current,
          values
        };
      },
      () => {
        this.props.onChange(this.state.values);
      }
    );
  }
  render() {
    const { id } = this.props;
    const { values } = this.state;
    return (
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {values.map((d, i) => {
          return (
            <div key={i} style={{ padding: "5px" }}>
              <InputWithKeyboard
                id={`${id}.${i}`}
                layout={"numericAlt"}
                onChange={this.onChangeValue(i)}
                defaultValue={d}
              />
            </div>
          );
        })}
      </div>
    );
  }
}

export default VectorInputControl;
