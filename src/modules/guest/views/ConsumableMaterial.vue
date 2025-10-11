<script setup lang="ts">
import type { AxiosError } from "axios";
import { computed, reactive, ref } from "vue";
import { useRoute } from "vue-router";

import { Table, Toast } from "@/components";
import { useMutation, useQuery } from "@tanstack/vue-query";
import type { IPagination } from "@/types/GlobalType";

import { ColumnsConsumableMaterial } from "../constants/ConsumableMaterialConstant";
import type {
  ConsumableMaterialInterface,
  ResponseConsMatInterface,
  UpdateConsMatInterface,
} from "../types/ConsumableMaterialType";
import FormQuantity from "../components/FormQuantity.vue";
import FormMerk from "../components/FormMerk.vue";
import { useTransactionStore } from "../stores/TransactionStore";

const entitiesConsMat = ref<ConsumableMaterialInterface[]>([]);

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
const merk = ref<any>(null);

//--- GET CONSMAT
const {
  data: dataConsMat,
  isFetching: isLoadingConsMat,
  refetch: refetchConsMat,
} = useQuery({
  queryKey: ["getConsMat"],
  queryFn: async () => {
    try {
      const { data } = await transactionStore.getConsMat(params);
      const response = data as IPagination<ResponseConsMatInterface[]>;

      total_item.value = response.total;

      const new_arr: ConsumableMaterialInterface[] =
        response.data?.map((item) => {
          return {
            id: item.uuid,
            material: item.name,
            merk: item.merk,
            quantity: item.qty.toString(),
            unit: item.global_unit?.name,
            global_unit_uuid: item.global_unit_uuid,
            project_uuid: item.project_uuid,
            additional_scope_uuid: item.additional_scope_uuid,
          };
        }) || [];
      entitiesConsMat.value = new_arr;

      return response;
    } catch (error: any) {
      const err = error as AxiosError;
      throw err.response;
    }
  },
  refetchOnWindowFocus: false,
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

const saveQuantity = (
  e: { quantity: string },
  entity: ConsumableMaterialInterface
) => {
  updateConsMat({
    id: entity.id,
    payload: {
      name: entity.material,
      merk: entity.merk,
      qty: parseFloat(e.quantity),
      additional_scope_uuid: entity.additional_scope_uuid,
      global_unit_uuid: entity.global_unit_uuid,
      project_uuid: entity.project_uuid,
    },
  });
};

const saveMerk = (e: { merk: string }, entity: ConsumableMaterialInterface) => {
  updateConsMat({
    id: entity.id,
    payload: {
      name: entity.material,
      merk: e.merk,
      qty: parseFloat(entity.quantity as string),
      additional_scope_uuid: entity.additional_scope_uuid,
      global_unit_uuid: entity.global_unit_uuid,
      project_uuid: entity.project_uuid,
    },
  });
};

function searchTable() {
  clearTimeout(timeout.value);
  timeout.value = window.setTimeout(() => {
    params.currentPage = 1;
    refetchConsMat();
  }, 1000);
}
</script>

<template>
  <Toast ref="toastRef" />
  <Table
    label-create="Material"
    :columns="ColumnsConsumableMaterial"
    :entities="entitiesConsMat"
    :loading="isLoadingConsMat"
    :pagination="pagination"
    :is-create="false"
    :is-action="false"
    v-model:model-search="params.search"
    @change-page="changePage"
    @change-limit="changeLimit"
    @search="searchTable"
  >
    <template #column_merk="{ entity }">
      <div class="w-full flex justify-center">
        <FormMerk
          ref="merk"
          :value="entity.merk || ''"
          :label="entity.material"
          :loading="isLoadingUpdate"
          @save="(e) => saveMerk(e, entity)"
        />
      </div>
    </template>
    <template #column_quantity="{ entity }">
      <div class="w-full flex justify-center">
        <FormQuantity
          ref="quantity"
          :value="entity.quantity || ''"
          :label="entity.material"
          :loading="isLoadingUpdate"
          @save="(e) => saveQuantity(e, entity)"
        />
      </div>
    </template>
    <template #column_unit="{ entity }">
      <div class="w-full flex justify-center">
        <div
          v-if="entity.unit"
          class="border border-neutral-50 rounded-lg px-2 min-w-[100px] text-base text-neutral-50 text-center"
        >
          {{ entity.unit }}
        </div>
        <div v-else>-</div>
      </div>
    </template>
  </Table>
</template>
