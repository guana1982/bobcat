import { compose, lifecycle, setDisplayName, withHandlers, withState, withProps } from "recompose";
import mediumLevel from "../lib/mediumLevel";

const DEFAULT_TIMEOUT = 30;

export default ({
  defaultTimeout = DEFAULT_TIMEOUT,
  showCountdown = false,
  resetOnClick = false,
  stopCamera = false
} = {}) => {
  let timer;
  let countdownTimer;
  return compose(
    withProps(ownProps => ({
      inactivityTimeout: ownProps.inactivityTimeout || defaultTimeout
    })),
    withState("countdown", "setCountdown", ownProps => ownProps.inactivityTimeout),
    setDisplayName("withInactivityTimer"),
    withHandlers({
      resetTimer: ({ onTimeout, setCountdown, inactivityTimeout }) => () => {
        clearTimeout(timer);
        // window.cancelAnimationFrame(timer)
        if (showCountdown) setCountdown(inactivityTimeout);
        timer = setTimeout((timeout, reqId) => {
          // timer = reqId
          onTimeout();
        }, inactivityTimeout * 1000);
      }
    }),
    lifecycle({
      componentWillUnmount() {
        clearTimeout(timer);
        // window.cancelAnimationFrame(timer)
        window.cancelAnimationFrame(countdownTimer);
        document.removeEventListener("touchstart", () => clearTimeout(timer));
        document.removeEventListener("touchend", this.props.resetTimer);
      },
      componentDidMount() {
        const { onTimeout, setCountdown, resetTimer, countdown, inactivityTimeout } = this.props;
        timer = setTimeout((timeout, reqId) => {
          // timer = reqId
          console.log("timeout");
          onTimeout();
          if (stopCamera) {
            mediumLevel.config.stopQrCamera();
          }
        }, inactivityTimeout * 1000);
        if (resetOnClick) {
          document.addEventListener("touchstart", () => clearTimeout(timer));
          document.addEventListener("touchend", resetTimer);
        }
        if (!showCountdown) {
          return;
        }
        const start = Date.now();
        const countdownRaf = () => {
          const now = Date.now();
          const dt = Math.ceil((now - start) / 1000);
          if (dt > inactivityTimeout) {
            return;
          }
          if (dt % 1 === 0) setCountdown(inactivityTimeout - dt);
          countdownTimer = window.requestAnimationFrame(countdownRaf);
        };
        countdownTimer = window.requestAnimationFrame(countdownRaf);
      }
    })
  );
};
