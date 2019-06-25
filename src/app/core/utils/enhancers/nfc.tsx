// // import * as React from 'react'
// import { compose, lifecycle, withState } from "recompose";
// // import appLifecycle from 'stores/AppLifecycle'
// import query from "../enhancers/fetchState";
// import mediumLevel from "../lib/mediumLevel";
// const NFC_POLL_INTERVAL = 1000;
// const NFC_POLL_TIMEOUT = 5000;
// export default compose(
//   withState("timeout", "updateTimeout", NFC_POLL_TIMEOUT / 1000),
//   query(mediumLevel.payment.pollNfc, {
//     name: "nfcPoll"
//   }),
//   lifecycle({
//     componentWillUnmount() {
//       this.mounted = false;
//       clearInterval(this.polling);
//       clearTimeout(this.pollingTimeout);
//     },
//     componentDidMount() {
//       this.mounted = true;
//       const { navigation, updateTimeout, nextPath } = this.props;
//       this.pollingTimeout = setTimeout(() => {
//         if (!this.mounted) {
//           return;
//         }
//         navigation.reset();
//         // appLifecycle.error = { message: 'No NFC detected' }
//         throw new Error("No NFC detected");
//       }, NFC_POLL_TIMEOUT);
//       this.polling = setInterval(async () => {
//         if (!this.mounted) {
//           return;
//         }
//         updateTimeout(this.props.timeout - 1);
//         const nfcStatus = await this.props.nfcPoll();
//         if (nfcStatus instanceof Error) {
//           navigation.reset();
//         }
//         if (nfcStatus.status !== 1) {
//           return;
//         }
//         if (!nfcStatus.beverage) {
//           navigation.reset();
//           throw new Error(nfcStatus);
//         }
//         // found valid beverage on nfc response
//         // appLifecycle.setBeverage(nfcStatus.beverage)
//         nextPath && navigation.push(nextPath);
//       }, NFC_POLL_INTERVAL);
//     }
//   })
// );
