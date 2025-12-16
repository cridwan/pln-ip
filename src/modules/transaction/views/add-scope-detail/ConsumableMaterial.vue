<script setup lang="ts">
import type { AxiosError } from "axios";
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";

import {
  Breadcrumb,
  Button,
  Icon,
  // Icon,
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
import { ColumnsConsumableMaterial } from "@/modules/transaction/constants/ConsumableMaterialConstant";
import { useTransactionStore } from "@/modules/transaction/stores/TransactionStore";
// import FormConsumableMaterialStd from "@/modules/transaction/components/FormConsumableMaterialStd.vue";
import FilterConsumableMaterialStd from "@/modules/transaction/components/add-scope/FilterConsumableMaterialStd.vue";
import { numberFormat } from "@/helpers/global";
import { useAuthStore } from "@/modules/auth/stores/AuthStore";

import type { ProjectInterface } from "../../types/ProjectType";
import FormConsumableMaterialStd from "../../components/FormConsumableMaterialStd.vue";
import FormQuantity from "../../components/FormQuantity.vue";
import type { UpdateConsMatInterface } from "../../types/ConsumableMaterialType";
import type { ConsumableMaterialStdTransactionInterface } from "../../types/ConsumableMaterialStdType";
import type { ActivitySelectInterface } from "../../types/ActivityType";
import TableSummary from "@/components/tables/TableSummary.vue";
// import FormAdCosumableMaterial from "../../components/add-scope/FormAdCosumableMaterial.vue";

const formConsumableMaterial = ref<InstanceType<
  typeof FormConsumableMaterialStd
> | null>(null);
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
      column: "activity.equipment.scopeStandart.additional_scope_uuid",
      value: route.params.id_scope,
    },
  ],
  currentPage: 1,
  perPage: 10,
});
const dataSummary = ref<{
  total_price: Number;
  price: Number;
  total_qty: Number;
}>({
  total_price: 0,
  price: 0,
  total_qty: 0,
});
const total_item = ref(0);
const toastRef = ref<InstanceType<typeof Toast> | null>(null);
const timeout = ref(0);
const original_uuid = ref("");
const dataForm = ref<FilterConsumableMaterialStdInterface | null>(null);
const selected_item = ref<ConsumableMaterialStdTransactionInterface | null>(
  null
);
const breadcrumb = ref<BreadcrumbType[]>([]);
const open_form = ref(false);
const open_delete = ref(false);
const is_loading_filter = ref(false);
const quantity = ref<any>(null);

//--- GET STATUS APPROVAL
const { data: dataApproval } = useQuery({
  queryKey: ["getApprovalAtConsMatDetailAddScope"],
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
  queryKey: ["getConsMatAtConsMatDetailAddScope"],
  queryFn: async () => {
    try {
      const { data } = await transactionStore.getConsMat(
        params,
        "/add-scope/detail"
      );
      const response = data as IPagination<
        ConsumableMaterialStdTransactionInterface[]
      >;
      const summary = data.summary;
      dataSummary.value = {
        total_price: summary.total_price,
        price: summary.price,
        total_qty: summary.total_qty,
      };
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

    if (formConsumableMaterial.value?.refetchConsumableMaterial) {
      formConsumableMaterial.value.refetchConsumableMaterial();
    }
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

//--- UPDATE CONSUMABLE MATERIAL
const { mutate: updateConsMat, isPending: isLoadingUpdate } = useMutation({
  mutationFn: async ({
    payload,
    id,
  }: {
    payload: UpdateConsMatInterface;
    id: string;
  }) => {
    return await transactionStore.updateConsMat(payload, id);
  },
  onSuccess: async () => {
    refetchConsMat();
    quantity.value.modelOpenInputData = false;
    toastRef.value?.showToast({
      title: "Success",
      description: "Saved successfully",
      type: "success",
    });
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

  if (formConsumableMaterial.value?.refetchConsumableMaterial) {
    formConsumableMaterial.value.refetchConsumableMaterial();
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

const handleUpdate = (item: ConsumableMaterialStdTransactionInterface) => {
  selected_item.value = item;
  open_form.value = true;
};

const handleDelete = (item: ConsumableMaterialStdTransactionInterface) => {
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

const handleOnFilter = (
  data: FilterConsumableMaterialStdInterface,
  activity: ActivitySelectInterface
) => {
  is_loading_filter.value = true;
  dataForm.value = data;
  original_uuid.value = activity.original_uuid;
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

const saveQuantity = (
  e: { quantity: string },
  entity: ConsumableMaterialStdTransactionInterface
) => {
  updateConsMat({
    id: entity.uuid,
    payload: {
      qty: parseFloat(e.quantity),
    },
  });
};

onMounted(() => {
  breadcrumb.value = [
    {
      name: route.query?.location as string,
      as_link: false,
      url: "",
    },
    {
      name: route.query?.unit as string,
      as_link: false,
      url: "",
    },
    {
      name: route.query?.machine as string,
      as_link: false,
      url: "",
    },
    {
      name: ((route.query?.inspection as string) || "").toUpperCase(),
      as_link: false,
      url: "",
    },
    {
      name: route.query?.scope as string,
      as_link: false,
      url: "",
    },
  ];
});
</script>

<template>
  <div class="relative w-full">
    <Button
      v-if="
        dataForm?.activity_uuid &&
        dataApproval?.status !== 'approve' &&
        access_token &&
        authStore.users?.role == 'planner'
      "
      icon_only="plus"
      class="absolute right-0"
      size="sm"
      rounded="full"
      color="blue"
      @click="handleCreate"
    />

    <div class="flex gap-8">
      <div class="basis-1/5">
        <FilterConsumableMaterialStd
          @filter="handleOnFilter"
          @reset-filter="handleResetFilter"
          :loading="is_loading_filter"
        />
      </div>
      <div class="flex-1 overflow-auto">
        <div class="max-w-full min-w-full">
          <Breadcrumb :items="breadcrumb" />
          <Table
            label-create="Material"
            :is_logging="false"
            :columns="ColumnsConsumableMaterial"
            :entities="dataConsMat?.data || []"
            :loading="isLoadingConsMat"
            :pagination="pagination"
            :is-create="false"
            :is-action="
              dataApproval?.status !== 'approve' &&
              access_token !== '' &&
              authStore.users?.role == 'planner'
            "
            class="mt-6"
            v-model:model-search="params.search"
            @change-page="changePage"
            @change-limit="changeLimit"
            @search="searchTable"
          >
            <template #column_action="{ entity }">
              <div class="flex items-center justify-center gap-4">
                <!-- <Icon name="pencil" class="icon-action-table" @click="handleUpdate(entity)"
                  v-if="dataForm?.activity_uuid" /> -->
                <Icon
                  name="trash"
                  class="icon-action-table"
                  @click="handleDelete(entity)"
                  v-if="dataForm?.activity_uuid"
                />
              </div>
            </template>
            <template #column_material="{ entity }">
              <p class="text-base text-neutral-50 text-left min-w-[100px]">
                {{ entity?.name ?? "-" }}
              </p>
            </template>
            <template #column_merk="{ entity }">
              <p class="text-base text-neutral-50 text-left">
                {{ entity?.merk ?? "-" }}
              </p>
            </template>
            <template #column_total_qty="{ entity }">
              <p
                v-if="
                  (dataApproval?.status === 'approve' && !entity.total_qty) ||
                  (!access_token && !entity.total_qty)
                "
              >
                -
              </p>
              <FormQuantity
                v-else
                ref="quantity"
                :value="entity.total_qty?.toString() || ''"
                :label="entity?.name"
                :loading="isLoadingUpdate"
                :disabled="
                  dataApproval?.status === 'approve' ||
                  !access_token ||
                  !dataForm?.activity_uuid ||
                  authStore.users?.role != 'planner'
                "
                @save="(e) => saveQuantity(e, entity)"
              />
            </template>
            <template #column_price="{ entity }">
              <p v-if="!entity?.price">-</p>
              <p
                v-else
                class="text-base text-neutral-50 text-left whitespace-nowrap"
              >
                Rp. {{ numberFormat(entity?.price) ?? "-" }}
              </p>
            </template>
            <template #column_total="{ entity }">
              <p v-if="!entity.total_qty && !entity?.price">-</p>
              <p
                v-else
                class="text-base text-neutral-50 text-left whitespace-nowrap"
              >
                Rp.
                {{
                  (
                    Number(entity?.price) * Number(entity.total_qty)
                  ).toLocaleString("id")
                }}
              </p>
            </template>
            <template #column_unit="{ entity }">
              <p class="text-base text-neutral-50 text-left">
                {{ entity?.unit ?? "-" }}
              </p>
            </template>
          </Table>
          <TableSummary
            :total_price="Number(dataSummary.total_price)"
            :price="Number(dataSummary.price)"
            :total_qty="Number(dataSummary.total_qty)"
          />
        </div>
      </div>
    </div>
  </div>

  <Toast ref="toastRef" />
  <FormConsumableMaterialStd
    :is-additional="true"
    v-model="open_form"
    :data-form="dataForm"
    :original_uuid="original_uuid"
    ref="formConsumableMaterial"
    :selected-value="selected_item"
    @success="handleSuccess"
    @error="handleError"
    @removeSucess="handleRemoveSuccess"
  />
  <!-- <FormAdCosumableMaterial v-model="open_form" :data-form="dataForm" :selected-value="selected_item"
    @success="handleSuccess" @error="handleError" @removeSucess="handleRemoveSuccess" /> -->
  <ModalDelete
    v-model="open_delete"
    :title="`${selected_item?.name} / ${selected_item?.unit}`"
    :loading="isLoadingDelete"
    @delete="onDelete"
  />
</template>
