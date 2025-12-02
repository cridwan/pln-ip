<script setup lang="ts">
import type { AxiosError } from "axios";
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";

import {
  Breadcrumb,
  Table,
} from "@/components";
import { useQuery } from "@tanstack/vue-query";
import type { IPagination } from "@/types/GlobalType";
import type {
  ConsumableMaterialStdInterface,
  FilterConsumableMaterialStdInterface,
} from "@/modules/master/types/ConsumableMaterialStdType";
import type { BreadcrumbType } from "@/components/navigations/Breadcrumb.vue";
import { numberFormat } from "@/helpers/global";

import { ColumnsConsumableMaterial } from "../constants/ConsumableMaterialConstant";
import FilterConsumableMaterialStd from "../components/FilterConsumableMaterialStd.vue";
import { useMasterStore } from "@/modules/master/stores/MasterStore";

const masterStore = useMasterStore();
const route = useRoute();
const params = reactive({
  search: "",
  filter: "",
  filters: [
    {
      group: "AND",
      operator: "EQ",
      column: "activity.equipment.scopeStandart.inspection_type_uuid",
      value: route.params.id_inspection,
    },
  ],
  currentPage: 1,
  perPage: 10,
});
const total_item = ref(0);
const timeout = ref(0);
const dataForm = ref<FilterConsumableMaterialStdInterface | null>(null);
const breadcrumb = ref<BreadcrumbType[]>([]);
const is_loading_filter = ref(false);

//--- GET CONSMAT STD
const {
  data: dataConsMat,
  isFetching: isLoadingConsMat,
  refetch: refetchConsMat,
} = useQuery({
  queryKey: ["getConsMatGuest"],
  queryFn: async () => {
    try {
      const { data } = await masterStore.getConsMatGrouping(params);
      const response = data.data as IPagination<ConsumableMaterialStdInterface[]>;

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

const setFilter = () => {
  params.filters = [
    {
      group: "AND",
      operator: "EQ",
      column: "activity.equipment.scopeStandart.inspection_type_uuid",
      value: route.params.id_inspection,
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
      column: "activity.equipment.scopeStandart.inspection_type_uuid",
      value: route.params.id_inspection,
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
      name: route.query?.inspection as string,
      as_link: false,
      url: "",
    },
    {
      name: "CONSUMABLE MATERIAL STANDART",
      as_link: false,
      url: "",
    },
  ];
});
</script>

<template>
  <div class="relative w-full">
    <div class="flex gap-8">
      <div class="basis-1/5">
        <FilterConsumableMaterialStd @filter="handleOnFilter" @reset-filter="handleResetFilter"
          :loading="is_loading_filter" />
      </div>
      <div class="flex-1 overflow-auto">
        <div class="max-w-full min-w-full">
          <Breadcrumb :items="breadcrumb" />
          <Table label-create="Material" :is-action="false" :columns="ColumnsConsumableMaterial"
            :entities="dataConsMat?.data || []" :loading="isLoadingConsMat" :pagination="pagination" :is-create="false"
            class="mt-6" v-model:model-search="params.search" @change-page="changePage" @change-limit="changeLimit"
            @search="searchTable" :is_logging="false">
            <template #column_material="{ entity }">
              <p class="text-base text-neutral-50 text-left min-w-[100px]">
                {{ entity.consmat?.name ?? "-" }}
              </p>
            </template>
            <template #column_merk="{ entity }">
              <p class="text-base text-neutral-50 text-left">
                {{ entity.consmat?.merk ?? "-" }}
              </p>
            </template>
            <template #column_price="{ entity }">
              <p v-if="!entity.consmat?.price">-</p>
              <p v-else class="text-base text-neutral-50 text-left whitespace-nowrap">
                Rp. {{ numberFormat(entity.consmat?.price) ?? "-" }}
              </p>
            </template>
            <template #column_total="{ entity }">
              <p v-if="!entity.total_qty && !entity.consmat?.price">-</p>
              <p v-else class="text-base text-neutral-50 text-left whitespace-nowrap">
                Rp.
                {{
                  numberFormat(
                    entity.consmat?.price * Number(entity?.total_qty || 0)
                  ) ?? "-"
                }}
              </p>
            </template>
            <template #column_unit="{ entity }">
              <p class="text-base text-neutral-50 text-left">
                {{ entity.consmat?.global_unit?.name ?? "-" }}
              </p>
            </template>
          </Table>
        </div>
      </div>
    </div>
  </div>
</template>
