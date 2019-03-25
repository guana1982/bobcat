// -- PAGES --
export enum Pages {
  Attractor = "/",
  Home = "/home",
  Prepay = "/prepay",
  Menu = "/menu/:typeMenu(tech|crew)",
  MenuCrew = "/menu/crew",
  MenuTech = "/menu/tech"
}

// -- BEVERAGE --
export enum Beverages {
  Plain = "plain",
  Bev = "bev"
}

// -- LEVELS BEVERAGE --
export const LEVELS = {
  flavor: [
    {label: "light", value: 1},
    {label: "full", value: 2},
    {label: "bold", value: 3}
  ],
  carbonation: [
    {label: "light", value: 20},
    {label: "medium", value: 50},
    {label: "full", value: 100}
  ],
  temperature: [
    {label: "ambient", value: 100},
    {label: "cool", value: 50},
    {label: "ice-cold", value: 0},
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
  flux_water,
  flux_soda,
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
export enum SOCKET_CONSUMER {
  QR = "consumer_qr_data",
  SERVER = "consumer_server_data"
}
// export const SOCKET_QR = "qr_found";
// -- MESSAGES SOCKET --
export const MESSAGE_STOP_VIDEO = "stop_video";
export const MESSAGE_START_CAMERA = "start_camera";


//  INFO-CARDS POSITIONS ON LONG-PRESS POUR
export const coordsCards = [
  { card1: { top: 226, left: 525 }, card2: { top: 247, right: 226 } },
  { card1: { top: 226, left: 715 }, card2: { top: 247, right: 94  } },
  { card1: { top: 226, left: 75  }, card2: { top: 247, right: 727 } },
  { card1: { top: 226, left: 200 }, card2: { top: 247, right: 570 } },
  { card1: { top: 229, left: 591 }, card2: { top: 249, right: 199 } },
  { card1: { top: 229, left: 216 }, card2: { top: 249, right: 239 } },
  { card1: { top: 229, left: 205 }, card2: { top: 249, right: 597 } },
];

export const coordsCardsWithSlider = [
  { card1: { top: 226, left: 625 }, card2: { top: 247, right: 186 } },
  { card1: { top: 226, left: 306 }, card2: { top: 247, right: 186  } },
  { card1: { top: 226, left: 175  }, card2: { top: 247, right: 627 } },
  { card1: { top: 226, left: 175  }, card2: { top: 247, right: 627 } },
  { card1: { top: 229, left: 216 }, card2: { top: 249, right: 239 } },
  { card1: { top: 229, left: 205 }, card2: { top: 249, right: 597 } },
  { card1: { top: 229, left: 205 }, card2: { top: 249, right: 597 } },
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