// medium-level.js
// bindings to medium level apis
import { getFake, get, post } from "./APIUtils";
import { of } from "rxjs";

export default {
  config: {
    getBeverages: () => get("config/beverages"),
    getVendor: () => get("config/vendor"),
    getLang: () => get("config/localization"),
    getLocalization: () => get("config/localization"),
    getBrands: () => get("config/beverage/brands_description"),
    // getErrorCodes: () => getFake("config/errorcodes"),
    getSizes: () => get("config/beverage/sizes"),
    // getLinesForCountry: () => getFake("config/beverage/default_lines"),
    // updateConfigValue: () => getFake("config/update_value"),
    saveLinesConfig: config => post("config/beverage/lines", config),
    saveLineCalibration: calibration => post("config/beverage/line_config", calibration),
    testPour: recipe => post("menu/tech_menu/beverage_settings_tech/test_line", recipe),
    lineTest: recipe => post("dispense/test_beverage", recipe),
    startClean: line => post("menu/tech_menu/clean_sanitation/start_clean", line),
    stopClean: line => post("menu/tech_menu/clean_sanitation/stop_clean", line),
    sanitationCompleted: lines => post("menu/tech_menu/clean_sanitation/save_values", lines),
    resetStockShelfLife: line => post("menu/crew_menu/stock_shelf_life/reset_bib", line),
    updateStockShelfLife: lines => post("menu/crew_menu/stock_shelf_life/save_values", lines),
    startVideo: () => post("config/start_video"),
    stopVideo: () => post("config/stop_video"),
    startDisplay: () => post("menu/employee_menu/operation_settings_employee/switch_on_display"),
    startQrCamera: () => post("config/start_camera_qr_reading"),
    stopQrCamera: () => post("config/stop_camera_qr_reading")
  },
  payment: {
    // getAvailableMethods: () => getFake("payment/methods"),
    // getBeverageFromQr: data => getFake(`payment/prepay/qr/lean/beverages_from_qr/${data}`),
    // validateQr: data => getFake(`payment/prepay/qr/lean/validate`),
    // pollNfc: () => getFake("poll_nfc_empty"),
    generateQr: data => post("payment/postpay/qr/mode1/generate", data),
    confirmPostPayment: payload => post("payment/postpay/qr/mode1/confirm", payload)
  },
  dispense: {
    pour: beverageConfig => post("dispense/pour", beverageConfig),
    stop: () => post("dispense/stop"),
    getReservedBeverage: () => get("dispense/reserved_beverage")
  },
  menu: {
    getList: () => get("menu"),
    getSubMenu: (menuId = "", submenuId = "") => get(`menu/${menuId}/${submenuId}`),
    authorize: (menuId, pin) => post("auth", { menu_id: menuId, pin }),
    saveMenuConfig: (menuId, submenuId, data) => post(`menu/${menuId}/${submenuId}/save_values`, data),
    runAction: menudata => post("menu/run_action"),
    action: (menuId, submenuId, actionId, payload) => post(`menu/${menuId}/${submenuId}/${actionId}`, payload),
  },
  alarm: {
    getAlarms: (menuId = "tech_menu", submenuId = "alarms_menu_tech") => get(`menu/${menuId}/${submenuId}`)
  },
  wifi: {
    getApList: () => get("menu/crew_menu/wifi_management"),
    connect: (bssid, password) => post("menu/crew_menu/wifi_management/connect_wifi", { bssid, password }),
    disconnect: () => post("menu/crew_menu/wifi_management/disconnect_wifi"),
    enable: () => post("menu/crew_menu/wifi_management/wifi_enable"),
    disable: () => post("menu/crew_menu/wifi_management/wifi_disable"),
    scan: () => get("menu/crew_menu/wifi_management/wifi_scan")
  }
};

// mobile: {
//   getConfig: () => get("mobile_management/config"),
//   saveConfig: (config) => post(`mobile_management/config`, config),
//   signal: () => get("mobile_management/signal"), // POLLING
//   getStatistics: () => get("mobile_management/statistics"),
//   // resetStatistics: () => delete("mobile_management/statistics"),
// },
// initialization: {
//   getConfig: () => get("initialization"),
//   getValues: () => get("initialization/values"),
//   saveValues: (config) => post("initialization/values", config),
//   // resetConfig: () => delete("initialization/values"),
// },
// alarm: {
//   getList: () => get("alarm"),
//   runAction: (alarmId, actionId, payload) => post(`alarm/${alarmId}/${actionId}`, payload),
// },
// test: {
//   // validateQrFail: data => getFake("validate_qr_fail"),
//   // notFound: data => getFake("unexistent")
// }