import type { ValueUploadType } from "@/components/fields/Upload.vue";
import type { ResponseDocumentInterface } from "@/types/GlobalType";

export interface SequenceInterface {
  uuid: string;
  name: string;
  link?: string;
  document?: ResponseDocumentInterface;
  created_at: string;
  updated_at: string;
}

export interface SequenceCreateInterface {
  name: string;
  link?: string;
}

export interface SequenceCreateModelInterface {
  name: string;
  link?: string;
  file?: ValueUploadType[];
}
