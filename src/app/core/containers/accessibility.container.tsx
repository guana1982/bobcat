
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

const AccessibilityContainer = createContainer((props: AccessibilityState) => {

  const [enable, setEnable] = React.useState<boolean>(false);
  const [down, setDown] = React.useState<boolean>(false);

  const [pour, setPour] = React.useState<boolean>(null);
  const [enter, setEnter] = React.useState<boolean>(null);

  //  ==== DETECT CHANGE CONTENT ====
  React.useEffect(() => {
    const { pathname } = props.location;
    changeContent(pathname);
  }, [enable, props.location, props.history]);

  function changeContent(pathname?) {
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
  }, [down]);

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
      if (down) {
        return;
      }
      setDown(true);

      const endPour = () => {
        setDown(false);
        actionEndEvent(action);
        window.removeEventListener("keyup", endPour);
      };

      window.addEventListener("keyup", endPour);

      actionStartEvent(action);
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

  function actionStartEvent(event: Action) {
    if (event === Action.BACK) {
      const { pathname } = props.location;
      if (pathname === Pages.Home) {
        const buttons = detectButtons();
        focusElement(buttons[0]);
      }
    }
    if (event === Action.ENTER) {
      setEnter(true);
      const btnFocused = buttonFocused();
      btnFocused.click();
    }
    if (event === Action.POUR) {
      console.log("||| START POUR |||");
      setPour(true);
    }
  }

  function actionEndEvent(event: Action) {
    if (event === Action.ENTER) {
      setEnter(false);
    }
    if (event === Action.POUR) {
      console.log("||| END POUR |||");
      setPour(false);
    }
  }

  //  ==== UTILS FUNCTION ====
  //  ================================

  function detectButtons() {
    let buttons = Array.from(document.getElementsByTagName("button"));
    console.log("buttons", buttons);
    buttons = buttons.filter(button => !button.disabled);
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

  return { pour, enter, changeContent };
});

export const AccessibilityProvider = withRouter(AccessibilityContainer.Provider);
export const AccessibilityContext = AccessibilityContainer.Context;




// import * as React from "react";
// import { withRouter } from "react-router-dom";
// import { Pages } from "../utils/constants";

// export enum FocusAttribute {
//   Button = "data-btn-focus",
//   Container =  "data-focus"
// }

// export enum FocusElm {
//   Controller = "focus-controller",
//   Init = "init-focus",
//   Disable = "no-focus",
//   Extra = "extra-focus"
// }

// enum Actions {
//   ENTER
// }

// enum Direction {
//   LEFT,
//   UP,
//   RIGHT,
//   DOWN
// }

// const valuesAngle = [135, 45, 225, 315];
// const DirectiontAngle = {
//   LEFT:   [[valuesAngle[0], 180], [180, valuesAngle[2]]],
//   UP:     [[valuesAngle[1], 90], [90, valuesAngle[0]]],
//   RIGHT:  [[valuesAngle[3], 360], [0, valuesAngle[1]]],
//   DOWN:   [[valuesAngle[2], 270], [270, valuesAngle[3]]],
// };

// enum KeyMapping {
//   LEFT = 37,
//   UP = 38,
//   RIGHT = 39,
//   DOWN = 40,
//   ENTER = 13
// }

// class Point {
//   x: number;
//   y: number;

//   constructor(x, y) {
//     this.x = x;
//     this.y = y;
//   }

//   distance(point: Point) {
//     return Math.hypot(point.x - this.x, point.y - this.y);
//   }

//   angle(point: Point) {
//     return Math.atan2(-(this.y - point.y), this.x - point.x) * 180 / Math.PI + 180;
//   }

// }

// interface Parent {
//   element: HTMLButtonElement;
//   rect: DOMRect;
//   point?: Point;
// }

// export interface AccessibilityInterface {

// }

// const AccessibilityContext = React.createContext<AccessibilityInterface | null>(null);

// export const AccessibilityProvider = AccessibilityContext.Provider;
// export const AccessibilityConsumer = AccessibilityContext.Consumer;

// class AccessibilityStoreComponent extends React.Component<any, any> {

//   handleKeyDown: any;

//   evt: KeyboardEvent;
//   direction: Direction;
//   action: Actions;

//   lastContainer: any[];
//   parents: Parent[];
//   activeElement: any;

//   constructor(props) {
//     super(props);
//     this.handleKeyDown = this.onKeyDown.bind(this);
//   }

//   componentDidMount() {
//     window.addEventListener("keydown", this.handleKeyDown);
//   }

//   componentWillUnmount() {
//     window.removeEventListener("keydown", this.handleKeyDown);
//   }

//   getContainers(): any[] {
//     return Array.from(document.querySelectorAll(`[${FocusAttribute.Container}=${FocusElm.Controller}]`));
//   }

//   getButtons(container): any[] {
//     return Array.from(container.getElementsByTagName("button"));
//   }

//   getExtraButtons(): any[] {
//     const extraContainers = Array.from(document.querySelectorAll(`[${FocusAttribute.Container}=${FocusElm.Extra}]`));
//     let buttons = [];
//     extraContainers.forEach(extraContainers => {
//       const buttonsContainer = this.getButtons(extraContainers);
//       buttons = buttons.concat(buttonsContainer);
//     });
//     return buttons;
//   }

//   getActiveElement(parents: Parent[]): any {
//     const activeElementDomument = document.activeElement;
//     const activeElement = parents.filter(parent => {
//       return parent.element === activeElementDomument;
//     })[0];
//     return activeElement;
//   }

//   getInitElement(parents: Parent[]): any {
//     return parents.filter(parent => {
//       return parent.element.getAttribute(FocusAttribute.Button) === FocusElm.Init;
//     })[0];
//   }

//   getParents(buttons: any[]): Parent[] {
//     let parents = [];
//     buttons = buttons.filter(element => {
//       return element.getAttribute(FocusAttribute.Button) !== FocusElm.Disable;
//     });
//     buttons.forEach(element => {
//       const rect: any = element.getBoundingClientRect();
//       const x = rect.left + rect.width / 2;
//       const y = rect.top + rect.height / 2;
//       const point = new Point(x, y);
//       const parent: Parent = { element, rect, point };
//       parents.push(parent);
//     });
//     return parents;
//   }

//   onKeyDown(evt: KeyboardEvent) {
//     this.evt = evt;
//     const event = KeyMapping[evt.keyCode];
//     const direction = Direction[event];
//     const action = Actions[event];

//     if (direction === undefined && action === undefined)
//       return;

//     const { pathname } = this.props.location;
//     if (pathname === Pages.Attractor)
//       this.props.history.push(Pages.Home);

//     this.detectComponents();

//     if (!this.activeElement) {
//       this.initFocusParent(this.parents);
//       return;
//     }

//     if (direction !== undefined) {
//       this.direction = direction;
//       const nextElement = this.getNextElement();
//       this.focusElement(nextElement);
//     }

//     if (action !== undefined) {
//       this.action = action;
//       this.initNewFocusContent();
//     }
//   }

//   detectComponents() {
//     const containers = this.getContainers();
//     this.lastContainer = containers[containers.length - 1];

//     const extraButtons =  this.getExtraButtons();
//     const buttons = [...this.getButtons(this.lastContainer), ...extraButtons];
//     this.parents = this.getParents(buttons);

//     this.activeElement = this.getActiveElement(this.parents);
//   }

//   getNextElement() {
//     let diffPoints = [];

//     const focusParent = this.activeElement;
//     const parentList = this.parents.filter(e => e !== focusParent);

//     parentList.forEach(parent => {
//       const pointFocus = focusParent.point;
//       const point = parent.point;

//       const angle = pointFocus.angle(point);
//       const distance = pointFocus.distance(point);
//       const { element } = parent;

//       diffPoints.push({angle, distance, element, pointFocus, point});
//     });

//     if (this.direction === undefined)
//       return undefined;

//     const event = Direction[this.direction];
//     const directionAngle = DirectiontAngle[event];
//     console.log("directionAngle", directionAngle);

//     const anglePoints = diffPoints.filter((point: any) => {
//       return point.angle >= directionAngle[0][0] && point.angle <= directionAngle[0][1] || point.angle >= directionAngle[1][0] && point.angle < directionAngle[1][1];
//     });

//     console.log("anglePoints", anglePoints);

//     // anglePoints.sort((a, b) => (a.distance > b.distance) ? 1 : ((b.distance > a.distance) ? -1 : 0));
//     anglePoints.sort((a, b) => a.distance - b.distance);

//     const nextElement = anglePoints[0];
//     return nextElement;
//   }

//   initNewFocusContent() {
//     if (this.action !== Actions.ENTER)
//       return;

//     setTimeout(() => {
//       const containers = this.getContainers();
//       const lastContainer = containers[containers.length - 1];
//       if (lastContainer !== this.lastContainer) {
//         console.log("New Container");
//         this.detectComponents();
//         this.initFocusParent(this.parents);
//       }
//     }, 100);
//   }

//   initFocusParent(parents) {
//     const initElement = this.getInitElement(parents);
//     this.focusElement(initElement);
//     this.evt.stopPropagation();
//     this.evt.preventDefault();
//   }

//   focusElement(element) {
//     if (element)
//       element.element.focus();
//     else
//       console.log("Focus: ", "Not element available");
//   }

//   render() {
//     const { children } = this.props;
//     return (
//       <AccessibilityProvider value={{}}>
//         {children}
//       </AccessibilityProvider>
//     );
//   }

// }

// export const AccessibilityStore = withRouter(AccessibilityStoreComponent);