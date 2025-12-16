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

import { ColumnsUnit } from "../constants/UnitConstant";
import type {
  UnitInterface,
  UnitTypeModelCreateInterface,
} from "../types/UnitType";
import { useMasterStore } from "../stores/MasterStore";
import FormUnit from "../components/FormUnit.vue";
import ButtonGroup from "../components/ButtonGroup.vue";
import FilterUnit from "../components/FilterUnit.vue";

const masterStore = useMasterStore();
const total_item = ref(0);
const params = reactive({
  search: "",
  filter: "",
  filters: [
    // {
    //   group: "AND",
    //   operator: "EQ",
    //   column: "location_uuid",
    //   value: "",
    // },
  ],
  currentPage: 1,
  perPage: 10,
});
const open_form = ref(false);
const open_delete = ref(false);
const selected_item = ref<UnitInterface | null>(null);
const toastRef = ref<InstanceType<typeof Toast> | null>(null);
const timeout = ref(0);
const breadcrumb = ref<BreadcrumbType[]>([]);
const dataForm = ref<UnitTypeModelCreateInterface | null>(null);
const is_loading_filter = ref(false);

//--- GET UNIT
const {
  data: dataUnit,
  isFetching: isLoadingUnit,
  refetch: refetchUnit,
} = useQuery({
  queryKey: ["getUnitMaster"],
  queryFn: async () => {
    try {
      const { data } = await masterStore.getUnit(params);
      const response = data.data as IPagination<UnitInterface[]>;

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

//--- DELETE UNIT
const { mutate: deleteUnit, isPending: isLoadingDelete } = useMutation({
  mutationFn: async (id: string) => {
    return await masterStore.deleteUnit(id);
  },
  onSuccess: () => {
    toastRef.value?.showToast({
      title: "Success",
      description: "Deleted successfully",
      type: "success",
    });
    open_delete.value = false;
    refetchUnit();
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
const { mutate: downloadUnit, isPending: isLoadingDownload } = useMutation({
  mutationFn: async () => {
    return await masterStore.downloadUnit(params);
  },
  onSuccess: () => { },
  onError: (error) => {
    console.log(error);
  },
});
//--- END

//--- DOWNLOAD TEMPLATE
const { mutate: templateUnit, isPending: isLoadingTemplate } = useMutation({
  mutationFn: async () => {
    return await masterStore.templateUnit();
  },
  onSuccess: () => { },
  onError: (error) => {
    console.log(error);
  },
});
//--- END

//--- IMPORT
const { mutate: importUnit, isPending: isLoadingImport } = useMutation({
  mutationFn: async (payload: File) => {
    return await masterStore.importUnit(payload);
  },
  onSuccess: () => {
    toastRef.value?.showToast({
      title: "Success",
      description: "Import successfully",
      type: "success",
    });
    refetchUnit();
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

    refetchUnit();
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

const setFilter = () => {
  params.filters = [
    {
      group: "AND",
      operator: "EQ",
      column: "location_uuid",
      value: String(dataForm.value?.location_uuid),
    },
  ] as any;
};

const resetFilter = () => {
  dataForm.value = null;
  params.filters = [
    // {
    //   group: "AND",
    //   operator: "EQ",
    //   column: "location_uuid",
    //   value: "",
    // },
  ] as any;
};

const changePage = (e: number) => {
  params.currentPage = e;
  refetchUnit();
};

const changeLimit = (e: string) => {
  params.perPage = parseInt(e);
  params.currentPage = 1;
  refetchUnit();
};

const searchTable = () => {
  clearTimeout(timeout.value);
  timeout.value = window.setTimeout(() => {
    params.currentPage = 1;
    refetchUnit();
  }, 1000);
};

const handleSuccess = () => {
  toastRef.value?.showToast({
    title: "Success",
    description: "Saved successfully",
    type: "success",
  });
  params.currentPage = 1;
  refetchUnit();
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

const handleUpdate = (item: UnitInterface) => {
  selected_item.value = item;
  open_form.value = true;
};

const handleDelete = (item: UnitInterface) => {
  selected_item.value = item;
  open_delete.value = true;
};

const onDelete = () => {
  deleteUnit(selected_item.value?.uuid as string);
};

const handleDownload = () => {
  downloadUnit();
};

const handleExportTemplate = () => {
  templateUnit();
};

const handleImport = (file: File) => {
  importUnit(file);
};

const handleOnFilter = (data: UnitTypeModelCreateInterface) => {
  is_loading_filter.value = true;
  dataForm.value = data;
  setFilter();
  refetchUnit();
};

const handleResetFilter = () => {
  is_loading_filter.value = true;
  resetFilter();
  refetchUnit();
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
      name: "Unit",
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
      <ButtonGroup :loading-import="isLoadingImport" :loading-download="isLoadingDownload"
        :loading-template="isLoadingTemplate" @download="handleDownload" @template="handleExportTemplate"
        @import="handleImport" />
      <Button icon_only="plus" size="sm" rounded="full" color="blue" @click="handleCreate"
        v-if="dataForm?.location_uuid" />
    </div>
    <div class="flex gap-8">
      <div class="w-[330px]">
        <FilterUnit @filter="handleOnFilter" @reset-filter="handleResetFilter" :loading="is_loading_filter" />
      </div>
      <div class="w-full">
        <Table label-create="Unit" :columns="ColumnsUnit" :entities="dataUnit?.data || []" :loading="isLoadingUnit"
          :pagination="pagination" :is-create="false" v-model:model-search="params.search" @change-page="changePage"
          :is-action="dataForm?.location_uuid != undefined" @change-limit="changeLimit" @search="searchTable">
          <template #column_action="{ entity }">
            <div class="flex items-center justify-center gap-4">
              <Icon name="pencil" class="icon-action-table" @click="handleUpdate(entity)" />
              <Icon name="trash" class="icon-action-table" @click="handleDelete(entity)" />
            </div>
          </template>
          <template #column_location="{ entity }">
            <p class="text-base text-neutral-50 text-left">
              {{ entity.location?.name }}
            </p>
          </template>
        </Table>
      </div>
    </div>

    <FormUnit :data-form="dataForm" v-model="open_form" :selected-value="selected_item" @success="handleSuccess"
      @error="handleError" />
  </div>

  <Toast ref="toastRef" />
  <ModalDelete v-model="open_delete" :title="`${selected_item?.name} / ${selected_item?.location?.name}`"
    :loading="isLoadingDelete" @delete="onDelete" />
</template>
