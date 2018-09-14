import mediumLevel from "../lib/mediumLevel";
import { setLangDict } from "../lib/i18n";
let ws: any;
declare var window: any;

const getDefaultBeverages = (allBeverages, installedValves) => {
  const beverages = allBeverages.filter(b => {
    return b.available === true && b.line_id !== -1 && b.beverage_type !== "top" && b.status_id === "ok";
  });
  return {
    beverages: beverages.slice(0, installedValves),
    beverage: beverages[0]
  };
};
export const actions = {
  reset: async (dispatch, update) => {
    const stopQrCamera = await mediumLevel.config.stopQrCamera();
    console.log("here");
    if (stopQrCamera.error) {
      return dispatch("FAIL", { error: stopQrCamera.error });
    }
  },
  "start.enter": async (dispatch, update) => {
    const [switchOnDisplay, stopVideo, startVideo] = await Promise.all([
      mediumLevel.config.startDisplay(),
      mediumLevel.config.stopVideo(),
      mediumLevel.config.startVideo()
    ]);
    if (!stopVideo || stopVideo.error || !startVideo || startVideo.error) {
      console.log("- error: cannot start video", startVideo);
    }
  },
  "start.exit": async dispatch => {
    const [stopVideo, switchOnDisplay] = await Promise.all([
      mediumLevel.config.stopVideo(),
      mediumLevel.config.startDisplay()
    ]);
    console.log("video stopped", stopVideo);
    console.log("display on", switchOnDisplay);
  },
  "init.enter": (dispatch, update, data: any = {}, payload = {}) => {
    Promise.all([
      mediumLevel.config.getVendor(),
      mediumLevel.config.getBeverages(),
      mediumLevel.payment.getAvailableMethods(),
      mediumLevel.config.getSizes(),
      mediumLevel.config.getLang(),
      mediumLevel.config.getErrorCodes(),
      mediumLevel.config.startDisplay(),
      mediumLevel.menu.getList()
    ])
      .then(res => {
        let [vendorConfig, beverages, paymentMethods, sizes, langDict, errorCodes, startDisplay, menus] = res;
        console.log("menus", menus);
        setLangDict(langDict.i18n);
        return dispatch("NEXT", {
          paymentMethods: paymentMethods.reverse(),
          ...getDefaultBeverages(beverages, vendorConfig.installed_valves_number),
          vendorConfig,
          sizes,
          errorCodes,
          menus
        });
      })
      .catch(error => {
        console.log("[!] init error", { error });
        return dispatch("ERROR", {
          initRetryCount: data.initRetryCount ? data.initRetryCount + 1 : 1
        });
      });
  },
  "beverage.reset": (dispatch, update) => {
    mediumLevel.config.stopQrCamera();
    console.log("beverage.reset");
    update(prevData => {
      return {
        ...prevData,
        beverage: prevData.beverages[0]
      };
    });
  },
  "prepayQr.enter": async (dispatch, update, data) => {
    console.log("prepayQr.enter");
    // TEST QRCODE -->
    mediumLevel.config.stopVideo();
    mediumLevel.config.stopQrCamera();
    // <-- TEST QRCODE
    update((prevData) => {
      return {
        ...prevData,
        qr: null,
      };
    });
    const startQrCamera = await mediumLevel.config.startQrCamera();
    if (startQrCamera.error) {
      return dispatch("FAIL", { error: startQrCamera.error });
    }
    // dispatch("NEXT")
  },
  "prepayQr.scanning.enter": (dispatch, update, data) => {
    ws.onmessage = data => {
      console.log("socket message was received");
      const qrData = JSON.parse(data.data);
      if (qrData.message_type === "qr_found") {
        const qrString = qrData.value;
        dispatch("NEXT", { qr: qrString });
        mediumLevel.config.stopQrCamera();
      }
    };
  },
  "prepayQr.scanned.enter": async (dispatch, update, data) => {
    const beverages = await mediumLevel.payment.getBeverageFromQr(data.qr);
    if (!beverages || beverages.error) {
      return dispatch("FAIL", { error: beverages.error });
    }
    dispatch("NEXT", { beverages, qr: data.qr, error: null });
  },
  "prepayQr.validating.enter": async (dispatch, update, data) => {
    const isValid = await mediumLevel.payment.validateQr({ data: data.qr });
    if (!isValid || isValid.error) {
      return dispatch("FAIL", { error: isValid.error });
    }
    return dispatch("NEXT", { error: null });
  },
  "prepayQr.FAIL": (dispatch, update, data) => {
    update(prevData => ({
      ...prevData,
      availableBeverages: null,
      qr: null
    }));
  },
  "prepayQr.exit": async (dispatch, update, data) => {
    mediumLevel.config.stopQrCamera();
  },
  "pouring.offline.enter": async (dispatch, update, data) => {
    const paymentData = await mediumLevel.payment.generateQr(data.recipe);
    if (!paymentData || paymentData.error) {
      return dispatch("FAIL", { error: paymentData.error });
    }
    const paymentConfirmation = await mediumLevel.payment.confirmPostPayment(paymentData.qr);
    if (paymentConfirmation.status === 1 || paymentConfirmation.error) {
      return dispatch("FAIL", { error: paymentConfirmation.error });
    }
    dispatch("NEXT", { recipe: data.recipe, error: null });
  },
  "postpayQr.enter": async (dispatch, update, data) => {
    const paymentData = await mediumLevel.payment.generateQr(data.recipe);
    if (!paymentData || paymentData.error) {
      return dispatch("FAIL", { error: paymentData.error });
    }
    dispatch("NEXT", {
      paymentData,
      error: null
    });
  },
  "postpayQr.confirm.enter": async (dispatch, update, data) => {
    const filteredQrData = data.paymentData.qr.map(({ order_id: oId, id, data: d }) => ({
      order_id: oId,
      id,
      data: d
    }));
    const paymentConfirmation = await mediumLevel.payment.confirmPostPayment(filteredQrData);
    if (paymentConfirmation.status === 1 || paymentConfirmation.error) {
      return dispatch("FAIL", { error: paymentConfirmation.error });
    }
    dispatch("NEXT", { recipe: data.recipe, error: null });
  },
  "postpayQr.exit": (dispatch, update) => {
    update(prevData => ({
      ...prevData,
      paymentData: undefined
    }));
  },
  "beverageSelection.enter": async (dispatch, update, data) => {},
  "beverageSetup.enter": async (dispatch, update, data) => {},
  "pouring.enter": async (dispatch, update, data) => {
    const dispense = await mediumLevel.dispense.pour(data.recipe);
    if (dispense.error || !dispense.eta) {
      return dispatch("FAIL", { error: dispense.error });
    }
    setTimeout(() => {
      return dispatch("NEXT");
    }, dispense.eta);
    dispatch("NEXT", dispense);
  },
  "pouring.exit": async (dispatch, update, data) => {
    const beverages = await mediumLevel.config.getBeverages();
    update(currentData => ({
      ...currentData,
      ...getDefaultBeverages(beverages, currentData.vendorConfig.installed_valves_number)
    }));
  },
  "pouring.completed.enter": dispatch => {
    setTimeout(() => {
      dispatch("NEXT");
    }, 2000);
  },
  "*.cancelRequests": () => {
    const ongoingRequests = Object.keys(window.__requestSources);
    if (!ongoingRequests.length) {
      return;
    }
    console.log("[!] Cancel API request to mediumLevel", ongoingRequests);
    ongoingRequests.forEach(reqId => {
      window.__requestSources[reqId].cancel();
    });
    window.__requestSources = {};
  }
};
