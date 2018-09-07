import { findDOMNode } from "react-dom";
import {
  compose,
  setDisplayName,
  withProps,
  withHandlers,
  lifecycle
} from "recompose";
import * as Animated from "animated/lib/targets/react-dom";
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const HorizontalPan = (anim, config) => {
  let node = null;
  let containerRect = null;
  let currentScroll = 0;
  let moveListener;
  let upListener;
  config = config || {};
  return {
    ref(el) {
      if (!el) return;
      node = findDOMNode(el);
      containerRect = node.getBoundingClientRect();
    },
    // onTouchEnd: function (_event) {
    //   window.removeEventListener('touchend', upListener, true)
    //   window.removeEventListener('touchmove', moveListener, true)
    // },
    onTouchStart: function(_event) {
      if (!node || !node.contains(_event.target)) {
        return;
      }
      console.log("touchstart");
      if (containerRect.width < window.innerWidth) {
        return;
      }
      anim.stopAnimation(startValue => {
        const event = _event.touches[0];
        const startPosition = event.clientX;
        let lastTime = Date.now();
        let lastPosition = event.clientX;
        let velocity = 0;
        config.onStart && config.onStart();
        function updateVelocity(event) {
          const now = Date.now();
          if (event.clientX === lastPosition || now === lastTime) {
            return;
          }
          velocity = (event.clientX - lastPosition) / (now - lastTime);
          lastTime = now;
          lastPosition = event.clientX;
        }
        window.addEventListener(
          "touchmove",
          (moveListener = _event => {
            if (!node || !node.contains(_event.target)) {
              return;
            }
            const event = _event.touches[0];
            const { width } = containerRect;
            currentScroll = clamp(
              startValue + (event.clientX - startPosition),
              -width * 1.1,
              120
            );
            anim.setValue(currentScroll);
            updateVelocity(event);
          })
        );
        window.addEventListener(
          "touchend",
          (upListener = _event => {
            if (!node || !node.contains(_event.target)) {
              return;
            }
            const event = _event.changedTouches[0];
            const { width } = containerRect;
            updateVelocity(event);
            window.removeEventListener("touchmove", moveListener);
            window.removeEventListener("touchend", upListener);
            config.onEnd &&
              config.onEnd({
                velocity,
                currentScroll,
                width: width - window.innerWidth
              });
          })
        );
      });
    }
  };
};
export default compose(
  setDisplayName("withDragger"),
  withProps({
    anim: new Animated.Value(0),
    horizontalPan: HorizontalPan
  }),
  lifecycle({
    componentDidMount: () => {},
    componentWillUnmount: () => {}
  }),
  withHandlers({
    onDragEnd: ({ itemWidth, elementsCount, anim, setIndex, onSelect }) => ({
      velocity,
      width
    }) => {
      if (velocity === 0) {
        return;
      }
      const currentScroll = anim.__getValue();
      this.index = Math.abs(
        Math.round(currentScroll / (width + window.innerWidth) * elementsCount)
      );
      onSelect && onSelect(Math.min(this.index, elementsCount - 1));
      if (Math.abs(currentScroll) >= width) {
        Animated.spring(anim, {
          toValue: -itemWidth * Math.min(elementsCount - 1, this.index)
        }).start();
      } else {
        Animated.spring(anim, {
          toValue: -(Math.min(elementsCount - 1, this.index) * itemWidth)
        }).start();
      }
    }
  })
);
