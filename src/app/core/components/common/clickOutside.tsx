import { findDOMNode } from "react-dom";
import { compose, setDisplayName, lifecycle, withHandlers } from "recompose";

export default compose(
  setDisplayName("withClickOutsideHandler"),
  withHandlers(() => {
    let element = null;
    return {
      handleClickOutside: () => () => ({
        ref: ref => {
          element = findDOMNode(ref);
        }
      }),
      onDocumentClick: ({ onClickOutside }) => e => {
        if (element && !element.contains(e.target)) {
          onClickOutside && onClickOutside();
        }
      }
    };
  }),
  lifecycle({
    componentDidMount() {
      const { onDocumentClick } = this.props;
      document.addEventListener("click", onDocumentClick, true);
    },
    componentWillUnmount() {
      const { onDocumentClick } = this.props;
      document.removeEventListener("click", onDocumentClick, true);
    }
  })
);
