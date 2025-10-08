<script setup lang="ts">
import type { AxiosError } from "axios";
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";

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
import type {
  ConsumableMaterialStdInterface,
  FilterConsumableMaterialStdInterface,
} from "@/modules/master/types/ConsumableMaterialStdType";
import type { BreadcrumbType } from "@/components/navigations/Breadcrumb.vue";
import { numberFormat } from "@/helpers/global";
import { useAuthStore } from "@/modules/auth/stores/AuthStore";

import { ColumnsConsumableMaterial } from "../constants/ConsumableMaterialConstant";
import { useTransactionStore } from "../stores/TransactionStore";
import FormConsumableMaterialStd from "../components/FormConsumableMaterialStd.vue";
import FilterConsumableMaterialStd from "../components/FilterConsumableMaterialStd.vue";
import type { ProjectInterface } from "../types/ProjectType";

const authStore = useAuthStore();
const { access_token } = storeToRefs(authStore);
const transactionStore = useTransactionStore();
const route = useRoute();
const params = reactive({
  search: "",
  filter: "",
  filters: [
    {
      group: "AND",
      operator: "EQ",
      column: "activity.equipment.scopeStandart.project_uuid",
      value: route.params.id_project,
    },
  ],
  currentPage: 1,
  perPage: 10,
});
const total_item = ref(0);
const toastRef = ref<InstanceType<typeof Toast> | null>(null);
const timeout = ref(0);
const dataForm = ref<FilterConsumableMaterialStdInterface | null>(null);
const selected_item = ref<ConsumableMaterialStdInterface | null>(null);
const breadcrumb = ref<BreadcrumbType[]>([]);
const open_form = ref(false);
const open_delete = ref(false);
const is_loading_filter = ref(false);

//--- GET STATUS APPROVAL
const { data: dataApproval } = useQuery({
  queryKey: ["getApprovalAtConsMat"],
  queryFn: async () => {
    const { data } = await transactionStore.getProject(
      route.params.id_project as string
    );
    const response = data.data.data as ProjectInterface;

    return response;
  },
  retry: 0,
  refetchOnWindowFocus: false,
});
//--- END

//--- GET CONSMAT STD
const {
  data: dataConsMat,
  isFetching: isLoadingConsMat,
  refetch: refetchConsMat,
} = useQuery({
  queryKey: ["getConsMatTransaction"],
  queryFn: async () => {
    try {
      const { data } = await transactionStore.getConsMat(params);
      const response = data as IPagination<ConsumableMaterialStdInterface[]>;

      total_item.value = response.total;
      is_loading_filter.value = false;

      return response;
    } catch (error: any) {
      const err = error as AxiosError;
      is_loading_filter.value = false;
      throw err.response;
    }
  },
  retry: 0,
  refetchOnWindowFocus: false,
});
//--- END

//--- DELETE CONSMAT STD
const { mutate: deleteConsMatStd, isPending: isLoadingDelete } = useMutation({
  mutationFn: async (id: string) => {
    return await transactionStore.deleteConsMatStd(id);
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
  retry: 0,
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

function searchTable() {
  clearTimeout(timeout.value);
  timeout.value = window.setTimeout(() => {
    params.currentPage = 1;
    refetchConsMat();
  }, 1000);
}

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

const handleUpdate = (item: ConsumableMaterialStdInterface) => {
  selected_item.value = item;
  open_form.value = true;
};

const handleDelete = (item: ConsumableMaterialStdInterface) => {
  selected_item.value = item;
  open_delete.value = true;
};

const onDelete = () => {
  deleteConsMatStd(selected_item.value?.uuid as string);
};

const setFilter = () => {
  params.filters = [
    {
      group: "AND",
      operator: "EQ",
      column: "activity.equipment.scopeStandart.project_uuid",
      value: route.params.id_project,
    },
    {
      group: "AND",
      operator: "EQ",
      column: "activity.uuid",
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
      column: "activity.equipment.scopeStandart.project_uuid",
      value: route.params.id_project,
    },
  ];
};

const handleOnFilter = (data: FilterConsumableMaterialStdInterface) => {
  is_loading_filter.value = true;
  dataForm.value = data;
  setFilter();
  refetchConsMat();
};

const handleResetFilter = () => {
  is_loading_filter.value = true;
  resetFilter();
  refetchConsMat();
};

const handleRemoveSuccess = () => {
  refetchConsMat();
};

onMounted(() => {
  breadcrumb.value = [
    {
      name: "Consumable Material Std",
      as_link: false,
      url: "",
    },
  ];
});
</script>

<template>
  <div class="relative w-full">
    <Button v-if="
      dataForm?.activity_uuid &&
      dataApproval?.status !== 'approve' &&
      access_token
    " icon_only="plus" class="absolute right-0" size="sm" rounded="full" color="blue" @click="handleCreate" />

    <div class="flex gap-8">
      <div class="basis-1/5">
        <FilterConsumableMaterialStd @filter="handleOnFilter" @reset-filter="handleResetFilter"
          :loading="is_loading_filter" />
      </div>
      <div class="flex-1 overflow-auto">
        <div class="max-w-full min-w-full">
          <Breadcrumb :items="breadcrumb" />
          <Table label-create="Material" :is-action="dataApproval?.status !== 'approve' && access_token !== ''
            " :columns="ColumnsConsumableMaterial" :entities="dataConsMat?.data || []" :loading="isLoadingConsMat"
            :pagination="pagination" :is-create="false" class="mt-6" v-model:model-search="params.search"
            @change-page="changePage" @change-limit="changeLimit" @search="searchTable">
            <template #column_action="{ entity }">
              <div class="flex items-center justify-center gap-4">
                <Icon name="pencil" class="icon-action-table" @click="handleUpdate(entity)"
                  v-if="dataForm?.activity_uuid" />
                <Icon name="trash" class="icon-action-table" @click="handleDelete(entity)"
                  v-if="dataForm?.activity_uuid" />
              </div>
            </template>
            <template #column_material="{ entity }">
              <p class="text-base text-neutral-50 text-left underline cursor-pointer">
                {{ entity.consmat?.name ?? "-" }}
              </p>
            </template>
            <template #column_merk="{ entity }">
              <p class="text-base text-neutral-50 text-left underline cursor-pointer">
                {{ entity.consmat?.merk ?? "-" }}
              </p>
            </template>
            <template #column_total_qty="{ entity }">
              <p class="text-base text-neutral-50 text-left underline cursor-pointer">
                {{ Number(entity.total_qty).toLocaleString("id") ?? "-" }}
              </p>
            </template>
            <template #column_price="{ entity }">
              <p class="text-base text-neutral-50 text-left underline cursor-pointer">
                Rp. {{ numberFormat(entity.consmat?.price) ?? "-" }}
              </p>
            </template>
            <template #column_total="{ entity }">
              <p class="text-base text-neutral-50 text-left underline cursor-pointer">
                Rp.
                {{
                  numberFormat(
                    entity.consmat?.price * Number(entity?.total_qty || 0)
                  ) ?? "-"
                }}
              </p>
            </template>
            <template #column_unit="{ entity }">
              <p class="text-base text-neutral-50 text-left underline cursor-pointer">
                {{ entity.consmat?.global_unit?.name ?? "-" }}
              </p>
            </template>
          </Table>
        </div>
      </div>
    </div>
  </div>

  <Toast ref="toastRef" />
  <FormConsumableMaterialStd v-model="open_form" :data-form="dataForm" :selected-value="selected_item"
    @success="handleSuccess" @error="handleError" @removeSucess="handleRemoveSuccess" />
  <ModalDelete v-model="open_delete" :title="selected_item?.consmat?.name" :loading="isLoadingDelete"
    @delete="onDelete" />
</template>
