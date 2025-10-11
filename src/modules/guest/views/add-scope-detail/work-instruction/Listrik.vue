<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import type { AxiosError } from "axios";
import { useRoute } from "vue-router";

import { useQuery } from "@tanstack/vue-query";
import { Table } from "@/components";
import type { IPagination } from "@/types/GlobalType";
import { useTransactionStore } from "@/modules/transaction/stores/TransactionStore";
import { ColumnsAddScopeDetailWorkInstruction } from "@/modules/transaction/constants/AddScope";

import type {
  ResponseScopeInterface,
  ScopeInterface,
} from "../../../types/ScopeType";

const entitiesScope = ref<ScopeInterface[]>([]);

const transactionStore = useTransactionStore();
const route = useRoute();
const params = reactive({
  search: "",
  filters: `category,listrik&additional_scope_uuid,${route.params.id_scope}`,
  currentPage: 1,
  perPage: 10,
});
const total_item = ref(0);

//--- GET SCOPE
const {
  data: dataScope,
  isFetching: isLoadingScope,
  refetch: refetchScope,
} = useQuery({
  queryKey: ["getAddScopeWorkInstructionListrik"],
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
</script>

<template>
  <Table
    label-create="Asset"
    :columns="ColumnsAddScopeDetailWorkInstruction"
    :entities="entitiesScope"
    :loading="isLoadingScope"
    :pagination="pagination"
    :is-create="false"
    @change-page="changePage"
    @change-limit="changeLimit"
  >
    <template #column_action><p></p> </template>
    <template #children="{ entity, index, parentActive }">
      <tr v-if="parentActive === index && entity.children.length === 0">
        <td
          :colspan="ColumnsAddScopeDetailWorkInstruction.length + 1"
          class="td-child"
        >
          <div class="v-table-body">
            <p class="v-table-body-text pl-11 text-center">Not Found Data</p>
          </div>
        </td>
      </tr>
      <tr
        v-if="parentActive === index"
        v-for="(child, childIndex) in entity.children"
        :key="childIndex"
      >
        <td
          :colspan="ColumnsAddScopeDetailWorkInstruction.length + 1"
          class="td-child"
        >
          <div class="v-table-body">
            <p class="v-table-body-text pl-11">
              {{ child.name }}
            </p>
          </div>
        </td>
      </tr>
    </template>
  </Table>
</template>
