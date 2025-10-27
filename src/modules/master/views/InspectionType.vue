<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import { AxiosError } from "axios";

import {
  Breadcrumb,
  Button,
  Icon,
  ModalDelete,
  Table,
  Toast,
} from "@/components";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import type { IPagination } from "@/types/GlobalType";
import type { BreadcrumbType } from "@/components/navigations/Breadcrumb.vue";

import { ColumnsInspectionType } from "../constants/InspectionTypeConstant";
import type {
  InspectionTypeInterface,
  InspectionTypeModelCreateInterface,
} from "../types/InspectionType";
import { useMasterStore } from "../stores/MasterStore";
import FormInspectionType from "../components/FormInspectionType.vue";
import FilterInspectionType from "../components/FilterInspectionType.vue";
import ButtonGroup from "../components/ButtonGroup.vue";

const dataForm = ref<InspectionTypeModelCreateInterface | null>(null);
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
const selected_item = ref<InspectionTypeInterface | null>(null);
const toastRef = ref<InstanceType<typeof Toast> | null>(null);
const timeout = ref(0);
const breadcrumb = ref<BreadcrumbType[]>([]);
const is_loading_filter = ref(false);

//--- GET INSPECTION TYPE
const {
  data: dataInspectionType,
  isFetching: isLoadingInspectionType,
  refetch: refetchInspectionType,
} = useQuery({
  queryKey: ["getInspectionTypeMaster"],

  queryFn: async () => {
    try {
      const { data } = await masterStore.getInspectionType(params);
      const response = data.data as IPagination<InspectionTypeInterface[]>;

      total_item.value = response.total;
      is_loading_filter.value = false;

      return response;
    } catch (error: any) {
      const err = error as AxiosError;
      is_loading_filter.value = false;
      throw err.response;
    }
  },
  enabled: computed(() => params.filters.length > 0),
  refetchOnWindowFocus: false,
  gcTime: 0,
});
//--- END

//--- DELETE INSPECTION TYPE
const { mutate: deleteInspectionType, isPending: isLoadingDelete } =
  useMutation({
    mutationFn: async (id: string) => {
      return await masterStore.deleteInspectionType(id);
    },
    onSuccess: () => {
      toastRef.value?.showToast({
        title: "Success",
        description: "Deleted successfully",
        type: "success",
      });
      open_delete.value = false;
      refetchInspectionType();
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
const { mutate: downloadInspectionType, isPending: isLoadingDownload } =
  useMutation({
    mutationFn: async () => {
      return await masterStore.downloadInspectionType(params);
    },
    onSuccess: () => { },
    onError: (error) => {
      console.log(error);
    },
  });
//--- END

//--- DOWNLOAD TEMPLATE
const { mutate: templateInspectionType, isPending: isLoadingTemplate } =
  useMutation({
    mutationFn: async () => {
      return await masterStore.templateInspectionType();
    },
    onSuccess: () => { },
    onError: (error) => {
      console.log(error);
    },
  });
//--- END

//--- IMPORT
const { mutate: importInspectionType, isPending: isLoadingImport } =
  useMutation({
    mutationFn: async (payload: File) => {
      return await masterStore.importInspectionType(payload);
    },
    onSuccess: () => {
      toastRef.value?.showToast({
        title: "Success",
        description: "Import successfully",
        type: "success",
      });
      refetchInspectionType();
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

      refetchInspectionType();
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
  refetchInspectionType();
};

const changeLimit = (e: string) => {
  params.perPage = parseInt(e);
  params.currentPage = 1;
  refetchInspectionType();
};

const searchTable = () => {
  clearTimeout(timeout.value);
  timeout.value = window.setTimeout(() => {
    params.currentPage = 1;
    refetchInspectionType();
  }, 1000);
};

const handleSuccess = () => {
  toastRef.value?.showToast({
    title: "Success",
    description: "Saved successfully",
    type: "success",
  });
  params.currentPage = 1;
  refetchInspectionType();
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

const handleUpdate = (item: InspectionTypeInterface) => {
  selected_item.value = item;
  open_form.value = true;
};

const handleDelete = (item: InspectionTypeInterface) => {
  selected_item.value = item;
  open_delete.value = true;
};

const onDelete = () => {
  deleteInspectionType(selected_item.value?.uuid as string);
};

const setFilter = () => {
  params.filters = [
    {
      group: "AND",
      operator: "EQ",
      column: "machine_uuid",
      value: String(dataForm.value?.machine_uuid),
    },
  ] as any;
};

const resetFilter = () => {
  dataForm.value = null;
  params.filters = [];
};

const handleOnFilter = (data: InspectionTypeModelCreateInterface) => {
  is_loading_filter.value = true;
  dataForm.value = data;
  setFilter();
  refetchInspectionType();
};

const handleResetFilter = () => {
  is_loading_filter.value = true;
  resetFilter();
  refetchInspectionType();
};

const handleDownload = () => {
  downloadInspectionType();
};

const handleExportTemplate = () => {
  templateInspectionType();
};

const handleImport = (file: File) => {
  importInspectionType(file);
};

onMounted(() => {
  breadcrumb.value = [
    {
      name: "Main Menu",
      as_link: false,
      url: "",
    },
    {
      name: "Inspection Type",
      as_link: false,
      url: "",
    },
  ];
});
</script>

<template>
  <div class="relative w-full">
    <div class="flex items-center gap-2 absolute right-0 top-10">
      <ButtonGroup :loading-import="isLoadingImport" :loading-download="isLoadingDownload"
        :loading-template="isLoadingTemplate" @download="handleDownload" @template="handleExportTemplate"
        @import="handleImport" />
      <Button icon_only="plus" size="sm" rounded="full" color="blue" @click="handleCreate"
        v-if="dataForm?.machine_uuid" />
    </div>

    <div class="flex gap-8">
      <div class="w-[330px]">
        <FilterInspectionType @filter="handleOnFilter" @reset-filter="handleResetFilter" :loading="is_loading_filter" />
      </div>
      <div class="w-full">
        <Breadcrumb :items="breadcrumb" />
        <Table label-create="Inspection Type" :columns="ColumnsInspectionType"
          :entities="dataInspectionType?.data || []" :loading="isLoadingInspectionType" :pagination="pagination"
          :is-create="false" v-model:model-search="params.search" class="mt-6" @change-page="changePage"
          @change-limit="changeLimit" @search="searchTable">
          <template #column_action="{ entity }">
            <div class="flex items-center justify-center gap-4">
              <Icon name="pencil" class="icon-action-table" @click="handleUpdate(entity)" />
              <Icon name="trash" class="icon-action-table" @click="handleDelete(entity)" />
            </div>
          </template>
          <template #column_sequence="{ entity }">
            <p class="text-base text-neutral-50 text-left">
              {{ entity.sequence?.name || "-" }}
            </p>
          </template>
        </Table>
      </div>
    </div>

    <FormInspectionType v-model="open_form" :selected-value="selected_item" @success="handleSuccess"
      @error="handleError" :data-form="dataForm" />
  </div>

  <Toast ref="toastRef" />
  <ModalDelete v-model="open_delete" :title="selected_item?.name" :loading="isLoadingDelete" @delete="onDelete" />
</template>
