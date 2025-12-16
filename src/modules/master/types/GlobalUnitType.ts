export interface GlobalUnitInterface {
  uuid: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface GlobalUnitCreateInterface {
  name: string;
  slug: string;
}
