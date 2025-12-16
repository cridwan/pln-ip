import type { ScopeInterface } from "./ScopeType";

export interface EquipmentInterface {
  uuid: string;
  name: string;
  scope_standart_uuid: string;
  scope_standart: ScopeInterface;
  created_at: string;
  updated_at: string;
  link_ik1: null;
  link_ik2: null;
  has_transaction?: number;
}

export interface EquipmentCreateInterface {
  name: string;
  scope_standart_uuid: string;
}

export interface EquipmentModelCreateInterface {
  location_uuid?: string;
  unit_uuid?: string;
  machine_uuid?: string;
  inspection_type_uuid?: string;
  sub_bidang_uuid: string;
  bidang_uuid: string;
  scope_standart_uuid: string;
}

export interface EquipmentFilterInterface {
  location_uuid?: string;
  unit_uuid?: string;
  machine_uuid?: string;
  inspection_type_uuid?: string;
  sub_bidang_uuid: string;
  bidang_uuid: string;
  scope_standart_uuid: string;
}
