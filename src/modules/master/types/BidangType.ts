import type { LocationInterface } from "./LocationType";

export interface BidangInterface {
  uuid: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface BidangCreateInterface {
  name: string;
}
export interface BidangTypeModelCreateInterface {
  uuid: string;
}
