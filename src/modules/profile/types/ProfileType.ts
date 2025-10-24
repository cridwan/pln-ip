export interface ProfileInterface {
  id: number;
  name: string;
  email: string;
  email_verified_at: null;
  created_at: string;
  updated_at: string;
  first_create: boolean;
}

export interface UpdateProfileInterface {
  name: string;
  email: string;
}
