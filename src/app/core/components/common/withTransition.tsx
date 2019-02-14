import * as React from "react";
import { Transition } from "react-transition-group";
import {
  compose,
  setDisplayName,
  withProps,
  withHandlers,
  withState
} from "recompose";
import * as Animated from "animated/lib/targets/react-dom";

export default compose(
  setDisplayName("withTransition"),
  withState("animTransition", "setTransition", undefined),
  withProps({
    visibility: new Animated.Value(0)
  }),
  withHandlers({
    onEnter: ({ visibility, setTransition, duration = 250 }) => () => {
      setTransition(
        visibility.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1]
        })
      );
      Animated.timing(visibility, {
        toValue: 1,
        duration
      }).start();
    },
    onExit: ({ visibility, setTransition, duration = 250 }) => () => {
      setTransition(
        visibility.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1]
        })
      );
      Animated.timing(visibility, {
        toValue: 0,
        duration
      }).start();
    }
  }),
  WrappedComponent => ({
    appear,
    show,
    onEnter,
    onExit,
    animTransition,
    visibility,
    style,
    animateProp = "opacity",
    ...rest
  }) => {
    return (
      <Transition
        timeout={250}
        onEnter={onEnter}
        onExit={onExit}
        in={show}
        unmountOnExit={true}
      >
        {state => {
          return (
            <Animated.div
              style={{
                ...style,
                willChange: "transform",
                [animateProp]: animTransition
              }}
            >
              <WrappedComponent {...rest} />
            </Animated.div>
          );
        }}
      </Transition>
    );
  }
);
