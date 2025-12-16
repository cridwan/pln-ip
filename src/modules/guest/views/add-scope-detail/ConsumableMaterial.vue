<script setup lang="ts">
import type { AxiosError } from "axios";
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { Breadcrumb, Table } from "@/components";
import { useQuery } from "@tanstack/vue-query";
import type { IPagination } from "@/types/GlobalType";
import type {
  ConsumableMaterialStdInterface,
  FilterConsumableMaterialStdInterface,
} from "@/modules/master/types/ConsumableMaterialStdType";
import type { BreadcrumbType } from "@/components/navigations/Breadcrumb.vue";
import { ColumnsConsumableMaterial } from "@/modules/guest/constants/ConsumableMaterialConstant";
import FilterConsumableMaterialStd from "@/modules/guest/components/add-scope/FilterConsumableMaterialStd.vue";
import { numberFormat } from "@/helpers/global";
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
      column: "activity.equipment.scopeStandart.additional_scope_uuid",
      value: route.params.id_scope,
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
  queryKey: ["getConsMatAtConsMatDetailAddScopeGuest"],
  queryFn: async () => {
    try {
      const { data } = await masterStore.getConsMatGrouping(params);
      const response = data.data as IPagination<
        ConsumableMaterialStdInterface[]
      >;

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
      column: "activity.equipment.scopeStandart.additional_scope_uuid",
      value: route.params.id_scope,
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
  <div class="relative w-full">
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
            :columns="ColumnsConsumableMaterial"
            :entities="dataConsMat?.data || []"
            :loading="isLoadingConsMat"
            :pagination="pagination"
            :is-create="false"
            :is-action="false"
            class="mt-6"
            v-model:model-search="params.search"
            @change-page="changePage"
            @change-limit="changeLimit"
            :is_logging="false"
            @search="searchTable"
          >
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
              <p
                v-else
                class="text-base text-neutral-50 text-left whitespace-nowrap"
              >
                Rp. {{ numberFormat(entity.consmat?.price) ?? "-" }}
              </p>
            </template>
            <template #column_total="{ entity }">
              <p v-if="!entity.total_qty && !entity.consmat?.price">-</p>
              <p
                v-else
                class="text-base text-neutral-50 text-left whitespace-nowrap"
              >
                Rp.
                {{
                  (
                    Number(entity.consmat?.price) * Number(entity.total_qty)
                  ).toLocaleString("id")
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
