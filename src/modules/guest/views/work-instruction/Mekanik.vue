<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import type { AxiosError } from "axios";

import type {
  IPagination,
  ResponseDocumentInterface,
} from "@/types/GlobalType";
import { Table } from "@/components";
import { useQuery } from "@tanstack/vue-query";

import { ColumnsWorkInstruction } from "../../constants/WorkInstructionConstant";
import type {
  ResponseScopeInterface,
  ScopeInterface,
} from "../../types/ScopeType";
import ButtonPreview from "../../components/ButtonPreview.vue";
import { useTransactionStore } from "../../stores/TransactionStore";

const entitiesScope = ref<ScopeInterface[]>([]);

const transactionStore = useTransactionStore();
const route = useRoute();
const params = reactive({
  search: "",
  filters: `project_uuid,${route.params.id_project}&category,mekanik`,
  currentPage: 1,
  perPage: 10,
});
const total_item = ref(0);
const timeout = ref(0);

//--- GET SCOPE
const {
  data: dataScope,
  isFetching: isLoadingScope,
  refetch: refetchScope,
} = useQuery({
  queryKey: ["getScopeMekanik"],
  queryFn: async () => {
    try {
      const { data } = await transactionStore.getScopeStandar(params);
      const response = data as IPagination<ResponseScopeInterface[]>;

      total_item.value = response.total;

      const new_arr: ScopeInterface[] =
        response.data?.map((item) => {
          return {
            id: item.uuid,
            asset: item.name || "",
            asset_welness: null,
            oh_recom: null,
            wo_priority: null,
            history: null,
            rla: null,
            ncr: null,
            children: item.details.map((el) => {
              return {
                id: el.uuid,
                name: el.name,
                document: el.document,
              };
            }),
            document: item.document,
          };
        }) || [];
      entitiesScope.value = new_arr;

      return response;
    } catch (error: any) {
      const err = error as AxiosError;
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

const searchTable = () => {
  clearTimeout(timeout.value);
  timeout.value = window.setTimeout(() => {
    params.currentPage = 1;
    refetchScope();
  }, 1000);
};

const preview = (item: ResponseDocumentInterface) => {
  const a = document.createElement("a");
  a.href =
    import.meta.env.VITE_API_BASE_URL.replace("api", "") + item?.document_link;
  a.download = item?.document_original_name || "";
  a.target = "_blank";
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
</script>

<template>
  <Table
    label-create="Asset"
    :columns="ColumnsWorkInstruction"
    :entities="entitiesScope"
    :loading="isLoadingScope"
    :pagination="pagination"
    :is-create="false"
    :is-action="false"
    v-model:model-search="params.search"
    @change-page="changePage"
    @change-limit="changeLimit"
    @search="searchTable"
  >
    <template #column_preview="{ entity }">
      <ButtonPreview v-if="entity.document" @click="preview(entity.document)" />
      <div v-else class="text-center">-</div>
    </template>
    <template #column_action><p></p> </template>
    <template #children="{ entity, index, parentActive }">
      <tr v-if="parentActive === index && entity.children.length === 0">
        <td :colspan="ColumnsWorkInstruction.length + 1" class="td-child">
          <div class="v-table-body">
            <p class="v-table-body-text pl-11 text-center">Not Found Data</p>
          </div>
        </td>
      </tr>
      <tr
        v-if="parentActive === index && entity.children.length > 0"
        v-for="(child, childIndex) in entity.children"
        :key="childIndex"
      >
        <td class="td-child">
          <div class="v-table-body">
            <p class="v-table-body-text pl-11">
              {{ child.name }}
            </p>
          </div>
        </td>
        <td class="td-child">
          <ButtonPreview
            v-if="child.document"
            @click="preview(child.document)"
          />
          <div v-else class="text-center">-</div>
        </td>
      </tr>
    </template>
  </Table>
</template>
