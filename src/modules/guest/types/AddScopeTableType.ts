import type { ValueUploadType } from "@/components/fields/Upload.vue";
import type { ResponseDocumentInterface } from "@/types/GlobalType";

import type { TColor } from "./ScopeType";

interface WithFileInterface {
  note: string;
  file: ValueUploadType[];
}

export interface AddScopeInterface {
  id: string;
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
  squence: ResponseSequenceAnimationInterface;
  day: number;
  animation: string;
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

export interface ResponseSequenceAnimationInterface {
  additional_scope_uuid: string;
  created_at: string;
  updated_at: string;
  uuid: string;
  name: string;
  slug: string;
}

export interface ResponseAddScopeInterface {
  uuid: string;
  name: string;
  link: string | null;
  global_unit_uuid: string;
  project_uuid: string;
  created_at: string;
  updated_at: string;
  details: {
    link: string | null;
    name: string;
    scope_standart_uuid: string;
    uuid: string;
    created_at: string;
    updated_at: string;
  }[];
  asset_welnes: Category;
  oh_recom: Category;
  wo_priority: Category;
  history: Category;
  rla: Category;
  ncr: Category;
  day: number;
  sequence_animation: ResponseSequenceAnimationInterface;
  animation: string;
  original_uuid: string;
}

export interface CreateAddScopeInterface {
  additional_scope_uuid: string;
  note: string;
  category: string;
  color: string | null;
}
