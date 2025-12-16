import type { InspectionTypeInterface } from "./InspectionType";
import type { SequenceInterface } from "./SequenceTypes";

export interface AdditionalScopeInterface {
  uuid: string;
  inspection_type_uuid: string;
  inspection_type: InspectionTypeInterface;
  created_at: string;
  updated_at: string;
  name: string;
  sequence_uuid: string;
  sequence: SequenceInterface;
  has_transaction?: number;
}

export interface AdditionalScopeDetailInterface {
  uuid: string;
  name: string;
  link: string | null;
  scope_standart_uuid: string;
  created_at: string;
  updated_at: string;
  merk: string | null;
  qty: string | null;
  global_unit_uuid: string | null;
  inspection_type_uuid: string | null;
  additional_scope_uuid: string;
}

export interface AdditionalScopeCreateInterface {
  name: string;
  sequence_uuid: string;
  inspection_type_uuid: string;
}

export interface AdditionalScopeCreateModelInterface {
  name: string;
  sequence_uuid?: string;
  inspection_type_uuid?: string;
}

export interface AdditionalScopeFilterInterface {
  location_uuid: string;
  unit_uuid: string;
  machine_uuid: string;
  inspection_type_uuid: string;
}
