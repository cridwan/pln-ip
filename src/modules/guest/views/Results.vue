<script setup lang="ts">
import { ref } from "vue";
import type { AxiosError } from "axios";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";

import { Loading, Table } from "@/components";
import { useQuery } from "@tanstack/vue-query";
import { useAuthStore } from "@/modules/auth/stores/AuthStore";

import type { ResultsInterface } from "../types/ResultsType";
import { ColumnsResults } from "../constants/ResultsConstant";
import { useTransactionStore } from "../stores/TransactionStore";

const Data = ref<ResultsInterface[]>([
  {
    id: 2,
    uuid: "scope",
    manpower: "Scope",
  },
  {
    id: 3,
    uuid: "consumable_material",
    manpower: "Consumable Material",
  },
  {
    id: 4,
    uuid: "part_list",
    manpower: "Part List",
  },
  {
    id: 5,
    uuid: "manpower",
    manpower: "Manpower",
  },
]);

const authStore = useAuthStore();
const { access_token } = storeToRefs(authStore);
const transactionStore = useTransactionStore();
const route = useRoute();
const is_loading = ref<string | null>(null);

//--- DOWNLOAD BUDGET ACTIVITY
const { refetch: refetchDownloadBudgetActivity } = useQuery({
  queryKey: ["downloadResultBudgetActivity"],
  queryFn: async () => {
    try {
      await transactionStore.getDownloadResultBudgetActivity(
        route.params.id_project as string
      );
      is_loading.value = null;

      return true;
    } catch (error: any) {
      const err = error as AxiosError;
      is_loading.value = null;

      throw err.response;
    }
  },
  enabled: false,
  retry: 0,
  refetchOnWindowFocus: false,
});
//--- END

//--- DOWNLOAD SCOPE
const { refetch: refetchDownloadScope } = useQuery({
  queryKey: ["downloadResultScope"],
  queryFn: async () => {
    try {
      await transactionStore.getDownloadResultScope(
        route.params.menu as string
      );
      is_loading.value = null;

      return true;
    } catch (error: any) {
      const err = error as AxiosError;
      is_loading.value = null;

      throw err.response;
    }
  },
  enabled: false,
  retry: 0,
  refetchOnWindowFocus: false,
});
//--- END

//--- DOWNLOAD CONSMAT
const { refetch: refetchDownloadConsMat } = useQuery({
  queryKey: ["downloadResultConsMat"],
  queryFn: async () => {
    try {
      await transactionStore.getDownloadResultConsMat(
        route.params.menu as string
      );
      is_loading.value = null;

      return true;
    } catch (error: any) {
      const err = error as AxiosError;
      is_loading.value = null;

      throw err.response;
    }
  },
  enabled: false,
  retry: 0,
  refetchOnWindowFocus: false,
});
//--- END

//--- DOWNLOAD PART
const { refetch: refetchDownloadPart } = useQuery({
  queryKey: ["downloadResultPart"],
  queryFn: async () => {
    try {
      await transactionStore.getDownloadResultPart(
        route.params.menu as string
      );
      is_loading.value = null;

      return true;
    } catch (error: any) {
      const err = error as AxiosError;
      is_loading.value = null;

      throw err.response;
    }
  },
  enabled: false,
  retry: 0,
  refetchOnWindowFocus: false,
});
//--- END

//--- DOWNLOAD MANPOWER
const { refetch: refetchDownloadManpower } = useQuery({
  queryKey: ["downloadResultManpower"],
  queryFn: async () => {
    try {
      await transactionStore.getDownloadResultManpower(
        route.params.menu as string
      );
      is_loading.value = null;

      return true;
    } catch (error: any) {
      const err = error as AxiosError;
      is_loading.value = null;

      throw err.response;
    }
  },
  enabled: false,
  retry: 0,
  refetchOnWindowFocus: false,
});
//--- END

//--- DOWNLOAD TOOLS
const { refetch: refetchDownloadTools } = useQuery({
  queryKey: ["downloadResultTools"],
  queryFn: async () => {
    try {
      await transactionStore.getDownloadResultTools(
        route.params.id_project as string
      );
      is_loading.value = null;

      return true;
    } catch (error: any) {
      const err = error as AxiosError;
      is_loading.value = null;

      throw err.response;
    }
  },
  enabled: false,
  retry: 0,
  refetchOnWindowFocus: false,
});
//--- END

//--- DOWNLOAD HSE
const { refetch: refetchDownloadHse } = useQuery({
  queryKey: ["downloadResultHse"],
  queryFn: async () => {
    try {
      await transactionStore.getDownloadResultHse(
        route.params.id_project as string
      );
      is_loading.value = null;

      return true;
    } catch (error: any) {
      const err = error as AxiosError;
      is_loading.value = null;

      throw err.response;
    }
  },
  enabled: false,
  retry: 0,
  refetchOnWindowFocus: false,
});
//--- END

//--- DOWNLOAD QC PLAN
const { refetch: refetchDownloadQcPlan } = useQuery({
  queryKey: ["downloadResultQcPlan"],
  queryFn: async () => {
    try {
      await transactionStore.getDownloadResultQcPlan(
        route.params.id_project as string
      );
      is_loading.value = null;

      return true;
    } catch (error: any) {
      const err = error as AxiosError;
      is_loading.value = null;

      throw err.response;
    }
  },
  enabled: false,
  retry: 0,
  refetchOnWindowFocus: false,
});
//--- END

const handleDownload = (item: ResultsInterface) => {
  is_loading.value = item.uuid;

  switch (item.uuid) {
    case "budget_activity":
      refetchDownloadBudgetActivity();
      break;

    case "scope":
      refetchDownloadScope();
      break;

    case "consumable_material":
      refetchDownloadConsMat();
      break;

    case "part_list":
      refetchDownloadPart();
      break;

    case "manpower":
      refetchDownloadManpower();
      break;

    case "tools":
      refetchDownloadTools();
      break;

    case "hse":
      refetchDownloadHse();
      break;

    case "qc_plan":
      refetchDownloadQcPlan();
      break;
  }
};
</script>

<template>
  <p class="text-center w-full font-bold text-2xl text-blue-900 mb-10">
    REPORT
  </p>
  <Table :is-create="false" :is-search="false" :is-action="false" :columns="ColumnsResults" :entities="Data"
    :is-pagination="false">
    <template #column_download="{ entity }">
      <div class="flex justify-center">
        <button class="button-download" @click="handleDownload(entity)">
          <Loading v-if="is_loading === entity.uuid" width="10" height="10" />
          Download
        </button>
      </div>
    </template>
  </Table>
</template>

<style lang="sass">
.button-download
  @apply flex items-center justify-center py-1 gap-2 bg-transparent border border-neutral-50 rounded-lg px-2 min-w-[100px] text-base text-neutral-50 hover:bg-cyan-500
</style>
