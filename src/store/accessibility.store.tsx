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
    return Math.atan2(point.y - this.y, point.x - this.x) * 180 / Math.PI;
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

  parents: Parent[];

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
      this.setParents(Array.from(buttons));
      this.compareParents();
    }
  }

  setParents(elements: HTMLButtonElement[]) {
    this.parents = [];
    elements.forEach(element => {
      const rect: any = element.getBoundingClientRect();
      const point = new Point(rect.x, rect.y);
      const parent: Parent = { element, rect, point };
      this.parents.push(parent);
    });
    console.log(this.parents);
  }

  compareParents() {
    let diffPoints = [];
    const focusParent = this.parents[5];
    const parentList = this.parents.filter(e => e !== focusParent);
    parentList.forEach(parent => {
      const pointFocus = focusParent.point;
      const point = parent.point;

      const angle = pointFocus.angle(point);
      const distance = pointFocus.distance(point);
      const { element } = parent;

      diffPoints.push({angle, distance, element});
    });
    console.log(diffPoints);
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