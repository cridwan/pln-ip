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
import type { BreadcrumbType } from "@/components/navigations/Breadcrumb.vue";
import type {
  FilterManpowerStdInterface,
  ManpowerStdInterface,
} from "@/modules/master/types/ManpowerStdType";
import { useAuthStore } from "@/modules/auth/stores/AuthStore";

import { ColumnsManpower } from "../constants/ManpowerConstant";
import { useTransactionStore } from "../stores/TransactionStore";
import FilterManpowerStd from "../components/FilterManpowerStd.vue";
import FormManpowerStd from "../components/FormManpowerStd.vue";
import type { ProjectInterface } from "../types/ProjectType";
import type { UpdateManPowerInterface } from "../types/ManpowerType";
import FormQuantity from "../components/FormQuantity.vue";

const authStore = useAuthStore();
const { access_token } = storeToRefs(authStore);
const transactionStore = useTransactionStore();
const route = useRoute();
const params = reactive({
  search: "",
  filter: ``,
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
const dataForm = ref<FilterManpowerStdInterface | null>(null);
const selected_item = ref<ManpowerStdInterface | null>(null);
const breadcrumb = ref<BreadcrumbType[]>([]);
const open_form = ref(false);
const open_delete = ref(false);
const is_loading_filter = ref(false);
const quantity = ref<any>(null);

//--- GET STATUS APPROVAL
const { data: dataApproval } = useQuery({
  queryKey: ["getApprovalAtManpowerStandart"],
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

//--- GET MANPOWER
const {
  data: dataManPower,
  isFetching: isLoadingManPower,
  refetch: refetchManPower,
} = useQuery({
  queryKey: ["getManPowerTransaction"],
  queryFn: async () => {
    try {
      const { data } = await transactionStore.getManPower(params);
      const response = data as IPagination<ManpowerStdInterface[]>;

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

//--- DELETE MANPOWER STD
const { mutate: deleteManpowerStd, isPending: isLoadingDelete } = useMutation({
  mutationFn: async (id: string) => {
    return await transactionStore.deleteManPowerStd(id);
  },
  onSuccess: () => {
    toastRef.value?.showToast({
      title: "Success",
      description: "Deleted successfully",
      type: "success",
    });
    open_delete.value = false;
    refetchManPower();
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

//--- UPDATE MANPOWER
const { mutate: updateCManPower, isPending: isLoadingUpdate } = useMutation({
  mutationFn: async ({
    payload,
    id,
  }: {
    payload: UpdateManPowerInterface;
    id: string;
  }) => {
    return await transactionStore.updateManPower(payload, id);
  },
  onSuccess: async () => {
    refetchManPower();
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
  refetchManPower();
};

const changeLimit = (e: string) => {
  params.perPage = parseInt(e);
  params.currentPage = 1;
  refetchManPower();
};

function searchTable() {
  clearTimeout(timeout.value);
  timeout.value = window.setTimeout(() => {
    params.currentPage = 1;
    refetchManPower();
  }, 1000);
}

const handleSuccess = () => {
  toastRef.value?.showToast({
    title: "Success",
    description: "Saved successfully",
    type: "success",
  });
  params.currentPage = 1;
  refetchManPower();
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

const handleUpdate = (item: ManpowerStdInterface) => {
  selected_item.value = item;
  open_form.value = true;
};

const handleDelete = (item: ManpowerStdInterface) => {
  selected_item.value = item;
  open_delete.value = true;
};

const onDelete = () => {
  deleteManpowerStd(selected_item.value?.uuid as string);
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

const handleOnFilter = (data: FilterManpowerStdInterface) => {
  is_loading_filter.value = true;
  dataForm.value = data;
  setFilter();
  refetchManPower();
};

const handleResetFilter = () => {
  is_loading_filter.value = true;
  resetFilter();
  refetchManPower();
};

const handleRemoveSuccess = () => {
  refetchManPower();
};

const saveQuantity = (
  e: { quantity: string },
  entity: ManpowerStdInterface
) => {
  updateCManPower({
    id: entity.uuid,
    payload: {
      name: entity.manpower.name,
      qty: parseFloat(e.quantity),
      type: "type",
    },
  });
};

onMounted(() => {
  breadcrumb.value = [
    {
      name: "Manpower Std",
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
        access_token
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
        <FilterManpowerStd
          @filter="handleOnFilter"
          @reset-filter="handleResetFilter"
          :loading="is_loading_filter"
        />
      </div>
      <div class="flex-1 overflow-auto">
        <div class="max-w-full min-w-full">
          <Breadcrumb :items="breadcrumb" />
          <Table
            label-create="Manpower"
            :columns="ColumnsManpower"
            :entities="dataManPower?.data || []"
            :loading="isLoadingManPower"
            :pagination="pagination"
            :is-create="false"
            :is-action="
              dataApproval?.status !== 'approve' && access_token !== ''
            "
            class="mt-6"
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
                  v-if="dataForm?.activity_uuid"
                />
                <Icon
                  name="trash"
                  class="icon-action-table"
                  @click="handleDelete(entity)"
                  v-if="dataForm?.activity_uuid"
                />
              </div>
            </template>
            <template #column_manpower="{ entity }">
              <p class="text-base text-neutral-50 text-left">
                {{ entity.manpower?.name ?? "-" }}
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
                :label="entity.manpower.name"
                :loading="isLoadingUpdate"
                :disabled="dataApproval?.status === 'approve' || !access_token"
                @save="(e) => saveQuantity(e, entity)"
              />
            </template>
            <template #column_price="{ entity }">
              <p v-if="!entity.manpower?.price">-</p>
              <p
                v-else
                class="text-base text-neutral-50 text-left whitespace-nowrap"
              >
                Rp.
                {{ Number(entity.manpower.price)?.toLocaleString("id") ?? "-" }}
              </p>
            </template>
            <template #column_total="{ entity }">
              <p v-if="!entity.total_qty && !entity.manpower?.price">-</p>
              <p
                v-else
                class="text-base text-neutral-50 text-left whitespace-nowrap"
              >
                Rp.
                {{
                  (
                    Number(entity.manpower.price) * Number(entity.total_qty)
                  ).toLocaleString("id")
                }}
              </p>
            </template>
          </Table>
        </div>
      </div>
    </div>
  </div>

  <Toast ref="toastRef" />
  <FormManpowerStd
    v-model="open_form"
    :data-form="dataForm"
    :selected-value="selected_item"
    @success="handleSuccess"
    @error="handleError"
    @removeSucess="handleRemoveSuccess"
  />
  <ModalDelete
    v-model="open_delete"
    :title="selected_item?.manpower?.name"
    :loading="isLoadingDelete"
    @delete="onDelete"
  />
</template>
