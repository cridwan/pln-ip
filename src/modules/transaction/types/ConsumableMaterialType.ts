export interface ConsumableMaterialInterface {
  id: string;
  material: string;
  // merk: {
  //   file: ValueUploadType[];
  // } | null;
  merk: string;
  quantity: string | null;
  unit: string | null;
  global_unit_uuid: string;
  project_uuid: string | null;
  additional_scope_uuid: string | null;
}

export interface ResponseConsMatInterface {
  uuid: string;
  name: string;
  merk: string;
  qty: number;
  global_unit_uuid: string;
  global_unit: {
    created_at: string;
    updated_at: string;
    name: string;
    uuid: string;
  };
  project_uuid: string;
  additional_scope_uuid: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateConsMatInterface {
  qty: number;
}
