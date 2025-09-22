export interface TInspection {
  uuid: string;
  name: string;
  machine_uuid: string;
  created_at: string;
  updated_at: string;
  day: number;
}

export interface TCreateGenerate {
  name: string;
  link: string;
  inspection_type_uuid: string;
}

export interface ResponseProject {
  uuid: string;
  name: string;
  link: string;
  inspection_type_uuid: string;
  created_at: string;
  updated_at: string;
  inspection_type: TInspection;
  status: string;
}
