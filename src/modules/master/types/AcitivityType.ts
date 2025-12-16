import type { ResponseDocumentInterface } from "@/types/GlobalType";
import type { EquipmentInterface } from "./EquipmentType";

export interface ActivityInterface {
  uuid: string;
  name: string;
  original_uuid?: string;
  document: ResponseDocumentInterface;
  document_uuid: string;
  equipment_uuid: string;
  equipment: EquipmentInterface;
  duration: number;
  created_at: string;
  updated_at: string;
  link_ik1: null;
  link_ik2: null;
  has_transaction?: number;
  serial_number:string;
}

export interface ActivityCreateInterface {
  name: string;
  link_ik1: string;
  duration: string;
  equipment_uuid: string;
  serial_number:string;
}

export interface ActivityModelCreateInterface {
  location_uuid?: string;
  unit_uuid?: string;
  machine_uuid?: string;
  inspection_type_uuid?: string;
  bidang_uuid: string;
  sub_bidang_uuid: string;
  scope_standart_uuid: string;
  equipment_uuid: string;
}

export interface ActivityFilterInterface {
  location_uuid?: string;
  unit_uuid?: string;
  machine_uuid?: string;
  inspection_type_uuid?: string;
  bidang_uuid: string;
  sub_bidang_uuid: string;
  scope_standart_uuid: string;
  equipment_uuid: string;
}
