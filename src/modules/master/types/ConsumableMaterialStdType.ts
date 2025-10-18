import type { ActivityInterface } from "./AcitivityType";
import type { ConsMatInterface } from "./ConsumableMaterialType";

export interface ConsumableMaterialStdInterface {
  uuid: string;
  activity_uuid: string;
  activity: ActivityInterface;
  cons_mat_uuid: string;
  consmat: ConsMatInterface;
  qty: number;
  use_transaction?: boolean;
  total_qty?: number;
  created_at: string;
  updated_at: string;
}

export interface ConsumableMaterialStdCreateInterface {
  cons_mat_uuid: string;
  activity_uuid: string;
  qty: number;
}

export interface ConsumableMaterialStdCreateModelInterface {
  location_uuid?: string;
  unit_uuid?: string;
  machine_uuid?: string;
  inspection_type_uuid?: string;
  sub_bidang_uuid: string;
  bidang_uuid: string;
  scope_standart_uuid: string;
  equipment_uuid: string;
  activity_uuid: string;
  cons_mat_uuid: string;
  qty: string;
}

export interface FilterConsumableMaterialStdInterface {
  bidang_uuid: string;
  sub_bidang_uuid: string;
  scope_standart_uuid: string;
  equipment_uuid: string;
  activity_uuid: string;
}
