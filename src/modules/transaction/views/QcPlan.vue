<script setup lang="ts">
import type { AxiosError } from "axios";
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";

import {
  Breadcrumb,
  Button,
  Icon,
  ModalDelete,
  Table,
  Toast,
} from "@/components";
import type { ValueUploadType } from "@/components/fields/Upload.vue";
import { useMutation, useQuery } from "@tanstack/vue-query";
import type { CreateDocumentInterface, IPagination } from "@/types/GlobalType";
import { useGlobalStore } from "@/stores/GlobalStore";
import { useAuthStore } from "@/modules/auth/stores/AuthStore";

import { ColumnsQcPlan } from "../constants/QcPlan";
import type {
  QcPlanInterface,
  ResponseQcPlanInterface,
} from "../types/QcPlanType";
import FormOnlyUploadFile from "../components/FormOnlyUploadFile.vue";
import { useTransactionStore } from "../stores/TransactionStore";
import type { ProjectInterface } from "../types/ProjectType";
import FormCloneQcPlan from "../components/FormCloneQcPlan.vue";
import type { BreadcrumbType } from "@/components/navigations/Breadcrumb.vue";

const authStore = useAuthStore();
const open_form = ref(false);
const breadcrumb = ref<BreadcrumbType[]>([]);
const open_delete = ref(false);
const selected_item = ref<QcPlanInterface | null>(null);
const formCloneQcPlanm = ref<InstanceType<typeof FormCloneQcPlan> | null>(null);
const { access_token } = storeToRefs(authStore);
const entitiesQcPlan = ref<QcPlanInterface[]>([]);
const transactionStore = useTransactionStore();
const globalStore = useGlobalStore();
const route = useRoute();
const params = reactive({
  search: "",
  filter: "",
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
const attachment = ref<any>(null);
const timeout = ref(0);
const is_loading_create = ref(false);

//--- GET STATUS APPROVAL
const { data: dataApproval } = useQuery({
  queryKey: ["getApprovalAtQcPlan"],
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

//--- DELETE QC PLAN
const { mutate: deleteQcPlan, isPending: isLoadingDelete } = useMutation({
  mutationFn: async (id: string) => {
    return await transactionStore.deleteQcPlan(id);
  },
  onSuccess: () => {
    toastRef.value?.showToast({
      title: "Success",
      description: "Deleted successfully",
      type: "success",
    });
    open_delete.value = false;
    refetchQcPlan();
    if (formCloneQcPlanm.value?.refetchQcPlan) {
      formCloneQcPlanm.value.refetchQcPlan();
    }
  },
  onError: (error: any) => {
    console.log(error);
    toastRef.value?.showToast({
      title: "Error",
      description: error?.response?.data?.message || "Something went wrong",
      type: "error",
    });
  },
  retry: 0,
});
//--- END

//--- GET QC PLAN
const { isFetching: isLoadingQcPlan, refetch: refetchQcPlan } = useQuery({
  queryKey: ["getQcPlanTransaction"],
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
  retry: 0,
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
    is_loading_create.value = false;
  },
  onError: (error: any) => {
    console.log(error);
    toastRef.value?.showToast({
      title: "Error",
      description: error?.response?.data?.message || "Something went wrong",
      type: "error",
    });
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

function searchTable() {
  clearTimeout(timeout.value);
  timeout.value = window.setTimeout(() => {
    params.currentPage = 1;
    refetchQcPlan();
  }, 1000);
}

const handleSuccess = () => {
  toastRef.value?.showToast({
    title: "Success",
    description: "Saved successfully",
    type: "success",
  });
  params.currentPage = 1;
  refetchQcPlan();

  if (formCloneQcPlanm.value?.refetchQcPlan) {
    formCloneQcPlanm.value.refetchQcPlan();
  }
};

const handleError = (error: any) => {
  toastRef.value?.showToast({
    title: "Error",
    description: error?.response?.data?.message || "Something went wrong",
    type: "error",
  });
};

const handleRemoveSuccess = () => {
  refetchQcPlan();
};

const handleCreate = () => {
  open_form.value = true;
};

const onDelete = () => {
  deleteQcPlan(selected_item.value?.id as string);
};

const handleDelete = (item: QcPlanInterface) => {
  selected_item.value = item;
  open_delete.value = true;
};
onMounted(() => {
  breadcrumb.value = [
    {
      name: route.query?.location as string,
      as_link: false,
      url: "",
    },
    {
      name: route.query?.unit as string,
      as_link: false,
      url: "",
    },
    {
      name: route.query?.machine as string,
      as_link: false,
      url: "",
    },
    {
      name: ((route.query?.inspection as string) || "").toUpperCase(),
      as_link: false,
      url: "",
    },
    {
      name: "QC PLAN",
      as_link: false,
      url: "",
    },
  ];
});
</script>

<template>
  <Toast ref="toastRef" />
  <Button
    icon_only="plus"
    class="absolute right-10"
    size="sm"
    rounded="full"
    color="blue"
    @click="handleCreate"
    v-show="authStore.users?.role == 'planner'"
  />
  <Breadcrumb :items="breadcrumb" />
  <Table
    :is_logging="false"
    label-create="QC Plan Document"
    :columns="ColumnsQcPlan"
    :entities="entitiesQcPlan"
    :loading="isLoadingQcPlan"
    :pagination="pagination"
    :is-create="false"
    :is-action="
      dataApproval?.status !== 'approve' &&
      access_token !== '' &&
      authStore.users?.role == 'planner'
    "
    v-model:model-search="params.search"
    @change-page="changePage"
    @change-limit="changeLimit"
    @search="searchTable"
  >
    <template #column_action="{ entity }">
      <div class="flex items-center justify-center gap-4">
        <Icon
          name="trash"
          class="icon-action-table"
          @click="handleDelete(entity)"
        />
      </div>
    </template>
    <template #column_attachment="{ entity }">
      <div class="w-full flex justify-center">
        <p
          v-if="
            (dataApproval?.status === 'approve' && !entity.document) ||
            (!access_token && !entity.document)
          "
        >
          -
        </p>
        <FormOnlyUploadFile
          v-else
          ref="attachment"
          :value="entity.document"
          :label="entity.name"
          :loading="is_loading_create"
          :disabled="
            dataApproval?.status === 'approve' ||
            !access_token ||
            authStore.users?.role != 'planner'
          "
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
  <FormCloneQcPlan
    ref="formCloneQcPlanm"
    v-model="open_form"
    @success="handleSuccess"
    @error="handleError"
    @removeSucess="handleRemoveSuccess"
  />
  <ModalDelete
    v-model="open_delete"
    :title="`${selected_item?.name}`"
    :loading="isLoadingDelete"
    @delete="onDelete"
  />
</template>
