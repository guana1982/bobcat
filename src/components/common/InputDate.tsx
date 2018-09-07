import * as React from "react";
import InputWithKeyboard from "./InputWithKeyboard";
import * as styles from "./InputDate.scss";
import * as customStyles from "../../VendorComponents/Menu/InputDate.scss";

const pattern = "1111-11-11";
const formatDate = date => {
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  return `${date.getFullYear()}-${month}-${day}`;
};
type InputDateProps = {
  minDate?: any
};
type InputDateState = {
  date: any
};

class InputDate extends React.Component<any> { // InputDateProps, InputDateState
  state = {
    date: this.props.defaultValue || ""
  };
  // a little bit silly, but it does the job
  onChangeValue = value => {
    const { minDate } = this.props;
    let masked = "";
    console.log("value", value);
    // DELETION HANDLE
    if (value && value.length < this.state.date.length) {
      if (value.length === 8 || value.length === 5) {
        return this.setState({
          date: value.substring(0, value.length - 1)
        });
      }
      return this.setState({
        date: value
      });
    }
    if (this.state.date.length >= pattern.length - 1) {
      const date = new Date(value);
      if (!date || date < minDate || isNaN(date.getTime())) {
        console.log("entered wrong date");
        return this.setState({
          date: formatDate(minDate)
        });
      }
    }
    // INSERTION HANDLE
    /* eslint-disable-next-line */
    value
      .replace(/\-/g, "")
      .split("")
      .forEach((v, i) => {
        if (i === 3 || i === 5) {
          masked = `${masked}${v}-`;
        } else {
          masked = `${masked}${v}`;
        }
      });
    this.setState(
      current => {
        return {
          date: masked
        };
      },
      () => {
        this.props.onChange(masked);
      }
    );
  }
  render() {
    const { id, label } = this.props;
    const { date } = this.state;
    return (
      <div style={{ display: "flex" }} className={styles.inputDate}>
        <InputWithKeyboard
          id={id}
          label={label}
          layout={"numericInt"}
          onChange={this.onChangeValue}
          defaultValue={date}
          theme={customStyles}
        >
          {value => (
            <input
              style={{
                fontSize: "1.25em",
                padding: ".5em",
                borderBottom: "2px solid"
              }}
              placeholder="YYYY-MM-DD"
              value={date}
              maxLength={10}
            />
          )}
        </InputWithKeyboard>
      </div>
    );
  }
}
export default InputDate;
