// import * as React from 'react'
import { compose, withProps, withState, withHandlers, lifecycle } from "recompose";
const LAYOUTS = {
  latin: [
    "q,w,e,r,t,y,u,i,o,p,DEL".split(","),
    "MAIUSC,a,s,d,f,g,h,j,k,l,ENTER".split(","),
    "SHIFT < z x c v b n m , . -".split(" "),
    "123,SPACE_BAR,#+=,TOGGLE".split(",")
  ],
  latinUppercase: [
    "q,w,e,r,t,y,u,i,o,p,DEL".split(",").map(d => d.toUpperCase()),
    "MAIUSC,a,s,d,f,g,h,j,k,l,ENTER".split(",").map(d => d.toUpperCase()),
    "SHIFT > z x c v b n m ; : _".split(" ").map(d => d.toUpperCase()),
    "123,SPACE_BAR,#+=,TOGGLE".split(",")
  ],
  symbols: [
    "1234567890".split(""),
    "-/:;()€&@\"".split(""),
    "#+= . , ? ! ' ENTER".split(" "),
    "abc,SPACE_BAR,abc,TOGGLE".split(",")
  ],
  symbolsAlt: [
    "[,],{,},#,&,^,*,+,=,DEL".split(","),
    "_\\|~<>$£¥•".split(""),
    "123 . , ? ' ENTER".split(" "),
    "abc,SPACE_BAR,abc,TOGGLE".split(",")
  ],
  pin: ["123".split(""), "456".split(""), "789".split(""), "DEL,0,".split(",")],
  numericInt: [
    "123".split(""),
    "456".split(""),
    "789".split(""),
    "DEL,0,OK".split(",")
  ],
  numericAlt: [
    "123".split(""),
    "456".split(""),
    "789".split(""),
    "DEL,0,.".split(","),
    ",,OK".split(",")
  ],
  numericFloat: [
    "123".split(""),
    "456".split(""),
    "789".split(""),
    "DEL,0,.".split(","),
    ",,OK".split(",")
  ],
  numericFloatAlt: [
    "123".split(""),
    "456".split(""),
    "789".split(""),
    "DEL,0,.".split(",")
  ]
};
const withKeyboard = compose(
  // wrapComponentName(Component => `${Component.name}WithKeyboard`),
  withProps({
    layouts: LAYOUTS
  }),
  withState("layout", "setLayout", ({ layout = "latin" }) => LAYOUTS[layout]),
  withState("value", "setValue", ({ defaultValue }) => defaultValue),
  withState("show", "toggleKeyboard", ({ initialShow }) => initialShow),
  withState("activeKey", "setActiveKey", null),
  lifecycle({
    UNSAFE_componentWillReceiveProps({ defaultValue, setValue }) {
      if (this.props.defaultValue && defaultValue !== this.props.value) {
        setValue(defaultValue);
      }
    }
  }),
  withHandlers({
    onFocus: ({ toggleKeyboard }) => e => {
      toggleKeyboard(true);
    },
    onBlur: ({ toggleKeyboard }) => () => {
      toggleKeyboard(false);
    },
    onKeyDown: ({ setActiveKey, setLayout }) => key => () => {
      if (key === "SHIFT") {
        setActiveKey("SHIFT");
        setLayout(LAYOUTS.latinUppercase);
      }
    },
    onKeyUp: ({ setActiveKey, activeKey, setLayout }) => key => () => {
      if (activeKey === "SHIFT") {
        setActiveKey(null);
        setLayout(LAYOUTS.latin);
      }
    },
    onKeyPress: ({
      activeKey,
      setValue,
      setActiveKey,
      initialValue,
      value,
      setLayout,
      toggleKeyboard,
      onChange,
      onToggle
    }) => key => e => {
      if (key === "SPACE_BAR") {
        return setValue((current = "") => current + " ");
      }
      if (key === "123") {
        return setLayout(LAYOUTS.symbols);
      }
      if (key === "abc" || (key === "MAIUSC" && activeKey === "MAIUSC")) {
        setActiveKey(null);
        return setLayout(LAYOUTS.latin);
      }
      if (key === "MAIUSC" && activeKey !== "MAIUSC") {
        setActiveKey("MAIUSC");
        return setLayout(LAYOUTS.latinUppercase);
      }
      if (key === "#+=") {
        return setLayout(LAYOUTS.symbolsAlt);
      }
      if (key === "DEL") {
        return setValue((current = "") => {
          const nextValue = String(current).substring(
            0,
            String(current).length - 1
          );
          onChange && onChange(nextValue);
          return nextValue;
        });
      }
      if (key === "SHIFT") {
        return;
      }
      if (key === "ENTER" || key === "OK") {
        if (onToggle) onToggle(false);
        return toggleKeyboard(false);
      }
      if (key === "TOGGLE") {
        return setValue(initialValue, () => toggleKeyboard());
      }
      setValue((current = "") => {
        onChange && onChange(current + key);
        return current + key;
      });
    }
  })
);
export default withKeyboard;
