
// === BEVERAGE ===

export interface IBeverageModel {
  carbonation_levels: Carbonationlevels;
  last_sanification_date: string;
  beverage_logo_id: number;
  beverage_id: number;
  bib_reload_date: string;
  last_calibration_date: string;
  toppings: Topping[];
  beverage_menu_index: number;
  target_flow_rate: number;
  remaining_bib: number;
  calibration_status: number;
  current_flow_rate: number;
  status_id: string;
  bib_expiring_date: string;
  beverage_type: string;
  carbonation_divider: number;
  second_shelf_life: number;
  density: number;
  country: string[];
  available: boolean;
  line_id: number;
  bib_size: number;
  enabled_beverage_size_ids: number[];
  beverage_label_id: string;
  ratio: number;
}

interface Topping {
  enable: boolean;
  topping_percs: Carbonationlevels;
  topping_id: number;
}

interface Carbonationlevels {
  values: number[];
  type: string;
}

// === CONSUMER ===

export enum IdentificationConsumerTypes {
  NoAuth = "0",
  VesselSticker = "1",
  Vessel = "2",
  Phone = "3",
  // PromoCode = 4
}

export interface IConsumerModel {
  identification_type?: IdentificationConsumerTypes;
  consumer_id: string;
  consumer_nick: string;
  saveBottles: string;
  currHydraLvl: string;
  hydraGoal: string;
  favourite: Favourite[];
  last_pour: Favourite;
}

interface Favourite {
  flavorTitle: string;
  carbLvl: string;
  coldLvl: string;
  flavours: Flavour[];
  enhancements: Enhancement[];
}

interface Enhancement {
  product: Product;
}

interface Flavour {
  flavorStrength: string;
  product: Product;
}

interface Product {
  flavorUpc: string;
}
