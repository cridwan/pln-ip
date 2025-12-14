import type { ActivityInterface } from "@/modules/master/types/AcitivityType";

export interface FormToolCloneInterface {
  tool_uuid: string;
  activity_uuid: string;
}

export interface ToolStdTransactionInterface {
  uuid: string;
  activity_uuid: string;
  activity: ActivityInterface;
  tool_uuid: string;
  original_uuid: string;
  name: string;
  merk: string;
  unit: string;
  price: number;
  no_drawing: String;
  use_transaction?: boolean;
  qty: number;
  total_qty?: number;
  created_at: string;
  updated_at: string;
}
