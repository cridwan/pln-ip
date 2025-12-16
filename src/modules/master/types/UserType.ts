import type { AreaInterface } from "./AreaType";
import type { RoleInterface } from "./RoleType";

export interface UserInterface {
  name: string;
  created_at: string;
  updated_at: string;
  id: number;
  email: string;
  email_verified_at: string | null;
  roles: RoleInterface[];
  area_uuid?: string;
  area: AreaInterface;
}

export interface UserCreateInterface {
  name: string;
  email: string;
  roles: string[];
  password?: string;
  area_uuid: string;
}

export interface UserCreateModelInterface {
  name: string;
  email: string;
  roles: string;
  password: string;
  area_uuid: string;
}
