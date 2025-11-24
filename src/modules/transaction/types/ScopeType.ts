import type { ValueUploadType } from "@/components/fields/Upload.vue";
import type { SubBidangInterface } from "@/modules/master/types/SubBidangType";
import type { ResponseDocumentInterface } from "@/types/GlobalType";
import type { EquipmentInterface } from "@/modules/transaction/types/EquipmentType";

interface WithFileInterface {
  note: string;
  file: ValueUploadType[];
}

export type TColor = "red" | "green" | "yellow" | "";

export interface ScopeInterface {
  id: string;
  original_uuid?: string;
  asset: string;
  asset_welness: {
    color: TColor;
    note: string;
    file: ValueUploadType[];
  } | null;
  oh_recom: WithFileInterface | null;
  wo_priority: WithFileInterface | null;
  history: WithFileInterface | null;
  rla: WithFileInterface | null;
  ncr: WithFileInterface | null;
  // children: {
  //   id: string;
  //   name: string;
  //   document: ResponseDocumentInterface | null;
  // }[];
  document: ResponseDocumentInterface | null;
  children: EquipmentInterface[];
}

interface Category {
  uuid: string;
  note: string;
  category: string;
  color: TColor;
  scope_standart_uuid: string;
  created_at: string;
  updated_at: string;
  document: ResponseDocumentInterface | null;
}

export interface ResponseScopeInterface {
  uuid: string;
  original_uuid?: string;
  name: string;
  link: string | null;
  global_unit_uuid: string;
  project_uuid: string;
  sub_bidang_uuid: string;
  sub_bidang?: SubBidangInterface;
  created_at: string;
  updated_at: string;
  details: {
    link: string | null;
    name: string;
    scope_standart_uuid: string;
    uuid: string;
    created_at: string;
    updated_at: string;
    document: ResponseDocumentInterface | null;
  }[];
  asset_welnes: Category;
  oh_recom: Category;
  wo_priority: Category;
  history: Category;
  rla: Category;
  ncr: Category;
  document: ResponseDocumentInterface | null;
}

export interface CreateScopeInterface {
  scope_standart_uuid: string;
  note: string;
  category: string;
  color: string | null;
}

export interface FilterScopeInterface {
  bidang_uuid: string;
  sub_bidang_uuid: string;
}

export interface FormScopeInterface {
  scope_standart_uuid: string;
  project_uuid?: string;
  additional_scope_uuid?: string;
}

export interface FormAdScopeInterface {
  additional_scope_uuid: string;
  project_uuid: string;
}
