<script setup lang="ts">
import type { AxiosError } from "axios";
import { computed, reactive, ref } from "vue";
import { useRoute } from "vue-router";

import { Table, Toast } from "@/components";
import { useMutation, useQuery } from "@tanstack/vue-query";
import type { IPagination } from "@/types/GlobalType";

import { ColumnsTools } from "../../constants/ToolsConstant";
import FormQuantity from "../../components/FormQuantity.vue";
import type {
  ResponseToolsInterface,
  ToolsInterface,
  UpdateToolsInterface,
} from "../../types/ToolsType";
import { useTransactionStore } from "../../stores/TransactionStore";

const entitiesTools = ref<ToolsInterface[]>([]);

const transactionStore = useTransactionStore();
const route = useRoute();
const params = reactive({
  search: "",
  filter: `additional_scope_uuid,${route.params.id_scope}`,
  currentPage: 1,
  perPage: 10,
});
const total_item = ref(0);
const toastRef = ref<InstanceType<typeof Toast> | null>(null);
const quantity = ref<any>(null);
const timeout = ref(0);

//--- GET TOOLS
const {
  data: dataTools,
  isFetching: isLoadingTools,
  refetch: refetchTools,
} = useQuery({
  queryKey: ["getTools"],
  queryFn: async () => {
    try {
      const { data } = await transactionStore.getTools(params);
      const response = data as IPagination<ResponseToolsInterface[]>;

      total_item.value = response.total;

      const new_arr: ToolsInterface[] =
        response.data?.map((item) => {
          return {
            id: item.uuid,
            tool: item.name,
            quantity: item.qty.toString(),
            unit: item.global_unit?.name,
            section: item.section,
            global_unit_uuid: item.global_unit_uuid,
            project_uuid: item.project_uuid,
            additional_scope_uuid: item.additional_scope_uuid,
          };
        }) || [];
      entitiesTools.value = new_arr;

      return response;
    } catch (error: any) {
      const err = error as AxiosError;
      throw err.response;
    }
  },
  refetchOnWindowFocus: false,
});
//--- END

//--- UPDATE TOOLS
const { mutate: updateTools, isPending: isLoadingUpdate } = useMutation({
  mutationFn: async ({
    payload,
    id,
  }: {
    payload: UpdateToolsInterface;
    id: string;
  }) => {
    return await transactionStore.updateTools(payload, id);
  },
  onSuccess: async () => {
    refetchTools();
    quantity.value.modelOpenInputData = false;
    toastRef.value?.showToast({
      title: "Success",
      description: "Saved successfully",
      type: "success",
    });
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
  refetchTools();
};

const changeLimit = (e: string) => {
  params.perPage = parseInt(e);
  params.currentPage = 1;
  refetchTools();
};

const saveQuantity = (e: { quantity: string }, entity: ToolsInterface) => {
  updateTools({
    id: entity.id,
    payload: {
      name: entity.tool,
      qty: parseFloat(e.quantity),
      section: entity.section,
      additional_scope_uuid: entity.additional_scope_uuid,
      global_unit_uuid: entity.global_unit_uuid,
      project_uuid: entity.project_uuid,
    },
  });
};

function searchTable() {
  clearTimeout(timeout.value);
  timeout.value = window.setTimeout(() => {
    params.currentPage = 1;
    refetchTools();
  }, 1000);
}
</script>

<template>
  <Toast ref="toastRef" />
  <Table
    label-create="Tools"
    :columns="ColumnsTools"
    :entities="entitiesTools"
    :loading="isLoadingTools"
    :pagination="pagination"
    :is-create="false"
    :is-action="false"
    v-model:model-search="params.search"
    @change-page="changePage"
    @change-limit="changeLimit"
    @search="searchTable"
  >
    <!-- <template #column_document="{ entity }">
      <div class="w-full flex justify-center">
        <FormUploadOnly
          :value="entity.document"
          :label="entity.part"
          @save="(e) => saveFile(e, entity)"
        />
      </div>
    </template> -->
    <template #column_quantity="{ entity }">
      <div class="w-full flex justify-center">
        <FormQuantity
          ref="quantity"
          :value="entity.quantity || ''"
          :label="entity.tool"
          :loading="isLoadingUpdate"
          @save="(e) => saveQuantity(e, entity)"
        />
      </div>
    </template>
    <template #column_unit="{ entity }">
      <div class="w-full flex justify-center">
        <div
          class="border border-neutral-50 rounded-lg px-2 min-w-[100px] text-base text-neutral-50 text-center"
        >
          {{ entity.unit }}
        </div>
      </div>
    </template>
    <!-- <template #column_volume="{ entity }">
      <div class="w-full flex justify-center">
        <Volume
          type="part"
          :value="entity.volume || ''"
          @save="(e) => saveVolume(e, entity)"
        />
      </div>
    </template> -->
  </Table>
</template>
