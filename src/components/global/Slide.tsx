import * as React from "react";
import { observer } from "mobx-react";
import * as styles from "./slide.scss";
import posed from "react-pose";

/* ========= */
// ANIMATIONS
/* ========= */

const Box = posed.div({
  close: {
    left: "-70vw",
    transition: {
      duration: 1000,
    }
  },
  open: {
    left: "-10vw",
    transition: {
      duration: 1000,
    }
  }
});

const Icon = ({ fill }) => (
  <svg viewBox="0 0 409.6 405.76" fill={ fill }>
      <path d="M682.8,396.06c50.72,0,91.84-48.13,91.84-107.49,0-82.33-41.12-107.49-91.84-107.49S591,206.24,591,288.57c0,59.36,41.12,107.49,91.84,107.49Zm0,0" transform="translate(-478 -181.08)"/>
      <path d="M885.6,554.28,839.27,449.9a23.3,23.3,0,0,0-10.48-11.15l-71.91-37.43a4.66,4.66,0,0,0-4.93.41,113.41,113.41,0,0,1-138.3,0,4.67,4.67,0,0,0-4.94-.41l-71.9,37.43a23.24,23.24,0,0,0-10.47,11.15L480,554.28a23.16,23.16,0,0,0,21.18,32.56H864.42a23.17,23.17,0,0,0,21.18-32.56Zm0,0" transform="translate(-478 -181.08)"/>
  </svg>
);


const SvgComponent = props => (
  <svg
    id="prefix__Livello_1"
    data-name="Livello 1"
    viewBox="0 0 357.87 229.5"
    {...props}
  >
    <defs>
      <style>{".prefix__cls-1{fill:#005bc3}"}</style>
    </defs>
    <title>{"Senza titolo-1"}</title>
    <path
      className="prefix__cls-1"
      d="M839.4 533.53c0-7.62 5.22-14.17 12.71-17.1v-99H514.63V647h337.48v-96.37c-7.49-2.93-12.71-9.48-12.71-17.1z"
      transform="translate(-514.63 -417.48)"
    />
    <circle
      cx={859.5}
      cy={532.23}
      r={13}
      transform="rotate(-87.94 385.77 590.235)"
      fill="#fff"
    />
    <path
      className="prefix__cls-1"
      d="M344.36 118.67l-.71-.71 3.15-3.15-3.27-3.27.71-.71 3.98 3.98-3.86 3.86z"
    />
  </svg>
)


/* ========= */
// COMPONENT
/* ========= */

interface PrepayProps {
}

interface PrepayState {
  open: boolean;
}

class SlideComponent extends React.Component<PrepayProps, PrepayState> {

  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  toggleServiceMenu = () => {
    const openState = this.state.open;
    this.setState({
      open: !openState
    });
  }

  render() {
    const { open } = this.state;
    return (
      <React.Fragment>
        <Box className={styles.slideBox} pose={open ? "open" : "close"}>
          <button onClick={this.toggleServiceMenu}>
            <h1>{open ? "open" : "close"}</h1>
          </button>
          <SvgComponent />
        </Box>
      </React.Fragment>
    );
  }

}

export default SlideComponent;
