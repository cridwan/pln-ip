<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import type { AxiosError } from "axios";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";

import { Button, Icon, ModalDelete, Table, Toast } from "@/components";
import type { ValueUploadType } from "@/components/fields/Upload.vue";
import { useMutation, useQuery } from "@tanstack/vue-query";
import type { CreateDocumentInterface, IPagination } from "@/types/GlobalType";
import { useGlobalStore } from "@/stores/GlobalStore";
import { useAuthStore } from "@/modules/auth/stores/AuthStore";

import type {
  ResponseAddScopeInterface,
  AddScopeInterface,
  CreateAddScopeInterface,
} from "../types/AddScopeTableType";
import { ColumnsScope } from "../constants/ScopeConstant";
import type { TColor } from "../types/ScopeType";
import FormAssetWelness from "../components/FormAssetWelness.vue";
import FormWithUploadFile from "../components/FormWithUploadFile.vue";
import { useTransactionStore } from "../stores/TransactionStore";
import FormAdScope from "../components/FormAdScope.vue";
import type { ProjectInterface } from "../types/ProjectType";

const authStore = useAuthStore();
const { access_token } = storeToRefs(authStore);
const open_form = ref(false);
const entitiesScope = ref<(AddScopeInterface & { original_uuid: string })[]>(
  []
);
const selected_item = ref<AddScopeInterface>();
const transactionStore = useTransactionStore();
const globalStore = useGlobalStore();
const router = useRouter();
const route = useRoute();
const params = reactive({
  search: "",
  filters: [
    {
      group: "AND",
      operator: "EQ",
      column: "project_uuid",
      value: route.params.id_project,
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
  queryKey: ["getApprovalAtAdditionalScope"],
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
const { isFetching: isLoadingScope, refetch: refetchScope } = useQuery({
  queryKey: ["getAddScopeTransaction"],
  queryFn: async () => {
    try {
      const { data } = await transactionStore.getAddScope(params);
      const response = data as IPagination<ResponseAddScopeInterface[]>;

      total_item.value = response.total;

      const new_arr: (AddScopeInterface & { original_uuid: string })[] =
        response.data?.map((item) => {
          return {
            id: item.uuid,
            original_uuid: item.original_uuid,
            squence: item.sequence_animation,
            animation: item.animation,
            day: item.day,
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
          };
        }) || [];
      entitiesScope.value = new_arr;

      return response;
    } catch (error: any) {
      const err = error as AxiosError;
      throw err.response;
    }
  },
  retry: 0,
  refetchOnWindowFocus: false,
});
//--- END

//--- DELETE
const { mutate: deleteScope, isPending: isLoadingDelete } = useMutation({
  mutationFn: async (id: string) => {
    return await transactionStore.deleteAdScope(id);
  },
  onSuccess: () => {
    refetchScope();
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

//--- CREATE ADD SCOPE
const { mutate: createAddScope } = useMutation({
  mutationFn: async (payload: CreateAddScopeInterface) => {
    return await transactionStore.createAddScope(payload);
  },
  onSuccess: async (data) => {
    if (file.value === null && file_deleted.value === "") {
      refetchScope();
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
          document_uuid: data.data.uuid,
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
  retry: 0,
});
//--- END

//--- CREATE DOCUMENT
const { mutate: createDocument } = useMutation({
  mutationFn: async (payload: CreateDocumentInterface) => {
    return await globalStore.createDocument(payload);
  },
  onSuccess: () => {
    refetchScope();
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
  retry: 0,
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
  entity: AddScopeInterface
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
  createAddScope({
    color: e.color,
    note: e.note,
    category: "asset-welness",
    additional_scope_uuid: entity.id,
  });
};

const saveFieldWithFile = (
  e: { note: string; file: ValueUploadType[] },
  entity: AddScopeInterface,
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
  createAddScope({
    color: null,
    note: e.note,
    category: field,
    additional_scope_uuid: entity.id,
  });
};

const toDetail = (id: string, original_uuid: string) => {
  router.push(
    `/${route.params.id}/create/unit/${route.params.id_unit}/${route.params.id_machine}/${route.params.menu}/${route.params.id_project}/${route.params.id_inspection}/add-scope/${id}/scope?original_uuid=${original_uuid}`
  );
};

const toSquence = (item: AddScopeInterface) => {
  router.push(
    `/${route.params.id}/create/unit/${route.params.id_unit}/${route.params.id_machine}/${route.params.menu}/${route?.params?.id_project}/${route.params.id_inspection}/add-scope-squences/${item.animation}`
  );
};

function searchTable() {
  clearTimeout(timeout.value);
  timeout.value = window.setTimeout(() => {
    params.currentPage = 1;
    refetchScope();
  }, 1000);
}

const onDelete = () => {
  deleteScope(selected_item.value?.id as string);
};

const handleDelete = (e: AddScopeInterface) => {
  selected_item.value = e;
  open_delete.value = true;
};

const handleCreate = () => {
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
  <div class="relative w-full">
    <Toast ref="toastRef" />
    <ModalDelete
      v-model="open_delete"
      :title="selected_item?.asset"
      :loading="isLoadingDelete"
      @delete="onDelete"
    />
    <Button
      v-if="dataApproval?.status !== 'approve' && access_token"
      icon_only="plus"
      class="absolute right-0"
      size="sm"
      rounded="full"
      color="blue"
      @click="handleCreate"
    />
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
      <template #header_action>
        <div class="px-3 py-1.5">
          <p class="v-table-th-text">Action</p>
        </div>
      </template>
      <template #column_asset_welness="{ entity }">
        <div class="w-full flex justify-center">
          <p
            v-if="
              (dataApproval?.status === 'approve' && !entity.asset_welness) ||
              (!access_token && !entity.asset_welness)
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
            :disabled="dataApproval?.status === 'approve' || !access_token"
            @save="(e) => saveAssetWelness(e, entity)"
          />
        </div>
      </template>
      <template #column_oh_recom="{ entity }">
        <div class="w-full flex justify-center">
          <p
            v-if="
              (dataApproval?.status === 'approve' && !entity.oh_recom) ||
              (!access_token && !entity.oh_recom)
            "
          >
            -
          </p>
          <FormWithUploadFile
            v-else
            ref="oh_recom"
            :value="entity.oh_recom"
            :label="entity.asset"
            :loading="is_loading_create"
            :disabled="dataApproval?.status === 'approve' || !access_token"
            @save="(e) => saveFieldWithFile(e, entity, 'oh-recom')"
          />
        </div>
      </template>
      <template #column_wo_priority="{ entity }">
        <div class="w-full flex justify-center">
          <p
            v-if="
              (dataApproval?.status === 'approve' && !entity.wo_priority) ||
              (!access_token && !entity.wo_priority)
            "
          >
            -
          </p>
          <FormWithUploadFile
            v-else
            ref="wo_priority"
            :value="entity.wo_priority"
            :label="entity.asset"
            :loading="is_loading_create"
            :disabled="dataApproval?.status === 'approve' || !access_token"
            @save="(e) => saveFieldWithFile(e, entity, 'wo-priority')"
          />
        </div>
      </template>
      <template #column_history="{ entity }">
        <div class="w-full flex justify-center">
          <p
            v-if="
              (dataApproval?.status === 'approve' && !entity.history) ||
              (!access_token && !entity.history)
            "
          >
            -
          </p>
          <FormWithUploadFile
            v-else
            ref="history"
            :value="entity.history"
            :label="entity.asset"
            :loading="is_loading_create"
            :disabled="dataApproval?.status === 'approve' || !access_token"
            @save="(e) => saveFieldWithFile(e, entity, 'history')"
          />
        </div>
      </template>
      <template #column_rla="{ entity }">
        <div class="w-full flex justify-center">
          <p
            v-if="
              (dataApproval?.status === 'approve' && !entity.rla) ||
              (!access_token && !entity.rla)
            "
          >
            -
          </p>
          <FormWithUploadFile
            v-else
            ref="rla"
            :value="entity.rla"
            :label="entity.asset"
            :loading="is_loading_create"
            :disabled="dataApproval?.status === 'approve' || !access_token"
            @save="(e) => saveFieldWithFile(e, entity, 'rla')"
          />
        </div>
      </template>
      <template #column_ncr="{ entity }">
        <div class="w-full flex justify-center">
          <p
            v-if="
              (dataApproval?.status === 'approve' && !entity.ncr) ||
              (!access_token && !entity.ncr)
            "
          >
            -
          </p>
          <FormWithUploadFile
            v-else
            ref="ncr"
            :value="entity.ncr"
            :label="entity.asset"
            :loading="is_loading_create"
            :disabled="dataApproval?.status === 'approve' || !access_token"
            @save="(e) => saveFieldWithFile(e, entity, 'ncr')"
          />
        </div>
      </template>
      <template #column_action="{ entity }">
        <div class="flex items-center justify-center gap-2">
          <!-- <ButtonDots :day="entity.day" @detail="toDetail(entity.id)" @squence="toSquence(entity)" /> -->
          <Icon
            name="eye"
            class="cursor-pointer text-white"
            @click="toDetail(entity.id, entity.original_uuid)"
          />
          <Icon
            v-if="dataApproval?.status !== 'approve' && access_token"
            name="trash"
            class="cursor-pointer text-white"
            @click="handleDelete(entity)"
          />
        </div>
      </template>
    </Table>

    <FormAdScope
      v-model="open_form"
      :selected-value="selected_item"
      @success="handleSuccess"
      @error="handleError"
    />
  </div>
</template>
