import type { LocationInterface } from "./LocationType";

export interface UnitInterface {
  uuid: string;
  location_uuid: string;
  name: string;
  created_at: string;
  updated_at: string;
  location: LocationInterface;
}

export interface UnitCreateInterface {
  name: string;
  location_uuid: string;
}
export interface UnitTypeModelCreateInterface {
  location_uuid: string;
}
