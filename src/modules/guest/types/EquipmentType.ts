import type { ResponseScopeInterface } from "./ScopeType";

export interface EquipmentInterface {
  uuid: string;
  name: string;
  scope_standart_uuid: string;
  scope_standart: ResponseScopeInterface;
  created_at: string;
  updated_at: string;
  link_ik1: null;
  link_ik2: null;
}

export interface FormEquipmentInterface {
  equipment_uuid: string;
}
export interface FormEquipmentCloneInterface {
  equipment_uuid: string;
  scope_standart_uuid: string;
}
