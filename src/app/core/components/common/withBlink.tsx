import { compose, setDisplayName, lifecycle, withHandlers, withState } from "recompose";
export default compose(
  setDisplayName("withBlink"),
  withState("blinkingIndex", "setBlinkingIndex", 0),
  withState("raf", "setRaf", null),
  withHandlers({
    blink: ({ itemsKey, itemsAccessor, shouldBlink, blinkingIndex, setBlinkingIndex, itemsCount, setRaf, ...props }) => () => {
      if (!shouldBlink) {
        return;
      }
      // setBlinkingIndex(0)
      let start = Date.now();
      const fpsInterval = 1000 / 3;
      const blinker = () => {
        let now = Date.now();
        let d = now - start;
        if (d > fpsInterval) {
          const itemsLength = itemsCount || (typeof itemsAccessor === "function" ? itemsAccessor(props).length : props[itemsKey].length);
          setBlinkingIndex(current => {
            return current === itemsLength - 1 ? 0 : current + 1;
          });
          start = now - d % fpsInterval;
        }
        setRaf(window.requestAnimationFrame(blinker));
      };
      setRaf(window.requestAnimationFrame(blinker));
    }
  }),
  lifecycle({
    componentWillUnmount() {
      window.cancelAnimationFrame(this.props.raf);
    },
    UNSAFE_componentWillReceiveProps(nextProps) {
      if (!nextProps.shouldBlink && this.props.raf) {
        window.cancelAnimationFrame(this.props.raf);
      }
      if (nextProps.shouldBlink === true && !this.props.shouldBlink) {
        window.cancelAnimationFrame(this.props.raf);
        this.props.blink();
      }
    },
    componentDidMount() {
      const { blink } = this.props;
      blink();
    }
  })
);
