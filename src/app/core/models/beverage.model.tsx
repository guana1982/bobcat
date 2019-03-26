
export interface IBeverageConfig {
  flavor_level: number;
  carbonation_level: number;
  temperature_level: number;
  b_complex?: boolean;
  antioxidants?: boolean;
}

export interface IBeverage {
  beverage_type?: string;
  line_id?: number;
  toppings?: Topping[];
  density?: number;
  beverage_font_color?: string;
  calories?: string;
  calibration_status?: number;
  last_sanification_date?: string;
  carbonation_divider?: number;
  current_flow_rate?: number;
  bib_expiring_date?: string;
  last_calibration_date?: string;
  carbonation_levels?: Toppingpercs;
  target_flow_rate?: number;
  beverage_menu_index?: number;
  beverage_label_id?: string;
  beverage_logo_id?: number;
  status_id?: BeverageStatus;
  remaining_bib?: number;
  bib_reload_date?: string;
  bib_size?: number;
  country?: string[];
  available?: boolean;
  ratio?: number;
  second_shelf_life?: number;
  enabled_beverage_size_ids?: number[];
  beverage_id?: number;
}

interface Topping {
  enable: boolean;
  topping_percs: Toppingpercs;
  topping_id: number;
}

interface Toppingpercs {
  type: string;
  values: number[];
}

export enum BeverageStatus {
  SodaAlarm = "soda_alarm",
  PlainAlarm = "plain_alarm",
  EmptyBib = "empty_bib",
  Ok = "ok"
}