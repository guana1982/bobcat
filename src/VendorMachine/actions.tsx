import mediumLevel from "../lib/mediumLevel";
import { setLangDict } from "../lib/i18n";
declare var window: any;

let ws;
if (process.env.INTELLITOWER_VENDOR === "pepsi") {
  // let ws = new window.WebSocket("ws://93.55.118.41:5901");
  ws = new window.WebSocket(process.env.NODE_ENV === "production" ? "ws://93.55.118.43:5901" : "ws://192.168.188.204:5901");
  ws.onopen = () => {
    // connection opened
    console.log("connected");
    // const a = ws.send({ key: 'value' });
  };
}

const getDefaultBeverages = (allBeverages, installedValves) => {
  const beverages = allBeverages.filter(b => {
    return (
      b.available === true &&
      b.line_id !== -1 &&
      b.beverage_type !== "top"
    );
  });
  return {
    beverages: beverages.slice(0, installedValves),
    beverage: null,
  };
};

export const actions = {
  "idle.enter": (dispatch) => {
    console.log("IDLE ENTER");
  },
  "init.enter": (dispatch, update, data = {}, payload = {}) => {
    Promise.all([
      mediumLevel.config.getVendor(),
      mediumLevel.config.getBeverages(),
      mediumLevel.payment.getAvailableMethods(),
      mediumLevel.config.getSizes(),
      mediumLevel.config.getLang(),
      mediumLevel.config.getErrorCodes(),
      mediumLevel.config.startDisplay(),
    ]).then(res => {
      let [
        vendorConfig,
        beverages,
        paymentMethods,
        sizes,
        langDict,
        errorCodes,
      ] = res;

      setLangDict(langDict.i18n);

      // if (!pollingActive) {
      //   pollingActive = true
      //   setInterval(async () => {
      //     const reservedBeverage = await mediumLevel.dispense.getReservedBeverage()
      //     if (reservedBeverage && reservedBeverage.length) {
      //       console.log('Reserved beverage', reservedBeverage)
      //       if (!data.beverage) {
      //         return dispatch('RESERVED_BEVERAGE', { beverage: reservedBeverage[0] })
      //       }
      //     }
      //   }, 5000)
      // }

      return dispatch("NEXT", {
        paymentMethods: paymentMethods.reverse(),
        ...getDefaultBeverages(beverages, vendorConfig.installed_valves_number),
        vendorConfig,
        sizes,
        errorCodes,
        pourMethod: vendorConfig.pour_method,
        easySelection: vendorConfig.easy_selection || false,
      });
    }).catch(error => {
      console.log("[!] init error", { error });
      // return dispatch('ERROR', {
      //   initRetryCount: data.initRetryCount ? data.initRetryCount + 1 : 1,
      // })
    });
  },
  "reset": async(dispatch, update, data) => {
    const stopQrCamera = await mediumLevel.config.stopQrCamera();
    if (stopQrCamera.error) {
      return dispatch("FAIL", { error: stopQrCamera.error });
    }

    update((prevData) => {
      return {
        ...prevData,
        availableBeverages: prevData.beverages,
        recipe: null,
        beverage: null,
      };
    });
  },
  "beverage.reset": (dispatch, update) => {
    update((prevData) => {
      return {
        ...prevData,
        beverage: null,
      };
    });
  },
  "prepayQr.scanning.enter": (dispatch, update, data) => {
    console.log("here");
    ws.onmessage = (data) => {
      console.log("socket message was received");
      const qrData = JSON.parse(data.data);

      if (qrData.message_type === "qr_found") {
        const qrString = qrData.value;
        dispatch("NEXT", { qr: qrString });
        mediumLevel.config.stopQrCamera();
        // update((prevData) => {
        //   return {
        //     ...prevData,
        //     qr: qrString,
        //   };
        // });
      }
    };
  },
  "prepayQr.scanned.enter": async (dispatch, update, data) => {
    // const beverages = await mediumLevel.payment
    //   .getBeverageFromQr(data.qr)
    //
    // if (!beverages || beverages.error) {
    //   return dispatch('FAIL', { error: beverages.error })
    // }
    //
    // dispatch('NEXT', { beverages, qr: data.qr, error: null })


    // update((prevData) => {
    //   const beveragesFromQr = prevData.beverages.filter((b) => b.beverage_id === Number(data.qr));
    //   if (beveragesFromQr.length === 0) {
    //     return dispatch("FAIL");
    //   }

    //   return dispatch("NEXT", {
    //     paymentMethods: prevData.paymentMethods,
    //     paymentMethod: prevData.paymentMethod,
    //     sizes: prevData.sizes,
    //     beverages: beveragesFromQr,
    //     availableBeverages: beveragesFromQr,
    //     beverage: beveragesFromQr[0],
    //     qr: data.qr,
    //     pourMethod: "timed"
    //   });
    // });
  },
  "prepayQr.validating.enter": async (dispatch, update, data) => {
    const isValid = await mediumLevel.payment
      .validateQr({ data: data.qr });

    if (!isValid || isValid.error) {
      return dispatch("FAIL", { error: isValid.error });
    }

    return dispatch("NEXT", { ...data, error: null });
  },
  // 'prepayQr.scanned.enter': (dispatch, update, data) => {
  //   //const beveragesFromQr = await mediumLevel.payment.getBeverageFromQr(data.qr)
  //
  //   update((prevData) => {
  //     console.log(prevData);
  //     const beveragesFromQr = prevData.beverages.filter((b) => b.beverage_id === Number(data.qr))
  //
  //     if (!beveragesFromQr) {
  //       return dispatch('FAIL')
  //     }
  //
  //     return dispatch('NEXT', {
  //       paymentMethods: prevData.paymentMethods,
  //       paymentMethod: prevData.paymentMethod,
  //       sizes: prevData.sizes,
  //       beverages: beveragesFromQr,
  //       availableBeverages: beveragesFromQr,
  //       beverage: beveragesFromQr[0],
  //       qr: data.qr,
  //       pourMethod: 'timed'
  //     })
  //   })
  // },
  // 'prepayQr.validating.enter': async (dispatch, update, data) => {
  //   const isValid = await mediumLevel.payment
  //     .validateQr({ data: data.qr })
  //
  //   if (!isValid || isValid.error) {
  //     return dispatch('FAIL')
  //   }
  //
  //   return dispatch('NEXT', {
  //     paymentMethods: data.paymentMethods,
  //     paymentMethod: data.paymentMethod,
  //     sizes: data.sizes,
  //     beverages: data.beverages,
  //     availableBeverages: data.availableBeverages,
  //     beverage: data.beverage,
  //     qr: data.qr,
  //     pourMethod: data.pourMethod
  //   })
  // },
  "prepayQr.valid.enter": async (dispatch, update, data) => {
    setTimeout(() => {
      return dispatch("NEXT");
    }, 100);
  },
  "prepayQr.FAIL": (dispatch, update, data) => {
    update((prevData) => ({
      ...prevData,
      availableBeverages: null,
      qr: null,
    }));
  },
  "beverageConfig.confirm.enter": async (dispatch, update, data) => {
    if (data && data.recipe) {
      return dispatch("NEXT", { recipe: data.recipe });
    } else {
      return dispatch("FAIL");
    }
  },
  "setPaymentMethod": (dispatch, update, data) => {
    update((prevData) => ({
      ...prevData,
      paymentMethod: data,
    }));
  },
  "setReservedBeverage": (dispatch, update, data) => {
    update((prevData) => ({
      ...prevData,
      beverage: data,
      paymentMethod: prevData.paymentMethods[0],
    }));
  },
  "beverageConfig.setup.enter": (dispatch, update, data) => {
    update((prevData) => ({
      ...prevData,
      beverage: prevData ? prevData.beverage : null,
      recipe: prevData ? prevData.recipe : null,
    }));
  },
  "pouring.enter": async (dispatch, update, data) => {
    const dispense = await mediumLevel.dispense.pour(data.recipe);
    if (dispense.error || !dispense.eta) {
      return dispatch("FAIL");
    }
    return dispatch("NEXT", dispense);
  },
  "pouring.exit": async (dispatch, update, data) => {

  },
  "pouring.dispensing.enter": async (dispatch, update, data) => {

  },
  "pouring.stop.enter": async (dispatch, update, data) => {
    const stop = await mediumLevel.dispense.stop();
    if (stop.error) {
      return dispatch("FAIL");
    }
    update((prevData) => ({
      ...prevData,
      beverage: prevData.pourMethod === "start_stop" ? prevData.beverage : null,
      recipe: prevData.pourMethod === "start_stop" ? prevData.beverage : null,
    }));
  },
  "pouring.completed.enter": (dispatch, update, data) => {
    setTimeout(() => {
      dispatch("NEXT", {
        beverage: null,
      });
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
  },
};
