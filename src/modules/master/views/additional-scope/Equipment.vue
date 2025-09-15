<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import type { AxiosError } from "axios";
import { useRoute } from "vue-router";

import { Button, Icon, ModalDelete, Table, Toast } from "@/components";
import { useMutation, useQuery } from "@tanstack/vue-query";
import type { IPagination } from "@/types/GlobalType";

import { ColumnsEquipment } from "../../constants/EquipmentConstant";
import { useMasterStore } from "../../stores/MasterStore";
import type {
  EquipmentFilterInterface,
  EquipmentInterface,
} from "../../types/EquipmentType";
import FormAdEquipment from "../../components/FormAdEquipment.vue";
import FilterAdEquipment from "../../components/FilterAdEquipment.vue";
import ButtonGroup from "../../components/ButtonGroup.vue";

const dataForm = ref<EquipmentFilterInterface | null>(null);
const masterStore = useMasterStore();
const route = useRoute();
const total_item = ref(0);
const params = reactive({
  search: "",
  filter: "",
  filters: [
    {
      group: "AND",
      operator: "EQ",
      column: "scopeStandart.additional_scope_uuid",
      value: route.params?.id,
    },
  ],
  currentPage: 1,
  perPage: 10,
});
const open_form = ref(false);
const open_delete = ref(false);
const selected_item = ref<EquipmentInterface | null>(null);
const toastRef = ref<InstanceType<typeof Toast> | null>(null);
const timeout = ref(0);

//--- GET EQUIPMENT
const {
  data: dataEquipment,
  isFetching: isLoadingEquipment,
  refetch: refetchEquipment,
} = useQuery({
  queryKey: ["getEquipmentMaster"],
  queryFn: async () => {
    try {
      const { data } = await masterStore.getEquipment(params);
      const response = data.data as IPagination<EquipmentInterface[]>;

      total_item.value = response.total;

      return response;
    } catch (error: any) {
      const err = error as AxiosError;
      throw err.response;
    }
  },
  refetchOnWindowFocus: false,
  enabled: computed(() => {
    return Boolean(params.filters?.[1]);
  }),
  gcTime: 0,
});
//--- END

//--- DELETE EQUIPMENT
const { mutate: deleteEquipment, isPending: isLoadingDelete } = useMutation({
  mutationFn: async (id: string) => {
    return await masterStore.deleteEquipment(id);
  },
  onSuccess: () => {
    toastRef.value?.showToast({
      title: "Success",
      description: "Deleted successfully",
      type: "success",
    });
    open_delete.value = false;
    refetchEquipment();
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
const { mutate: downloadEquipment, isPending: isLoadingDownload } = useMutation(
  {
    mutationFn: async () => {
      return await masterStore.downloadEquipment(params);
    },
    onSuccess: () => {},
    onError: (error) => {
      console.log(error);
    },
  }
);
//--- END

//--- DOWNLOAD TEMPLATE
const { mutate: templateEquipment, isPending: isLoadingTemplate } = useMutation(
  {
    mutationFn: async () => {
      return await masterStore.templateEquipment();
    },
    onSuccess: () => {},
    onError: (error) => {
      console.log(error);
    },
  }
);
//--- END

//--- IMPORT
const { mutate: importEquipment, isPending: isLoadingImport } = useMutation({
  mutationFn: async (payload: File) => {
    return await masterStore.importEquipment(payload);
  },
  onSuccess: () => {
    refetchEquipment();
  },
  onError: (error) => {
    console.log(error);
  },
});
//--- END

const handleDownload = () => {
  downloadEquipment();
};

const handleExportTemplate = () => {
  templateEquipment();
};

const handleImport = (file: File) => {
  importEquipment(file);
};

const pagination = computed(() => {
  return {
    totalItems: total_item.value,
    itemsPerPage: params.perPage,
    currentPage: params.currentPage,
  };
});

const changePage = (e: number) => {
  params.currentPage = e;
  refetchEquipment();
};

const changeLimit = (e: string) => {
  params.perPage = parseInt(e);
  params.currentPage = 1;
  refetchEquipment();
};

const searchTable = () => {
  clearTimeout(timeout.value);
  timeout.value = window.setTimeout(() => {
    params.currentPage = 1;
    refetchEquipment();
  }, 1000);
};

const handleSuccess = () => {
  toastRef.value?.showToast({
    title: "Success",
    description: "Saved successfully",
    type: "success",
  });
  params.currentPage = 1;
  refetchEquipment();
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

const handleUpdate = (item: EquipmentInterface) => {
  selected_item.value = item;
  open_form.value = true;
};

const handleDelete = (item: EquipmentInterface) => {
  selected_item.value = item;
  open_delete.value = true;
};

const onDelete = () => {
  deleteEquipment(selected_item.value?.uuid as string);
};

const setFilter = () => {
  params.filters = [
    {
      group: "AND",
      operator: "EQ",
      column: "scopeStandart.additional_scope_uuid",
      value: route.params?.id,
    },
    {
      group: "AND",
      operator: "EQ",
      column: "scope_standart_uuid",
      value: String(dataForm.value?.scope_standart_uuid),
    },
  ];
};

const resetFilter = () => {
  dataForm.value = null;
  params.filters = [
    {
      group: "AND",
      operator: "EQ",
      column: "scopeStandart.additional_scope_uuid",
      value: route.params?.id,
    },
  ];
};

const handleOnFilter = (data: EquipmentFilterInterface) => {
  dataForm.value = data;
  setFilter();
  refetchEquipment();
};

const handleResetFilter = () => {
  resetFilter();
  refetchEquipment();
};

const handleRemoveSuccess = () => {
  refetchEquipment();
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
    <div class="flex items-center gap-2 absolute right-0 top-0">
      <ButtonGroup
        :loading-import="isLoadingImport"
        :loading-download="isLoadingDownload"
        :loading-template="isLoadingTemplate"
        @download="handleDownload"
        @template="handleExportTemplate"
        @import="handleImport"
      />
      <Button
        v-if="dataForm?.scope_standart_uuid"
        icon_only="plus"
        size="sm"
        rounded="full"
        color="blue"
        @click="handleCreate"
      />
    </div>

    <div class="flex gap-8">
      <div class="w-[330px]">
        <FilterAdEquipment
          @filter="handleOnFilter"
          @reset-filter="handleResetFilter"
          :loading="isLoadingEquipment"
        />
      </div>
      <div class="w-full">
        <Table
          label-create="Sub Bidang"
          :columns="ColumnsEquipment"
          :entities="dataEquipment?.data || []"
          :loading="isLoadingEquipment"
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
          <template #column_scope_standart="{ entity }">
            <p class="text-base text-neutral-50 text-left">
              {{ entity.scope_standart?.name }}
            </p>
          </template>
        </Table>
      </div>
    </div>

    <FormAdEquipment
      v-model="open_form"
      :selected-value="selected_item"
      :data-form="dataForm"
      @success="handleSuccess"
      @error="handleError"
      @removeSucess="handleRemoveSuccess"
    />
  </div>
</template>

<style lang="sass"></style>
