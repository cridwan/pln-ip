<script setup lang="ts">
import type { AxiosError } from "axios";
import { computed, reactive, ref } from "vue";
import { useRoute } from "vue-router";

import { Table, Toast } from "@/components";
import type { ValueUploadType } from "@/components/fields/Upload.vue";
import { useMutation, useQuery } from "@tanstack/vue-query";
import type { CreateDocumentInterface, IPagination } from "@/types/GlobalType";
import { useGlobalStore } from "@/stores/GlobalStore";

import { ColumnsAddScopeDetailQcPlan } from "../../constants/AddScope";
import type {
  QcPlanInterface,
  ResponseQcPlanInterface,
} from "../../types/QcPlanType";
import FormOnlyUploadFile from "../../components/FormOnlyUploadFile.vue";
import { useTransactionStore } from "../../stores/TransactionStore";

const entitiesQcPlan = ref<QcPlanInterface[]>([]);

const transactionStore = useTransactionStore();
const globalStore = useGlobalStore();
const route = useRoute();
const params = reactive({
  search: "",
  filter: `additional_scope_uuid,${route.params.id_scope}`,
  currentPage: 1,
  perPage: 10,
});
const total_item = ref(0);
const toastRef = ref<InstanceType<typeof Toast> | null>(null);
const attachment = ref<any>(null);
const is_loading_create = ref(false);

//--- GET QC PLAN
const {
  data: dataQcPlan,
  isFetching: isLoadingQcPlan,
  refetch: refetchQcPlan,
} = useQuery({
  queryKey: ["getAddScopeQcPlan"],
  queryFn: async () => {
    try {
      const { data } = await transactionStore.getQcPlan(params);
      const response = data as IPagination<ResponseQcPlanInterface[]>;

      total_item.value = response.total;

      const new_arr: QcPlanInterface[] =
        response.data?.map((item) => {
          return {
            id: item.uuid,
            name: item.name,
            document: item.document
              ? {
                  file: item.document
                    ? [
                        {
                          id: item.document.uuid,
                          name: item.document.document_original_name,
                          size: item.document.document_size,
                          file: item.document.document_link,
                        },
                      ]
                    : [],
                }
              : null,
            note: null,
            document_original: item.document,
          };
        }) || [];
      entitiesQcPlan.value = new_arr;

      return response;
    } catch (error: any) {
      const err = error as AxiosError;
      throw err.response;
    }
  },
  refetchOnWindowFocus: false,
});
//--- END

//--- CREATE DOCUMENT
const { mutate: createDocument } = useMutation({
  mutationFn: async (payload: CreateDocumentInterface) => {
    return await globalStore.createDocument(payload);
  },
  onSuccess: () => {
    refetchQcPlan();
    attachment.value.modelOpenInputData = false;
    toastRef.value?.showToast({
      title: "Success",
      description: "Saved successfully",
      type: "success",
    });
  },
  onError: (error: any) => {
    console.log(error);
    toastRef.value?.showToast({
      title: "Error",
      description: error?.response?.data?.message || "Something went wrong",
      type: "error",
    });
  },
});
//--- END

const pagination = computed(() => {
  return {
    totalItems: total_item.value,
    itemsPerPage: params.perPage,
    currentPage: params.currentPage,
  };
});

const changePage = (e: number) => {
  params.currentPage = e;
  refetchQcPlan();
};

const changeLimit = (e: string) => {
  params.perPage = parseInt(e);
  params.currentPage = 1;
  refetchQcPlan();
};

const preview = (item: QcPlanInterface) => {
  const a = document.createElement("a");
  a.href =
    import.meta.env.VITE_API_BASE_URL.replace("api", "") +
    item?.document_original?.document_link;
  a.download = item?.document_original?.document_name || "";
  a.target = "_blank";
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const saveFile = async (
  e: { file: ValueUploadType[] },
  entity: QcPlanInterface
) => {
  if (e.file.length === 0) {
    is_loading_create.value = true;
    try {
      await globalStore.deleteDocument([
        entity.document_original?.uuid as string,
      ]);
      refetchQcPlan();
      attachment.value.modelOpenInputData = false;
      toastRef.value?.showToast({
        title: "Success",
        description: "Saved successfully",
        type: "success",
      });
      is_loading_create.value = false;
    } catch (error) {
      toastRef.value?.showToast({
        title: "Error",
        description: "Something went wrong",
        type: "error",
      });
      is_loading_create.value = false;
    }
  } else {
    is_loading_create.value = true;
    createDocument({
      document: e.file?.[0]?.file as File,
      document_type: "App\\Models\\Transaction\\QcPlan",
      document_uuid: entity.id,
    });
  }
};
</script>

<template>
  <Toast ref="toastRef" />
  <Table
    label-create="QC Plan Document"
    :columns="ColumnsAddScopeDetailQcPlan"
    :entities="entitiesQcPlan"
    :loading="isLoadingQcPlan"
    :pagination="pagination"
    :is-create="false"
    :is-action="false"
    @change-page="changePage"
    @change-limit="changeLimit"
  >
    <template #column_attachment="{ entity }">
      <div class="w-full flex justify-center">
        <FormOnlyUploadFile
          ref="attachment"
          :value="entity.document"
          :label="entity.name"
          :loading="is_loading_create"
          @save="(e) => saveFile(e, entity)"
        />
      </div>
    </template>
    <template #column_preview="{ entity }">
      <div v-if="entity.document" class="w-full flex justify-center">
        <div
          class="bg-cyan-500 text-center border border-neutral-50 rounded-lg px-2 min-w-[120px] text-base text-neutral-50 cursor-pointer"
          @click="preview(entity)"
        >
          Preview
        </div>
      </div>
      <div v-else class="text-center">-</div>
    </template>
  </Table>
</template>
