import * as React from "react";
import { Transition, TransitionGroup } from "react-transition-group";
import * as Animated from "animated/lib/targets/react-dom";

type ScreenTransitionState = {
  animEnter: any,
  animExit: any,
  animEntered: any,
  animExited: any
};

export default class ScreenTransition extends React.Component<any> { // {}, ScreenTransitionState
  state = {
    animEnter: new Animated.Value(0),
    animExit: new Animated.Value(0),
    animEntered: new Animated.Value(0),
    animExited: new Animated.Value(0)
  };
  transitions = {
    entering: undefined,
    entered: undefined,
    exiting: undefined,
    exited: undefined
  };
  onExited = () => {
    this.transitions["exited"] = this.state.animExited;
    Animated.timing(this.state.animExited, {
      toValue: 1,
      duration: 1
    }).start();
  }
  onEntered = () => {
    this.transitions["entered"] = this.state.animEntered;
    Animated.timing(this.state.animEntered, {
      toValue: 1,
      duration: 1
    }).start();
  }
  onEnter = () => {
    const { direction } = this.props;
    this.state.animEnter.setValue(0);
    this.transitions["entering"] = this.state.animEnter.interpolate({
      inputRange: [0, 1],
      outputRange: direction > 0 ? ["100%", "0%"] : ["-100%", "0%"]
    });
    Animated.spring(this.state.animEnter, {
      toValue: 1,
      // easing:
      speed: 12
    }).start();
  }
  onExit = () => {
    this.state.animExit.setValue(0);
    const { direction } = this.props;
    this.transitions["exiting"] = this.state.animExit.interpolate({
      inputRange: [0, 1],
      outputRange: direction > 0 ? ["0%", "-100%"] : ["0%", "100%"]
    });
    Animated.spring(this.state.animExit, {
      toValue: 1,
      // easing:
      speed: 12
    }).start();
  }
  render() {
    const { path, children } = this.props;
    return (
      <TransitionGroup appear={false}>
        <Transition
          timeout={400}
          onEntered={this.onEntered}
          onEnter={this.onEnter}
          onExit={this.onExit}
          onExited={this.onExited}
          key={path}
        >
          {state => {
            return (
              <Animated.div
                style={{
                  willChange: "transform",
                  position: "absolute",
                  height: "100%",
                  width: "100%",
                  transform: [
                    {
                      translateX: this.transitions[state]
                    }
                  ]
                }}
              >
                {children}
              </Animated.div>
            );
          }}
        </Transition>
      </TransitionGroup>
    );
  }
}
