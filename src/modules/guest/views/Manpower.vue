<script setup lang="ts">
import type { AxiosError } from "axios";
import { computed, reactive, ref } from "vue";
import { useRoute } from "vue-router";

import { Table, Toast } from "@/components";
import { useMutation, useQuery } from "@tanstack/vue-query";
import type { IPagination } from "@/types/GlobalType";

import { ColumnsManpower } from "../constants/ManpowerConstant";
import type {
  ManPowerInterface,
  ResponseManPowerInterface,
  UpdateManPowerInterface,
} from "../types/ManpowerType";
import FormQuantity from "../components/FormQuantity.vue";
import { useTransactionStore } from "../stores/TransactionStore";

const entitiesManPower = ref<ManPowerInterface[]>([]);

const transactionStore = useTransactionStore();
const route = useRoute();
const params = reactive({
  search: "",
  filter: `project_uuid,${route.params.id_project}`,
  currentPage: 1,
  perPage: 10,
});
const total_item = ref(0);
const toastRef = ref<InstanceType<typeof Toast> | null>(null);
const quantity = ref<any>(null);
const timeout = ref(0);

//--- GET MANPOWER
const {
  data: dataManPower,
  isFetching: isLoadingManPower,
  refetch: refetchManPower,
} = useQuery({
  queryKey: ["getManPower"],
  queryFn: async () => {
    try {
      const { data } = await transactionStore.getManPower(params);
      const response = data as IPagination<ResponseManPowerInterface[]>;

      total_item.value = response.total;

      const new_arr: ManPowerInterface[] =
        response.data?.map((item) => {
          return {
            id: item.uuid,
            manpower: item.name,
            quantity: item.qty.toString(),
            type: item.type,
            additional_scope_uuid: item.additional_scope_uuid,
            project_uuid: item.project_uuid,
            note: item.note,
          };
        }) || [];
      entitiesManPower.value = new_arr;

      return response;
    } catch (error: any) {
      const err = error as AxiosError;
      throw err.response;
    }
  },
  refetchOnWindowFocus: false,
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

const saveQuantity = (e: { quantity: string }, entity: ManPowerInterface) => {
  updateCManPower({
    id: entity.id,
    payload: {
      name: entity.manpower,
      qty: parseFloat(e.quantity),
      additional_scope_uuid: entity.additional_scope_uuid,
      project_uuid: entity.project_uuid,
      type: entity.type,
      note: entity.note,
    },
  });
};

function searchTable() {
  clearTimeout(timeout.value);
  timeout.value = window.setTimeout(() => {
    params.currentPage = 1;
    refetchManPower();
  }, 1000);
}
</script>

<template>
  <Toast ref="toastRef" />
  <Table
    label-create="Manpower"
    :columns="ColumnsManpower"
    :entities="entitiesManPower"
    :loading="isLoadingManPower"
    :pagination="pagination"
    :is-create="false"
    :is-action="false"
    v-model:model-search="params.search"
    @change-page="changePage"
    @change-limit="changeLimit"
    @search="searchTable"
  >
    <template #column_quantity="{ entity }">
      <div class="w-full flex justify-center">
        <FormQuantity
          ref="quantity"
          :value="entity.quantity || ''"
          :label="entity.manpower"
          :loading="isLoadingUpdate"
          @save="(e) => saveQuantity(e, entity)"
        />
      </div>
    </template>
    <template #column_unit="{ entity }">
      <div class="w-full flex justify-center">
        <div
          class="border border-neutral-50 rounded-lg px-2 min-w-[100px] text-base text-neutral-50 text-center"
        >
          {{ entity.type }}
        </div>
      </div>
    </template>
  </Table>
</template>
