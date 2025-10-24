import type { ActivityInterface } from "./AcitivityType";
import type { ManpowerInterface } from "./ManpowerType";

export interface ManpowerStdInterface {
  uuid: string;
  activity_uuid: string;
  activity: ActivityInterface;
  manpower_uuid: string;
  manpower: ManpowerInterface;
  qty: number;
  total_qty?: number;
  created_at: string;
  updated_at: string;
  use_transaction?: boolean;
}

export interface ManpowerStdCreateInterface {
  manpower_uuid: string;
  activity_uuid: string;
  qty: number;
}

export interface ManpowerStdCreateModelInterface {
  location_uuid?: string;
  unit_uuid?: string;
  machine_uuid?: string;
  inspection_type_uuid?: string;
  sub_bidang_uuid: string;
  bidang_uuid: string;
  scope_standart_uuid: string;
  equipment_uuid: string;
  activity_uuid: string;
  manpower_uuid: string;
  qty: string;
}

export interface FilterManpowerStdInterface {
  sub_bidang_uuid: string;
  bidang_uuid: string;
  scope_standart_uuid: string;
  equipment_uuid: string;
  activity_uuid: string;
}
