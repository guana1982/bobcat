import * as React from "react";
import * as ReactDOM from "react-dom";
import { withRouter } from "react-router-dom";
import { Pages } from "../utils/constants";

export enum FocusAttribute {
  Button = "data-btn-focus",
  Container =  "data-focus"
}

export enum FocusElm {
  Controller = "focus-controller",
  Init = "init-focus",
  Disable = "no-focus",
  Extra = "extra-focus"
}

enum Actions {
  ENTER
}

enum Direction {
  LEFT,
  UP,
  RIGHT,
  DOWN
}

const valuesAngle = [135, 45, 225, 315];
const DirectiontAngle = {
  LEFT:   [[valuesAngle[0], 180], [180, valuesAngle[2]]],
  UP:     [[valuesAngle[1], 90], [90, valuesAngle[0]]],
  RIGHT:  [[valuesAngle[3], 360], [0, valuesAngle[1]]],
  DOWN:   [[valuesAngle[2], 270], [270, valuesAngle[3]]],
};

enum KeyMapping {
  LEFT = 37,
  UP = 38,
  RIGHT = 39,
  DOWN = 40,
  ENTER = 13
}

class Point {
  x: number;
  y: number;

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  distance(point: Point) {
    return Math.hypot(point.x - this.x, point.y - this.y);
  }

  angle(point: Point) {
    return Math.atan2(-(this.y - point.y), this.x - point.x) * 180 / Math.PI + 180;
  }

}

interface Parent {
  element: HTMLButtonElement;
  rect: DOMRect;
  point?: Point;
}

export interface AccessibilityInterface {

}

const AccessibilityContext = React.createContext<AccessibilityInterface | null>(null);

export const AccessibilityProvider = AccessibilityContext.Provider;
export const AccessibilityConsumer = AccessibilityContext.Consumer;

class AccessibilityStoreComponent extends React.Component<any, any> {

  evt: KeyboardEvent;
  direction: Direction;
  action: Actions;

  lastContainer: any[];
  parents: Parent[];
  activeElement: any;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    window.addEventListener("keydown", this.onKeyDown.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.onKeyDown.bind(this));
  }

  getContainers(): any[] {
    return Array.from(document.querySelectorAll(`[${FocusAttribute.Container}=${FocusElm.Controller}]`));
  }

  getButtons(container): any[] {
    return Array.from(container.getElementsByTagName("button"));
  }

  getExtraButtons(): any[] {
    const extraContainers = Array.from(document.querySelectorAll(`[${FocusAttribute.Container}=${FocusElm.Extra}]`));
    let buttons = [];
    extraContainers.forEach(extraContainers => {
      const buttonsContainer = this.getButtons(extraContainers);
      buttons = buttons.concat(buttonsContainer);
    });
    return buttons;
  }

  getActiveElement(parents: Parent[]): any {
    const activeElementDomument = document.activeElement;
    const activeElement = parents.filter(parent => {
      return parent.element === activeElementDomument;
    })[0];
    return activeElement;
  }

  getInitElement(parents: Parent[]): any {
    return parents.filter(parent => {
      return parent.element.getAttribute(FocusAttribute.Button) === FocusElm.Init;
    })[0];
  }

  getParents(buttons: any[]): Parent[] {
    let parents = [];
    buttons = buttons.filter(element => {
      return element.getAttribute(FocusAttribute.Button) !== FocusElm.Disable;
    });
    buttons.forEach(element => {
      const rect: any = element.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const point = new Point(x, y);
      const parent: Parent = { element, rect, point };
      parents.push(parent);
    });
    return parents;
  }

  onKeyDown(evt: KeyboardEvent) {
    this.evt = evt;
    const event = KeyMapping[evt.keyCode];
    const direction = Direction[event];
    const action = Actions[event];

    if (direction === undefined && action === undefined)
      return;

    const { pathname } = this.props.location;
    if (pathname === Pages.Attractor)
      this.props.history.push(Pages.Home);

    this.detectComponents();

    if (!this.activeElement) {
      this.initFocusParent(this.parents);
      return;
    }

    if (direction !== undefined) {
      this.direction = direction;
      const nextElement = this.getNextElement();
      this.focusElement(nextElement);
    }

    if (action !== undefined) {
      this.action = action;
      this.initNewFocusContent();
    }
  }

  detectComponents() {
    const containers = this.getContainers();
    this.lastContainer = containers[containers.length - 1];

    const extraButtons =  this.getExtraButtons();
    const buttons = [...this.getButtons(this.lastContainer), ...extraButtons];
    this.parents = this.getParents(buttons);

    this.activeElement = this.getActiveElement(this.parents);
  }

  getNextElement() {
    let diffPoints = [];

    const focusParent = this.activeElement;
    const parentList = this.parents.filter(e => e !== focusParent);

    parentList.forEach(parent => {
      const pointFocus = focusParent.point;
      const point = parent.point;

      const angle = pointFocus.angle(point);
      const distance = pointFocus.distance(point);
      const { element } = parent;

      diffPoints.push({angle, distance, element, pointFocus, point});
    });

    if (this.direction === undefined)
      return undefined;

    const event = Direction[this.direction];
    const directionAngle = DirectiontAngle[event];
    console.log("directionAngle", directionAngle);

    const anglePoints = diffPoints.filter((point: any) => {
      return point.angle >= directionAngle[0][0] && point.angle <= directionAngle[0][1] || point.angle >= directionAngle[1][0] && point.angle < directionAngle[1][1];
    });

    console.log("anglePoints", anglePoints);

    // anglePoints.sort((a, b) => (a.distance > b.distance) ? 1 : ((b.distance > a.distance) ? -1 : 0));
    anglePoints.sort((a, b) => a.distance - b.distance);

    const nextElement = anglePoints[0];
    return nextElement;
  }

  initNewFocusContent() {
    if (this.action !== Actions.ENTER)
      return;

    setTimeout(() => {
      const containers = this.getContainers();
      const lastContainer = containers[containers.length - 1];
      if (lastContainer !== this.lastContainer) {
        console.log("New Container");
        this.detectComponents();
        this.initFocusParent(this.parents);
      }
    }, 100);
  }

  initFocusParent(parents) {
    const initElement = this.getInitElement(parents);
    this.focusElement(initElement);
    this.evt.stopPropagation();
    this.evt.preventDefault();
  }

  focusElement(element) {
    if (element)
      element.element.focus({preventScroll: true});
    else
      console.log("Focus: ", "Not element available");
  }

  render() {
    const { children } = this.props;
    return (
      <AccessibilityProvider value={{}}>
        {children}
      </AccessibilityProvider>
    );
  }

}

export const AccessibilityStore = withRouter(AccessibilityStoreComponent);