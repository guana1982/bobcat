import * as React from "react";
import { observer } from "mobx-react";
import * as styles from "../../VendorComponents/Menu/MenuLauncher.scss";
import posed from "react-pose";

/* ========= */
// ANIMATIONS
/* ========= */

const Background = posed.div({
  hidden: {
    opacity: 0,
    zIndex: -1,
    transition: {
      duration: 600
    },
  },
  visible: {
    opacity: 0.5,
    zIndex: 3,
    transition: {
      duration: 600
    }
  }
});

const Box = posed.div({
  close: {
    x: "100%",
    transition: {
      duration: 600,
    }
  },
  open: {
    x: "0%",
    transition: {
      duration: 600,
    }
  }
});

/* ========= */
// COMPONENT
/* ========= */

export interface Action {
  title: string;
  event: () => void;
  stayOpen?: boolean;
  disabled?: boolean;
}

interface PrepayProps {
  actions: Action[];
  disabled?: boolean;
}
interface PrepayState {
  visible: boolean;
}

class LauncherComponent extends React.Component<PrepayProps, PrepayState> {

  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  toggleServiceMenu = (action?: Action) => {
    if (action) {
      action.event();
      if (action.stayOpen) return;
    }
    const visibleState = this.state.visible;
    this.setState({
      visible: !visibleState
    });
  }

  render() {
    const { visible } = this.state;
    const { disabled, actions } = this.props;
    console.log("actions", actions);
    return (
      <div>
        <Background className={styles.menuBackground} pose={visible ? "visible" : "hidden"} />
        <Box className={styles.menuContainer} pose={visible ? "open" : "close"}>
          {visible && <div className={styles.arrowRight} style={{ top: "50px", left: "0" }} />}
          {visible && (
            <div onClick={() => this.toggleServiceMenu()} className={styles.box} style={{ top: "15px", left: "-25px" }} />
          )}
          {!visible && !disabled && <div className={styles.arrowLeft} style={{ top: "50px", left: "-20px" }} />}
          {!visible &&
            !disabled && (
              <div onClick={() => this.toggleServiceMenu()} className={styles.box} style={{ top: "15px", left: "-80px" }} />
            )}
          {actions.map(action => (
              <div className={styles.menuBox} onClick={() => this.toggleServiceMenu(action)}>
                <div className={styles.menuBoxText}>{action.title}</div>
              </div>
            ))}
        </Box>
      </div>
    );
  }

}

export default LauncherComponent;
