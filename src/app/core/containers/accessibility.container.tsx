
import * as React from "react";
import { Pages } from "@core/utils/constants";
import { withRouter } from "react-router-dom";
import { ConsumerContext } from "@core/containers";
import createContainer from "constate";

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

interface AccessibilityState {
  location: any;
  history: any;
}

interface StateLayout {
  beverageSelected?: number;
  slideOpen?: boolean;
  buttonGroupSelected?: string;
  alertShow?: boolean;
  endBeverageShow?: boolean;
}

const AccessibilityContainer = createContainer((props: AccessibilityState) => {

  const [enable, setEnable] = React.useState<boolean>(false);
  const [stop, setStop] = React.useState<boolean>(false);
  const [down, setDown] = React.useState<boolean>(false);

  const [stateLayout, setStateLayout] = React.useState<StateLayout>({
    beverageSelected: null,
    slideOpen: false,
    buttonGroupSelected: null,
    alertShow: false,
    endBeverageShow: false
  });

  const [pour, setPour] = React.useState<boolean>(null);
  const [enter, setEnter] = React.useState<boolean>(null);

  //  ==== DETECT CHANGE DOM ====
  //  ================================

  const { pathname } = props.location;
  React.useEffect(() => {
    detectChangePage(pathname);
  }, [enable, pathname]);

  function detectChangePage(pathname) {
    if (!enable)
      return;

    if (pathname === Pages.Attractor) {
      return;
    }

    const buttons = detectButtons();
    focusElement(buttons[0]);
  }

  function changeStateLayout(updatedValues: StateLayout) {
    setStateLayout(prevState => ({
      ...prevState,
      ...updatedValues
    }));
  }

  //  ==== ON CHANGE STATE LAYOUT ====
  //  ================================

  //  ==== BEVERAGE SELECTED CASE ====
  React.useEffect(() => {
    const buttons = detectButtons();
    focusElement(buttons[0]);
  }, [stateLayout.beverageSelected]);

  //  ==== SLIDE OPEN CASE ====
  React.useEffect(() => {
    if (stateLayout.slideOpen) {
      const buttons = detectButtons();
      focusElement(buttons.length > 2 ? buttons[1] : buttons[0]);
    }
  }, [stateLayout.slideOpen]);

  //  ==== BUTTON GROUP CASE ====
  React.useEffect(() => {
    if (stateLayout.buttonGroupSelected !== null) {
      const buttons = detectButtons();
      focusElement(buttons[1] || buttons[0]);
    }
  }, [stateLayout.buttonGroupSelected]);

  //  ==== ALERT || END BEVERAGE CASE ====
  const { alertShow, endBeverageShow } = stateLayout;
  React.useEffect(() => {
    console.log({alertShow, endBeverageShow});
    if (alertShow || endBeverageShow) {
      // focusRemove();
      setDown(false);
      setEnable(false);
      setPour(false);
      setStop(true);
    }
    if (!alertShow && !endBeverageShow) {
      setStop(false);
    }
  }, [alertShow, endBeverageShow]);

  React.useEffect(() => {
    console.log("stop", stop);
  }, [stop]);

  //  ==== DETECT STATUS FOR STYLE ====
  //  ================================

  React.useEffect(() => {
    if (enable) {
      document.body.classList.add("accessibility-enable");
    } else {
      document.body.classList.remove("accessibility-enable");
    }
  }, [enable]);


  //  ==== CONSTRUCTOR ====
  //  ================================

  React.useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("touchend", onTouchEnd);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.addEventListener("touchend", onTouchEnd);
    };
  }, [down, enable, stop, props.location.pathname]);

  //  ==== EVENTS FUNCTION ====
  //  ================================

  function onKeyDown(evt: KeyboardEvent) {
    this.evt = evt;
    const event = KeyMapping[evt.keyCode];
    const direction = Direction[event];
    const action = Action[event];

    //  ==== KEY NOT VALID ====
    if (direction === undefined && action === undefined)
      return;

    //  ==== INIT CONDITION ====
    const { pathname } = props.location;
    if (pathname === Pages.Attractor) {
      setEnable(true);
      props.history.push(Pages.Home);
      return;
    }

    //  ==== ENABLE CONDITION ====
    if (!enable) {
      setEnable(true);
      return;
    }

    //  ==== DIRECTION EVENT ====
    if (direction !== undefined) {
      directionEvent(direction);
    }

    //  ==== ACTION EVENT ====
    if (action !== undefined) {
      if (down) {
        return;
      }
      setDown(true);

      const endPour = () => {
        setDown(false);
        actionEndEvent(action);
        document.removeEventListener("keyup", endPour);
      };

      document.addEventListener("keyup", endPour);

      actionStartEvent(action);
    }
  }

  function onTouchEnd(evt) {
    setEnable(false);
  }

  function directionEvent(event: Direction) {
    if (stop) return; // ==> STOP CONDITION

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

  function actionStartEvent(event: Action) {
    if (stop && event !== Action.ENTER) return; // ==> STOP CONDITION

    if (event === Action.BACK) {
      backAction();
    }
    if (event === Action.ENTER) {
      setEnter(true);
      if (stop) return; // ==> STOP CONDITION
      const btnFocused = buttonFocused();
      btnFocused.click();
    }
    if (event === Action.POUR) {
      setPour(true);
    }
  }

  function actionEndEvent(event: Action) {
    if (event === Action.ENTER) {
      setEnter(false);
    }
    if (event === Action.POUR) {
      setPour(false);
    }
  }

  //  ==== UTILS FUNCTION ====
  //  ================================

  function backAction() {

    // === BUTTON GROUP CASE ===
    const { buttonGroupSelected } = stateLayout;
    if (buttonGroupSelected !== null) {
      const buttonToFocus = getSpecificButton(`${buttonGroupSelected}-button_group`);
      focusElement(buttonToFocus);
      setStateLayout(prevState => ({
        ...prevState,
        buttonGroupSelected: null
      }));
      return;
    }

    // === BEVERAGE SELECTED CASE ===
    const { beverageSelected } = stateLayout;
    if (beverageSelected !== null) {
      const buttonToFocus = getSpecificButton(`beverage_close`);
      buttonToFocus.click();
      return;
    }

    // === PREPAY PAGE CASE ===
    const buttonPrepayClose = getSpecificButton(`prepay_close`);
    if (buttonPrepayClose) {
      buttonPrepayClose.click();
      return;
    }

    // === SLIDE OPEN CASE ===
    const { slideOpen } = stateLayout;
    if (slideOpen) {
      const buttons = detectButtons();
      focusElement(buttons.length > 2 ? buttons[1] : buttons[0]);
      return;
    }

    // === HOME CASE ===
    const { pathname } = props.location;
    if (pathname === Pages.Home) {
      const buttons = detectButtons();
      focusElement(buttons[0]);
      return;
    }
  }

  const detectButtons = () => {
    let buttons = Array.from(document.getElementsByTagName("button"));

    // === FILTER BUTTONS ===
    buttons = buttons.filter(button => {

      const idValues = button.id.split("-"); // => GET TYPE BUTTON

      // === BUTTON GROUP CASE ==>
      if (stateLayout.buttonGroupSelected !== null) {
        if (idValues[0] === stateLayout.buttonGroupSelected && idValues[1] === "option") {
          return true;
        } else {
          return false;
        }
      } else {
        if (idValues[1] === "option") {
          return false;
        }
      }

      return !button.disabled; // => REMOVE DISABLED BUTTON
    });

    // === SORT BUTTONS ===

    return buttons;
  };

  function buttonFocused(): any {
    const activeElementDomument = document.activeElement;
    return activeElementDomument;
  }

  function indexButtonFocused(buttons): number {
    const activeElementDomument = buttonFocused();
    const indexActiveElement = buttons.indexOf(activeElementDomument);
    return indexActiveElement;
  }

  function getSpecificButton(identifier: string): any {
    return document.getElementById(identifier);
  }

  function focusElement(element) {
    if (element)
      element.focus();
    else
      console.log("Focus: ", "Not element available");
  }

  // function focusRemove() {
  //   const activeElementDomument: any = buttonFocused();
  //   if (activeElementDomument !== document.body) activeElementDomument.blur();
  // }

  return { pour, enter, changeStateLayout };
});

export const AccessibilityProvider = withRouter(AccessibilityContainer.Provider);
export const AccessibilityContext = AccessibilityContainer.Context;


// === SIMPLE DETECT BUTTONS =>
// ==================
// const detectButtons = React.useCallback(
//   () => {
//     let buttons = Array.from(document.getElementsByTagName("button"));
//     console.log("buttons", buttons);
//     buttons = buttons.filter(button => !button.disabled);
//     return buttons;
//   },
//   [stateLayout],
// );