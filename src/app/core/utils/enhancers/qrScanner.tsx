import { compose, lifecycle, setDisplayName } from "recompose";
import { observer } from "mobx-react";
import QRCodeScanner from "../lib/QRCodeScanner";
import withInactivityTimer from "./inactivityTimer";
declare var window: any;

export default compose(
  setDisplayName("QrScanner"),
  observer,
  withInactivityTimer(),
  lifecycle({
    componentDidMount() {
      // setTimeout(() => {
      window.requestIdleCallback(() => {
        const { scanQr } = this.props;
        const video = document.getElementById("webcam");
        try {
          let scanned = false;
          this.scanner = new QRCodeScanner(video, qrData => {
            console.log("QR READING", { qrData });
            if (!scanned) {
              scanQr && scanQr(qrData);
            }
            scanned = true;
          });
          this.scanner.start();
        } catch (e) {
          throw new Error(`Cannot instantiate webcam: ${e}`);
        }
      });
    },
    componentWillUnmount() {
      window.requestIdleCallback(() => {
        if (this.scanner && this.scanner.stop) this.scanner.stop();
      });
    }
  })
);
