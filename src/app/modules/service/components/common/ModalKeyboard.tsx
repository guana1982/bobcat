import * as React from "react";
import styled, { keyframes } from "styled-components";
import Keyboard from "react-simple-keyboard";
import { ModalContent, Modal, ACTIONS_CONFIRM, ModalTheme } from "./Modal";
import { MInput } from "./Input";
import { ConfigContext, ServiceContext } from "@core/containers";
import "react-simple-keyboard/build/css/index.css";

const NumberPadWrapper = styled.div`
  position: absolute;
  z-index: 10000;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100vh;

  ${ModalContent} {
    min-width: 380px;
  }

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
  [TypeLayout.Default]: ["1 2 3", "4 5 6", "7 8 9", "{enter} 0 {bksp}"],
  [TypeLayout.Shift]: ["! / #", "$ % ^", "& * (", "{bksp} ) +"],
};
const display = {
  "{bksp}": "Del",
  "{enter}": "Go"
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

  return (
    <NumberPadWrapper>
      <Modal
        show={true}
        title={title}
        themeMode={ModalTheme.Dark}
        actions={ACTIONS_CONFIRM}
        cancel={() => cancel()}
        finish={() => finish(state.input)}
      >
        <React.Fragment>
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
        </React.Fragment>
      </Modal>
    </NumberPadWrapper>
  );
};