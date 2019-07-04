// -- PAGES --
export enum Pages {
  // -- CONSUMER --
  Attractor = "/",
  Home = "/home",
  Prepay = "/prepay",
  Update = "/update",
  // -- SERVICE --
  Menu = "/menu",
  Master = "/master",
  Test = "/test",
}

export const calcolaPerc = (tot, num): number => Number(((num / tot) * 100).toFixed(0));

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
  // carbTemperature: [
  //   {label: "ice-cold", value: 0},
  // ]
};

// -- TIMER --
export enum CONSUMER_TIMER {
  END_POUR = 8000
}

// -- BEVERAGE --
export enum AlarmsOutOfStock {
  flux1,
  flux2,
  flux3,
  flux4,
  flux5,
  flux6,
  // press_co2,
  // press_h2o
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
// export const SOCKET_QR = "qr_found";
// -- MESSAGES SOCKET --
export const MESSAGE_START_VIDEO = "start_video";
export const MESSAGE_STOP_VIDEO = "stop_video";
export const MESSAGE_START_CAMERA = "start_camera";
export const MESSAGE_STOP_CAMERA = "start_camera";


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