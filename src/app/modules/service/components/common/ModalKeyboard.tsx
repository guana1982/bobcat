import * as React from "react";
import styled, { keyframes } from "styled-components";
import Keyboard from "react-simple-keyboard";
import { ModalContent, Modal, ACTIONS_CONFIRM, ModalTheme, Box, Action } from "./Modal";
import { MInput, InputTheme, InputContent, InputWrapper } from "./Input";
import { ConfigContext, ServiceContext } from "@core/containers";
import "react-simple-keyboard/build/css/index.css";
import { MButton } from "./Button";
import { MKeyboard, KeyboardWrapper } from "./Keyboard";
import { __ } from "@core/utils/lib/i18n";

const dateFormat = (input: string) => {
  const lenght_ = input.length;
  if (lenght_ === 0) {
    return "MM/DD/YYYY";
  } else if (lenght_ > 0) {
    const _ = (i) => input.charAt(i) || "_";
    return `${_(0)}${_(1)}/${_(2)}${_(3)}/${_(4)}${_(5)}${_(6)}${_(7)}`;
  }
};

const ACTIONS_MULTIPLE = (cancel, finish, disableNext: boolean): Action[] => [{
  title: __("cancel"),
  event: cancel,
}, {
  title: __("finish"),
  disabled: disableNext,
  event: finish,
}];

const FullKeyboardWrapper = styled.div`
  ${InputWrapper} {
    margin: 20px auto;
  }
  ${KeyboardWrapper} {
    margin: 20px 60px 0
  }
`;

const NumberPadWrapper = styled.div`
  input {
    margin: 10px;
  }
  h3 {
    color: ${props => props.theme.light};
    margin-bottom: 5px;
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
  beverage?: any;
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

const layout = {
  [TypeLayout.Default]: ["1 2 3", "4 5 6", "7 8 9", " 0 {bksp}"],
  [TypeLayout.Shift]: ["! / #", "$ % ^", "& * (", "{bksp} ) +"],
};
const display = {
  "{bksp}": "Del",
  // "{enter}": "Go"
};

const isValidDate = (dateString: string) => {
  const date_ = new Date(dateString);
  const today_ = new Date();
  const validDate_ = date_ > today_;
  return validDate_;
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

  const keyboardEl = React.useRef(null);

  React.useEffect(() => {
    if (!state.showKeyboard) {
      return;
    }
    if (type === ModalKeyboardTypes.Multiple) {
      const keyboardEl_ = keyboardEl.current;
      keyboardEl_.setInput(state.input);
    }
  }, [state.showKeyboard]);

  //  ==== ENABLE NEXT ====>
  const [disableNext_, setDisableNext_] = React.useState<boolean>(true);

  React.useEffect(() => {
    const { input, input2 } = state;
    if (type === ModalKeyboardTypes.Multiple) {
      if (input !== "" && input2 !== "") {
        const date_ = dateFormat(state.input);
        const validDate_ = isValidDate(date_);
        if (validDate_) {
          setDisableNext_(false);
          return;
        }
      }
    } else {
      setDisableNext_(false);
      return;
    }
    setDisableNext_(true);
  }, [state.input, state.input2]);
  //  <=== ENABLE NEXT ====

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

  const toggleKeyboard = () => {
    setState(prevState => ({
      ...prevState,
      showKeyboard: true,
      showSelect: false
    }));
  };

  const toggleSelect = () => {
    setState(prevState => ({
      ...prevState,
      showSelect: true,
      showKeyboard: false
    }));
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
              ref={keyboardEl}
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

  if (type === ModalKeyboardTypes.Full)
  return (
      <Modal
        show={true}
        title={title}
        themeMode={ModalTheme.Dark}
        actions={ACTIONS_CONFIRM}
        cancel={() => cancel()}
        finish={() => finish(state.input)}
      >
        <FullKeyboardWrapper>
          <div>
            <MInput
              value={state.input}
              onChange={e => console.log(e)}
            />
            <MKeyboard
              inputName="field"
              onChangeAll={inputObj => onChangeInput(inputObj.field)}
            />
          </div>
        </FullKeyboardWrapper>
      </Modal>
  );

  const resetBibPayload = {
    "exp_date": dateFormat(state.input),
    "volume": state.input2,
    "uom": beverage.uom[0],
    "line_id": beverage.line_id
  };

  const finishMultiple = () => {
    finish(resetBibPayload);
    cancel();
  };

  if (type === ModalKeyboardTypes.Multiple)
  return (
      <Modal
        show={true}
        title={title}
        themeMode={ModalTheme.Dark}
        actions={ACTIONS_MULTIPLE(cancel, finishMultiple, disableNext_)}
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
                  ref={keyboardEl}
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
              <>
                <h3>SELECT VOLUME</h3>
                <Box className="centered">
                  { beverage.sizes.map((size, i) =>
                      <MButton key={i} onClick={() => onChangeInput2(size)}>{size}</MButton>)
                  }
                </Box>
              </>
            }
          </div>
        </NumberPadWrapper>
      </Modal>
  );
};