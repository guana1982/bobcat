// medium-level.js
// bindings to medium level apis
import { getFake, get, post } from "./APIUtils";
import { of } from "rxjs";
import { tap } from "rxjs/operators";

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
    lineTest: recipe => post("menu/tech_menu/beverage_settings_tech/prime_line", recipe),
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
  product: {
    sustainabilityData: () => get("product/sustainability_data"),
    sessionEnded: () => post("product/session_ended")
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
  brightness: {
    dimDisplay: () => post("menu/dim_display").pipe(tap(() => console.log("dim_brightness"))),
    brightenDisplay: () => post("menu/brighten_display").pipe(tap(() => console.log("brighten_brightness")))
  },
  menu: {
    getList: () => get("menu"),
    getSubMenu: (menuId = "", submenuId = "") => get(`menu/${menuId}/${submenuId}`),
    authorize: (menuId, pin) => post("auth", { menu_id: menuId, pin }),
    saveMenuConfig: (menuId, submenuId, data) => post(`menu/${menuId}/${submenuId}/save_values`, data),
    runAction: menudata => post("menu/run_action"),
    action: (menuId, submenuId, actionId, payload) => post(`menu/${menuId}/${submenuId}/${actionId}`, payload),

    authentication: pin => post("auth", { pin }),
    reboot: () => post("menu/tech_menu/operation_settings_tech/reboot_tower"),

    getMaster: () => get("menu/master_menu/master_submenu/"),
    saveMaster: values => post("menu/master_menu/master_submenu/save", values)
  },
  connectivity: {
    connectivityInfo: () => get("menu/connectivity_status"),
    signalStrength: () => get("menu/signal_strength"),
    enableMobileData: () => post("menu/enable_mobile_data"),
    disableMobileData: () => post("menu/disable_mobile_data"),
    getApn: () => get("menu/apn")
  },
  line: {
    startPriming: line_id => post("menu/start_priming", { line_id }),
    stopPriming: () => post("menu/stop_priming"),
    getLockLines: () => get("menu/lock_lines"),
    setLockLine: line_id => post("menu/lock_line", { line_id }),
    setUnlockLine: line_id => post("menu/unlock_line", { line_id }),
    bibReset: (line) => post("menu/bib_reset", line)
  },
  price: {
    getPaymentType: () =>  get("menu/payment_type"),
    setPaymentType: type => post("menu/payment_type", { type }),
    getPrices: () => get("menu/prices"),
    setPrice: data => post("menu/price", data)
  },
  timeout: {
    setTimeout: screen_saver_timeout => post("menu/screen_saver_timeout", { screen_saver_timeout })
  },
  language: {
    getLanguageList: () => get("menu/language_list"),
    setLanguage: language => post("menu/language", { language })
  },
  country: {
    getCountryList: () => get("menu/country"),
    setCountry: country => post("menu/country", { country }),
  },
  video: {
    getVideoList: () => get("menu/video_list"),
    setVideo: filename => post("menu/video", { filename })
  },
  operator: {
    getOperatorList: () => get("menu/operator"),
    setOperator: type => post("menu/operator", { type })
  },
  timezone: {
    getTimezoneList: () => get("menu/timezone"),
    setTimezone: timezone => post("menu/timezone", { timezone })
  },
  sanitation: {
    startClean: line_id => post("menu/tech_menu/clean_sanitation/start_clean", { line_id }),
    stopClean: line_id => post("menu/tech_menu/clean_sanitation/stop_clean", { line_id }),
    saveValues: lines => post("menu/tech_menu/clean_sanitation/save_values", { line_id: lines }),
  },
  updates: {
    updateUsb: update_type => post("menu/usb_update", { update_type }),
    updateRemoteServer: update_type => post("menu/server_update", { update_type })
  },
  equipmentConfiguration: {
    getFirstActivation: () => get("menu/first_activation"),
    setFirstActivation: data => post("menu/first_activation", data),
    motherboardSubstitution: serial_number => post("menu/motherboard_substitution", { serial_number }),
    equipmentSubstitution: serial_number => post("menu/equipment_substitution", { serial_number }),
    pickUp: () => post("menu/pickup")
  },
  alarm: {
    getAlarms: (menuId = "tech_menu", submenuId = "alarms_menu_tech") => get(`menu/${menuId}/${submenuId}`),
    disableAlarm: name => post("menu/disable_alerts", { name }),
    enableAlarm: name => post("menu/enable_alerts", { name })
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