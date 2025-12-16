import type { ValueUploadType } from "@/components/fields/Upload.vue";
import type { HseDocCreateInterface } from "@/modules/master/types/HseDocTypes";
import type { ResponseDocumentInterface } from "@/types/GlobalType";

export interface HseDocInterface {
    uuid: string;
    name: string;
    project_uuid: string;
    created_at: string;
    updated_at: string;
    document: {
        file: ValueUploadType[];
    } | null;
    document_original: ResponseDocumentInterface | null;
}

export interface ResponseHseDocInterface {
    uuid: string;
    name: string;
    project_uuid: string;
    created_at: string;
    updated_at: string;
    document: ResponseDocumentInterface | null;
}
