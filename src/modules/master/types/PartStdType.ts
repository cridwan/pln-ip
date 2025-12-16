import type { ActivityInterface } from "./AcitivityType";
import type { PartInterface } from "./PartType";

export interface PartStdInterface {
  uuid: string;
  activity_uuid: string;
  activity: ActivityInterface;
  part_uuid: string;
  part: PartInterface;
  use_transaction?: boolean;
  qty: number;
  total_qty?: number;
  created_at: string;
  updated_at: string;
  has_transaction?: number;
}

export interface PartStdCreateInterface {
  part_uuid: string;
  activity_uuid: string;
  qty: number;
}

export interface PartStdCreateModelInterface {
  location_uuid?: string;
  unit_uuid?: string;
  machine_uuid?: string;
  inspection_type_uuid?: string;
  sub_bidang_uuid: string;
  bidang_uuid: string;
  scope_standart_uuid: string;
  equipment_uuid: string;
  activity_uuid: string;
  part_uuid: string;
  qty: string;
}

export interface FilterPartStdInterface {
  sub_bidang_uuid: string;
  bidang_uuid: string;
  scope_standart_uuid: string;
  equipment_uuid: string;
  activity_uuid: string;
}
