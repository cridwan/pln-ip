import type { ActivityInterface } from "./AcitivityType";
import type { GlobalUnitInterface } from "./GlobalUnitType";

export interface ConsMatInterface {
  uuid: string;
  name: string;
  merk: string;
  price: number;
  global_unit_uuid: string;
  global_unit: GlobalUnitInterface;
  created_at: string;
  updated_at: string;
  has_transaction?: number;
}

export interface ConsMatCreateInterface {
  name: string;
  price: number;
  merk: string;
  global_unit_uuid: string;
  activity_uuid: string;
}

export interface ConsMatCreateModelInterface {
  name: string;
  price: string;
  merk: string;
  activity_uuid: string;
  global_unit_uuid: string;
}
