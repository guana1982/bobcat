import * as React from "react";
import * as ReactDOM from "react-dom";

export enum FocusElm {
  Controller = "focus-controller",
  Horizontal = "focus-horizontal"
}

enum KeyMapping {
  LEFT = 37,
  UP = 38,
  RIGHT = 39,
  DOWN = 40,
  ENTER = 13
}

export interface AccessibilityInterface {

}

const AccessibilityContext = React.createContext<AccessibilityInterface | null>(null);

export const AccessibilityProvider = AccessibilityContext.Provider;
export const AccessibilityConsumer = AccessibilityContext.Consumer;

class AccessibilityStoreComponent extends React.Component<any, any> {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    window.addEventListener("keydown", this.onKeyDown.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.onKeyDown.bind(this));
  }

  onKeyDown(evt: KeyboardEvent) {
    const direction = KeyMapping[evt.keyCode];
    if (direction) {
      console.log(direction);
      const root = document.getElementById("root");
      const buttons = root.getElementsByTagName("button");
      console.log(buttons);
      console.log(buttons[0].getBoundingClientRect());
    }
  }

  render() {
    const { children } = this.props;
    return (
      <AccessibilityProvider
        value={{

        }}
      >
        {children}
      </AccessibilityProvider>
    );
  }

}

export const AccessibilityStore = AccessibilityStoreComponent;