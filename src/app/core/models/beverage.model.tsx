
export interface IBeverage {
  label: string;
  id: number;
  type?: string;
}

export interface IBeverageConfig {
  flavor_level: number;
  carbonation_level: number;
  temperature_level: number;
  b_complex?: boolean;
  antioxidants?: boolean;
}