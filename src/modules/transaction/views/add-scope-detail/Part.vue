<script setup lang="ts">
import type { AxiosError } from "axios";
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";

import {
  Breadcrumb,
  Button,
  Icon,
  ModalDelete,
  Table,
  Toast,
} from "@/components";
import { useMutation, useQuery } from "@tanstack/vue-query";
import type { IPagination } from "@/types/GlobalType";
import type { BreadcrumbType } from "@/components/navigations/Breadcrumb.vue";
import type {
  PartStdCreateModelInterface,
  PartStdInterface,
} from "@/modules/master/types/PartStdType";
import { ColumnsPart } from "@/modules/transaction/constants/PartConstant";
import { useTransactionStore } from "@/modules/transaction/stores/TransactionStore";
import FilterPartStd from "@/modules/transaction/components/add-scope/FilterPartStd.vue";
import FormPartStd from "@/modules/transaction/components/FormPartStd.vue";
import type { ProjectInterface } from "../../types/ProjectType";

const transactionStore = useTransactionStore();
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
    {
      group: "AND",
      operator: "EQ",
      column: "activity.original_uuid",
      value: "",
    },
  ],
  currentPage: 1,
  perPage: 10,
});
const total_item = ref(0);
const toastRef = ref<InstanceType<typeof Toast> | null>(null);
const timeout = ref(0);
const dataForm = ref<PartStdCreateModelInterface | null>(null);
const selected_item = ref<PartStdInterface | null>(null);
const breadcrumb = ref<BreadcrumbType[]>([]);
const open_form = ref(false);
const open_delete = ref(false);

//--- GET STATUS APPROVAL
const { data: dataApproval } = useQuery({
  queryKey: ["getApprovalAtManpowerPart"],
  queryFn: async () => {
    const { data } = await transactionStore.getProject(
      route.params.id_project as string
    );
    const response = data.data.data as ProjectInterface;

    return response;
  },
  retry: 0,
  refetchOnWindowFocus: false,
});
//--- END

//--- GET PART STD
const {
  data: dataPart,
  isFetching: isLoadingPart,
  refetch: refetchPart,
} = useQuery({
  queryKey: ["getPart"],
  queryFn: async () => {
    try {
      const { data } = await transactionStore.getPart(params);
      const response = data as IPagination<PartStdInterface[]>;

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

//--- DELETE PART STD
const { mutate: deletePartStd, isPending: isLoadingDelete } = useMutation({
  mutationFn: async (id: string) => {
    return await transactionStore.deletePartStd(id);
  },
  onSuccess: () => {
    toastRef.value?.showToast({
      title: "Success",
      description: "Deleted successfully",
      type: "success",
    });
    open_delete.value = false;
    refetchPart();
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

const handleSuccess = () => {
  toastRef.value?.showToast({
    title: "Success",
    description: "Saved successfully",
    type: "success",
  });
  params.currentPage = 1;
  refetchPart();
};

const handleError = (error: any) => {
  toastRef.value?.showToast({
    title: "Error",
    description: error?.response?.data?.message || "Something went wrong",
    type: "error",
  });
};

const handleCreate = () => {
  selected_item.value = null;
  open_form.value = true;
};

const handleUpdate = (item: PartStdInterface) => {
  selected_item.value = item;
  open_form.value = true;
};

const handleDelete = (item: PartStdInterface) => {
  selected_item.value = item;
  open_delete.value = true;
};

const onDelete = () => {
  deletePartStd(selected_item.value?.uuid as string);
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
      column: "activity.equipment.scopeStandart.project_uuid",
      value: route.params.id_project,
    },
    {
      group: "AND",
      operator: "EQ",
      column: "activity.original_uuid",
      value: "",
    },
  ];
};

const handleOnFilter = (data: PartStdCreateModelInterface) => {
  dataForm.value = data;
  setFilter();
  refetchPart();
};

const handleResetFilter = () => {
  resetFilter();
  refetchPart();
};

const handleRemoveSuccess = () => {
  refetchPart();
};

onMounted(() => {
  breadcrumb.value = [
    {
      name: "Part Std",
      as_link: false,
      url: "",
    },
  ];
});
</script>

<template>
  <div class="relative w-full">
    <Button
      v-if="dataForm?.activity_uuid && dataApproval?.status !== 'approve'"
      icon_only="plus"
      class="absolute right-0"
      size="sm"
      rounded="full"
      color="blue"
      @click="handleCreate"
    />

    <div class="flex gap-8">
      <div class="basis-1/5">
        <FilterPartStd
          @filter="handleOnFilter"
          @reset-filter="handleResetFilter"
          :loading="isLoadingPart"
        />
      </div>
      <div class="flex-1 overflow-auto">
        <div class="max-w-full min-w-full">
          <Breadcrumb :items="breadcrumb" />
          <Table
            label-create="Part"
            :columns="ColumnsPart"
            :entities="dataPart?.data || []"
            :loading="isLoadingPart"
            :pagination="pagination"
            :is-create="false"
            :is-action="dataApproval?.status !== 'approve'"
            class="mt-6"
            v-model:model-search="params.search"
            @change-page="changePage"
            @change-limit="changeLimit"
            @search="searchTable"
          >
            <template #column_action="{ entity }">
              <div class="flex items-center justify-center gap-4">
                <Icon
                  name="pencil"
                  class="icon-action-table"
                  @click="handleUpdate(entity)"
                />
                <Icon
                  name="trash"
                  class="icon-action-table"
                  @click="handleDelete(entity)"
                />
              </div>
            </template>
            <template #column_part="{ entity }">
              <p
                class="text-base text-neutral-50 text-left underline cursor-pointer"
              >
                {{ entity.part?.name ?? "-" }}
              </p>
            </template>

            <template #column_unit="{ entity }">
              <p
                class="text-base text-neutral-50 text-left underline cursor-pointer"
              >
                {{ entity.part?.global_unit?.name ?? "-" }}
              </p>
            </template>

            <template #column_number_drawing="{ entity }">
              <p
                class="text-base text-neutral-50 text-left underline cursor-pointer"
              >
                {{ entity.part?.no_drawing ?? "-" }}
              </p>
            </template>
          </Table>
        </div>
      </div>
    </div>
  </div>

  <Toast ref="toastRef" />
  <FormPartStd
    v-model="open_form"
    :data-form="dataForm"
    :selected-value="selected_item"
    @success="handleSuccess"
    @error="handleError"
    @removeSucess="handleRemoveSuccess"
  />
  <ModalDelete
    v-model="open_delete"
    :title="selected_item?.part?.name"
    :loading="isLoadingDelete"
    @delete="onDelete"
  />
</template>
