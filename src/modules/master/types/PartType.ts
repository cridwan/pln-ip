import type { GlobalUnitInterface } from "./GlobalUnitType";

export interface PartInterface {
  uuid: string;
  name: string;
  price: string;
  merk: string;
  no_drawing: string;
  global_unit_uuid: string;
  global_unit: GlobalUnitInterface;
  created_at: string;
  updated_at: string;
  has_transaction?: number;
}

export interface PartCreateInterface {
  name: string;
  price: number;
  merk: string;
  no_drawing: string;
  global_unit_uuid: string;
}

export interface PartCreateModelInterface {
  name: string;
  price: string;
  merk: string;
  no_drawing: string;
  global_unit_uuid: string;
}
