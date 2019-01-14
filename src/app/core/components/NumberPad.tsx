import * as React from "react";
import styled, { keyframes } from "styled-components";
import { MButton } from "../../modules/service/components/Button";
import Keyboard from "react-simple-keyboard";
import { Modal, ACTIONS_CONFIRM, Box, ModalTheme, ModalContent } from "../../modules/service/components/Modal";
import { ThemeProvider } from "styled-components";
import { themeMenu } from "@style";
import { MInput } from "@modules/service/components/Input";

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

interface NumberPadProps {

}

interface NumberPadState {
  layoutName: TypeLayout;
  input: string;
}

export class NumberPad extends React.Component<NumberPadProps, NumberPadState> {

  keyboard: any;
  readonly state: NumberPadState = {
    layoutName: TypeLayout.Default,
    input: ""
  };
  layout = {
    [TypeLayout.Default]: ["1 2 3", "4 5 6", "7 8 9", "{enter} 0 {bksp}"],
    [TypeLayout.Shift]: ["! / #", "$ % ^", "& * (", "{bksp} ) +"],
  };
  display = {
    "{bksp}": "Del",
    "{enter}": "Go"
  };

  componentDidMount() {}

  onChange = input => {
    this.setState({
      input: input
    });
    console.log("Input changed", input);
  }

  onKeyPress = button => {
    console.log("Button pressed", button);
  }

  onChangeInput = event => {
    let input = event.target.value;
    this.setState(
      {
        input: input
      },
      () => {
        this.keyboard.setInput(input);
      }
    );
  }

  render() {
    return (
      <ThemeProvider theme={themeMenu}>
        <NumberPadWrapper>
          <Modal
            title={"ENTER PIN"}
            themeMode={ModalTheme.Dark}
            content={
              <div>
                <MInput
                  value={this.state.input}
                  type="password"
                  onChange={e => console.log(e)}
                />
                <Keyboard
                  ref={r => (this.keyboard = r)}
                  layoutName={this.state.layoutName}
                  layout={this.layout}
                  display={this.display}
                  theme="hg-theme-default hg-layout-numeric numeric-theme"
                  preventMouseDownDefault={true}
                  onChange={input => this.onChange(input)}
                  onKeyPress={button => this.onKeyPress(button)}
                />
              </div>
            }
            actions={ACTIONS_CONFIRM}
          ></Modal>
        </NumberPadWrapper>
      </ThemeProvider>
    );
  }
}