import type { ValueUploadType } from "@/components/fields/Upload.vue";
import type { ResponseDocumentInterface } from "@/types/GlobalType";

export interface QcPlanInterface {
  id: string;
  name: string;
  document: {
    file: ValueUploadType[];
  } | null;
  note: string | null;
  document_original: ResponseDocumentInterface | null;
}

export interface ResponseQcPlanInterface {
  uuid: string;
  name: string;
  note: string | null;
  project_uuid: string;
  created_at: string;
  updated_at: string;
  document: ResponseDocumentInterface | null;
}
