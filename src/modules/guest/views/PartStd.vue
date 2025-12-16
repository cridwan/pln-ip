<script setup lang="ts">
import type { AxiosError } from "axios";
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";

import { Breadcrumb, Table } from "@/components";
import { useQuery } from "@tanstack/vue-query";
import type { IPagination } from "@/types/GlobalType";
import type { BreadcrumbType } from "@/components/navigations/Breadcrumb.vue";
import type {
  FilterPartStdInterface,
  PartStdInterface,
} from "@/modules/master/types/PartStdType";
import type { ActivityInterface } from "@/modules/master/types/AcitivityType";

import { ColumnsPart } from "../constants/PartConstant";
import FilterPartStd from "../components/FilterPartStd.vue";
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
const dataForm = ref<FilterPartStdInterface | null>(null);
const dataActivity = ref<ActivityInterface | null>(null);
const breadcrumb = ref<BreadcrumbType[]>([]);
const is_loading_filter = ref(false);

//--- GET PART STD
const {
  data: dataPart,
  isFetching: isLoadingPart,
  refetch: refetchPart,
} = useQuery({
  queryKey: ["getPartGuest"],
  queryFn: async () => {
    try {
      const { data } = await masterStore.getPartGrouping(params);
      const response = data.data as IPagination<PartStdInterface[]>;
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
  refetchPart();
};

const changeLimit = (e: string) => {
  params.perPage = parseInt(e);
  params.currentPage = 1;
  refetchPart();
};

function searchTable() {
  clearTimeout(timeout.value);
  timeout.value = window.setTimeout(() => {
    params.currentPage = 1;
    refetchPart();
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
  dataActivity.value = null;
  params.filters = [
    {
      group: "AND",
      operator: "EQ",
      column: "activity.equipment.scopeStandart.inspection_type_uuid",
      value: route.params.id_inspection,
    },
  ];
};

const handleOnFilter = (
  data: FilterPartStdInterface,
  activity: ActivityInterface
) => {
  is_loading_filter.value = true;
  dataForm.value = data;
  dataActivity.value = activity;
  setFilter();
  refetchPart();
};

const handleResetFilter = () => {
  is_loading_filter.value = true;
  resetFilter();
  refetchPart();
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
      name: "PART STANDART",
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
        <FilterPartStd
          @filter="handleOnFilter"
          @reset-filter="handleResetFilter"
          :loading="is_loading_filter"
        />
      </div>
      <div class="flex-1 overflow-auto">
        <div class="max-w-full min-w-full">
          <Breadcrumb :items="breadcrumb" />
          <Table
            label-create="Part"
            :columns="ColumnsPart"
            :entities="dataPart?.data || []"
            :loading="isLoadingPart"
            :is_logging="false"
            :pagination="pagination"
            :is-create="false"
            :is-action="false"
            class="mt-6"
            v-model:model-search="params.search"
            @change-page="changePage"
            @change-limit="changeLimit"
            @search="searchTable"
          >
            <template #column_part="{ entity }">
              <p class="text-neutral-50">
                {{ entity.part?.name ?? "-" }}
              </p>
            </template>

            <template #column_total_qty="{ entity }">
              <span class="text-base text-neutral-50 text-left">{{
                entity.total_qty
              }}</span>
            </template>

            <template #column_unit="{ entity }">
              <span class="text-base text-neutral-50 text-left">
                {{ entity.part?.global_unit?.name ?? "-" }}
              </span>
            </template>

            <template #column_number_drawing="{ entity }">
              <span class="text-base text-neutral-50 text-left">
                {{ entity.part?.no_drawing ?? "-" }}
              </span>
            </template>
          </Table>
        </div>
      </div>
    </div>
  </div>
</template>
