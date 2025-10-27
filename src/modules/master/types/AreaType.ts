import type { LocationInterface } from "./LocationType";

export interface AreaInterface {
    uuid: string;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface AreaCreateInterface {
    name: string;
}
export interface AreaTypeModelCreateInterface {
    uuid: string;
}
