import {
  compose,
  lifecycle,
  withHandlers,
  setDisplayName,
  withState
} from "recompose";
import { observer } from "mobx-react";
export default compose(
  setDisplayName("ErrorDialog"),
  withState("show", "setShow", initialProps => true),
  observer,
  withHandlers({
    close: ({ setShow }) => e => {
      e.stopPropagation();
      setShow(false);
    }
  }),
  lifecycle({
    componentDidMount() {
      const { close } = this.props;
      document.addEventListener("click", close);
    },
    componentWillUnmount() {
      const { close } = this.props;
      document.removeEventListener("click", close);
    }
  })
);
