import * as React from "react";
import styled, { keyframes } from "styled-components";
import { __ } from "@core/utils/lib/i18n";

export enum ModalTheme {
  Dark = "dark",
  Light = "light"
}

export const Box = styled.div`
  &:not(.container) {
    display: flex;
  }
  max-width: 1280px;
  &.centered {
    justify-content: center;
    align-items: center;
  }
  &.elements {
    padding: 0 1rem 1rem 1rem;
    flex-wrap: wrap;
    /* min-width: 900px; */
    min-width: 1050px;
    button {
      margin: .5rem;
    }
  }
  &.container {
    padding: 1rem 2rem ;
    border-top: 1px solid ${props => props.theme.dark};
    border-bottom: 1px solid ${props => props.theme.dark};
  }
  & > #title {
    text-transform: uppercase;
    color: ${props => props.theme.dark};
  }
  div#info-box {
    align-self: center;
    padding: 1rem;
    width: 100%;
    h3 {
      color: ${props => props.theme.dark};
      font-weight: 400;
      font-size: 1.2rem;
      margin: 0;
    }
  }
`;

const Overlay = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0, .6);
`;

export const ModalContent = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  min-width: 700px;
  min-height: 200px;
  background: ${props => props.theme.primary};
  * {
    font-family: 'Karla' !important;
  }
  header {
    padding: 1rem;
    h2, h3 {
      margin: 0;
      margin-left: 1rem;
      text-transform: uppercase;
      color: ${props => props.theme.dark};
    }
    h3 {
      font-weight: 400;
    }
  }
  main {
    display: flex;
    justify-content: center;
    align-items: center;
    /* padding: 1rem; */
  }
  footer {
    display: flex;
    justify-content: flex-end;
    padding: 1rem;
    button {
      text-transform: uppercase;
      font-size: 1.5rem;
      font-weight: 500;
      padding: 1rem;
      color: ${props => props.theme.dark};
      &:active {
        background: rgba(0, 0, 0, .1);
      }
    }
  }
`;

const ModalWrapper = styled.div`
  &.${ModalTheme.Dark} {
    ${Overlay} {
      background: ${props => props.theme.secondary};
      opacity: .5;
    }
    ${ModalContent} {
      background: ${props => props.theme.dark};
      header, footer {
        h2, h3, button {
          color: ${props => props.theme.light};
        }
      }
    }
  }
`;

export interface Action {
  title: string;
  icon?: any;
  event: (props) => void;
}

export const ACTIONS_CLOSE: Action[] = [{
  title: __("cancel"),
  event: (props) => props.cancel(),
}];

export const ACTIONS_CONFIRM: Action[] = [
  ...ACTIONS_CLOSE, {
  title: __("finish"),
  event: (props) => props.finish()
}];

interface ModalProps {
  themeMode?: ModalTheme;
  title: string;
  subTitle?: string;
  content: any;
  actions: Action[];
  show: boolean;
  cancel: () => void;
}

export interface ModalContentProps {
  cancel: () => void;
}


interface ModalState {

}

export const Modal = (props: ModalProps) => {
    const { title, subTitle, content, actions, themeMode, show } = props;

    const finish = () => {
      alert("Finish");
      props.cancel();
    };

    const eventActions = {
      cancel: props.cancel,
      finish: finish
    };

    const contentWithProps = () => {
      const modalProps: ModalContentProps = { cancel: props.cancel };
      return React.cloneElement(
        content,
        { ...modalProps }
      );
    };

    return (
      <React.Fragment>
        {show && <ModalWrapper className={themeMode}>
          <Overlay />
          <ModalContent>
            <header>
              <h2>{title}</h2>
              {subTitle && <h3>{subTitle}</h3>}
            </header>
            <main>
              {contentWithProps()}
            </main>
            <footer>
              { actions.map((action, index) => <button key={index} onClick={() => action.event(eventActions)}>{action.title}</button>) }
            </footer>
          </ModalContent>
        </ModalWrapper>}
      </React.Fragment>
    );
};