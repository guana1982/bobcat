import { findDOMNode } from "react-dom";
import { compose, setDisplayName, withProps, withHandlers } from "recompose";
import * as Animated from "animated/lib/targets/react-dom";
// const clamp = (value, min, max) => Math.min(Math.max(value, min), max)
const HorizontalPan = (anim, config) => {
  let node = null;
  let containerRect = null;
  config = config || {};
  return {
    ref: el => {
      if (!el) return;
      node = findDOMNode(el);
      containerRect = node.getBoundingClientRect();
    },
    onTouchStart(_event) {
      // _event.preventDefault()
      let currentScroll = 0;
      let moveListener;
      let upListener;
      if (!node || !node.contains(_event.target)) {
        return;
      }
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
            const event = _event.touches[0];
            const { width } = containerRect;
            const scroll = startValue + (event.clientX - startPosition);
            const maxScroll = width - window.innerWidth;
            const distanceFromEdge =
              scroll > 0 ? scroll * 2 : Math.abs(scroll) - maxScroll;
            const friction =
              distanceFromEdge > 0
                ? 1 + distanceFromEdge / window.innerWidth
                : 1;
            currentScroll = scroll / friction;
            anim.setValue(currentScroll);
            // Animated.event([
            //   { target: { offset: currentScroll } },
            // ])
            updateVelocity(event);
          })
        );
        window.addEventListener(
          "touchend",
          (upListener = _event => {
            // _event.preventDefault()
            const event = _event.changedTouches[0];
            const { width } = containerRect;
            updateVelocity(event);
            window.removeEventListener("touchmove", moveListener);
            window.removeEventListener("touchend", upListener);
            config.onEnd &&
              config.onEnd({
                velocity,
                currentScroll,
                width: width
              });
          })
        );
      });
    }
  };
};
export default compose(
  setDisplayName("withHorizontalPan"),
  withProps(() => ({
    anim: new Animated.Value(0),
    horizontalPan: HorizontalPan
  })),
  withHandlers({
    onDragEnd: ({ anim }) => ({ velocity, width: maxScroll }) => {
      // remove previous listeners
      anim.removeAllListeners();
      // start animation decay
      Animated.decay(anim, {
        velocity,
        deceleration: 0.998
      }).start();
      // add a listener on value
      anim.addListener(({ value: v }) => {
        // we can detect wether it's out of bounds
        if (v < 0 && Math.abs(v) + window.innerWidth >= maxScroll) {
          anim.removeAllListeners();
          return Animated.spring(anim, {
            toValue: -maxScroll + window.innerWidth,
            friction: 5
          }).start();
        }
        if (v > 0) {
          anim.removeAllListeners();
          return Animated.spring(anim, {
            toValue: 0,
            friction: 5
          }).start();
        }
      });
    }
  })
);
