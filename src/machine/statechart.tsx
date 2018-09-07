export const OFF = "off";
export const IDLE = "idle";
export const INIT = "init";
export const START = "start";
export const PAYMENT_METHODS = "paymentMethods";
export const BEVERAGE = "beverageConfig";
export const PREPAY_QR = "prepayQr";
export const POSTPAY_QR = "postpayQr";
export const POURING = "pouring";
export const POURING_OFFLINE = "pouringOffline";
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
    [START]: {
      actions: ["reset"],
    },
  },
};

export const offState = {
  OFF: OFF,
};

export const statechart = {
  key: "user",
  initial: IDLE,
  states: {
    [IDLE]: {
      on: {
        NEXT: INIT,
      },
    },
    [OFF]: {
      on: {
        ON: INIT,
      },
    },
    [INIT]: {
      on: {
        NEXT: START,
        ERROR: {
          [INIT]: {
            cond: ({ initRetryCount }) => initRetryCount < 999,
          },
        },
      },
      onEntry: "init.enter",
    },
    [START]: {
      on: {
        NEXT: {
          [PAYMENT_METHODS]: {
            cond: (data) => {
              return data.paymentMethods && data.paymentMethods.length > 1;
            },
          },
          [BEVERAGE]: {
            cond: (data) => {
              const paymentMethod = data.paymentMethods[0];
              return data.paymentMethods.length === 1 &&
                     paymentMethod.id === "qr_code_post_payment";
            },
          },
          [PREPAY_QR]: {
            cond: (data) => {
              const paymentMethod = data.paymentMethods[0];
              return data.paymentMethods.length === 1 &&
                     paymentMethod.id === "qr_code_pre_payment";
            },
          },
        },
        OFF,
      },
      onEntry: "start.enter",
      onExit: "start.exit",
    },
    [PAYMENT_METHODS]: {
      on: {
        qr_code_post_payment: BEVERAGE,
        qr_code_pre_payment: PREPAY_QR,
        OFF,
        // free_drink: BEVERAGE_FREE,
        // nfc: BEVERAGE,
        ...timeoutState,
        ...offState,
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
        valid: {},
      },
      on: {
        // ...backState(PAYMENT_METHODS, ['beverage.reset']),
        ...beverageBackState,
        NEXT: POURING,
        FAIL: {
          [START]: {
            actions: ["prepayQr.FAIL"],
          },
        },
        OFF,
        ...timeoutState,
      },
      onEntry: "prepayQr.enter",
      onExit: "prepayQr.exit",
    },
    [BEVERAGE]: {
      on: {
        NEXT: {
          [POSTPAY_QR]: {
            cond: (data) => {
              return data.vendorConfig.offline_mode === false;
            },
          },
          [POURING_OFFLINE]: {
            cond: (data) => {
              return data.vendorConfig.offline_mode === true;
            },
          },
        },
        OFF,
        ...backState(PAYMENT_METHODS, ["beverage.reset"]),
        ...timeoutState,
      },
      onEntry: "beverage.enter",
      onExit: "beverage.exit",
    },
    [POSTPAY_QR]: {
      initial: "generating",
      states: {
        generating: {
          on: {
            NEXT: "generated",
          },
        },
        generated: {
          on: {
            NEXT: "confirming",
          },
        },
        confirming: {
          onEntry: "postpayQr.confirm.enter",
        },
      },
      on: {
        ...backState(BEVERAGE, ["beverage.reset"]),
        NEXT: POURING,
        FAIL: START,
        ...timeoutState,
        OFF,
      },
      onEntry: "postpayQr.enter",
      onExit: "postpayQr.exit",
    },
    [POURING_OFFLINE]: {
      on: {
        NEXT: POURING,
      },
      onEntry: "pouring.offline.enter",
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
          on: {
            NEXT: "completed",
          },
        },
        completed: {
          onEntry: "pouring.completed.enter",
        },
      },
      on: {
        NEXT: START,
        FAIL: START,
      },
      onEntry: "pouring.enter",
      onExit: "pouring.exit",
    },
  },
};
