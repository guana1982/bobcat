import * as React from "react";
import styled, { keyframes } from "styled-components";
import Keyboard from "react-simple-keyboard";
import { ModalContent, Modal, ACTIONS_CONFIRM, ModalTheme, Box } from "./Modal";
import { MInput, InputTheme, InputContent } from "./Input";
import { ConfigContext, ServiceContext } from "@core/containers";
import "react-simple-keyboard/build/css/index.css";
import { MButton } from "./Button";

const dateFormat = (input: string) => {
  console.log('format', input);
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
  beverage: any;
  title: string;
  type: ModalKeyboardTypes;
  cancel: () => void;
  finish: (output: any) => void;
}

interface NumberPadState {
  showKeyboard: boolean;
  showSelect: boolean;
  layoutName: TypeLayout;
  input: string;
  input2: string;
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

  const { beverage, title, type, cancel, finish } = props;

  const [state, setState] = React.useState<NumberPadState>({
    showKeyboard: type === ModalKeyboardTypes.Multiple ? false : true,
    showSelect: false,
    layoutName: TypeLayout.Default,
    input: "",
    input2: ""
  });

  const onChangeInput = input => {
    setState(prevState => ({
      ...prevState,
      input: input
    }));
    // console.log("Input changed", input);
  };

  const onChangeInput2 = input => {
    setState(prevState => ({
      ...prevState,
      input2: input,
    }));
    // console.log("Input changed", input);
  };

  const onKeyPress = button => {
    // console.log("Button pressed", button);
  };

  // const onChangeInput = event => {
  //   let input = event.target.value;
  //   setState(prevState => ({
  //     ...prevState,
  //     input: input,
  //   }));
  //   keyboard.setInput(input);
  // };

  const toggleKeyboard = () => {
    setState(prevState => ({
      ...prevState,
      showKeyboard: true,
      showSelect: false
    }))
  }

  const toggleSelect = () => {
    setState(prevState => ({
      ...prevState,
      showSelect: true,
      showKeyboard: false
    }))
  }
  
  const resetBibPayload = {
    "exp_date": dateFormat(state.input),
    "volume": state.input2,
    "uom": beverage.uom[0],
    "line_id": beverage.line_id
  }

  
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
              onChange={input => onChangeInput(input)}
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
        finish={() => finish(resetBibPayload)}
      >
        <NumberPadWrapper>
          <div>
            <MInput
              label="EXPIRATION DATE:"
              themeMode={InputTheme.Light}
              disabled
              value={dateFormat(state.input)}
              onChange={e => console.log(e)}
              click={() => toggleKeyboard()}
            />
            <MInput
              label="VOLUME (GAL):"
              themeMode={InputTheme.Light}
              disabled
              value={state.input2}
              type="number"
              onChange={e => console.log(e)}
              click={() => toggleSelect()}
            />
            { state.showKeyboard &&
                <Keyboard
                  ref={r => (keyboard = r)}
                  layoutName={state.layoutName}
                  layout={layout}
                  display={display}
                  theme="hg-theme-default hg-layout-numeric numeric-theme"
                  preventMouseDownDefault={true}
                  onChange={input => onChangeInput(input)}
                  onKeyPress={button => onKeyPress(button)}
                  maxLength={8}
                />
            }
            { state.showSelect &&
              <Box className="centered">
                { beverage.sizes.map(size =>
                    <MButton onClick={() => onChangeInput2(size)}>{size}</MButton>)
                }
              </Box>
            }
          </div>
        </NumberPadWrapper>
      </Modal>
  );
};