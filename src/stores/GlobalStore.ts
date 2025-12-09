import type { StorageLike } from "pinia-plugin-persistedstate";
import { defineStore } from "pinia";
import { ref } from "vue";

import { encryptStorage } from "@/utils/storage";
import { api } from "@/api/axios";
import type {
  CreateActivityLogSyncInterface,
  CreateDocumentInterface,
} from "@/types/GlobalType";
import type { TInspection } from "@/modules/inspection/types/InspectionType";

export const useGlobalStore = defineStore(
  "global",
  () => {
    const titleHeader = ref<string>("");
    const disabledNext = ref(false);
    const disabledBack = ref(false);
    const isAddScope = ref(false);
    const isFinish = ref(false);
    const isRemoveNext = ref(false);
    const isStepNavigation = ref(false);
    const InspectionType = ref<TInspection>();

    const createDocument = async (payload: CreateDocumentInterface) => {
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, value);
        }
      });

      return await api
        .post(`/document`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const createStreamDocument = async (
      payload: CreateDocumentInterface,
      onProgress?: (percent: number) => void
    ) => {
      return await api
        .post(`/document/stream`, payload.document, {
          headers: {
            "Content-Type": payload.document.type,
            "X-filename": encodeURIComponent(payload.document.name),
            "X-modeltype": payload.document_type,
            "X-modeluuid": payload.document_uuid,
            "X-filemimetype": payload.document.type,
            "X-filesize": payload.document.size,
          },
          onUploadProgress: (progressEvent) => {
            if (onProgress && progressEvent.total) {
              const percent = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              onProgress(percent);
            }
          },
        })
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const deleteDocument = async (ids: string[]) => {
      return await api
        .delete(`/document/delete/multi`, {
          data: { ids },
        })
        .then((res) => {
          return Promise.resolve(res);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const createActivityLogSync = async (
      payload: CreateActivityLogSyncInterface
    ) => {
      return await api
        .post(`/activity-log/sync`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    return {
      createDocument,
      createStreamDocument,
      deleteDocument,
      createActivityLogSync,
      titleHeader,
      disabledNext,
      disabledBack,
      isAddScope,
      isFinish,
      isRemoveNext,
      isStepNavigation,
      InspectionType,
    };
  },
  {
    persist: {
      storage: encryptStorage as StorageLike,
      pick: [],
    },
  }
);
