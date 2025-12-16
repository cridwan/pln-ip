<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { AxiosError } from "axios";

import { Button, Icon, ModalDelete, Table, Toast } from "@/components";
import { useMutation, useQuery } from "@tanstack/vue-query";
import type { IPagination } from "@/types/GlobalType";

import { ColumnsTools } from "../constants/ToolsConstant";
import type { ToolsInterface } from "../types/ToolsType";
import { useMasterStore } from "../stores/MasterStore";
import FormTools from "../components/FormTools.vue";
import { numberFormat } from "@/helpers/global";
import ButtonGroup from "../components/ButtonGroup.vue";

const masterStore = useMasterStore();
const total_item = ref(0);
const params = reactive({
  search: "",
  filter: "",
  filters: [],
  currentPage: 1,
  perPage: 10,
});
const open_form = ref(false);
const open_delete = ref(false);
const selected_item = ref<ToolsInterface | null>(null);
const toastRef = ref<InstanceType<typeof Toast> | null>(null);
const timeout = ref(0);

//--- GET TOOLS
const {
  data: dataTools,
  isFetching: isLoadingTools,
  refetch: refetchTools,
} = useQuery({
  queryKey: ["getToolsMaster"],
  queryFn: async () => {
    try {
      const { data } = await masterStore.getTools(params);
      const response = data.data as IPagination<ToolsInterface[]>;

      total_item.value = response.total;

      return response;
    } catch (error: any) {
      const err = error as AxiosError;
      throw err.response;
    }
  },
  refetchOnWindowFocus: false,
});
//--- END

//--- DELETE TOOLS
const { mutate: deleteTools, isPending: isLoadingDelete } = useMutation({
  mutationFn: async (id: string) => {
    return await masterStore.deleteTools(id);
  },
  onSuccess: () => {
    toastRef.value?.showToast({
      title: "Success",
      description: "Deleted successfully",
      type: "success",
    });
    open_delete.value = false;
    refetchTools();
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

//--- DOWNLOAD
const { mutate: downloadTools, isPending: isLoadingDownload } = useMutation({
  mutationFn: async () => {
    return await masterStore.downloadTools(params);
  },
  onSuccess: () => {},
  onError: (error) => {
    console.log(error);
  },
});
//--- END

//--- DOWNLOAD TEMPLATE
const { mutate: templateTools, isPending: isLoadingTemplate } = useMutation({
  mutationFn: async () => {
    return await masterStore.templateTools();
  },
  onSuccess: () => {},
  onError: (error) => {
    console.log(error);
  },
});
//--- END

//--- IMPORT
const { mutate: importTools, isPending: isLoadingImport } = useMutation({
  mutationFn: async (payload: File) => {
    return await masterStore.importTools(payload);
  },
  onSuccess: () => {
    toastRef.value?.showToast({
      title: "Success",
      description: "Import successfully",
      type: "success",
    });
    refetchTools();
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

    refetchTools();
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
  refetchTools();
};

const changeLimit = (e: string) => {
  params.perPage = parseInt(e);
  params.currentPage = 1;
  refetchTools();
};

const searchTable = () => {
  clearTimeout(timeout.value);
  timeout.value = window.setTimeout(() => {
    params.currentPage = 1;
    refetchTools();
  }, 1000);
};

const handleSuccess = () => {
  toastRef.value?.showToast({
    title: "Success",
    description: "Saved successfully",
    type: "success",
  });
  params.currentPage = 1;
  refetchTools();
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

const handleUpdate = (item: ToolsInterface) => {
  selected_item.value = item;
  open_form.value = true;
};

const handleDelete = (item: ToolsInterface) => {
  selected_item.value = item;
  open_delete.value = true;
};

const onDelete = () => {
  deleteTools(selected_item.value?.uuid as string);
};

const handleDownload = () => {
  downloadTools();
};

const handleExportTemplate = () => {
  templateTools();
};

const handleImport = (file: File) => {
  importTools(file);
};
</script>

<template>
  <Toast ref="toastRef" />
  <ModalDelete
    v-model="open_delete"
    :title="selected_item?.name"
    :loading="isLoadingDelete"
    @delete="onDelete"
  />

  <div class="relative w-full">
    <div class="flex items-center gap-2 absolute right-0">
      <ButtonGroup
        :loading-import="isLoadingImport"
        :loading-download="isLoadingDownload"
        :loading-template="isLoadingTemplate"
        @download="handleDownload"
        @template="handleExportTemplate"
        @import="handleImport"
      />
      <Button
        icon_only="plus"
        size="sm"
        rounded="full"
        color="blue"
        @click="handleCreate"
      />
    </div>

    <Table
      label-create="Tools"
      :columns="ColumnsTools"
      :entities="dataTools?.data || []"
      :loading="isLoadingTools"
      :pagination="pagination"
      :is-create="false"
      v-model:model-search="params.search"
      @change-page="changePage"
      @change-limit="changeLimit"
      @search="searchTable"
    >
      <template #column_action="{ entity }">
        <div class="flex items-center justify-center gap-4">
          <Icon
            name="pencil"
            class="icon-action-table"
            @click="handleUpdate(entity)"
          />
          <Icon
            name="trash"
            class="icon-action-table"
            @click="handleDelete(entity)"
          />
        </div>
      </template>
      <template #column_price="{ entity }">
        <p class="text-base text-neutral-50 text-center">
          {{ numberFormat(entity.price, true) }}
        </p>
      </template>
      <template #column_unit="{ entity }">
        <p class="text-base text-neutral-50 text-center">
          {{ entity?.global_unit?.name ?? "-" }}
        </p>
      </template>
    </Table>

    <FormTools
      v-model="open_form"
      :selected-value="selected_item"
      @success="handleSuccess"
      @error="handleError"
    />
  </div>
</template>
