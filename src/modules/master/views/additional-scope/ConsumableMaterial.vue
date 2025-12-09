<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
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

import { useMasterStore } from "../../stores/MasterStore";
import FilterConsumableMaterialStd from "../../components/additional/FilterConsumableMaterialStd.vue";
import type {
  ConsumableMaterialStdCreateModelInterface,
  ConsumableMaterialStdInterface,
} from "../../types/ConsumableMaterialStdType";
import { ColumnConsumableMaterialStd } from "../../constants/ConsumableMaterialStdConstant";
import FormConsumableMaterialStd from "../../components/FormConsumableMaterialStd.vue";
import ButtonGroup from "../../components/ButtonGroup.vue";

const dataForm = ref<ConsumableMaterialStdCreateModelInterface | null>(null);
const formConsumableMaterialStd = ref<InstanceType<
  typeof FormConsumableMaterialStd
> | null>(null);
const breadcrumb = ref<BreadcrumbType[]>([]);
const route = useRoute();
const masterStore = useMasterStore();
const total_item = ref(0);
const params = reactive({
  search: "",
  filter: "",
  filters: [
    {
      group: "AND",
      operator: "EQ",
      column: "activity_uuid",
      value: "",
    },
    {
      group: "AND",
      operator: "EQ",
      column: "activity.equipment.scopeStandart.additional_scope_uuid",
      value: route.params.id,
    },
  ],
  currentPage: 1,
  perPage: 10,
});
const open_form = ref(false);
const open_delete = ref(false);
const selected_item = ref<ConsumableMaterialStdInterface | null>(null);
const toastRef = ref<InstanceType<typeof Toast> | null>(null);
const timeout = ref(0);

//--- GET SCOPE
const {
  data: dataMatStd,
  isFetching: isLoadingMatStd,
  refetch: refetchConsMatStd,
} = useQuery({
  queryKey: ["getConsumableMaterialStdAdditional"],
  queryFn: async () => {
    try {
      const { data } = await masterStore.getConsumableMaterialStd(
        params,
        "/add-scope/detail"
      );
      const response = data.data as IPagination<
        ConsumableMaterialStdInterface[]
      >;
      total_item.value = response.total;

      return response;
    } catch (error: any) {
      const err = error as AxiosError;
      throw err.response;
    }
  },
  refetchOnWindowFocus: false,
  enabled: computed(() =>
    params.filters.some((e) => e.column === "activity_uuid" && e.value !== "")
  ),
  gcTime: 0,
});
//--- END

//--- DELETE SCOPE
const { mutate: deleteScope, isPending: isLoadingDelete } = useMutation({
  mutationFn: async (id: string) => {
    return await masterStore.deleteConsumableMaterialStd(
      id,
      "/add-scope/detail"
    );
  },
  onSuccess: () => {
    toastRef.value?.showToast({
      title: "Success",
      description: "Deleted successfully",
      type: "success",
    });
    open_delete.value = false;
    refetchConsMatStd();
    if (formConsumableMaterialStd.value?.refetchConsumableMaterial) {
      formConsumableMaterialStd.value.refetchConsumableMaterial();
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
const { mutate: downloadConsMatStd, isPending: isLoadingDownload } =
  useMutation({
    mutationFn: async () => {
      return await masterStore.downloadConsumableMaterialStd(
        params,
        "/add-scope/detail"
      );
    },
    onSuccess: () => {},
    onError: (error) => {
      console.log(error);
    },
  });
//--- END

//--- DOWNLOAD TEMPLATE
const { mutate: templateConsMatStd, isPending: isLoadingTemplate } =
  useMutation({
    mutationFn: async () => {
      return await masterStore.templateConsumableMaterialStd(
        "/add-scope/detail",
        {
          filters: params.filters,
        }
      );
    },
    onSuccess: () => {},
    onError: (error) => {
      console.log(error);
    },
  });
//--- END

//--- IMPORT
const { mutate: importConsMatStd, isPending: isLoadingImport } = useMutation({
  mutationFn: async (payload: File) => {
    return await masterStore.importConsumableMaterialStd(
      payload,
      "/add-scope/detail"
    );
  },
  onSuccess: () => {
    toastRef.value?.showToast({
      title: "Success",
      description: "Import successfully",
      type: "success",
    });
    refetchConsMatStd();
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

    refetchConsMatStd();
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
  refetchConsMatStd();
};

const changeLimit = (e: string) => {
  params.perPage = parseInt(e);
  params.currentPage = 1;
  refetchConsMatStd();
};

const searchTable = () => {
  clearTimeout(timeout.value);
  timeout.value = window.setTimeout(() => {
    params.currentPage = 1;
    refetchConsMatStd();
  }, 1000);
};

const handleSuccess = () => {
  toastRef.value?.showToast({
    title: "Success",
    description: "Saved successfully",
    type: "success",
  });
  params.currentPage = 1;
  refetchConsMatStd();

  if (formConsumableMaterialStd.value?.refetchConsumableMaterial) {
    formConsumableMaterialStd.value.refetchConsumableMaterial();
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

const handleUpdate = (item: ConsumableMaterialStdInterface) => {
  selected_item.value = item;
  open_form.value = true;
};

const handleDelete = (item: ConsumableMaterialStdInterface) => {
  selected_item.value = item;
  open_delete.value = true;
};

const onDelete = () => {
  deleteScope(selected_item.value?.uuid as string);
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

const resetFilter = () => {
  dataForm.value = null;
  params.filters = [
    {
      group: "AND",
      operator: "EQ",
      column: "activity_uuid",
      value: "",
    },
    {
      group: "AND",
      operator: "EQ",
      column: "activity.equipment.scopeStandart.additional_scope_uuid",
      value: route.params.id,
    },
  ];
};

const handleOnFilter = (data: ConsumableMaterialStdCreateModelInterface) => {
  dataForm.value = data;
  setFilter();
  refetchConsMatStd();
};

const handleResetFilter = () => {
  resetFilter();
  refetchConsMatStd();
};

const handleRemoveSuccess = () => {
  refetchConsMatStd();
};

const handleDownload = () => {
  downloadConsMatStd();
};

const handleExportTemplate = () => {
  templateConsMatStd();
};

const handleImport = (file: File) => {
  importConsMatStd(file);
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
  <Toast ref="toastRef" />
  <ModalDelete
    v-model="open_delete"
    :title="`${selected_item?.consmat?.name} / ${selected_item?.consmat?.name}`"
    :loading="isLoadingDelete"
    @delete="onDelete"
  />
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
        <FilterConsumableMaterialStd
          @filter="handleOnFilter"
          @reset-filter="handleResetFilter"
          :loading="isLoadingMatStd"
        />
      </div>
      <div class="w-full">
        <Breadcrumb :items="breadcrumb" class="mb-6" />
        <Table
          label-create="User"
          :columns="ColumnConsumableMaterialStd"
          :entities="dataMatStd?.data || []"
          :loading="isLoadingMatStd"
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
          <template #column_cons_mat="{ entity }">
            <p class="text-base text-neutral-50 text-left">
              {{ entity.consmat?.name ?? "-" }}
            </p>
          </template>
          <template #column_globalUnit="{ entity }">
            <p class="text-base text-neutral-50 text-left">
              {{ entity.consmat?.global_unit?.name ?? "-" }}
            </p>
          </template>
        </Table>
      </div>
    </div>

    <FormConsumableMaterialStd
      :is-additional="true"
      :data-form="dataForm"
      v-model="open_form"
      :selected-value="selected_item"
      @success="handleSuccess"
      @error="handleError"
      @removeSucess="handleRemoveSuccess"
      ref="formConsumableMaterialStd"
    />
  </div>
</template>
