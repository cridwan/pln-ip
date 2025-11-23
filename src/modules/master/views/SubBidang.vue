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

import { ColumnsSubBidang } from "../constants/SubBidangConstant";
import { useMasterStore } from "../stores/MasterStore";
import type { SubBidangInterface } from "../types/SubBidangType";
import FormSubBidang from "../components/FormSubBidang.vue";
import ButtonGroup from "../components/ButtonGroup.vue";
import FilterSubBidang from "../components/FilterSubBidang.vue";
import type { BidangTypeModelCreateInterface } from "../types/BidangType";

const masterStore = useMasterStore();
const total_item = ref(0);
const params = reactive({
  search: "",
  filter: "",
  filters: [
    // {
    //   group: "AND",
    //   operator: "EQ",
    //   column: "bidang_uuid",
    //   value: "",
    // },
  ],
  currentPage: 1,
  perPage: 10,
});
const open_form = ref(false);
const open_delete = ref(false);
const selected_item = ref<SubBidangInterface | null>(null);
const dataForm = ref<BidangTypeModelCreateInterface | null>(null);
const toastRef = ref<InstanceType<typeof Toast> | null>(null);
const timeout = ref(0);
const breadcrumb = ref<BreadcrumbType[]>([]);
const is_loading_filter = ref(false);

//--- GET SUBBIDANG
const {
  data: dataSubBidang,
  isFetching: isLoadingSubBidang,
  refetch: refetchSubBidang,
} = useQuery({
  queryKey: ["getSubBidangMaster"],
  queryFn: async () => {
    try {
      const { data } = await masterStore.getSubBidang(params);
      const response = data.data as IPagination<SubBidangInterface[]>;

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
});
//--- END

//--- DELETE SUBBIDANG
const { mutate: deleteSubBidang, isPending: isLoadingDelete } = useMutation({
  mutationFn: async (id: string) => {
    return await masterStore.deleteSubBidang(id);
  },
  onSuccess: () => {
    toastRef.value?.showToast({
      title: "Success",
      description: "Deleted successfully",
      type: "success",
    });
    open_delete.value = false;
    refetchSubBidang();
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
const { mutate: downloadSubBidang, isPending: isLoadingDownload } = useMutation(
  {
    mutationFn: async () => {
      return await masterStore.downloadSubBidang(params);
    },
    onSuccess: () => { },
    onError: (error) => {
      console.log(error);
    },
  }
);
//--- END

//--- DOWNLOAD TEMPLATE
const { mutate: templateSubBidang, isPending: isLoadingTemplate } = useMutation(
  {
    mutationFn: async () => {
      return await masterStore.templateSubBidang();
    },
    onSuccess: () => { },
    onError: (error) => {
      console.log(error);
    },
  }
);
//--- END

//--- IMPORT
const { mutate: importSubBidang, isPending: isLoadingImport } = useMutation({
  mutationFn: async (payload: File) => {
    return await masterStore.importSubBidang(payload);
  },
  onSuccess: () => {
    toastRef.value?.showToast({
      title: "Success",
      description: "Import successfully",
      type: "success",
    });
    refetchSubBidang();
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

    refetchSubBidang();
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
  refetchSubBidang();
};

const changeLimit = (e: string) => {
  params.perPage = parseInt(e);
  params.currentPage = 1;
  refetchSubBidang();
};

const searchTable = () => {
  clearTimeout(timeout.value);
  timeout.value = window.setTimeout(() => {
    params.currentPage = 1;
    refetchSubBidang();
  }, 1000);
};

const handleSuccess = () => {
  toastRef.value?.showToast({
    title: "Success",
    description: "Saved successfully",
    type: "success",
  });
  params.currentPage = 1;
  refetchSubBidang();
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

const handleUpdate = (item: SubBidangInterface) => {
  selected_item.value = item;
  open_form.value = true;
};

const handleDelete = (item: SubBidangInterface) => {
  selected_item.value = item;
  open_delete.value = true;
};

const onDelete = () => {
  deleteSubBidang(selected_item.value?.uuid as string);
};

const handleDownload = () => {
  downloadSubBidang();
};

const handleExportTemplate = () => {
  templateSubBidang();
};

const handleImport = (file: File) => {
  importSubBidang(file);
};

const setFilter = () => {
  params.filters = [
    {
      group: "AND",
      operator: "EQ",
      column: "bidang_uuid",
      value: String(dataForm.value?.uuid),
    },
  ] as any;
};

const handleOnFilter = (data: BidangTypeModelCreateInterface) => {
  is_loading_filter.value = true;
  dataForm.value = data;
  setFilter();
  refetchSubBidang();
};

const resetFilter = () => {
  dataForm.value = null;
  params.filters = [
    // {
    //   group: "AND",
    //   operator: "EQ",
    //   column: "bidang_uuid",
    //   value: "",
    // },
  ] as any;
};

const handleResetFilter = () => {
  is_loading_filter.value = true;
  resetFilter();
  refetchSubBidang();
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
      name: "Sub Bidang",
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
      <Button icon_only="plus" size="sm" rounded="full" color="blue" @click="handleCreate" v-if="dataForm?.uuid" />
    </div>

    <div class="flex gap-8">
      <div class="w-[330px]">
        <FilterSubBidang @filter="handleOnFilter" @reset-filter="handleResetFilter" :loading="is_loading_filter" />
      </div>
      <div class="w-full">
        <Table label-create="Sub Bidang" :columns="ColumnsSubBidang" :entities="dataSubBidang?.data || []"
          :loading="isLoadingSubBidang" :pagination="pagination" :is-create="false" v-model:model-search="params.search"
          @change-page="changePage" @change-limit="changeLimit" @search="searchTable">
          <template #column_action="{ entity }">
            <div class="flex items-center justify-center gap-4">
              <Icon name="pencil" class="icon-action-table" @click="handleUpdate(entity)" />
              <Icon name="trash" class="icon-action-table" @click="handleDelete(entity)" />
            </div>
          </template>
          <template #column_bidang="{ entity }">
            <p class="text-base text-neutral-50">
              {{ entity.bidang?.name }}
            </p>
          </template>
        </Table>
      </div>
    </div>

    <FormSubBidang :data-form="dataForm" v-model="open_form" :selected-value="selected_item" @success="handleSuccess"
      @error="handleError" />
  </div>

  <Toast ref="toastRef" />
  <ModalDelete v-model="open_delete" :title="selected_item?.name" :loading="isLoadingDelete" @delete="onDelete" />
</template>

<style lang="sass"></style>
