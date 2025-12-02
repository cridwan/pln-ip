import type { MachineInterface } from "./MachineType";
import type { SequenceInterface } from "./SequenceTypes";

export interface InspectionTypeInterface {
  uuid: string;
  name: string;
  machine_uuid: string;
  machine: MachineInterface;
  sequence_uuid: string;
  sequence: SequenceInterface;
  created_at: string;
  updated_at: string;
  day: number;
  has_transaction?: number;
}

export interface InspectionTypeCreateInterface {
  name: string;
  machine_uuid: string;
  sequence_uuid?: string;
}

export interface InspectionTypeModelCreateInterface {
  name: string;
  machine_uuid: string;
  location_uuid: string;
  unit_uuid: string;
  sequence_uuid: string;
}