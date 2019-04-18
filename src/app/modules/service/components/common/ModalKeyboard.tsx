import * as React from "react";
import styled, { keyframes } from "styled-components";
import Keyboard from "react-simple-keyboard";
import { ModalContent, Modal, ACTIONS_CONFIRM, ModalTheme } from "./Modal";
import { MInput, InputTheme, InputContent } from "./Input";
import { ConfigContext, ServiceContext } from "@core/containers";
import "react-simple-keyboard/build/css/index.css";

const dateFormat = (input: string) => {
  const lenght_ = input.length;
  if (lenght_ === 0) {
    return "MM/DD/YYYY";
  } else if (lenght_ > 0) {
    const _ = (i) => input.charAt(i) || "_";
    return `${_(0)}${_(1)}/${_(2)}${_(3)}/${_(4)}${_(5)}${_(6)}${_(7)}`;
  }
};

const NumberPadWrapper = styled.div`
  input {
    margin: 10px;
  }
  .react-simple-keyboard {
    margin-top: 15px !important;
  }
  /* ${ModalContent} {
    min-width: 380px;
  } */
  .numeric-theme {
    max-width: 320px;
    margin: 0 auto;
  }
  .numeric-theme + .simple-keyboard-preview {
    max-width: 320px;
  }
  .simple-keyboard.hg-theme-default {
    background: transparent;
  }
  .simple-keyboard.hg-theme-default.numeric-theme
    .hg-button.hg-standardBtn.hg-button-at {
    max-width: none;
  }
`;

enum TypeLayout {
  Default = "default",
  Shift = "shift"
}

export enum ModalKeyboardTypes {
  Multiple = "multiple",
  Default = "default",
  Auth = "auth",
  Full = "full"
}

interface NumberPadProps {
  title: string;
  type: ModalKeyboardTypes;
  cancel: () => void;
  finish: (output: any) => void;
}

interface NumberPadState {
  layoutName: TypeLayout;
  input: string;
}

let keyboard: any;
const layout = {
  [TypeLayout.Default]: ["1 2 3", "4 5 6", "7 8 9", " 0 {bksp}"],
  [TypeLayout.Shift]: ["! / #", "$ % ^", "& * (", "{bksp} ) +"],
};
const display = {
  "{bksp}": "Del",
  // "{enter}": "Go"
};

export const ModalKeyboard = (props: NumberPadProps) => {

  const { title, type, cancel, finish } = props;

  const [state, setState] = React.useState<NumberPadState>({
    layoutName: TypeLayout.Default,
    input: ""
  });

  const onChange = input => {
    setState(prevState => ({
      ...prevState,
      input: input,
    }));
    console.log("Input changed", input);
  };

  const onKeyPress = button => {
    console.log("Button pressed", button);
  };

  const onChangeInput = event => {
    let input = event.target.value;
    setState(prevState => ({
      ...prevState,
      input: input,
    }));
    keyboard.setInput(input);
  };

  if (type === ModalKeyboardTypes.Auth)
  return (
      <Modal
        show={true}
        title={title}
        themeMode={ModalTheme.Dark}
        actions={ACTIONS_CONFIRM}
        cancel={() => cancel()}
        finish={() => finish(state.input)}
      >
        <NumberPadWrapper>
          <div>
            <MInput
              value={state.input}
              type="password"
              onChange={e => console.log(e)}
            />
            <Keyboard
              ref={r => (keyboard = r)}
              layoutName={state.layoutName}
              layout={layout}
              display={display}
              theme="hg-theme-default hg-layout-numeric numeric-theme"
              preventMouseDownDefault={true}
              onChange={input => onChange(input)}
              onKeyPress={button => onKeyPress(button)}
            />
          </div>
        </NumberPadWrapper>
      </Modal>
  );

  if (type === ModalKeyboardTypes.Multiple)
  return (
      <Modal
        show={true}
        title={title}
        themeMode={ModalTheme.Dark}
        actions={ACTIONS_CONFIRM}
        cancel={() => cancel()}
        finish={() => finish(state.input)}
      >
        <NumberPadWrapper>
          <div>
            <MInput
              label="EXPIRATION DATE:"
              themeMode={InputTheme.Light}
              disabled
              value={dateFormat(state.input)}
              onChange={e => console.log(e)}
            />
            <MInput
              label="VOLUME (GAL):"
              themeMode={InputTheme.Light}
              disabled
              value={state.input}
              type="number"
              onChange={e => console.log(e)}
            />
            <Keyboard
              ref={r => (keyboard = r)}
              layoutName={state.layoutName}
              layout={layout}
              display={display}
              theme="hg-theme-default hg-layout-numeric numeric-theme"
              preventMouseDownDefault={true}
              onChange={input => onChange(input)}
              onKeyPress={button => onKeyPress(button)}
            />
          </div>
        </NumberPadWrapper>
      </Modal>
  );
};