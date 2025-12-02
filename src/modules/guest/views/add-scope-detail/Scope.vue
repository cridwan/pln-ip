<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import type { AxiosError } from "axios";
import type { IPagination } from "@/types/GlobalType";
import { Breadcrumb, Table } from "@/components";
import { useQuery } from "@tanstack/vue-query";
import { ColumnsScope } from "@/modules/guest/constants/ScopeConstant";
import type {
  FilterScopeInterface,
  ResponseScopeInterface,
  ScopeInterface,
} from "@/modules/guest/types/ScopeType";
import FilterScope from "@/modules/guest/components/add-scope/FilterAdScope.vue";
import type { EquipmentInterface } from "@/modules/guest/types/EquipmentType";
import TableEquipment from "../../components/add-scope/TableEquipment.vue";
import { useMasterStore } from "@/modules/master/stores/MasterStore";
import type { BreadcrumbType } from "@/components/navigations/Breadcrumb.vue";

const breadcrumb = ref<BreadcrumbType[]>([]);
const entitiesScope = ref<ScopeInterface[]>([]);
const selected_item = ref<ScopeInterface>();
const dataForm = ref<FilterScopeInterface | null>(null);
const masterStore = useMasterStore();
const route = useRoute();
const params = reactive({
  search: "",
  filters: [
    {
      group: "AND",
      operator: "EQ",
      column: "additional_scope_uuid",
      value: route.params.id_scope,
    },
  ],
  currentPage: 1,
  perPage: 10,
});
const total_item = ref(0);
const dataDuration = ref(0)
const open_delete = ref(false);
const timeout = ref(0);
const children_active = ref<{ id: string; open: boolean }[]>([]);
const is_loading_filter = ref(false);

//--- GET SCOPE
const {
  isFetching: isLoadingScope,
  refetch: refetchScope,
} = useQuery({
  queryKey: ["getScopeAtScopeDetailAddScopeGuest"],
  queryFn: async () => {
    try {
      const { data } = await masterStore.getScope(params, '/add-scope/detail');
      const response = data as IPagination<ResponseScopeInterface[]>;
      total_item.value = response.total;
      dataDuration.value = response?.summary?.total_days || 0 as number;
      const new_arr: ScopeInterface[] =
        response?.data?.map((item) => {
          return {
            id: item.uuid,
            asset: item.name || "",
            children: [],
            asset_welness: item.asset_welnes
              ? {
                color: item.asset_welnes?.color,
                note: item.asset_welnes?.note,
                file: item.asset_welnes?.document
                  ? [
                    {
                      id: item.asset_welnes.document.uuid,
                      name: item.asset_welnes.document
                        .document_original_name,
                      size: item.asset_welnes.document.document_size,
                      file: item.asset_welnes.document.document_link,
                    },
                  ]
                  : [],
              }
              : null,
            oh_recom: item.oh_recom
              ? {
                note: item.oh_recom?.note,
                file: item.oh_recom?.document
                  ? [
                    {
                      id: item.oh_recom.document.uuid,
                      name: item.oh_recom.document.document_original_name,
                      size: item.oh_recom.document.document_size,
                      file: item.oh_recom.document.document_link,
                    },
                  ]
                  : [],
              }
              : null,
            wo_priority: item.wo_priority
              ? {
                note: item.wo_priority?.note,
                file: item.wo_priority?.document
                  ? [
                    {
                      id: item.wo_priority.document.uuid,
                      name: item.wo_priority.document
                        .document_original_name,
                      size: item.wo_priority.document.document_size,
                      file: item.wo_priority.document.document_link,
                    },
                  ]
                  : [],
              }
              : null,
            history: item.history
              ? {
                note: item.history?.note,
                file: item.history?.document
                  ? [
                    {
                      id: item.history.document.uuid,
                      name: item.history.document.document_original_name,
                      size: item.history.document.document_size,
                      file: item.history.document.document_link,
                    },
                  ]
                  : [],
              }
              : null,
            rla: item.rla
              ? {
                note: item.rla?.note,
                file: item.rla?.document
                  ? [
                    {
                      id: item.rla.document.uuid,
                      name: item.rla.document.document_original_name,
                      size: item.rla.document.document_size,
                      file: item.rla.document.document_link,
                    },
                  ]
                  : [],
              }
              : null,
            ncr: item.ncr
              ? {
                note: item.ncr?.note,
                file: item.ncr?.document
                  ? [
                    {
                      id: item.ncr.document.uuid,
                      name: item.ncr.document.document_original_name,
                      size: item.ncr.document.document_size,
                      file: item.ncr.document.document_link,
                    },
                  ]
                  : [],
              }
              : null,
            document: item.document,
          };
        }) || [];
      entitiesScope.value = new_arr;
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
  refetchScope();
};

const changeLimit = (e: string) => {
  params.perPage = parseInt(e);
  params.currentPage = 1;
  refetchScope();
};

const handleDelete = (e: ScopeInterface) => {
  selected_item.value = e;
  open_delete.value = true;
};

function searchTable() {
  clearTimeout(timeout.value);
  timeout.value = window.setTimeout(() => {
    params.currentPage = 1;
    refetchScope();
  }, 1000);
}

const setFilter = () => {
  params.filters = [
    {
      group: "AND",
      operator: "EQ",
      column: "additionalScope.uuid",
      value: route.params.id_scope,
    },
    {
      group: "AND",
      operator: "EQ",
      column: "sub_bidang_uuid",
      value: dataForm.value?.sub_bidang_uuid as string,
    },
  ];
};

const resetFilter = () => {
  dataForm.value = null;
  params.filters = [
    {
      group: "AND",
      operator: "EQ",
      column: "additionalScope.uuid",
      value: route.params.id_scope,
    },
  ];
};

const handleResetFilter = () => {
  is_loading_filter.value = true;
  resetFilter();
  refetchScope();
};

const handleOnFilter = (data: FilterScopeInterface) => {
  is_loading_filter.value = true;
  dataForm.value = data;
  setFilter();
  refetchScope();
};

const openChildren = (value: boolean, item: ScopeInterface) => {
  const find_index = children_active.value.findIndex((el) => el.id === item.id);
  if (find_index < 0) {
    children_active.value = [
      ...children_active.value,
      { id: item.id, open: value },
    ];
  } else {
    children_active.value[find_index].open = value;
  }
};

const getData = (id: string, response: EquipmentInterface[]) => {
  entitiesScope.value = entitiesScope.value.map((item) => {
    if (item.id === id) {
      return { ...item, children: response };
    } else {
      return { ...item };
    }
  });
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
  <div class="absolute right-12 rounded-full bg-cyan-500 text-neutral-50 text-center w-fit px-4 py-1">
    <span v-if="isLoadingScope">Loading...</span>
    <span v-else>{{ dataDuration }} Days</span>
  </div>
  <div class="flex gap-8">
    <div class="basis-1/5">
      <FilterScope @filter="handleOnFilter" @reset-filter="handleResetFilter" :loading="is_loading_filter" />
    </div>
    <div class="flex-1 overflow-auto">
      <div class="max-w-full min-w-full">
        <Breadcrumb :items="breadcrumb" />
        <Table label-create="Asset" :columns="ColumnsScope" :entities="entitiesScope" :loading="isLoadingScope"
          :is_logging="false" :pagination="pagination" :is-create="false" v-model:model-search="params.search"
          @delete="handleDelete" @change-page="changePage" @change-limit="changeLimit" @search="searchTable"
          @open-children="openChildren" :is-action="false">
          <template #children="{ entity, index, parentActive }">
            <tr v-if="
              children_active.find((el) => el.id === entity.id)?.open === true
            ">
              <td :colspan="ColumnsScope.length + 4">
                <div class="bg-[rgb(207,225,255,0.4)] px-3 py-2 rounded">
                  <TableEquipment :is-additional="true" :id="entity.id" :entity="entity.children" :open="children_active.find((el) => el.id === entity.id)?.open
                    " @get-data="getData" />
                </div>
              </td>
            </tr>
          </template>
        </Table>
      </div>
    </div>
  </div>
</template>
