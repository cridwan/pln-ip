import type { ActivityInterface } from "@/modules/master/types/AcitivityType";

export interface FormConsMatCloneInterface {
  cons_mat_uuid: string;
  activity_uuid: string;
}

export interface ConsumableMaterialStdTransactionInterface {
  uuid: string;
  activity_uuid: string;
  activity: ActivityInterface;
  name: string;
  merk: string;
  unit: string;
  price: number;
  cons_mat_uuid: string;
  qty: number;
  use_transaction?: boolean;
  total_qty?: number;
  created_at: string;
  updated_at: string;
}