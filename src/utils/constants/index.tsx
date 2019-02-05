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