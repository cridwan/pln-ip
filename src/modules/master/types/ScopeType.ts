import type { ResponseDocumentInterface } from "@/types/GlobalType";
import type { InspectionTypeInterface } from "./InspectionType";
import type { SequenceInterface } from "./SequenceTypes";
import type { SubBidangInterface } from "./SubBidangType";

export interface ScopeInterface {
  uuid: string;
  name: string;
  category: string;
  link: string;
  details: ScopeDetailInterface[];
  inspection_type_uuid: string;
  inspection_type: InspectionTypeInterface;
  sub_bidang_uuid: string;
  sub_bidang: SubBidangInterface;
  additional_scope_uuid: string | null;
  document_uuid: string;
  document: ResponseDocumentInterface;
  created_at: string;
  updated_at: string;
  has_transaction?: number;
}

export interface ScopeDetailInterface {
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

export interface ScopeCreateInterface {
  name: string;
  inspection_type_uuid?: string | null;
  additional_scope_uuid?: string | null;
  link: string;
  category: string;
  details: { name: string }[];
  sub_bidang_uuid: string;
}

export interface ScopeUpdateInterface {
  name: string;
  inspection_type_uuid?: string | null;
  additional_scope_uuid?: string | null;
  link: string;
  category: string;
  details: { name: string; uuid: string | null }[];
  sub_bidang_uuid: string;
}

export interface ScopeCreateModelInterface {
  name: string;
  location_uuid?: string;
  unit_uuid?: string;
  machine_uuid?: string;
  inspection_type_uuid?: string;
  additional_scope_uuid?: string;
  link: string;
  category: string;
  sub_bidang_uuid: string;
  bidang_uuid: string;
}

export interface ScopeAdditionalFilterInterface {
  sub_bidang_uuid: string;
  bidang_uuid: string;
}
