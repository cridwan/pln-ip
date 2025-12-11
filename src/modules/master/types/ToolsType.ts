import type { GlobalUnitInterface } from "./GlobalUnitType";

export interface ToolsInterface {
  uuid: string;
  name: string;
  merk: number;
  price: string;
  global_unit_uuid: string;
  global_unit: GlobalUnitInterface;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ToolsCreateInterface {
  name: string;
  merk: string;
  status: string;
  price: number;
  global_unit_uuid: string;
}

export interface ToolsCreateModelInterface {
  name: string;
  merk: string;
  price: string;
  global_unit_uuid: string;
  status: string;
}
