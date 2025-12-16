import type { ValueUploadType } from "@/components/fields/Upload.vue";

export interface PartInterface {
  id: string;
  part: string;
  document: {
    file: ValueUploadType[];
  } | null;
  quantity: string | null;
  unit: string | null;
  number_drawing: string | null;
  global_unit_uuid: string;
  project_uuid: string | null;
  additional_scope_uuid: string | null;
  note: string | null;
  location: string;
  size: string;
}

export interface ResponsePartInterface {
  uuid: string;
  name: string;
  no_drawing: string | null;
  note: string | null;
  project_uuid: string;
  qty: number;
  global_unit_uuid: string;
  global_unit: {
    name: string;
    uuid: string;
    created_at: string;
    updated_at: string;
  };
  created_at: string;
  updated_at: string;
  additional_scope_uuid: string | null;
  location: string;
  size: string;
}

export interface UpdatePartInterface {
  // name: string;
  qty: number;
  // noDrawing?: string | null;
  // note?: string | null;
  // global_unit_uuid: string;
  // project_uuid?: string | null;
  // additional_scope_uuid?: string | null;
}
