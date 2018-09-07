import * as React from "react";
import SelectDrop from "./SelectDrop";
import InputWithKeyboard from "./InputWithKeyboard";
type InputListState = {
  values: any
};
// import * as styles from './Vector.scss'
class InputList extends React.Component<any> { // {}, InputListState
  state = {
    values: this.props.options
  };
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
  onRemoveValue = () => {};
  onAddValue = () => {};
  render() {
    const { id } = this.props;
    const { values } = this.state;
    return (
      <div style={{ display: "flex" }}>
        {values.map((value, i) => {
          return <div key={i}>{value}</div>;
        })}
      </div>
    );
  }
}
export default InputList;
