import type { UnitInterface } from "./UnitType";

export interface MachineInterface {
  name: string;
  unit_uuid: string;
  uuid: string;
  created_at: string;
  updated_at: string;
  unit: UnitInterface;
}

export interface MachineCreateInterface {
  name: string;
  unit_uuid: string;
}
