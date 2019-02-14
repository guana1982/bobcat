import {
  withState,
  withHandlers,
  // withProps,
  compose,
  onlyUpdateForKeys,
  lifecycle
} from "recompose";
import withClickOutside from "./clickOutside";

export default compose(
  // onlyUpdateForKeys(['show', 'selected', 'initialValue']),
  withState("show", "setVisibility", ({ initialShow = false }) => initialShow),
  withState("selected", "setSelected", props => props.defaultValue),
  withHandlers({
    toggle: ({ setVisibility }) => event => {
      setVisibility(current => !current);
    },
    onSelect: ({ setVisibility, setSelected }) => value => {
      setVisibility(false);
      setSelected(value);
    },
    onClickOutside: ({ setVisibility }) => () => {
      setVisibility(false);
    }
  }),
  withClickOutside,
  lifecycle({
    UNSAFE_componentWillReceiveProps(nextProps) {
      if (this.props.initialValue !== nextProps.initialValue) {
        nextProps.setSelected(nextProps.initialValue);
      }
    }
  })
);
