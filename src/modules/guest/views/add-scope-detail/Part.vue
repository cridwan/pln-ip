<script setup lang="ts">
import type { AxiosError } from "axios";
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import {
  Breadcrumb,
  Icon,
  Table,
} from "@/components";
import { useQuery } from "@tanstack/vue-query";
import type { IPagination } from "@/types/GlobalType";
import type { BreadcrumbType } from "@/components/navigations/Breadcrumb.vue";
import type {
  FilterPartStdInterface,
  PartStdInterface,
} from "@/modules/master/types/PartStdType";
import { ColumnsPart } from "@/modules/guest/constants/PartConstant";
import FilterPartStd from "@/modules/guest/components/add-scope/FilterPartStd.vue";
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
const dataForm = ref<FilterPartStdInterface | null>(null);
const selected_item = ref<PartStdInterface | null>(null);
const breadcrumb = ref<BreadcrumbType[]>([]);
const open_form = ref(false);
const open_delete = ref(false);
const is_loading_filter = ref(false);

//--- GET PART STD
const {
  data: dataPart,
  isFetching: isLoadingPart,
  refetch: refetchPart,
} = useQuery({
  queryKey: ["getPartAtPartDetailAddScopeGuest"],
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

const handleUpdate = (item: PartStdInterface) => {
  selected_item.value = item;
  open_form.value = true;
};

const handleDelete = (item: PartStdInterface) => {
  selected_item.value = item;
  open_delete.value = true;
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
      column: "activity.equipment.scopeStandart.additional_scope_uuid",
      value: route.params.id_scope,
    },
  ];
};

const handleOnFilter = (data: FilterPartStdInterface) => {
  is_loading_filter.value = true;
  dataForm.value = data;
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
        <FilterPartStd @filter="handleOnFilter" @reset-filter="handleResetFilter" :loading="is_loading_filter" />
      </div>
      <div class="flex-1 overflow-auto">
        <div class="max-w-full min-w-full">
          <Breadcrumb :items="breadcrumb" />
          <Table label-create="Part" :columns="ColumnsPart" :entities="dataPart?.data || []" :loading="isLoadingPart"
            :is_logging="false" :pagination="pagination" :is-create="false" :is-action="false" class="mt-6"
            v-model:model-search="params.search" @change-page="changePage" @change-limit="changeLimit"
            @search="searchTable">
            <template #column_action="{ entity }">
              <div class="flex items-center justify-center gap-4">
                <Icon name="pencil" class="icon-action-table" @click="handleUpdate(entity)"
                  v-if="dataForm?.activity_uuid" />
                <Icon name="trash" class="icon-action-table" @click="handleDelete(entity)"
                  v-if="dataForm?.activity_uuid" />
              </div>
            </template>
            <template #column_part="{ entity }">
              <p class="text-base text-neutral-50 text-left">
                {{ entity.part?.name ?? "-" }}
              </p>
            </template>
            <template #column_price="{ entity }">
              <p v-if="!entity.part?.price">-</p>
              <p v-else class="text-base text-neutral-50 text-left whitespace-nowrap">
                Rp. {{ Number(entity.part.price).toLocaleString("id") }}
              </p>
            </template>
            <template #column_total="{ entity }">
              <p v-if="!entity.total_qty && !entity.part?.price">-</p>
              <p v-else class="text-base text-neutral-50 text-left whitespace-nowrap">
                Rp.
                {{
                  (
                    Number(entity.part.price) * Number(entity.total_qty)
                  ).toLocaleString("id")
                }}
              </p>
            </template>
            <template #column_unit="{ entity }">
              <p class="text-base text-neutral-50 text-left">
                {{ entity.part?.global_unit?.name ?? "-" }}
              </p>
            </template>
            <template #column_number_drawing="{ entity }">
              <p class="text-base text-neutral-50 text-left">
                {{ entity.part?.no_drawing ?? "-" }}
              </p>
            </template>
          </Table>
        </div>
      </div>
    </div>
  </div>
</template>
