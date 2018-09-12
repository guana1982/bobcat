import * as React from "react";
import { compose, withProps } from "recompose";
import withQrScanner from "../../enhancers/qrScanner";
import withInactivityTimer from "../../enhancers/inactivityTimer";
import * as styles from "./Prepay.scss";
import Navbar from "../../components/MenuV2/Navbar";
import { Match } from "../../components/Machine";

const PREPAY_QR = "prepayQr";

// let enhance
// if (process.env.NODE_ENV === 'production' ) {
//   enhance = compose(
//     withInactivityTimer({
//       stopCamera: true
//     }),
//   )
// } else {
//   enhance = compose(
//     withQrScanner,
//   )
// }

const enhance = compose(
  withInactivityTimer({
    stopCamera: true
  })
);
const getBreadcrumbs = (currentState, data) => {
  if (typeof BREADCRUMBS[currentState] === "function") {
    return BREADCRUMBS[currentState](currentState, data);
  }
  return BREADCRUMBS[currentState];
};

const BREADCRUMBS: any = {
  [`${PREPAY_QR}.scanning`]: [{ title: "scanning" }],
  [`${PREPAY_QR}.scanned`]: [{ title: "scanned" }]
};


export default enhance(({ navigation, ...props }) => {

  const machine = props.machine;
  const machineState = machine.toString();
  const breadcrumbs = getBreadcrumbs( machineState, machine.data);

  const onExit = () => {
    machine.transition("EXIT");
  };

  const onRetry = () => {
    machine.transition("RETRY");
  };

  return (
    <React.Fragment>
      <Navbar
        onJumpTo={{}}
        breadcrumbs={breadcrumbs}
        onExit={onExit}
        canExit={true}
      />
      <div className={styles.screenContent}>
        <h2>Place your qr-code in front of the camera</h2>
        <div className={styles.qrSquare} />
      </div>
      <div className={styles.webcam} />
      <div className={styles.infoContent}>
        <h2>{machine.data.qr || "---"}</h2>
        <Match state={machineState} show={`${PREPAY_QR}.scanned`}>
          <button onClick={onRetry}>try again</button>
        </Match>
      </div>
    </React.Fragment>
  );
});
