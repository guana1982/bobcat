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
  ${InputContent}.selected input {
    border: 3px solid #009933;
  }
  ${InputWrapper} {
    margin: 20px auto;
  }
  ${KeyboardWrapper} {
    margin: 20px 60px 0
  }
  &.vector-number {
    .values {
      display: flex;
      flex-wrap: wrap;
      padding: 20px;
      width: 801px;
      justify-content: center;
    }
    ${InputWrapper} {
      margin: 7px;
    }
    .numeric-theme {
      max-width: 320px;
      margin: auto;
    }
  }
  &.bobcat-name {
    .values {
      display: flex;
      justify-content: center;
      .input-field {
        display: flex;
        &:nth-child(1), &:nth-child(2), &:nth-child(3) {
          input {
            width: 50px;
          }
        }
        &:nth-child(4) {
          input {
            width: 150px;
          }
        }
      }
      span {
        width: 20px;
        color: #fff;
        align-self: center;
        text-align: center;
        font-size: 30px;
      }
    }
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
  Number = "number",
  Shift = "shift"
}

export enum ModalKeyboardTypes {
  Multiple = "multiple",
  Number = "number",
  VectorNumber = "vector-number",
  Default = "default",
  Auth = "auth",
  Full = "full"
}

interface NumberPadProps {
  beverage?: any;
  title: string;
  type: ModalKeyboardTypes;
  id?: string;
  form?: any;
  cancel: () => void;
  finish: (output: any) => void;
  inputType?: string;
}

interface NumberPadState {
  showKeyboard: boolean;
  showSelect: boolean;
  layoutName: TypeLayout;
  input: string;
  input2: string;
  form: any;
}

const layout = {
  [TypeLayout.Default]: ["1 2 3", "4 5 6", "7 8 9", " 0 {bksp}"],
  [TypeLayout.Number]: ["1 2 3", "4 5 6", "7 8 9", ". 0 {bksp}"],
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

  const { beverage, title, type, cancel, finish, form, inputType, id } = props;

  const [fieldSelected, setFieldSelected] = React.useState(0);

  const [state, setState] = React.useState<NumberPadState>({
    showKeyboard: type === ModalKeyboardTypes.Multiple ? false : true,
    showSelect: false,
    layoutName: TypeLayout.Default,
    form: form,
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
      keyboardEl_.setInput(state.input.toString());
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

  React.useEffect(() => {
    if (type === ModalKeyboardTypes.VectorNumber || type === ModalKeyboardTypes.Number) {
      const keyboardEl_ = keyboardEl.current;
      Object.keys(form).forEach(key => {
        keyboardEl_.setInput(form[key].toString(), key);
      });
    }
  }, [form]);

  const onChangeAll = inputObj => {
    delete inputObj.default;
    setState(prevState => ({
      ...prevState,
      form: Object.keys(inputObj).map(k => inputObj[k])
    }));
  };

  //  ==== CUSTOM BY ID ====>

  if (id === "bobcat_name" || id === "bobcat_name_check") {
    const { input } = state;
    const form_ = [input.slice(0, 2), input.slice(2, 4), input.slice(4, 7), input.slice(7, 17)];
    const separetor_ = [".", ".", "-", ""];
    return (
      <Modal
        show={true}
        title={title}
        themeMode={ModalTheme.Dark}
        actions={ACTIONS_CONFIRM}
        cancel={() => cancel()}
        finish={() => finish(`${form_[0]}${separetor_[0]}${form_[1]}${separetor_[1]}${form_[2]}${separetor_[2]}${form_[3]}`)}
      >
        <FullKeyboardWrapper className="bobcat-name">
          <div>
            <div className="values">
            {
                form_.map((inputValue, i) => (
                  <div className="input-field">
                    <MInput
                      key={i}
                      type={inputType}
                      value={inputValue}
                    />
                    <span>{separetor_[i]}</span>
                  </div>
                ))
              }
              </div>
            <MKeyboard
              inputName="field"
              onChangeAll={inputObj => onChangeInput(inputObj.field)}
              maxLength={17}
            />
          </div>
        </FullKeyboardWrapper>
      </Modal>
    );
  }

  //  <=== CUSTOM BY ID ====

  if (type === ModalKeyboardTypes.Number || type === ModalKeyboardTypes.VectorNumber)
  return (
    <Modal
      show={true}
      title={title}
      themeMode={ModalTheme.Dark}
      actions={ACTIONS_CONFIRM}
      cancel={() => cancel()}
      finish={() => finish(type === ModalKeyboardTypes.Number ? state.form[0] : state.form)}
    >
      <FullKeyboardWrapper className={type}>
        <div>
          <div className="values">
          {
            state.form.map((inputValue, i) => (
              <MInput
                className={`value ${fieldSelected === i ? "selected" : ""}`}
                key={i}
                click={() => setFieldSelected(i)}
                value={inputValue}
                onChange={e => console.log(e)}
              />
            ))
          }
          </div>
          <Keyboard
            ref={keyboardEl}
            layoutName={TypeLayout.Number}
            layout={layout}
            display={display}
            theme="hg-theme-default hg-layout-numeric numeric-theme"
            preventMouseDownDefault={true}
            inputName={fieldSelected}
            onChangeAll={(all) => onChangeAll(all) }
          />
        </div>
      </FullKeyboardWrapper>
    </Modal>
  );

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
              type={inputType}
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