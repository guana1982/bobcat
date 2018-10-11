// import { findDOMNode } from 'react-dom'
import DollarOne from "../lib/dollarOne";
import { compose, withState, lifecycle, setDisplayName } from "recompose";
import gestures from "../constants/gestures";

const dollarOne = new DollarOne({
  treshold: 0.1
});
gestures.forEach(gesture => dollarOne.addGesture(gesture.name, gesture.points));

export default compose(
  setDisplayName("withGesture"),
  withState("gesture", "setGesture", undefined),
  lifecycle({
    componentWillUnmount() {
      window.removeEventListener("touchstart", this.startListener);
      this.props.setGesture(null);
    },
    componentDidMount() {
      let moveListener = null;
      let endListener = null;
      let currentGesture = null;
      let clearGestureTimeout = null;
      let points = [];
      window.addEventListener(
        "touchstart",
        (this.startListener = evt => {
          if (currentGesture) {
            clearTimeout(clearGestureTimeout);
          }
          currentGesture = true;
          // console.log('-> touchstart')
          window.addEventListener(
            "touchmove",
            (moveListener = e => {
              const event = e.touches[0];
              points.push([
                Math.round(event.clientX),
                Math.round(event.clientY)
              ]);
            })
          );
          window.addEventListener(
            "touchend",
            (endListener = e => {
              window.removeEventListener("touchmove", moveListener);
              window.removeEventListener("touchend", endListener);
              console.log(JSON.stringify(points));
              if (!points.length) {
                return;
              }
              const matched = dollarOne.recognize(points);
              // console.log('-> matched', matched)
              clearGestureTimeout = setTimeout(() => {
                currentGesture = false;
                points = [];
              }, 250);
              if (matched) {
                this.props.setGesture(matched, () => {
                  this.props.onGesture && this.props.onGesture(matched);
                });
              }
            })
          );
        })
      );
    }
  })
);
