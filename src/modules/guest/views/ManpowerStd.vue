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
import type { BreadcrumbType } from "@/components/navigations/Breadcrumb.vue";
import type {
  FilterManpowerStdInterface,
  ManpowerStdInterface,
} from "@/modules/master/types/ManpowerStdType";

import { ColumnsManpower } from "../constants/ManpowerConstant";
import FilterManpowerStd from "../components/FilterManpowerStd.vue";
import { useMasterStore } from "@/modules/master/stores/MasterStore";

const masterStore = useMasterStore();
const route = useRoute();
const params = reactive({
  search: "",
  filter: ``,
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
const dataForm = ref<FilterManpowerStdInterface | null>(null);
const breadcrumb = ref<BreadcrumbType[]>([]);
const is_loading_filter = ref(false);

//--- GET MANPOWER
const {
  data: dataManPower,
  isFetching: isLoadingManPower,
  refetch: refetchManPower,
} = useQuery({
  queryKey: ["getManPowerGuest"],
  queryFn: async () => {
    try {
      const { data } = await masterStore.getManpowerGrouping(params);
      const response = data.data as IPagination<ManpowerStdInterface[]>;

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
      name: "MANPOWER STANDART",
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
        <FilterManpowerStd @filter="handleOnFilter" @reset-filter="handleResetFilter" :loading="is_loading_filter" />
      </div>
      <div class="flex-1 overflow-auto">
        <div class="max-w-full min-w-full">
          <Breadcrumb :items="breadcrumb" />
          <Table label-create="Manpower" :columns="ColumnsManpower" :entities="dataManPower?.data || []"
            :loading="isLoadingManPower" :pagination="pagination" :is-create="false" :is-action="false" class="mt-6"
            v-model:model-search="params.search" @change-page="changePage" @change-limit="changeLimit"
            :is_logging="false" @search="searchTable">
            <template #column_manpower="{ entity }">
              <p class="text-base text-neutral-50 text-left">
                {{ entity.manpower?.name ?? "-" }}
              </p>
            </template>
            <template #column_price="{ entity }">
              <p v-if="!entity.manpower?.price">-</p>
              <p v-else class="text-base text-neutral-50 text-left whitespace-nowrap">
                Rp.
                {{ Number(entity.manpower.price)?.toLocaleString("id") ?? "-" }}
              </p>
            </template>
            <template #column_total="{ entity }">
              <p v-if="!entity.total_qty && !entity.manpower?.price">-</p>
              <p v-else class="text-base text-neutral-50 text-left whitespace-nowrap">
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
</template>
