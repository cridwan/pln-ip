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
import type { IPagination } from "@/types/GlobalType";
import type { BreadcrumbType } from "@/components/navigations/Breadcrumb.vue";

import { useMasterStore } from "../stores/MasterStore";
import ButtonGroup from "../components/ButtonGroup.vue";
import type { GeneratorTypeInterface } from "../types/GeneratorType";
import { ColumnsGeneratorType } from "../constants/GeneratorConstant";
import FormGenerator from "../components/FormGenerator.vue";

const masterStore = useMasterStore();
const total_item = ref(0);
const params = reactive({
  search: "",
  filter: "",
  currentPage: 1,
  perPage: 10,
});
const open_form = ref(false);
const open_delete = ref(false);
const selected_item = ref<GeneratorTypeInterface | null>(null);
const toastRef = ref<InstanceType<typeof Toast> | null>(null);
const timeout = ref(0);
const breadcrumb = ref<BreadcrumbType[]>([]);

//--- GET GENERATOR TYPE
const {
  data: dataGeneratorType,
  isFetching: isLoadingGeneratorType,
  refetch: refetchGeneratorType,
} = useQuery({
  queryKey: ["getGeneratorTypeMaster"],
  queryFn: async () => {
    try {
      const { data } = await masterStore.getGeneratorType(params);
      const response = data as IPagination<GeneratorTypeInterface[]>;

      console.log("OOO", response);

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

//--- DELETE GENERATOR TYPE
const { mutate: deleteGeneratorType, isPending: isLoadingDelete } = useMutation(
  {
    mutationFn: async (id: string) => {
      return await masterStore.deleteGeneratorType(id);
    },
    onSuccess: () => {
      toastRef.value?.showToast({
        title: "Success",
        description: "Deleted successfully",
        type: "success",
      });
      open_delete.value = false;
      refetchGeneratorType();
    },
    onError: (error: any) => {
      console.log(error);
      toastRef.value?.showToast({
        title: "Error",
        description: error?.response?.data?.message || "Something went wrong",
        type: "error",
      });
    },
  }
);
//--- END

//--- DOWNLOAD
const { mutate: downloadGeneratorType, isPending: isLoadingDownload } =
  useMutation({
    mutationFn: async () => {
      return await masterStore.downloadGeneratorType();
    },
    onSuccess: () => {},
    onError: (error) => {
      console.log(error);
    },
  });
//--- END

//--- DOWNLOAD TEMPLATE
const { mutate: templateGeneratorType, isPending: isLoadingTemplate } =
  useMutation({
    mutationFn: async () => {
      return await masterStore.templateGeneratorType();
    },
    onSuccess: () => {},
    onError: (error) => {
      console.log(error);
    },
  });
//--- END

//--- IMPORT
const { mutate: importGeneratorType, isPending: isLoadingImport } = useMutation(
  {
    mutationFn: async (payload: File) => {
      return await masterStore.importGeneratorType(payload);
    },
    onSuccess: () => {
      toastRef.value?.showToast({
        title: "Success",
        description: "Import successfully",
        type: "success",
      });
      refetchGeneratorType();
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

      refetchGeneratorType();
    },
  }
);
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
  refetchGeneratorType();
};

const changeLimit = (e: string) => {
  params.perPage = parseInt(e);
  params.currentPage = 1;
  refetchGeneratorType();
};

const searchTable = () => {
  clearTimeout(timeout.value);
  timeout.value = window.setTimeout(() => {
    params.currentPage = 1;
    refetchGeneratorType();
  }, 1000);
};

const handleSuccess = () => {
  toastRef.value?.showToast({
    title: "Success",
    description: "Saved successfully",
    type: "success",
  });
  params.currentPage = 1;
  refetchGeneratorType();
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

const handleUpdate = (item: GeneratorTypeInterface) => {
  selected_item.value = item;
  open_form.value = true;
};

const handleDelete = (item: GeneratorTypeInterface) => {
  selected_item.value = item;
  open_delete.value = true;
};

const onDelete = () => {
  deleteGeneratorType(selected_item.value?.uuid as string);
};

const handleDownload = () => {
  downloadGeneratorType();
};

const handleExportTemplate = () => {
  templateGeneratorType();
};

const handleImport = (file: File) => {
  importGeneratorType(file);
};

onMounted(() => {
  breadcrumb.value = [
    {
      name: "Main Menu",
      as_link: false,
      url: "",
    },
    {
      name: "Master Data",
      as_link: false,
      url: "",
    },
    {
      name: "Jenis Pembangkit",
      as_link: false,
      url: "",
    },
  ];
});
</script>

<template>
  <Breadcrumb :items="breadcrumb" />
  <div class="relative w-full mt-6">
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
      label-create="Jenis Pembangkit"
      :columns="ColumnsGeneratorType"
      :entities="dataGeneratorType?.data || []"
      :loading="isLoadingGeneratorType"
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
      <template #column_color="{ entity }">
        <div class="w-6 h-6 rounded" :style="{ background: entity.color }" />
      </template>
    </Table>

    <FormGenerator
      v-model="open_form"
      :selected-value="selected_item"
      @success="handleSuccess"
      @error="handleError"
    />
  </div>

  <Toast ref="toastRef" />
  <ModalDelete
    v-model="open_delete"
    :title="selected_item?.name"
    :loading="isLoadingDelete"
    @delete="onDelete"
  />
</template>
