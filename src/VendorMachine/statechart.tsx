export const IDLE = "idle";
export const INIT = "init";
export const START = "start";
export const STOP = "stop";
export const PAYMENT_METHODS = "paymentMethods";
export const BEVERAGE = "beverageConfig";
export const PREPAY_QR = "prepayQr";
export const POSTPAY_QR = "postpayQr";
export const POURING = "pouring";
export const COMPLETED = "completed";

const backState = (toState, actions) => ({
  BACK: {
    [toState]: {
      actions: ["*.cancelRequests", ...actions],
    },
  },
});

export const beverageBackState = {
  BACK: {
    [PAYMENT_METHODS]: {
      actions: ["beverage.reset"],
    },
  },
};

export const timeoutState = {
  TIMEOUT: {
    [INIT]: {
      actions: ["reset"],
    },
  },
};

export const reservedBeverageState = {
  RESERVED_BEVERAGE: {
    "beverageConfig.setup": {
      actions: ["setReservedBeverage"],
    },
  },
};

export const stopPouringState = {
  STOP: [
    { target: "beverageConfig.selection", actions: ["pouring.stop.enter"], cond: (data) => data.pourMethod === "timed" }, // && data.paymentMethod.id === "free_drink"
    { target: INIT, actions: ["pouring.stop.enter"], cond: (data) => data.pourMethod === "timed" }, // && data.paymentMethod.id === "qr_pre"
    { target: "beverageConfig.setup", actions: ["pouring.stop.enter"], cond: (data) => data.pourMethod === "start_stop" },
    { target: "beverageConfig.selection", actions: ["pouring.stop.enter"], cond: (data) => data.pourMethod === "fastfood" },
  ],
};

export const statechart = {
  key: "user",
  initial: IDLE,
  states: {
    [IDLE]: {
      on: {
        NEXT: INIT,
        ...reservedBeverageState,
      },
      onEntry: "idle.enter",
    },
    [INIT]: {
      on: {
        NEXT: START,
        ERROR: {
          [INIT]: {
            cond: ({ initRetryCount }) => initRetryCount < 999,
          },
        },
        ...reservedBeverageState,
      },
      onEntry: "init.enter",
    },
    [START]: {
      on: {
        NEXT: BEVERAGE,
        // ...reservedBeverageState,
      },
      onEntry: "start.enter",
      onExit: "start.exit",
    },
    [PAYMENT_METHODS]: {
      on: {
        qr_pre: PREPAY_QR,
        free_drink: {
          [BEVERAGE]: {
            actions: ["setPaymentMethod"],
          }
        },
        // nfc: BEVERAGE,
        ...reservedBeverageState,
        ...timeoutState,
      },
    },
    [PREPAY_QR]: {
      initial: "scanning",
      states: {
        scanning: {
          on: {
            NEXT: "scanned",
          },
          onEntry: "prepayQr.scanning.enter",
        },
        scanned: {
          on: {
            NEXT: "validating",
          },
          onEntry: "prepayQr.scanned.enter",
        },
        validating: {
          on: {
            NEXT: "valid",
          },
          onEntry: "prepayQr.validating.enter",
        },
        valid: {
          onEntry: "prepayQr.valid.enter",
        },
      },
      on: {
        ...backState(PAYMENT_METHODS, ["beverage.reset"]),
        NEXT: "beverageConfig.setup",
        RETRY: "prepayQr.scanning",
        EXIT: {
          [BEVERAGE]: {
            actions: ["prepayQr.exit"],
          }
        },
        FAIL: {
          [INIT]: {
            actions: ["prepayQr.FAIL"],
          },
        },
        ...timeoutState,
      },
      onEntry: "prepayQr.enter",
      // onExit: "prepayQr.exit",
    },
    [BEVERAGE]: {
      initial: "selection",
      states: {
        selection: {
          on: {
            NEXT: "setup",
          },
        },
        setup: {
          onEntry: "beverageConfig.setup.enter",
          on: {
            ...backState("selection", ["beverage.reset"]),
            NEXT: "confirming",
          },
        },
        confirming: {
          onEntry: "beverageConfig.confirm.enter",
        },
      },
      on: {
        qr_pre: PREPAY_QR, // TEST QRCODE
        NEXT: POURING,
        ...timeoutState,
        ...reservedBeverageState,
        ...stopPouringState,
      },
      onEntry: "beverage.enter",
      onExit: "beverage.exit",
    },
    [POURING]: {
      initial: "prepare",
      states: {
        prepare: {
          on: {
            NEXT: "dispensing",
          },
        },
        dispensing: {
          onEntry: "pouring.dispensing.enter",
          on: {
            NEXT: "completed",
          },
        },
        completed: {
          onEntry: "pouring.completed.enter",
        },
      },
      on: {
        NEXT: [
          { target: BEVERAGE, cond: (data) => data.paymentMethod.id === "free_drink" },
          { target: INIT, cond: (data) => data.paymentMethod.id === "qr_pre" },
        ],
        FAIL: [
          { target: INIT, cond: (data) => data.paymentMethod.id === "free_drink" },
          { target: PREPAY_QR, cond: (data) => data.paymentMethod.id === "qr_pre" },
        ],
        ...stopPouringState,
      },
      onEntry: "pouring.enter",
      onExit: "pouring.exit",
    },
  },
};
