import type { ActivityInterface } from "@/modules/master/types/AcitivityType";

export interface FormManpowerCloneInterface {
  manpower_uuid: string;
  activity_uuid: string;
}

export interface ManpowerStdTransactionInterface {
  uuid: string;
  activity_uuid: string;
  activity: ActivityInterface;
  name: string;
  qty: number;
  price: number;
  total_qty?: number;
  created_at: string;
  updated_at: string;
  use_transaction?: boolean;
}