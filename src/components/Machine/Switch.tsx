import * as React from "react";

const Switch = ({state, children}) => {
  return React.Children.map(children, (child: any) =>
    React.cloneElement(child, { ...child.props, state })
  );
};

export default Switch;
