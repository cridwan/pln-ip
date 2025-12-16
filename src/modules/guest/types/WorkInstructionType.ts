import type { ValueUploadType } from "@/components/fields/Upload.vue";

export interface WorkInstructionInterface {
  id: number;
  scope: string;
  document: {
    file: ValueUploadType[];
  } | null;
  note: string | null;
}

export interface ResponseWorkInstructionInterface {
  uuid: string;
  name: string;
  created_at: string;
  updated_at: string;
}
