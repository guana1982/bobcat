import * as React from "react";
import { themr } from "react-css-themr";
import { compose, withProps, onlyUpdateForKeys, setDisplayName } from "recompose";
// import withTransition from './withTransition'
import withKeyboardToggle from "../../enhancers/keyboard";
import withClickOutside from "./clickOutside";
import Keyboard from "./Keyboard";
import * as styles from "../../scss/ui/InputWithKeyboard.scss";
const noop = () => {};
const enhance = compose(
  setDisplayName("InputWithKeyboard"),
  //  withTransition,
  withKeyboardToggle,
  withProps(ownProps => ({
    ...ownProps,
    onClickOutside: () => {
      ownProps.toggleKeyboard(false);
      ownProps.onToggle && ownProps.onToggle(false);
    }
  })),
  withClickOutside,
  themr("InputWithKeyboard", styles, { composeTheme: "softly" })
);
const InputWithKeyboard = enhance(
  ({
    activeKey,
    onFocus,
    onBlur,
    show,
    defaultValue,
    value = "",
    layout,
    onKeyPress,
    onKeyDown,
    onKeyUp,
    children,
    title,
    id,
    placeholder,
    overrideStyles,
    handleClickOutside,
    disabled,
    theme,
    suffix
  }) => {
    const child =
      typeof children === "function" ? (
        children(value)
      ) : (
        <div className={theme.input}>{value || placeholder}</div>
      );
    return (
      <div
        onClick={!show && !disabled ? onFocus : noop}
        style={{
          opacity: disabled ? 0.5 : 1
        }}
        className={show ? theme.containerWithKeyboard : theme.container}
        {...handleClickOutside()}
      >
        {show && (
          <div className={theme.placeholder}>
            <label className={theme.label}>{title}</label>
            {child}
          </div>
        )}
        {!show && (
          <React.Fragment>
            <span
              // type={!show ? 'text' : 'hidden'}
              contentEditable={!disabled}
              className={theme.input}
              style={{
                pointerEvents: disabled ? "none" : "inherit"
              }}
            >
              {value && String(value).length > 0 ? value : placeholder}
            </span>
            {suffix && <label className={theme.suffix}>{suffix}</label>}
            <input
              type="text"
              id={id}
              onFocus={onFocus}
              style={{
                opacity: 0,
                position: "absolute",
                zIndex: -1,
                pointerEvents: disabled ? "none" : "inherit"
              }}
            />
          </React.Fragment>
        )}
        {show && (
          <div className={theme.keyboard}>
            <Keyboard
              activeKey={activeKey}
              onKeyPress={onKeyPress}
              onKeyDown={onKeyDown}
              onKeyUp={onKeyUp}
              layout={layout}
            />
          </div>
        )}
      </div>
    );
  }
);
export default InputWithKeyboard;
