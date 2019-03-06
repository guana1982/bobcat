
import * as React from "react";
import { Pages } from "@core/utils/constants";
import { withRouter } from "react-router-dom";
import { ConsumerContext } from "@core/containers";

enum Action {
  BACK,
  ENTER,
  POUR
}

enum Direction {
  LEFT,
  RIGHT
}

enum KeyMapping {
  BACK = 65,
  LEFT = 83,
  RIGHT = 68,
  ENTER = 70,
  POUR = 71
}

const AccessibilityComponent = (props) => {

  const [enable, setEnable] = React.useState<boolean>(false);

  //  ==== DETECT CHANGE CONTENT ====
  React.useEffect(() => {
    const { pathname } = props.location;
    changeContent(pathname);
  }, [enable, props.location, props.history]);

  function changeContent(pathname) {
     // ==== INIT EVENT ====
    if (!enable)
      return;

    if (pathname === Pages.Attractor) {
      props.history.push(Pages.Home);
      return;
    }

    const buttons = detectButtons();
    focusElement(buttons[0]);
  }

  //  ==== CONSTRUCTOR ====
  React.useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  function onKeyDown(evt: KeyboardEvent) {
    this.evt = evt;
    const event = KeyMapping[evt.keyCode];
    const direction = Direction[event];
    const action = Action[event];

    if (!enable) {
      setEnable(true);
    }

    //  ==== KEY NOT VALID ====
    if (direction === undefined && action === undefined)
      return;

    //  ==== DIRECTION EVENT ====
    if (direction !== undefined) {
      directionEvent(direction);
    }

    //  ==== ACTION EVENT ====
    if (action !== undefined) {
      actionEvent(action);
    }

  }

  //  ==== EVENTS FUNCTION ====
  //  ================================

  function directionEvent(event: Direction) {
    const buttons = detectButtons();
    const indexFocused_ = indexButtonFocused(buttons);
    if (indexFocused_ === -1) {
      return;
    }

    let index = null;
    if (event === Direction.LEFT) {
      index = indexFocused_ !== 0 ? indexFocused_ - 1 : buttons.length - 1;
    }
    if (event === Direction.RIGHT) {
      index = indexFocused_ !== buttons.length - 1 ? indexFocused_ + 1 : 0;
    }
    focusElement(buttons[index]);
  }

  function actionEvent(event: Action) {
    if (event === Action.BACK) {
      const { pathname } = props.location;
      if (pathname === Pages.Home) {
        const buttons = detectButtons();
        focusElement(buttons[0]);
      }
    }
    if (event === Action.ENTER) {
      const buttonFocused_ = buttonFocused();
      console.log("buttonFocused_", buttonFocused_);
      console.log("focusPress", buttonFocused_.attributes);
    }
    if (event === Action.POUR) {
      console.log("POUR");
    }
  }

  //  ==== UTILS FUNCTION ====
  //  ================================

  function detectButtons() {
    const buttons = Array.from(document.getElementsByTagName("button"));
    console.log("buttons", buttons);
    // buttons.forEach(button => {

    // });
    return buttons;
  }

  function buttonFocused(): any {
    const activeElementDomument = document.activeElement;
    return activeElementDomument;
  }

  function indexButtonFocused(buttons): number {
    const activeElementDomument = document.activeElement;
    const indexActiveElement = buttons.indexOf(activeElementDomument);
    return indexActiveElement;
  }

  function focusElement(element) {
    if (element)
      element.focus();
    else
      console.log("Focus: ", "Not element available");
  }

  return (null);
};

export const Accessibility = withRouter(AccessibilityComponent);