<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { AxiosError } from "axios";

import {
  Breadcrumb,
  Button,
  Icon,
  ModalDelete,
  Table,
  Toast,
} from "@/components";
import { useMutation, useQuery } from "@tanstack/vue-query";
import type {
  IPagination,
  ResponseDocumentInterface,
} from "@/types/GlobalType";
import type { BreadcrumbType } from "@/components/navigations/Breadcrumb.vue";

import { useMasterStore } from "@/modules/master/stores/MasterStore";
import FormToolStd from "@/modules/master/components/FormToolStd.vue";
import FilterToolStd from "@/modules/master/components/additional/FilterToolStd.vue";
import type {
  ToolStdCreateModelInterface,
  ToolStdInterface,
} from "@/modules/master/types/ToolStdType";
import { ColumnsToolStd } from "@/modules/master/constants/ToolStdConstant";
import ButtonGroup from "@/modules/master/components/ButtonGroup.vue";
import { numberFormat } from "@/helpers/global";
import { useRoute } from "vue-router";

const route = useRoute();
const dataForm = ref<ToolStdCreateModelInterface | null>(null);
const formToolStd = ref<InstanceType<typeof FormToolStd> | null>(null);
const masterStore = useMasterStore();
const total_item = ref(0);
const params = reactive({
  search: "",
  filter: "",
  filters: [
    {
      group: "AND",
      operator: "EQ",
      column: "activity.equipment.scopeStandart.additional_scope_uuid",
      value: route.params.id_scope,
    },
    {
      group: "AND",
      operator: "EQ",
      column: "activity_uuid",
      value: "",
    },
  ],
  currentPage: 1,
  perPage: 10,
});
const open_form = ref(false);
const open_delete = ref(false);
const selected_item = ref<ToolStdInterface | null>(null);
const toastRef = ref<InstanceType<typeof Toast> | null>(null);
const timeout = ref(0);
const breadcrumb = ref<BreadcrumbType[]>([]);
const is_loading_filter = ref(false);

//--- GET TOOL STD
const {
  data: dataToolStd,
  isFetching: isLoadingToolStd,
  refetch: refetchToolStd,
} = useQuery({
  queryKey: ["getToolStdAdditionalScope"],
  queryFn: async () => {
    try {
      const { data } = await masterStore.getToolStd(
        params,
        "/add-scope/detail"
      );
      const response = data as IPagination<ToolStdInterface[]>;

      total_item.value = response.total;
      is_loading_filter.value = false;

      return response;
    } catch (error: any) {
      const err = error as AxiosError;
      is_loading_filter.value = false;
      throw err.response;
    }
  },
  refetchOnWindowFocus: false,
  enabled: computed(() => {
    return params.filters.some((e) => e.value !== "");
  }),
  gcTime: 0,
});
//--- END

//--- DELETE TOOL STD
const { mutate: deleteToolStd, isPending: isLoadingDelete } = useMutation({
  mutationFn: async (id: string) => {
    return await masterStore.deleteToolStd(id, "/add-scope/detail");
  },
  onSuccess: () => {
    toastRef.value?.showToast({
      title: "Success",
      description: "Deleted successfully",
      type: "success",
    });
    open_delete.value = false;
    refetchToolStd();
    if (formToolStd.value?.refetchTool) {
      formToolStd.value.refetchTool();
    }
  },
  onError: (error: any) => {
    toastRef.value?.showToast({
      title: "Error",
      description: error?.response?.data?.message || "Something went wrong",
      type: "error",
    });
  },
});
//--- END

//--- DOWNLOAD
const { mutate: downloadToolStd, isPending: isLoadingDownload } = useMutation({
  mutationFn: async () => {
    return await masterStore.downloadToolStd(params, "/add-scope/detail");
  },
  onSuccess: () => {},
  onError: (error) => {
    console.log(error);
  },
});
//--- END

//--- DOWNLOAD TEMPLATE
const { mutate: templateToolStd, isPending: isLoadingTemplate } = useMutation({
  mutationFn: async () => {
    return await masterStore.templateToolStd("/add-scope/detail");
  },
  onSuccess: () => {},
  onError: (error) => {
    console.log(error);
  },
});
//--- END

//--- IMPORT
const { mutate: importToolStd, isPending: isLoadingImport } = useMutation({
  mutationFn: async (payload: File) => {
    return await masterStore.importToolStd(payload, "/add-scope/detail");
  },
  onSuccess: () => {
    toastRef.value?.showToast({
      title: "Success",
      description: "Import successfully",
      type: "success",
    });
    refetchToolStd();
  },
  onError: (error) => {
    let message = "Something went wrong";

    if (error instanceof AxiosError) {
      message = error?.response?.data?.message || "Something went wrong";
    }

    toastRef.value?.showToast({
      title: "Error",
      description: message,
      type: "error",
    });

    refetchToolStd();
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
  refetchToolStd();
};

const changeLimit = (e: string) => {
  params.perPage = parseInt(e);
  params.currentPage = 1;
  refetchToolStd();
};

const searchTable = () => {
  clearTimeout(timeout.value);
  timeout.value = window.setTimeout(() => {
    params.currentPage = 1;
    refetchToolStd();
  }, 1000);
};

const handleSuccess = () => {
  toastRef.value?.showToast({
    title: "Success",
    description: "Saved successfully",
    type: "success",
  });
  params.currentPage = 1;
  refetchToolStd();
  if (formToolStd.value?.refetchTool) {
    formToolStd.value.refetchTool();
  }
};

const handleError = (error: any) => {
  toastRef.value?.showToast({
    title: "Error",
    description: error?.response?.data?.message || "Something went wrong",
    type: "error",
  });
};

const handleCreate = () => {
  selected_item.value = null;
  open_form.value = true;
};

const handleUpdate = (item: ToolStdInterface) => {
  selected_item.value = item;
  open_form.value = true;
};

const handleDelete = (item: ToolStdInterface) => {
  selected_item.value = item;
  open_delete.value = true;
};

const onDelete = () => {
  deleteToolStd(selected_item.value?.uuid as string);
};

const setFilter = () => {
  params.filters = [
    {
      group: "AND",
      operator: "EQ",
      column: "activity_uuid",
      value: String(dataForm.value?.activity_uuid),
    },
  ];
};

console.log(route.params);

const resetFilter = () => {
  dataForm.value = null;
  params.filters = [
    {
      group: "AND",
      operator: "NOT_NULL",
      column: "activity.equipment.scopeStandart.inspection_type_uuid",
      value: "",
    },
    {
      group: "AND",
      operator: "EQ",
      column: "activity_uuid",
      value: "",
    },
  ];
};

const handleOnFilter = (data: ToolStdCreateModelInterface) => {
  is_loading_filter.value = true;
  dataForm.value = data;
  setFilter();
  refetchToolStd();
};

const handleResetFilter = () => {
  is_loading_filter.value = true;
  resetFilter();
  refetchToolStd();
};

const previewDocument = (document: ResponseDocumentInterface) => {
  window.open(
    import.meta.env.VITE_API_BASE_URL.replace("api", "") +
      document.document_link,
    "_blank"
  );
};

const handleRemoveSuccess = () => {
  refetchToolStd();
};

const handleDownload = () => {
  downloadToolStd();
};

const handleExportTemplate = () => {
  templateToolStd();
};

const handleImport = (file: File) => {
  importToolStd(file);
};

onMounted(() => {
  breadcrumb.value = [
    {
      name: String(route.query?.location),
      as_link: false,
      url: "",
    },
    {
      name: String(route.query?.unit),
      as_link: false,
      url: "",
    },
    {
      name: String(route.query?.machine),
      as_link: false,
      url: "",
    },
    {
      name: String(route.query?.inspectionType),
      as_link: false,
      url: "",
    },
    {
      name: String(route.query?.addScope),
      as_link: false,
      url: "",
    },
  ];
});
</script>

<template>
  <div class="relative w-full">
    <div class="flex items-center gap-2 absolute right-0 top-10">
      <ButtonGroup
        :loading-import="isLoadingImport"
        :loading-download="isLoadingDownload"
        :loading-template="isLoadingTemplate"
        @download="handleDownload"
        @template="handleExportTemplate"
        @import="handleImport"
      />
      <Button
        v-if="dataForm?.activity_uuid"
        icon_only="plus"
        size="sm"
        rounded="full"
        color="blue"
        @click="handleCreate"
      />
    </div>

    <div class="flex gap-8">
      <div class="w-[330px]">
        <FilterToolStd
          @filter="handleOnFilter"
          @reset-filter="handleResetFilter"
          :loading="is_loading_filter"
        />
      </div>
      <div class="w-full">
        <Breadcrumb :items="breadcrumb" />
        <Table
          label-create="User"
          :columns="ColumnsToolStd"
          :entities="dataToolStd?.data || []"
          :loading="isLoadingToolStd"
          :pagination="pagination"
          :is-create="false"
          v-model:model-search="params.search"
          class="mt-6"
          @change-page="changePage"
          @change-limit="changeLimit"
          @search="searchTable"
        >
          <template #column_action="{ entity }">
            <div class="flex items-center justify-center gap-4">
              <Icon
                v-if="Number(entity?.has_transaction || 0) === 0"
                name="pencil"
                class="icon-action-table"
                @click="handleUpdate(entity)"
              />
              <Icon
                v-if="Number(entity?.has_transaction || 0) === 0"
                name="trash"
                class="icon-action-table"
                @click="handleDelete(entity)"
                v-show="Number(entity.has_transaction) == 0"
              />
            </div>
          </template>
          <template #column_tool="{ entity }">
            <p class="text-base text-neutral-50 text-left">
              {{ entity.tool?.name ?? "-" }}
            </p>
          </template>
          <template #column_price="{ entity }">
            <p class="text-base text-neutral-50 text-left">
              {{ numberFormat(Number(entity.tool?.price), true) }}
            </p>
          </template>
        </Table>
      </div>
    </div>

    <FormToolStd
      :data-form="dataForm"
      v-model="open_form"
      :selected-value="selected_item"
      @success="handleSuccess"
      @error="handleError"
      @removeSucess="handleRemoveSuccess"
      ref="formToolStd"
    />
  </div>

  <Toast ref="toastRef" />
  <ModalDelete
    v-model="open_delete"
    :title="selected_item?.tool?.name"
    :loading="isLoadingDelete"
    @delete="onDelete"
  />
</template>
