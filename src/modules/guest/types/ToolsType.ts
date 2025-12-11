import type { GlobalUnitInterface } from "@/modules/master/types/GlobalUnitType";

export interface ResponseToolsInterface {
  uuid: string;
  name: string;
  qty: number;
  section: string;
  global_unit_uuid: string;
  global_unit: {
    name: string;
    uuid: string;
    created_at: string;
    updated_at: string;
  };
  project_uuid: string;
  additional_scope_uuid: string | null;
  created_at: string;
  updated_at: string;
}

export interface ToolsInterface {
  uuid: string;
  name: string;
  qty: string | null;
  price: string | null;
  merk: string | null;
  status: string | null;
  global_unit_uuid: string;
  global_unit: GlobalUnitInterface;
  created_at: string;
  updated_at: string;
}

export interface UpdateToolsInterface {
  name: string;
  qty: number;
  section: string | null;
  global_unit_uuid: string;
  project_uuid: string | null;
  additional_scope_uuid: string | null;
}
