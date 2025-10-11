<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import type { AxiosError } from "axios";

import type { IPagination } from "@/types/GlobalType";
import { ModalDelete, Table, Toast } from "@/components";
import { useMutation, useQuery } from "@tanstack/vue-query";
import { useTransactionStore } from "@/modules/transaction/stores/TransactionStore";
import { ColumnsAddScopeDetailScope } from "@/modules/transaction/constants/AddScope";

import type {
  ResponseScopeInterface,
  ScopeInterface,
} from "../../../types/ScopeType";

const entitiesScope = ref<ScopeInterface[]>([]);
const selected_item = ref<ScopeInterface>();

const transactionStore = useTransactionStore();
const route = useRoute();
const params = reactive({
  search: "",
  filters: `category,instrument&additional_scope_uuid,${route.params.id_scope}`,
  currentPage: 1,
  perPage: 10,
});
const total_item = ref(0);
const toastRef = ref<InstanceType<typeof Toast> | null>(null);
const open_delete = ref(false);

//--- GET SCOPE
const {
  data: dataScope,
  isFetching: isLoadingScope,
  refetch: refetchScope,
} = useQuery({
  queryKey: ["getAddScopeScopeInstrument"],
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

//--- DELETE SCOPE
const { mutate: deleteScope, isPending: isLoadingDelete } = useMutation({
  mutationFn: async (id: string) => {
    return await transactionStore.deleteScopeStandar(id);
  },
  onSuccess: () => {
    refetchScope();
    toastRef.value?.showToast({
      title: "Success",
      description: "Deleted successfully",
      type: "success",
    });
    open_delete.value = false;
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
  refetchScope();
};

const changeLimit = (e: string) => {
  params.perPage = parseInt(e);
  params.currentPage = 1;
  refetchScope();
};

// const saveAssetWelness = (
//   e: { color: string; result: { id: number; note: string }[] },
//   entity: ScopeInterface
// ) => {
//   const duplicate_data = [...entitiesScope.value];
//   const find_index = entitiesScope.value.findIndex(
//     (item) => item.id === entity.id
//   );

//   if (find_index !== -1) {
//     duplicate_data[find_index].asset_welness = {
//       color: e.color,
//       result: e.result,
//     };
//     entitiesScope.value = duplicate_data;
//   }
// };

// const saveFieldWithFile = (
//   e: { result: { id: number; note: string }[]; file: ValueUploadType[] },
//   entity: ScopeInterface,
//   field: string
// ) => {
//   const duplicate_data = [...entitiesScope.value];
//   const find_index = entitiesScope.value.findIndex(
//     (item) => item.id === entity.id
//   );

//   if (find_index !== -1) {
//     if (field === "oh_recom") {
//       duplicate_data[find_index].oh_recom = {
//         result: e.result,
//         file: e.file,
//       };
//     } else if (field === "wo_priority") {
//       duplicate_data[find_index].wo_priority = {
//         result: e.result,
//         file: e.file,
//       };
//     } else if (field === "history") {
//       duplicate_data[find_index].history = {
//         result: e.result,
//         file: e.file,
//       };
//     } else if (field === "rla") {
//       duplicate_data[find_index].rla = {
//         result: e.result,
//         file: e.file,
//       };
//     } else if (field === "etc") {
//       duplicate_data[find_index].etc = {
//         result: e.result,
//         file: e.file,
//       };
//     }
//     entitiesScope.value = duplicate_data;
//   }
// };

const handleDelete = (e: ScopeInterface) => {
  selected_item.value = e;
  open_delete.value = true;
};

const onDelete = () => {
  // entitiesScope.value = entitiesScope.value.filter((item) => item.id !== e.id);
  deleteScope(selected_item.value?.id as string);
};
</script>

<template>
  <Toast ref="toastRef" />
  <ModalDelete
    v-model="open_delete"
    :title="selected_item?.asset"
    :loading="isLoadingDelete"
    @delete="onDelete"
  />
  <Table
    label-create="Asset"
    :columns="ColumnsAddScopeDetailScope"
    :entities="entitiesScope"
    :loading="isLoadingScope"
    :pagination="pagination"
    :is-create="false"
    @delete="handleDelete"
    @change-page="changePage"
    @change-limit="changeLimit"
  >
    <template #children="{ entity, index, parentActive }">
      <tr v-if="parentActive === index && entity.children.length === 0">
        <td :colspan="ColumnsAddScopeDetailScope.length + 1" class="td-child">
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
        <td :colspan="ColumnsAddScopeDetailScope.length + 1" class="td-child">
          <div class="v-table-body">
            <p class="v-table-body-text pl-11">
              {{ child.name }}
            </p>
          </div>
        </td>
      </tr>
    </template>
  </Table>
  <!-- <p class="font-bold text-black text-2xl">TEST</p> -->
</template>
