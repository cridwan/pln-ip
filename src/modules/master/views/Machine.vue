<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import type { AxiosError } from "axios";

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

import { ColumnsMachine } from "../constants/MachineConstant";
import type {
  MachineInterface,
  MachineTypeModelCreateInterface,
} from "../types/MachineType";
import { useMasterStore } from "../stores/MasterStore";
import FormMachine from "../components/FormMachine.vue";
import ButtonGroup from "../components/ButtonGroup.vue";
import FilterMechine from "../components/FilterMechine.vue";

const masterStore = useMasterStore();
const total_item = ref(0);
const dataForm = ref<MachineTypeModelCreateInterface | null>(null);
const is_loading_filter = ref(false);

const params = reactive({
  search: "",
  filter: "",
  filters: [
    {
      group: "AND",
      operator: "EQ",
      column: "location_uuid",
      value: "",
    },
    {
      group: "AND",
      operator: "EQ",
      column: "unit_uuid",
      value: "",
    },
  ],
  currentPage: 1,
  perPage: 10,
});
const open_form = ref(false);
const open_delete = ref(false);
const selected_item = ref<MachineInterface | null>(null);
const toastRef = ref<InstanceType<typeof Toast> | null>(null);
const timeout = ref(0);
const breadcrumb = ref<BreadcrumbType[]>([]);

//--- GET MACHINE
const {
  data: dataMachine,
  isFetching: isLoadingMachine,
  refetch: refetchMachine,
} = useQuery({
  queryKey: ["getMachineMaster"],
  queryFn: async () => {
    try {
      const { data } = await masterStore.getMachine(params);
      const response = data.data as IPagination<MachineInterface[]>;

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

//--- DELETE MACHINE
const { mutate: deleteMachine, isPending: isLoadingDelete } = useMutation({
  mutationFn: async (id: string) => {
    return await masterStore.deleteMachine(id);
  },
  onSuccess: () => {
    toastRef.value?.showToast({
      title: "Success",
      description: "Deleted successfully",
      type: "success",
    });
    open_delete.value = false;
    refetchMachine();
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
const { mutate: downloadMachine, isPending: isLoadingDownload } = useMutation({
  mutationFn: async () => {
    return await masterStore.downloadMachine(params);
  },
  onSuccess: () => {},
  onError: (error) => {
    console.log(error);
  },
});
//--- END

//--- DOWNLOAD TEMPLATE
const { mutate: templateMachine, isPending: isLoadingTemplate } = useMutation({
  mutationFn: async () => {
    return await masterStore.templateMachine();
  },
  onSuccess: () => {},
  onError: (error) => {
    console.log(error);
  },
});
//--- END

//--- IMPORT
const { mutate: importMachine, isPending: isLoadingImport } = useMutation({
  mutationFn: async (payload: File) => {
    return await masterStore.importMachine(payload);
  },
  onSuccess: () => {
    refetchMachine();
  },
  onError: (error) => {
    console.log(error);
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
  refetchMachine();
};

const changeLimit = (e: string) => {
  params.perPage = parseInt(e);
  params.currentPage = 1;
  refetchMachine();
};

const searchTable = () => {
  clearTimeout(timeout.value);
  timeout.value = window.setTimeout(() => {
    params.currentPage = 1;
    refetchMachine();
  }, 1000);
};

const handleSuccess = () => {
  toastRef.value?.showToast({
    title: "Success",
    description: "Saved successfully",
    type: "success",
  });
  params.currentPage = 1;
  refetchMachine();
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

const handleUpdate = (item: MachineInterface) => {
  selected_item.value = item;
  open_form.value = true;
};

const handleDelete = (item: MachineInterface) => {
  selected_item.value = item;
  open_delete.value = true;
};

const onDelete = () => {
  deleteMachine(selected_item.value?.uuid as string);
};

const handleDownload = () => {
  downloadMachine();
};

const handleExportTemplate = () => {
  templateMachine();
};

const handleImport = (file: File) => {
  importMachine(file);
};

const setFilter = () => {
  params.filters = [
    {
      group: "AND",
      operator: "EQ",
      column: "location_uuid",
      value: String(dataForm.value?.location_uuid),
    },
    {
      group: "AND",
      operator: "EQ",
      column: "unit_uuid",
      value: String(dataForm.value?.unit_uuid),
    },
  ] as any;
};

const handleOnFilter = (data: MachineTypeModelCreateInterface) => {
  is_loading_filter.value = true;
  dataForm.value = data;
  setFilter();
  refetchMachine();
};

const resetFilter = () => {
  dataForm.value = null;
  params.filters = [
    {
      group: "AND",
      operator: "EQ",
      column: "location_uuid",
      value: "",
    },
    {
      group: "AND",
      operator: "EQ",
      column: "unit_uuid",
      value: "",
    },
  ] as any;
};

const handleResetFilter = () => {
  is_loading_filter.value = true;
  resetFilter();
  refetchMachine();
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
      name: "Machine",
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
        v-if="dataForm?.unit_uuid"
      />
    </div>

    <div class="flex gap-8">
      <div class="w-[330px]">
        <FilterMechine
          @filter="handleOnFilter"
          @reset-filter="handleResetFilter"
          :loading="is_loading_filter"
        />
      </div>
      <div class="w-full">
        <Table
          label-create="Machine"
          :columns="ColumnsMachine"
          :entities="dataMachine?.data || []"
          :loading="isLoadingMachine"
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
          <template #column_unit="{ entity }">
            <p class="text-base text-neutral-50 text-center">
              {{ entity.unit?.name }}
            </p>
          </template>
          <template #column_location="{ entity }">
            <p class="text-base text-neutral-50 text-center">
              {{ entity.unit?.location?.name ?? "-" }}
            </p>
          </template>
        </Table>
      </div>
    </div>

    <FormMachine
      :data-form="dataForm"
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
