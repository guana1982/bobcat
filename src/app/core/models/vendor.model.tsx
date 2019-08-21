import { IBeverage, IBeverageConfig } from "./beverage.model";
import { IConsumerBeverage } from "@core/utils/APIModel";

export interface VendorConfig {
  software_version: string;
  language: string;
  screen_saver_timeout: number;
  imei: string;
  country: string;
  currency: string;
  pay_id: string;
  debug_mode: boolean;
  serial_number_mediaboard: string;
  serial_number_powerboard: string;
  serial_number_mqtt: string;
}

// === POUR CONFIG ===

export interface IPourConfig {
  params: IPourParams;
  from: PourFrom;
}

export interface IPourParams {
  beverageSelected?: IBeverage;
  beverageConfig?: IBeverageConfig;
  indexFavorite?: number;
}

// === POUR CONSUMER CONFIG ===

export interface IPourConsumerConfig {
  params: IPourConsumerParams;
  from: PourFrom;
}

export interface IPourConsumerParams {
  consumerBeverage?: IConsumerBeverage;
  indexFavorite?: number;
}

// === POUR FROM ===

export enum PourFrom {
  Ada = "ada",
  Touch = "touch"
}