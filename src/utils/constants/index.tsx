// -- PAGES --
export enum Pages {
  Attractor = "/",
  Home = "/home",
  Prepay = "/prepay",
  Menu = "/menu/:typeMenu(tech|crew)"
}

// -- BEVERAGE --
export enum Beverages {
  Plain = "plain",
  Bev = "bev"
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
export const SOCKET_QR = "qr_found";
// -- MESSAGES SOCKET --
export const MESSAGE_STOP_VIDEO = "stop_video";
export const MESSAGE_START_CAMERA = "start_camera";