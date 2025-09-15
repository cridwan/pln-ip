<script setup lang="ts">
import type { AxiosError } from "axios";
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";

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
  ConsumableMaterialStdCreateModelInterface,
  ConsumableMaterialStdInterface,
} from "@/modules/master/types/ConsumableMaterialStdType";
import type { BreadcrumbType } from "@/components/navigations/Breadcrumb.vue";
import { ColumnsConsumableMaterial } from "@/modules/transaction/constants/ConsumableMaterialConstant";
import { useTransactionStore } from "@/modules/transaction/stores/TransactionStore";
import FormConsumableMaterialStd from "@/modules/transaction/components/FormConsumableMaterialStd.vue";
import FilterConsumableMaterialStd from "@/modules/transaction/components/add-scope/FilterConsumableMaterialStd.vue";
import { numberFormat } from "@/helpers/global";

import type { ProjectInterface } from "../../types/ProjectType";
import FormAdCosumableMaterial from "../../components/add-scope/FormAdCosumableMaterial.vue";

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
    {
      group: "AND",
      operator: "EQ",
      column: "activity.original_uuid",
      value: "",
    },
  ],
  currentPage: 1,
  perPage: 10,
});
const total_item = ref(0);
const toastRef = ref<InstanceType<typeof Toast> | null>(null);
const timeout = ref(0);
const dataForm = ref<ConsumableMaterialStdCreateModelInterface | null>(null);
const selected_item = ref<ConsumableMaterialStdInterface | null>(null);
const breadcrumb = ref<BreadcrumbType[]>([]);
const open_form = ref(false);
const open_delete = ref(false);

//--- GET STATUS APPROVAL
const { data: dataApproval } = useQuery({
  queryKey: ["getApprovalAtConsMatAddScope"],
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
  queryKey: ["getConsMat"],
  queryFn: async () => {
    try {
      const { data } = await transactionStore.getConsMat(params);
      const response = data as IPagination<ConsumableMaterialStdInterface[]>;

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
      column: "activity.equipment.scopeStandart.additional_scope_uuid",
      value: route.params.id_scope,
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
    {
      group: "AND",
      operator: "EQ",
      column: "activity.original_uuid",
      value: "",
    },
  ];
};

const handleOnFilter = (data: ConsumableMaterialStdCreateModelInterface) => {
  dataForm.value = data;
  setFilter();
  refetchConsMat();
};

const handleResetFilter = () => {
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
    <Button v-if="dataForm?.activity_uuid && dataApproval?.status !== 'approve'" icon_only="plus"
      class="absolute right-0" size="sm" rounded="full" color="blue" @click="handleCreate" />

    <div class="flex gap-8">
      <div class="basis-1/5">
        <FilterConsumableMaterialStd @filter="handleOnFilter" @reset-filter="handleResetFilter"
          :loading="isLoadingConsMat" />
      </div>
      <div class="flex-1 overflow-auto">
        <div class="max-w-full min-w-full">
          <Breadcrumb :items="breadcrumb" />
          <Table label-create="Material" :columns="ColumnsConsumableMaterial" :entities="dataConsMat?.data || []"
            :loading="isLoadingConsMat" :pagination="pagination" :is-create="false" :is-action="false" class="mt-6"
            v-model:model-search="params.search" @change-page="changePage" @change-limit="changeLimit"
            @search="searchTable">
            <!-- <template #column_action="{ entity }">
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
            </template> -->
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
            <template #column_price="{ entity }">
              <p class="text-base text-neutral-50 text-left underline cursor-pointer">
                Rp. {{ numberFormat(entity.consmat?.price) ?? "-" }}
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
  <FormAdCosumableMaterial v-model="open_form" :data-form="dataForm" :selected-value="selected_item"
    @success="handleSuccess" @error="handleError" @removeSucess="handleRemoveSuccess" />
  <ModalDelete v-model="open_delete" :title="selected_item?.consmat?.name" :loading="isLoadingDelete"
    @delete="onDelete" />
</template>
