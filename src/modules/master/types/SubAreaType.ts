import type { AreaInterface } from "./AreaType";

export interface SubAreaInterface {
    uuid: string;
    name: string;
    created_at: string;
    updated_at: string;
    area_uuid: string;
    area: AreaInterface;
}

export interface SubAreaCreateInterface {
    name: string;
    area_uuid: string;
}
