import { __ } from "../lib/i18n";

// -- PAGES --
export enum Pages {
  // -- CONSUMER --
  Attractor = "/",
  Home = "/home",
  Prepay = "/prepay",
  Update = "/update",
  OutOfOrder = "/out_of_order",
  // -- SERVICE --
  Menu = "/menu",
  Master = "/master",
  Test = "/test",
}

export function areEqual(prevProps, nextProps) {
  return JSON.stringify(prevProps) === JSON.stringify(nextProps);
}

export const toOZ = (value) => Math.round(value / 29.5735);
export const calcolaPerc = (tot, num): number => {
  const percent = Math.round((num / tot * 100));
  return Math.max(0, percent);
};
export function debounce(func, wait, immediate?) {
  let timeout;
  return function() {
    let context = this, args = arguments;
    let later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}


/* ==== PRICE PARSER ==== */
export const parsePriceBeverage = (value: number, currency: string) => {
  if (value === 0) {
    return __("c_free");
  }
  let result_ = "";
  if (value < 100 && currency === "USD") {
    result_ = `${String(value / 100).replace(/^0\.+/, "")}${__("c_cent")}`;
  } else {
    result_ = `${value / 100}${__(`c_${currency}`)}`;
  }

  return result_;
};
/* ======================================== */

/* ==== EXPIRY DATE CHECK ==== */
export const formatDateForComparison = date => {
  return Number(date.replace(/-/g, ""));
};

export const compareDate = (date) => {
  const today = new Date().toISOString().substr(0, 10);
  return formatDateForComparison(today) > formatDateForComparison(date);
};
/* ======================================== */

// -- BEVERAGE --
export enum Beverages {
  Plain = "plain",
  Soda = "soda",
  Amb = "amb",
  Bev = "bev"
}

// -- LEVELS BEVERAGE --
export const LEVELS = {
  flavor: [
    {label: "c_light", value: 1},
    {label: "c_medium", value: 2},
    {label: "c_strong", value: 3}
  ],
  carbonation: [
    {label: "c_light", value: 20},
    {label: "c_medium", value: 50},
    {label: "c_strong", value: 100}
  ],
  temperature: [
    {label: "c_cool", value: 100},
    {label: "c_cold", value: 50},
    {label: "c_ice_cold", value: 0},
  ],
  noCarbonation: [
    {label: "", value: 0},
  ]
};

// -- TIMER --
export enum CONSUMER_TIMER {
  END_POUR = 8000
}

// -- PAYMENT METHODS --
export const PAYMENT_QR_PRE = "qr_code_pre_payment";
export const PAYMENT_QR_POST = "qr_code_post_payment";

// -- GLASS SIZES --
export const SIZE_TEST = 1;
export const SIZE_SMALL = 2;
export const SIZE_MED = 3;
export const SIZE_BIG = 4;

// -- SOCKET --
export const SOCKET_ATTRACTOR = "attract_loop";
export const SOCKET_ALARM = "alarm_changed";
export const CONSUMER_ALARM = "consumer_server_data";
export enum SOCKET_CONSUMER {
  QR = "consumer_qr_data",
  QR_TEST = "qr_collaudo",
  SERVER = "consumer_server_data"
}
export const SOCKET_CONNECTIVITY = "connectivity_status";
export const SOCKET_UPDATE = "update_status";
export const SOCKET_PAYMENT = "payment";
export const SOCKET_STOP_EROGATION = "force_stop_erogation";
export const SOCKET_SUSTAINABILITY = "sustainability_data";
// export const SOCKET_QR = "qr_found";

// -- MESSAGES SOCKET --
export const MESSAGE_START_VIDEO = "start_video";
export const MESSAGE_STOP_VIDEO = "stop_video";
export const MESSAGE_START_CAMERA = "start_camera";
export const MESSAGE_STOP_CAMERA = "stop_camera";
export enum MESSAGE_STOP_EROGATION {
  OUT_OF_STOCK = "out_of_stock",
  OUT_OF_SODA = "out_of_soda",
  EROGATION_LIMIT = "erogation_limit",
  OUT_OF_ORDER = "out_of_order"
}

// -- TIMER --
export interface TimerValues {
  timer_last_touch_active: number;
  timer_last_touch_inactive: number;
  timer_dims_active: number;
  timer_dims_inactive: number;
}

export const TIMER_HOME = [120000, 120000, 10000, 60000, 60000, 10000];
export const TIMER_POURING = [30000, 30000, 10000, 30000, 30000, 10000];
export const TIMER_SIGN_IN = [60000, 60000, 10000, 15000];
export const TIMER_OUT_OF_ORDER = 30000;

//  INFO-CARDS POSITIONS ON LONG-PRESS POUR
export const coordsCards = [
  [
    { card1: { top: 229, left: 216 }, card2: { top: 249, right: 239 } },
  ],
  [
    { card1: { top: 226, left: 715 }, card2: { top: 247, right: 94  } },
    { card1: { top: 226, left: 75  }, card2: { top: 247, right: 727 } },
  ],
  [
    { card1: { top: 226, left: 525 }, card2: { top: 247, right: 226 } },
    { card1: { top: 229, left: 216 }, card2: { top: 249, right: 239 } },
    { card1: { top: 226, left: 216 }, card2: { top: 247, right: 570 } },
  ],
  [
    { card1: { top: 226, left: 525 }, card2: { top: 247, right: 226 } },
    { card1: { top: 226, left: 715 }, card2: { top: 247, right: 94  } },
    { card1: { top: 226, left: 75  }, card2: { top: 247, right: 727 } },
    { card1: { top: 226, left: 200 }, card2: { top: 247, right: 570 } }
  ],
  [
    { card1: { top: 226, left: 525 }, card2: { top: 247, right: 226 } },
    { card1: { top: 229, left: 216 }, card2: { top: 249, right: 239 } },
    { card1: { top: 226, left: 216 }, card2: { top: 247, right: 570 } },
    { card1: { top: 229, left: 715 }, card2: { top: 249, right: 94  } },
    { card1: { top: 226, left: 75  }, card2: { top: 247, right: 727 } },
  ],
  [
    { card1: { top: 226, left: 525 }, card2: { top: 247, right: 226 } },
    { card1: { top: 229, left: 216 }, card2: { top: 249, right: 239 } },
    { card1: { top: 226, left: 216 }, card2: { top: 247, right: 570 } },
    { card1: { top: 226, left: 525 }, card2: { top: 247, right: 226 } },
    { card1: { top: 229, left: 216 }, card2: { top: 249, right: 239 } },
    { card1: { top: 226, left: 216 }, card2: { top: 247, right: 570 } },
  ],
  [
    { card1: { top: 226, left: 525 }, card2: { top: 247, right: 226 } },
    { card1: { top: 226, left: 715 }, card2: { top: 247, right: 94  } },
    { card1: { top: 226, left: 75  }, card2: { top: 247, right: 727 } },
    { card1: { top: 226, left: 200 }, card2: { top: 247, right: 570 } },
    { card1: { top: 229, left: 591 }, card2: { top: 249, right: 199 } },
    { card1: { top: 229, left: 216 }, card2: { top: 249, right: 239 } },
    { card1: { top: 229, left: 205 }, card2: { top: 249, right: 597 } }
  ]
];

export const coordsCardsWithSlider = [
  [
    { card1: { top: 226, left: 75  }, card2: { top: 247, right: 727 } },
  ],
  [
    { card1: { top: 226, left: 75  }, card2: { top: 247, right: 727 } },
    { card1: { top: 226, left: 75  }, card2: { top: 247, right: 727 } },
  ],
  [
    { card1: { top: 226, left: 124 }, card2: { top: 247, right: 226 } },
    { card1: { top: 226, left: 75  }, card2: { top: 247, right: 727 } },
    { card1: { top: 229, left: 205 }, card2: { top: 249, right: 597 } },
  ],
  [
    { card1: { top: 226, left: 594 }, card2: { top: 247, right: 226 } },
    { card1: { top: 226, left: 75  }, card2: { top: 247, right: 727 } },
    { card1: { top: 229, left: 205 }, card2: { top: 249, right: 597 } },
    { card1: { top: 226, left: 494 }, card2: { top: 247, right: 300 } },
  ],
  [
    { card1: { top: 226, left: 124 }, card2: { top: 247, right: 226 } },
    { card1: { top: 226, left: 75  }, card2: { top: 247, right: 727 } },
    { card1: { top: 229, left: 205 }, card2: { top: 249, right: 597 } },
    { card1: { top: 226, left: 124 }, card2: { top: 247, right: 226 } },
    { card1: { top: 226, left: 75  }, card2: { top: 247, right: 727 } },
  ],
  [
    { card1: { top: 226, left: 124 }, card2: { top: 247, right: 226 } },
    { card1: { top: 226, left: 75  }, card2: { top: 247, right: 727 } },
    { card1: { top: 229, left: 205 }, card2: { top: 249, right: 597 } },
    { card1: { top: 226, left: 124 }, card2: { top: 247, right: 226 } },
    { card1: { top: 226, left: 75  }, card2: { top: 247, right: 727 } },
    { card1: { top: 229, left: 205 }, card2: { top: 249, right: 597 } },
  ],
  [
    { card1: { top: 226, left: 625 }, card2: { top: 247, right: 186 } },
    { card1: { top: 226, left: 306 }, card2: { top: 247, right: 186  } },
    { card1: { top: 226, left: 175  }, card2: { top: 247, right: 627 } },
    { card1: { top: 226, left: 175  }, card2: { top: 247, right: 627 } },
    { card1: { top: 229, left: 216 }, card2: { top: 249, right: 239 } },
    { card1: { top: 229, left: 205 }, card2: { top: 249, right: 597 } },
    { card1: { top: 229, left: 205 }, card2: { top: 249, right: 597 } }
  ]
];

export const coordsSliderClose = [
  { card1: { top: 226, left: 515 }, card2: { top: 247, right: 226 } },
  { card1: { top: 226, left: 515 }, card2: { top: 247, right: 226  } },
];

export const coordsSliderOpen = [
  { card1: { top: 226, left: 525 }, card2: { top: 247, right: 226 } },
  { card1: { top: 226, left: 175 }, card2: { top: 247, right: 226  } },
  { card1: { top: 226, left: 175 }, card2: { top: 247, right: 525  } },
];