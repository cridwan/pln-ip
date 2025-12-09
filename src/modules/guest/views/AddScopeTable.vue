<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import type { AxiosError } from "axios";
import { useRoute, useRouter } from "vue-router";

import { Breadcrumb, Icon, Table } from "@/components";
import { useQuery } from "@tanstack/vue-query";
import type {
  IPagination,
  ResponseDocumentInterface,
} from "@/types/GlobalType";

import type {
  AddScopeInterface,
  AddScopeInterfaceTable,
} from "../types/AddScopeTableType";
import { ColumnsScopeGuest } from "../constants/ScopeConstant";
import { useMasterStore } from "@/modules/master/stores/MasterStore";
import type { BreadcrumbType } from "@/components/navigations/Breadcrumb.vue";
import ModalPlay from "@/components/overlays/ModalPlay.vue";

const documentRef = ref<ResponseDocumentInterface | undefined>(undefined);
const open_modal = ref(false);
const selected_item = ref<AddScopeInterface>();
const breadcrumb = ref<BreadcrumbType[]>([]);
const masterStore = useMasterStore();
const router = useRouter();
const route = useRoute();
const params = reactive({
  search: "",
  filters: [
    {
      group: "AND",
      operator: "EQ",
      column: "inspection_type_uuid",
      value: route.params.id_inspection,
    },
  ],
  currentPage: 1,
  perPage: 10,
});
const total_item = ref(0);
const open_delete = ref(false);
const timeout = ref(0);
//--- GET SCOPE
const {
  isFetching: isLoadingScope,
  refetch: refetchScope,
  data: entitiesScope,
} = useQuery({
  queryKey: ["getAddScopeGuest"],
  queryFn: async () => {
    try {
      const { data } = await masterStore.getAdditionalScope(params);
      const response = data as IPagination<AddScopeInterfaceTable[]>;

      total_item.value = response.total;
      return response;
    } catch (error: any) {
      const err = error as AxiosError;
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
  refetchScope();
};

const changeLimit = (e: string) => {
  params.perPage = parseInt(e);
  params.currentPage = 1;
  refetchScope();
};

const toDetail = (entity: AddScopeInterfaceTable) => {
  router.push({
    path: `/${route.params.id}/guest/${route.params.id_unit}/${route.params.id_machine}/${route.params.menu}/${route.params.id_project}/${route.params.id_inspection}/add-scope/${entity.uuid}/scope`,
    query: {
      location: entity.inspection_type?.machine?.unit?.location?.name,
      unit: entity.inspection_type?.machine?.unit?.name,
      machine: entity.inspection_type?.machine?.name,
      inspectionType: entity.inspection_type?.name,
      addScope: entity.name,
      inspection: entity.inspection_type?.name,
    },
  });
};

function searchTable() {
  clearTimeout(timeout.value);
  timeout.value = window.setTimeout(() => {
    params.currentPage = 1;
    refetchScope();
  }, 1000);
}

const handleDelete = (e: AddScopeInterface) => {
  selected_item.value = e;
  open_delete.value = true;
};

const clickVideo = (document: ResponseDocumentInterface) => {
  documentRef.value = document;
  open_modal.value = true;
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
      name: "ADDITIONAL SCOPE",
      as_link: false,
      url: "",
    },
  ];
});
</script>

<template>
  <div class="relative w-full">
    <Breadcrumb :items="breadcrumb" />
    <Table
      label-create="Asset"
      :columns="ColumnsScopeGuest"
      :entities="entitiesScope?.data"
      :loading="isLoadingScope"
      :pagination="pagination"
      :is-create="false"
      v-model:model-search="params.search"
      @delete="handleDelete"
      @change-page="changePage"
      @change-limit="changeLimit"
      @search="searchTable"
      :is-action="true"
      :is_logging="false"
    >
      <template #header_action>
        <div class="px-3 py-1.5">
          <p class="v-table-th-text">Action</p>
        </div>
      </template>
      <template #column_action="{ entity }">
        <div class="flex items-center justify-center gap-2">
          <Icon
            name="eye"
            class="cursor-pointer text-white"
            @click="toDetail(entity)"
          />
        </div>
      </template>
      <template #column_video="{ entity }">
        <span
          class="text-white cursor-pointer underline"
          v-if="entity.sequence?.document"
          @click="clickVideo(entity.sequence.document)"
          >{{ entity.sequence?.document?.document_name || "-" }}</span
        >
        <span class="text-white">-</span>
      </template>
    </Table>
  </div>
  <ModalPlay v-model="open_modal" :document="documentRef" />
</template>
