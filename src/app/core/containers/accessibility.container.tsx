
import * as React from "react";
import { Pages, debounce, MESSAGE_STOP_EROGATION } from "@core/utils/constants";
import { withRouter } from "react-router-dom";
import createUseContext from "constate";
import { StatusEndSession } from "@modules/consumer/screens/Home";

export enum Action {
  BACK,
  ENTER,
  POUR
}

export enum Direction {
  LEFT,
  RIGHT
}

export enum KeyMapping {
  BACK = 97,
  LEFT = 115,
  RIGHT = 100,
  ENTER = 102,
  POUR = 103
}

interface AccessibilityState {
  location: any;
  history: any;
}

interface StateLayout {
  beverageSelected?: number;
  nutritionFacts?: boolean;
  slideOpen?: boolean;
  fullMode?: boolean;
  buttonGroupSelected?: string;
  alertShow?: boolean;
  endSession?: StatusEndSession | MESSAGE_STOP_EROGATION;
}

const AccessibilityContainer = createUseContext((props: AccessibilityState) => {

  const [enable, setEnable] = React.useState<boolean>(false);
  const [stop, setStop] = React.useState<boolean>(false);
  const [down, setDown] = React.useState<boolean>(false);

  const [stateLayout, setStateLayout] = React.useState<StateLayout>({
    beverageSelected: null,
    nutritionFacts: false,
    slideOpen: false,
    fullMode: false,
    buttonGroupSelected: null,
    alertShow: false,
    endSession: null
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

  //  ==== ALERT CASE ====
  const { alertShow } = stateLayout;
  React.useEffect(() => {
    console.log({alertShow});
    if (alertShow) {
      // setDown(false);
      // setEnable(false);
      // setPour(false);
      // setStop(true);
      const buttonClose = getSpecificButton(`alert_close`);
      const buttons = detectButtons();
      focusElement(buttonClose || buttons[0]);
    } else {
      // setStop(false);
      const buttons = detectButtons();
      focusElement(buttons[0]);
    }
  }, [alertShow]);

  //  ==== BEVERAGE SELECTED CASE & NUTRITION FACTS CASE ====
  React.useEffect(() => {
    const buttons = detectButtons();
    focusElement(buttons[0]);
  }, [stateLayout.beverageSelected, stateLayout.nutritionFacts]);

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

  //  ==== END BEVERAGE ====
  React.useEffect(() => {
    if (stateLayout.endSession === StatusEndSession.Start) {
      const buttons = detectButtons();
      focusElement(buttons[0]);
    }
  }, [stateLayout.endSession]);

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
    document.addEventListener("keypress", onKeyDown);
    document.addEventListener("touchend", onTouchEnd);
    return () => {
      document.removeEventListener("keypress", onKeyDown);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, [down, enable, stop, props.location.pathname]);

  //  ==== EVENTS FUNCTION ====
  //  ================================

  const onKeyDown = (evt: KeyboardEvent) => {
    this.evt = evt;
    const event = KeyMapping[evt.keyCode];
    const direction = Direction[event];
    const action = Action[event];
    const { pathname } = props.location;

    //  ==== ONLY CONSUMER UI ====
    if (!(pathname === Pages.Attractor || pathname === Pages.Home || pathname === Pages.Prepay))
      return;

    //  ==== KEY NOT VALID ====
    if (direction === undefined && action === undefined)
      return;

    //  ==== INIT CONDITION ====
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
  };

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

    // === ALERT CASE ===
    const buttonAlertClose = getSpecificButton(`alert_close`);
    if (buttonAlertClose) {
      buttonAlertClose.click();
      return;
    }

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

    // === END SESSION (POURING) ===
    const { endSession } = stateLayout;
    if (endSession === "start") {
      const buttonToFocus = getSpecificButton(`exit-btn`);
      buttonToFocus.click();
      return;
    }

    // === BEVERAGE SELECTED CASE ===
    const { beverageSelected } = stateLayout;
    if (beverageSelected !== null) {
      const buttonToFocus = getSpecificButton(`beverage_close`);
      buttonToFocus.click();
      return;
    }

    // === NUTRITION FACTS CASE ===
    const { nutritionFacts } = stateLayout;
    if (nutritionFacts) {
      const buttonToFocus = getSpecificButton(`nutrition-btn`);
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

  const detectButtons = React.useCallback(() => {
    let buttons = Array.from(document.getElementsByTagName("button"));

    // === FILTER BUTTONS ===
    buttons = buttons.filter(button => {

      if (button.disabled) {
        return false; // => REMOVE DISABLED BUTTON
      }

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

      // === SLIDE OPEN CASE ==>
      if (!stateLayout.beverageSelected && stateLayout.endSession !== StatusEndSession.Start) {
        if (stateLayout.slideOpen === true) {
          return idValues[0] === "slide";
        } else if (stateLayout.slideOpen === false) {
          if (stateLayout.fullMode) {
            return !(idValues[0] === "slide" && idValues[1] === "beverage");
          } else {
            return true;
          }
        }
      }

      return true;
    });

    // === SORT BUTTONS ===

    // === BUTTON GROUP CASE ===
    if (stateLayout.buttonGroupSelected !== null) {
      return buttons;
    }

    // === BEVERAGE SELECTED CASE ===
    if (stateLayout.beverageSelected !== null) {
      const lastIndex = buttons.length - 1;
      const initButtons = buttons.slice(0, 3);
      const contentButtons = buttons.slice(3, lastIndex);
      const pourButton = buttons.slice(lastIndex);
      buttons = [...pourButton, ...contentButtons, ...initButtons];
    }

    // === SLIDE OPEN ===
    // if (stateLayout.slideOpen === false) {
    //   buttons.sort((a, b) => {
    //     const c_ = (v) => Number(v.id.split("-")[0] === "slide");
    //     return  c_(a) - c_(b);
    //   });
    // }

    return buttons;
  }, [stateLayout]);

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