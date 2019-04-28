import * as React from "react";
import styled, { keyframes } from "styled-components";
import Keyboard from "react-simple-keyboard";
import { ModalContent, Modal, ACTIONS_CONFIRM, ModalTheme } from "./Modal";
import { MInput } from "./Input";
import { ConfigContext, ServiceContext } from "@core/containers";
import "react-simple-keyboard/build/css/index.css";

export const KeyboardWrapper = styled.div`
  .simple-keyboard.hg-theme-ios {
    width: 750px;
    margin: auto;
  }
  .simple-keyboard.hg-theme-ios.hg-theme-default .hg-row .hg-button {
    flex-grow: 1;
    cursor: pointer;
    max-width: initial;
  }
  .simple-keyboard.hg-theme-ios .hg-row {
    display: flex;
  }
  .simple-keyboard.hg-theme-ios .hg-row:not(:last-child) {
    margin-bottom: 5px;
  }
  .simple-keyboard.hg-theme-ios .hg-row .hg-button:not(:last-child) {
    margin-right: 5px;
  }
  .simple-keyboard.hg-theme-ios .hg-row:nth-child(2) {
    margin-left: 18px;
  }
  .simple-keyboard.hg-theme-ios.hg-theme-default {
    background-color: rgba(0, 0, 0, 0.1);
    padding: 5px;
    border-radius: 5px;
  }
  .simple-keyboard.hg-theme-ios.hg-theme-default.hg-layout-custom {
    background-color: #e5e5e5;
    padding: 5px;
  }
  .simple-keyboard.hg-theme-ios.hg-theme-default .hg-button {
    border-radius: 5px;
    box-sizing: border-box;
    padding: 0;
    background: white;
    border-bottom: 1px solid #b5b5b5;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: none;
    font-weight: 400;
    font-size: 20px;
    max-width: 60px;
    min-width: 60px;
    height: 60px;
    min-height: 60px;
  }
  .simple-keyboard.hg-theme-ios.hg-theme-default .hg-button:active,
  .simple-keyboard.hg-theme-ios.hg-theme-default .hg-button:focus {
    background: #e4e4e4;
  }
  .simple-keyboard.hg-theme-ios.hg-theme-default .hg-button.hg-functionBtn {
    background-color: #adb5bb;
  }
  .simple-keyboard.hg-theme-ios.hg-theme-default .hg-button.hg-button-space,
  .simple-keyboard.hg-theme-ios.hg-theme-default .hg-button.hg-button-shift,
  .simple-keyboard.hg-theme-ios.hg-theme-default
    .hg-button.hg-button-shiftactivated {
    background-color: #ffffff;
  }
  .simple-keyboard.hg-theme-ios.hg-theme-default .hg-button-space {
    max-width: 448px;
    min-width: 448px;
  }
  .simple-keyboard.hg-theme-ios.hg-theme-default .hg-button-enter {
    max-width: 110px;
    min-width: 110px;
  }
  .simple-keyboard.hg-theme-ios.hg-theme-default .hg-button-altright,
  .simple-keyboard.hg-theme-ios.hg-theme-default .hg-button-back {
    min-width: 80px;
    max-width: 80px;
  }
`;

enum TypeLayout {
  Default = "default",
  Shift = "shift",
  Alt = "alt"
}

interface MKeyboardProps {
  onChange?: (input: any) => void;
  onChangeAll?: (inputObj) => any;
  onEnter?: () => void;
  inputName?: any;
}

interface MKeyboardState {
  layoutName: TypeLayout;
  input: string;
}

let keyboard: any;
const layout = {
  [TypeLayout.Default]: [
    "q w e r t y u i o p {bksp}",
    "a s d f g h j k l {enter}",
    "{shift} z x c v b n m , . {shift}",
    "{alt} {space}"
  ],
  [TypeLayout.Shift]: [
    "Q W E R T Y U I O P {bksp}",
    "A S D F G H J K L {enter}",
    "{shiftactivated} Z X C V B N M , . {shiftactivated}",
    "{alt} {space}"
  ],
  [TypeLayout.Alt]: [
    "1 2 3 4 5 6 7 8 9 0 {bksp}",
    `@ # $ & * ( ) ' " {enter}`,
    "{shift} % - + = / ; : ! ? {shift}",
    "{default} {space}"
  ]
};
const display = {
  "{alt}": ".?123",
  "{shift}": "⇧",
  "{shiftactivated}": "⇧",
  "{enter}": "next", // "return",
  "{bksp}": "⌫",
  "{altright}": ".?123",
  "{downkeyboard}": "🞃",
  "{space}": " ",
  "{default}": "ABC",
  "{back}": "⇦"
};

export const MKeyboard = (props: MKeyboardProps) => {

  const { onChange, onChangeAll, inputName, onEnter } = props;

  const [layoutName, setLayoutName] = React.useState<TypeLayout>(TypeLayout.Default);

  // const onChange = input => {
  //   setState(prevState => ({
  //     ...prevState,
  //     input: input,
  //   }));
  //   console.log("Input changed", input);
  // };

  const onKeyPress = button => {
    if (button.includes("{") && button.includes("}")) {
      handleLayoutChange(button);
    }
  };

  function handleLayoutChange(button) {
    let currentLayout = layoutName;
    let layoutName_;

    switch (button) {
      case "{shift}":
      case "{shiftactivated}":
      case "{default}":
        layoutName_ = currentLayout === "default" ? "shift" : "default";
        break;

      case "{enter}":
        onEnter();
      break;

      case "{alt}":
      case "{altright}":
        layoutName_ = currentLayout === "alt" ? "default" : "alt";
        break;

      default:
        break;
    }

    if (layoutName_) {
      setLayoutName(layoutName_);
    }
  }

  // const onChangeInput = event => {
  //   let input = event.target.value;
  //   setState(prevState => ({
  //     ...prevState,
  //     input: input,
  //   }));
  //   keyboard.setInput(input);
  // };

  console.log("propsKeyboard", props);

  return (
    <KeyboardWrapper>
      <Keyboard
        layoutName={layoutName}
        layout={layout}
        display={display}
        theme="hg-theme-default hg-theme-ios"
        preventMouseDownDefault={true}
        // onChange={input => onChange(input)}
        onKeyPress={button => onKeyPress(button)}
        onChangeAll={inputObj => onChangeAll(inputObj)}
        inputName={inputName}
      />
    </KeyboardWrapper>
  );
};