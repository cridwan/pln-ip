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
import { numberFormat } from "@/helpers/global";

import { ColumnsConsMat } from "../constants/ConsumableMaterialConstant";
import { useMasterStore } from "../stores/MasterStore";
import type { ConsMatInterface } from "../types/ConsumableMaterialType";
import FormConsumableMaterial from "../components/FormConsumableMaterial.vue";
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
const selected_item = ref<ConsMatInterface | null>(null);
const toastRef = ref<InstanceType<typeof Toast> | null>(null);
const timeout = ref(0);
const breadcrumb = ref<BreadcrumbType[]>([]);

//--- GET CONSUMABLE MATERIAL
const {
  data: dataConsMat,
  isFetching: isLoadingConsMat,
  refetch: refetchConsMat,
} = useQuery({
  queryKey: ["getConsMatMaster"],
  queryFn: async () => {
    try {
      const { data } = await masterStore.getConsMat(params);
      const response = data.data as IPagination<ConsMatInterface[]>;

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

//--- DELETE CONSUMABLE MATERIAL
const { mutate: deleteConsMat, isPending: isLoadingDelete } = useMutation({
  mutationFn: async (id: string) => {
    return await masterStore.deleteConsMat(id);
  },
  onSuccess: () => {
    toastRef.value?.showToast({
      title: "Success",
      description: "Deleted successfully",
      type: "success",
    });
    open_delete.value = false;
    refetchConsMat();
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
const { mutate: downloadConsMat, isPending: isLoadingDownload } = useMutation({
  mutationFn: async () => {
    return await masterStore.downloadConsMat();
  },
  onSuccess: () => { },
  onError: (error) => {
    console.log(error);
  },
});
//--- END

//--- DOWNLOAD TEMPLATE
const { mutate: templateConsMat, isPending: isLoadingTemplate } = useMutation({
  mutationFn: async () => {
    return await masterStore.templateConsMat();
  },
  onSuccess: () => { },
  onError: (error) => {
    console.log(error);
  },
});
//--- END

//--- IMPORT
const { mutate: importConsMat, isPending: isLoadingImport } = useMutation({
  mutationFn: async (payload: File) => {
    return await masterStore.importConsMat(payload);
  },
  onSuccess: () => {
    toastRef.value?.showToast({
      title: "Success",
      description: "Import successfully",
      type: "success",
    });
    refetchConsMat();
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

    refetchConsMat();
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
  refetchConsMat();
};

const changeLimit = (e: string) => {
  params.perPage = parseInt(e);
  params.currentPage = 1;
  refetchConsMat();
};

const searchTable = () => {
  clearTimeout(timeout.value);
  timeout.value = window.setTimeout(() => {
    params.currentPage = 1;
    refetchConsMat();
  }, 1000);
};

const handleSuccess = () => {
  toastRef.value?.showToast({
    title: "Success",
    description: "Saved successfully",
    type: "success",
  });
  params.currentPage = 1;
  refetchConsMat();
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

const handleUpdate = (item: ConsMatInterface) => {
  selected_item.value = item;
  open_form.value = true;
};

const handleDelete = (item: ConsMatInterface) => {
  selected_item.value = item;
  open_delete.value = true;
};

const onDelete = () => {
  deleteConsMat(selected_item.value?.uuid as string);
};

const handleDownload = () => {
  downloadConsMat();
};

const handleExportTemplate = () => {
  templateConsMat();
};

const handleImport = (file: File) => {
  importConsMat(file);
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
      name: "Consumable Material",
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
      <!-- <Button text="Import" rounded="full" color="blue" />
      <Button text="Download" rounded="full" color="blue" />
      <Button text="Export Template" rounded="full" color="blue" /> -->
      <ButtonGroup :loading-import="isLoadingImport" :loading-download="isLoadingDownload"
        :loading-template="isLoadingTemplate" @download="handleDownload" @template="handleExportTemplate"
        @import="handleImport" />
      <Button icon_only="plus" size="sm" rounded="full" color="blue" @click="handleCreate" />
    </div>

    <Table label-create="ConsMat" :columns="ColumnsConsMat" :entities="dataConsMat?.data || []"
      :loading="isLoadingConsMat" :pagination="pagination" :is-create="false" v-model:model-search="params.search"
      @change-page="changePage" @change-limit="changeLimit" @search="searchTable">
      <template #column_action="{ entity }">
        <div class="flex items-center justify-center gap-4">
          <Icon name="pencil" class="icon-action-table" @click="handleUpdate(entity)" />
          <Icon name="trash" class="icon-action-table" @click="handleDelete(entity)" />
        </div>
      </template>
      <template #column_price="{ entity }">
        <p class="text-base text-neutral-50 text-left">
          {{ numberFormat(entity.price, true) }}
        </p>
      </template>
      <template #column_global_unit="{ entity }">
        <p class="text-base text-neutral-50 text-left">
          {{ entity.global_unit?.name ?? "-" }}
        </p>
      </template>
    </Table>

    <FormConsumableMaterial v-model="open_form" :selected-value="selected_item" @success="handleSuccess"
      @error="handleError" />
  </div>

  <Toast ref="toastRef" />
  <ModalDelete v-model="open_delete" :title="`${selected_item?.name} / ${selected_item?.global_unit?.name}`"
    :loading="isLoadingDelete" @delete="onDelete" />
</template>
