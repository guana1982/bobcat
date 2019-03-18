import { BeverageStatus, IBeverage } from "../models/beverage.model";
import { BeverageTypes } from "../components/global/Beverage";

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
  pack_id?: string;
  consumer_id: string;
  consumer_nick: string;
  saveBottles: number;
  currHydraLvl: number;
  hydraGoal: number;
  favorites: IConsumerBeverage[];
  lastPour: IConsumerBeverage;
}

export interface IConsumerBeverage {
  flavorTitle: string;
  carbLvl: number;
  coldLvl: number;
  flavors: Flavor[];
  enhancements: Enhancement[];
  $type?: BeverageTypes;
  $status_id?: BeverageStatus;
  $logo_id?: any;
  $beverage?: IBeverage;
}

interface Enhancement {
  product: Product;
}

interface Flavor {
  flavorStrength: number;
  product: Product;
}

interface Product {
  flavorUpc: string;
}

/* ==== CONNECTIVITY ==== */
/* ======================================== */

export interface IWifi {
  actions: Action[];
  networks: INetwork[];
  wifi_enable: boolean;
}

export interface INetwork {
  encryption: string;
  power: string;
  locked: boolean;
  status: number;
  bssid: string;
  ip: string;
  favorited: boolean;
}

interface Action {
  label_id: string;
  group_label_id: string;
  id: string;
}