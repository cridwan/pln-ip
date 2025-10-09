export interface ManPowerInterface {
  id: string;
  manpower: string;
  quantity: string | null;
  type: string;
  project_uuid: string | null;
  additional_scope_uuid: string | null;
  note: string | null;
}

export interface ResponseManPowerInterface {
  uuid: string;
  name: string;
  qty: number;
  note: string | null;
  project_uuid: string;
  type: string;
  created_at: string;
  updated_at: string;
  additional_scope_uuid: string | null;
}

export interface UpdateManPowerInterface {
  name: string;
  qty: number;
  type: string;
  note?: string | null;
  project_uuid?: string | null;
  additional_scope_uuid?: string | null;
}
