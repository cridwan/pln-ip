import type { ActivityInterface } from "@/modules/master/types/AcitivityType";
import type { ToolsInterface } from "./ToolsType";

export interface ToolStdInterface {
  uuid: string;
  activity_uuid: string;
  activity: ActivityInterface;
  tools_uuid: string;
  tool: ToolsInterface;
  qty: number;
  total_qty?: number;
  created_at: string;
  updated_at: string;
  use_transaction?: boolean;
  has_transaction?: number;
}

export interface ToolStdCreateInterface {
  tools_uuid: string;
  activity_uuid: string;
  qty: number;
}

export interface ToolStdCreateModelInterface {
  location_uuid?: string;
  unit_uuid?: string;
  machine_uuid?: string;
  inspection_type_uuid?: string;
  sub_bidang_uuid: string;
  bidang_uuid: string;
  scope_standart_uuid: string;
  equipment_uuid: string;
  activity_uuid: string;
  tool_uuid: string;
  qty: string;
}

export interface FilterToolStdInterface {
  sub_bidang_uuid: string;
  bidang_uuid: string;
  scope_standart_uuid: string;
  equipment_uuid: string;
  activity_uuid: string;
}
