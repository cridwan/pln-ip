<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import type { AxiosError } from "axios";

import type { CreateDocumentInterface, IPagination } from "@/types/GlobalType";
import { Button, ModalDelete, Table, Toast } from "@/components";
import type { ValueUploadType } from "@/components/fields/Upload.vue";
import { useQuery, useMutation } from "@tanstack/vue-query";
import { useGlobalStore } from "@/stores/GlobalStore";
import FormAssetWelness from "@/modules/transaction/components/FormAssetWelness.vue";
import FormWithUploadFile from "@/modules/transaction/components/FormWithUploadFile.vue";
import { ColumnsScope } from "@/modules/transaction/constants/ScopeConstant";
import type {
  CreateScopeInterface,
  FilterScopeInterface,
  ResponseScopeInterface,
  ScopeInterface,
  TColor,
} from "@/modules/transaction/types/ScopeType";
import { useTransactionStore } from "@/modules/transaction/stores/TransactionStore";
import FilterScope from "@/modules/transaction/components/FilterScope.vue";
import FormAdScope from "@/modules/transaction/components/FormAdScope.vue";

import type { ProjectInterface } from "../../types/ProjectType";

const open_form = ref(false);
const entitiesScope = ref<ScopeInterface[]>([]);
const selected_item = ref<ScopeInterface>();
const dataForm = ref<FilterScopeInterface | null>(null);
const transactionStore = useTransactionStore();
const globalStore = useGlobalStore();
const route = useRoute();
const params = reactive({
  search: "",
  filters: [
    {
      group: "AND",
      operator: "EQ",
      column: "additionalScope.uuid",
      value: route.params.id_scope,
    },
    {
      group: "AND",
      operator: "EQ",
      column: "sub_bidang_uuid",
      value: "",
    },
  ],
  currentPage: 1,
  perPage: 10,
});
const total_item = ref(0);
const toastRef = ref<InstanceType<typeof Toast> | null>(null);
const asset_welness = ref<any>(null);
const oh_recom = ref<any>(null);
const wo_priority = ref<any>(null);
const history = ref<any>(null);
const rla = ref<any>(null);
const ncr = ref<any>(null);
const open_delete = ref(false);
const file = ref<File | null>(null);
const is_loading_create = ref(false);
const timeout = ref(0);
const file_deleted = ref("");

//--- GET STATUS APPROVAL
const { data: dataApproval } = useQuery({
  queryKey: ["getApprovalAtScopeAddScope"],
  queryFn: async () => {
    const { data } = await transactionStore.getProject(
      route.params.id_project as string
    );
    const response = data.data.data as ProjectInterface;

    return response;
  },
  retry: 0,
  refetchOnWindowFocus: false,
});
//--- END

//--- GET SCOPE
const {
  data: dataScope,
  isFetching: isLoadingScope,
  refetch: refetchScope,
} = useQuery({
  queryKey: ["getScopeTransaction"],
  queryFn: async () => {
    try {
      const { data } = await transactionStore.getScopeStandar(params);
      const response = data.data as IPagination<ResponseScopeInterface[]>;
      total_item.value = response.total;
      const new_arr: ScopeInterface[] =
        response?.data?.map((item) => {
          return {
            id: item.uuid,
            asset: item.name || "",
            asset_welness: item.asset_welnes
              ? {
                  color: item.asset_welnes?.color,
                  note: item.asset_welnes?.note,
                  file: item.asset_welnes?.document
                    ? [
                        {
                          id: item.asset_welnes.document.uuid,
                          name: item.asset_welnes.document
                            .document_original_name,
                          size: item.asset_welnes.document.document_size,
                          file: item.asset_welnes.document.document_link,
                        },
                      ]
                    : [],
                }
              : null,
            oh_recom: item.oh_recom
              ? {
                  note: item.oh_recom?.note,
                  file: item.oh_recom?.document
                    ? [
                        {
                          id: item.oh_recom.document.uuid,
                          name: item.oh_recom.document.document_original_name,
                          size: item.oh_recom.document.document_size,
                          file: item.oh_recom.document.document_link,
                        },
                      ]
                    : [],
                }
              : null,
            wo_priority: item.wo_priority
              ? {
                  note: item.wo_priority?.note,
                  file: item.wo_priority?.document
                    ? [
                        {
                          id: item.wo_priority.document.uuid,
                          name: item.wo_priority.document
                            .document_original_name,
                          size: item.wo_priority.document.document_size,
                          file: item.wo_priority.document.document_link,
                        },
                      ]
                    : [],
                }
              : null,
            history: item.history
              ? {
                  note: item.history?.note,
                  file: item.history?.document
                    ? [
                        {
                          id: item.history.document.uuid,
                          name: item.history.document.document_original_name,
                          size: item.history.document.document_size,
                          file: item.history.document.document_link,
                        },
                      ]
                    : [],
                }
              : null,
            rla: item.rla
              ? {
                  note: item.rla?.note,
                  file: item.rla?.document
                    ? [
                        {
                          id: item.rla.document.uuid,
                          name: item.rla.document.document_original_name,
                          size: item.rla.document.document_size,
                          file: item.rla.document.document_link,
                        },
                      ]
                    : [],
                }
              : null,
            ncr: item.ncr
              ? {
                  note: item.ncr?.note,
                  file: item.ncr?.document
                    ? [
                        {
                          id: item.ncr.document.uuid,
                          name: item.ncr.document.document_original_name,
                          size: item.ncr.document.document_size,
                          file: item.ncr.document.document_link,
                        },
                      ]
                    : [],
                }
              : null,
            // children: item.details.map((el) => {
            //     return {
            //         id: el.uuid,
            //         name: el.name,
            //         document: el.document,
            //     };
            // }),
            document: item.document,
          };
        }) || [];
      entitiesScope.value = new_arr;
      return response;
    } catch (error: any) {
      const err = error as AxiosError;
      throw err.response;
    }
  },
  refetchOnWindowFocus: false,
});
//--- END

//--- GET TOTAL DURATION
const params_duration = reactive({
  project_uuid: route.params.id_project,
});
const {
  data: dataDuration,
  isFetching: isLoadingDuration,
  refetch: refetchDuration,
} = useQuery({
  queryKey: ["getTotalDurationScope"],
  queryFn: async () => {
    try {
      const { data } = await transactionStore.getTotalDurationScope(
        params_duration
      );
      return data.data.data;
    } catch (error: any) {
      const err = error as AxiosError;
      throw err.response;
    }
  },
  refetchOnWindowFocus: false,
});
//--- END

//--- CREATE SCOPE
const { mutate: createScope } = useMutation({
  mutationFn: async (payload: CreateScopeInterface) => {
    return await transactionStore.createScopeStandar(payload);
  },
  onSuccess: async (data) => {
    if (file.value === null && file_deleted.value === "") {
      refetchScope();
      refetchDuration();
      asset_welness.value.modelOpenInputData = false;
      toastRef.value?.showToast({
        title: "Success",
        description: "Saved successfully",
        type: "success",
      });
      file.value = null;
      is_loading_create.value = false;
    } else {
      if (file_deleted.value) {
        try {
          await globalStore.deleteDocument([file_deleted.value]);

          refetchScope();
          refetchDuration();
          asset_welness.value.modelOpenInputData = false;
          toastRef.value?.showToast({
            title: "Success",
            description: "Saved successfully",
            type: "success",
          });
          file.value = null;
          is_loading_create.value = false;
        } catch (error) {
          toastRef.value?.showToast({
            title: "Error",
            description: "Something went wrong",
            type: "error",
          });
          file.value = null;
          is_loading_create.value = false;
        }
      } else {
        createDocument({
          document: file.value as File,
          document_type: "App\\Models\\Transaction\\ScopeStandartAsset",
          document_uuid: data.data.data.uuid,
        });
      }
    }
  },
  onError: (error: any) => {
    console.log(error);
    toastRef.value?.showToast({
      title: "Error",
      description: error?.response?.data?.message || "Something went wrong",
      type: "error",
    });
    file.value = null;
    is_loading_create.value = false;
  },
});
//--- END

//--- CREATE DOCUMENT
const { mutate: createDocument } = useMutation({
  mutationFn: async (payload: CreateDocumentInterface) => {
    return await globalStore.createDocument(payload);
  },
  onSuccess: () => {
    refetchScope();
    refetchDuration();
    oh_recom.value.modelOpenInputData = false;
    wo_priority.value.modelOpenInputData = false;
    history.value.modelOpenInputData = false;
    rla.value.modelOpenInputData = false;
    ncr.value.modelOpenInputData = false;
    toastRef.value?.showToast({
      title: "Success",
      description: "Saved successfully",
      type: "success",
    });
    file.value = null;
    is_loading_create.value = false;
  },
  onError: (error: any) => {
    console.log(error);
    toastRef.value?.showToast({
      title: "Error",
      description: error?.response?.data?.message || "Something went wrong",
      type: "error",
    });
    file.value = null;
    is_loading_create.value = false;
  },
});
//--- END

//--- DELETE SCOPE
const { mutate: deleteScope, isPending: isLoadingDelete } = useMutation({
  mutationFn: async (id: string) => {
    return await transactionStore.deleteScopeStandar(id);
  },
  onSuccess: () => {
    refetchScope();
    refetchDuration();
    toastRef.value?.showToast({
      title: "Success",
      description: "Deleted successfully",
      type: "success",
    });
    open_delete.value = false;
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
  refetchScope();
};

const changeLimit = (e: string) => {
  params.perPage = parseInt(e);
  params.currentPage = 1;
  refetchScope();
};

const saveAssetWelness = (
  e: { color: TColor; note: string; file: ValueUploadType[] },
  entity: ScopeInterface
) => {
  is_loading_create.value = true;
  if (typeof e.file?.[0]?.file !== "string") {
    if (e.file.length === 0) {
      file_deleted.value = entity.asset_welness?.file?.[0]?.id || "";
    } else {
      file.value = e.file?.[0]?.file as File;
      file_deleted.value = "";
    }
  } else {
    file.value = null;
    file_deleted.value = "";
  }
  createScope({
    color: e.color,
    note: e.note,
    category: "asset-welness",
    scope_standart_uuid: entity.id,
  });
};

const saveFieldWithFile = (
  e: { note: string; file: ValueUploadType[] },
  entity: ScopeInterface,
  field: string
) => {
  is_loading_create.value = true;
  if (typeof e.file?.[0]?.file !== "string") {
    if (e.file.length === 0) {
      if (field === "oh-recom") {
        file_deleted.value = entity?.oh_recom?.file?.[0]?.id || "";
      } else if (field === "wo-priority") {
        file_deleted.value = entity?.wo_priority?.file?.[0]?.id || "";
      } else if (field === "history") {
        file_deleted.value = entity?.history?.file?.[0]?.id || "";
      } else if (field === "rla") {
        file_deleted.value = entity?.rla?.file?.[0]?.id || "";
      } else if (field === "ncr") {
        file_deleted.value = entity?.ncr?.file?.[0]?.id || "";
      }
    } else {
      file.value = e.file?.[0]?.file as File;
      file_deleted.value = "";
    }
  } else {
    file.value = null;
    file_deleted.value = "";
  }

  createScope({
    color: null,
    note: e.note,
    category: field,
    scope_standart_uuid: entity.id,
  });
};

const handleDelete = (e: ScopeInterface) => {
  selected_item.value = e;
  open_delete.value = true;
};

const onDelete = () => {
  deleteScope(selected_item.value?.id as string);
};

function searchTable() {
  clearTimeout(timeout.value);
  timeout.value = window.setTimeout(() => {
    params.currentPage = 1;
    refetchScope();
  }, 1000);
}

const setFilter = () => {
  params.filters = [
    {
      group: "AND",
      operator: "EQ",
      column: "additionalScope.uuid",
      value: route.params.id_scope,
    },
    {
      group: "AND",
      operator: "EQ",
      column: "sub_bidang_uuid",
      value: dataForm.value?.sub_bidang_uuid as string,
    },
  ];
};

const resetFilter = () => {
  dataForm.value = null;
  params.filters = [
    {
      group: "AND",
      operator: "EQ",
      column: "additionalScope.uuid",
      value: route.params.id_scope,
    },
    {
      group: "AND",
      operator: "EQ",
      column: "sub_bidang_uuid",
      value: "",
    },
  ];
};

const handleResetFilter = () => {
  resetFilter();
  refetchScope();
};

const handleOnFilter = (data: FilterScopeInterface) => {
  dataForm.value = data;
  setFilter();
  refetchScope();
};

const handleCreate = () => {
  console.log(dataForm);
  open_form.value = true;
};

const handleSuccess = () => {
  toastRef.value?.showToast({
    title: "Success",
    description: "Saved successfully",
    type: "success",
  });
  params.currentPage = 1;
  refetchScope();
};

const handleError = (error: any) => {
  toastRef.value?.showToast({
    title: "Error",
    description: error?.response?.data?.message || "Something went wrong",
    type: "error",
  });
};
</script>

<template>
  <Toast ref="toastRef" />
  <ModalDelete
    v-model="open_delete"
    :title="selected_item?.asset"
    :loading="isLoadingDelete"
    @delete="onDelete"
  />
  <div
    class="absolute right-12 rounded-full bg-cyan-500 text-neutral-50 text-center w-fit px-4 py-1"
  >
    <span v-if="isLoadingDuration">Loading...</span>
    <span v-else>{{ dataDuration }} Days</span>
  </div>
  <Button
    v-if="dataForm?.sub_bidang_uuid && dataApproval?.status !== 'approve'"
    icon_only="plus"
    class="absolute right-[9rem] top-[6.5rem]"
    size="sm"
    rounded="full"
    color="blue"
    @click="handleCreate"
  />
  <div class="flex gap-8">
    <div class="basis-1/5">
      <FilterScope
        @filter="handleOnFilter"
        @reset-filter="handleResetFilter"
        :loading="isLoadingScope"
      />
    </div>
    <div class="flex-1 overflow-auto">
      <div class="max-w-full min-w-full">
        <Table
          label-create="Asset"
          :columns="ColumnsScope"
          :entities="entitiesScope"
          :loading="isLoadingScope"
          :pagination="pagination"
          :is-create="false"
          v-model:model-search="params.search"
          @delete="handleDelete"
          @change-page="changePage"
          @change-limit="changeLimit"
          @search="searchTable"
        >
          <template #column_asset_welness="{ entity }">
            <div class="w-full flex justify-center">
              <p
                v-if="
                  dataApproval?.status === 'approve' && !entity.asset_welness
                "
              >
                -
              </p>
              <FormAssetWelness
                v-else
                ref="asset_welness"
                :value="entity.asset_welness"
                :label="entity.asset"
                :loading="is_loading_create"
                :disabled="dataApproval?.status === 'approve'"
                @save="(e) => saveAssetWelness(e, entity)"
              />
            </div>
          </template>
          <template #column_oh_recom="{ entity }">
            <div class="w-full flex justify-center">
              <p v-if="dataApproval?.status === 'approve' && !entity.oh_recom">
                -
              </p>
              <FormWithUploadFile
                v-else
                ref="oh_recom"
                :value="entity.oh_recom"
                :label="entity.asset"
                :loading="is_loading_create"
                :disabled="dataApproval?.status === 'approve'"
                @save="(e) => saveFieldWithFile(e, entity, 'oh-recom')"
              />
            </div>
          </template>
          <template #column_wo_priority="{ entity }">
            <div class="w-full flex justify-center">
              <p
                v-if="dataApproval?.status === 'approve' && !entity.wo_priority"
              >
                -
              </p>
              <FormWithUploadFile
                v-else
                ref="wo_priority"
                :value="entity.wo_priority"
                :label="entity.asset"
                :loading="is_loading_create"
                :disabled="dataApproval?.status === 'approve'"
                @save="(e) => saveFieldWithFile(e, entity, 'wo-priority')"
              />
            </div>
          </template>
          <template #column_history="{ entity }">
            <div class="w-full flex justify-center">
              <p v-if="dataApproval?.status === 'approve' && !entity.history">
                -
              </p>
              <FormWithUploadFile
                v-else
                ref="history"
                :value="entity.history"
                :label="entity.asset"
                :loading="is_loading_create"
                :disabled="dataApproval?.status === 'approve'"
                @save="(e) => saveFieldWithFile(e, entity, 'history')"
              />
            </div>
          </template>
          <template #column_rla="{ entity }">
            <div class="w-full flex justify-center">
              <p v-if="dataApproval?.status === 'approve' && !entity.rla">-</p>
              <FormWithUploadFile
                v-else
                ref="rla"
                :value="entity.rla"
                :label="entity.asset"
                :loading="is_loading_create"
                :disabled="dataApproval?.status === 'approve'"
                @save="(e) => saveFieldWithFile(e, entity, 'rla')"
              />
            </div>
          </template>
          <template #column_ncr="{ entity }">
            <div class="w-full flex justify-center">
              <p v-if="dataApproval?.status === 'approve' && !entity.ncr">-</p>
              <FormWithUploadFile
                v-else
                ref="ncr"
                :value="entity.ncr"
                :label="entity.asset"
                :loading="is_loading_create"
                :disabled="dataApproval?.status === 'approve'"
                @save="(e) => saveFieldWithFile(e, entity, 'ncr')"
              />
            </div>
          </template>
        </Table>
      </div>
    </div>

    <FormAdScope
      v-model="open_form"
      :dataForm="dataForm"
      :selected-value="selected_item"
      @success="handleSuccess"
      @error="handleError"
    />
  </div>
</template>
