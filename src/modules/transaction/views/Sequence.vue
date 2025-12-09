<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { AxiosError } from "axios";

import { Breadcrumb, Table } from "@/components";
import { useQuery } from "@tanstack/vue-query";
import type {
  IPagination,
  ResponseDocumentInterface,
} from "@/types/GlobalType";
import type { BreadcrumbType } from "@/components/navigations/Breadcrumb.vue";

import { useMasterStore } from "@/modules/master/stores/MasterStore";
import type { SequenceInterface } from "@/modules/master/types/SequenceTypes";
import { ColumnSequence } from "@/modules/master/constants/SequenceConstant";
import { useRoute } from "vue-router";
import ModalPlay from "@/components/overlays/ModalPlay.vue";

const masterStore = useMasterStore();
const total_item = ref(0);
const open_modal = ref(false);
const documentRef = ref<ResponseDocumentInterface | undefined>(undefined);
const params = reactive({
  search: "",
  filter: "",
  filters: [],
  currentPage: 1,
  perPage: 10,
});
const timeout = ref(0);
const breadcrumb = ref<BreadcrumbType[]>([]);
const route = useRoute();

//--- GET HSE
const {
  data: dataSequence,
  isFetching: isLoadingSequence,
  refetch: refetchSequence,
} = useQuery({
  queryKey: ["getSequenceMaster"],
  queryFn: async () => {
    try {
      const { data } = await masterStore.getSequence(params);
      const response = data.data as IPagination<SequenceInterface[]>;

      total_item.value = response.total;

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
  refetchSequence();
};

const changeLimit = (e: string) => {
  params.perPage = parseInt(e);
  params.currentPage = 1;
  refetchSequence();
};

const searchTable = () => {
  clearTimeout(timeout.value);
  timeout.value = window.setTimeout(() => {
    params.currentPage = 1;
    refetchSequence();
  }, 1000);
};

const clickVideo = (document: ResponseDocumentInterface) => {
  console.log(document);
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
      name: ((route.query?.inspection as string) || "").toUpperCase(),
      as_link: false,
      url: "",
    },
    {
      name: "SEQUENCE",
      as_link: false,
      url: "",
    },
  ];
});
</script>

<template>
  <Breadcrumb :items="breadcrumb" />
  <div class="relative w-full mt-6">
    <Table
      label-create="Sub Bidang"
      :columns="ColumnSequence"
      :entities="dataSequence?.data || []"
      :loading="isLoadingSequence"
      :pagination="pagination"
      :is-create="false"
      :is_logging="false"
      v-model:model-search="params.search"
      @change-page="changePage"
      @change-limit="changeLimit"
      @search="searchTable"
      :is-action="false"
    >
      <template #column_document="{ entity }">
        <p
          @click="clickVideo(entity.document)"
          class="text-base text-neutral-50 text-left underline cursor-pointer"
          v-if="entity.document"
        >
          {{ entity.document?.document_name }}
        </p>
        <p v-else class="text-base text-neutral-50 text-center">-</p>
      </template>
    </Table>
  </div>
  <ModalPlay v-model="open_modal" :document="documentRef" />
</template>

<style lang="sass"></style>
