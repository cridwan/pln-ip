export interface GeneratorTypeInterface {
  uuid: string;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
  activity_log: {
    uuid: string;
    activity_type: string;
    activity_id: string;
    created_id: number;
    updated_id: string;
    created_at: string;
    updated_at: string;
    updated_by: string;
    created_by: {
      id: number;
      name: string;
      email: string;
      email_verified_at: string;
      created_at: string;
      updated_at: string;
      first_create: boolean;
      area_uuid: string;
    };
  };
}

export interface GeneratorTypeCreateInterface {
  name: string;
  color: string;
}
