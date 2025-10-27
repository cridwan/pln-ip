import type { SubAreaInterface } from "./SubAreaType";

export interface LocationInterface {
  color: string;
  created_at: string;
  updated_at: string;
  lat: string;
  lon: string;
  name: string;
  slug: string;
  uuid: string;
  description: string;
  sub_area_uuid: string;
  sub_area: SubAreaInterface;
}

export interface LocationCreateInterface {
  name: string;
  lat: string;
  lon: string;
  slug: string;
  description: string;
  color: string;
  sub_area_uuid: string;
}
