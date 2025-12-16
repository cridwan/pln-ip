import type { ActivityInterface } from "@/modules/master/types/AcitivityType";

export interface FormPartCloneInterface {
  part_uuid: string;
  activity_uuid: string;
}


export interface PartStdTransactionInterface {
  uuid: string;
  activity_uuid: string;
  activity: ActivityInterface;
  part_uuid: string;
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