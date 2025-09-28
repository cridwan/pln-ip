<script setup lang="ts">
import type { AxiosError } from "axios";
import { computed, onMounted, reactive, ref, watch } from "vue";
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
  FilterPartStdInterface,
  PartStdInterface,
} from "@/modules/master/types/PartStdType";
import type { ActivityInterface } from "@/modules/master/types/AcitivityType";

import { ColumnsPart } from "../constants/PartConstant";
import { useTransactionStore } from "../stores/TransactionStore";
import FilterPartStd from "../components/FilterPartStd.vue";
import FormPartStd from "../components/FormPartStd.vue";
import type { ProjectInterface } from "../types/ProjectType";
import InputQty from "../components/InputQty.vue";

type OptionType = {
  value: string;
  label: string;
};
const transactionStore = useTransactionStore();
const route = useRoute();
const params = reactive({
  search: "",
  filter: "",
  filters: [
    {
      group: "AND",
      operator: "EQ",
      column: "activity.equipment.scopeStandart.project_uuid",
      value: route.params.id_project,
    },
  ],
  currentPage: 1,
  perPage: 10,
});
const total_item = ref(0);
const toastRef = ref<InstanceType<typeof Toast> | null>(null);
const timeout = ref(0);
const dataForm = ref<FilterPartStdInterface | null>(null);
const dataActivity = ref<ActivityInterface | null>(null);
const selected_item = ref<PartStdInterface | null>(null);
const breadcrumb = ref<BreadcrumbType[]>([]);
const open_form = ref(false);
const open_delete = ref(false);
const edit_qty = ref(false);
const edit_id = ref<number | null>(null);
const is_loading_filter = ref(false);

//--- GET STATUS APPROVAL
const { data: dataApproval } = useQuery({
  queryKey: ["getApprovalAtPartStandart"],
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
  queryKey: ["getPartStdTransaction"],
  queryFn: async () => {
    try {
      const { data } = await transactionStore.getPart(params);
      const response = data as IPagination<PartStdInterface[]>;
      total_item.value = response.total;
      is_loading_filter.value = false;

      return response;
    } catch (error: any) {
      const err = error as AxiosError;
      is_loading_filter.value = false;
      throw err.response;
    }
  },
  retry: 0,
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
  retry: 0,
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

const handleUpdate = (index: number) => {
  // selected_item.value = item;
  // open_form.value = true;
  edit_qty.value = !edit_qty.value;
  edit_id.value = index;
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
      column: "activity.equipment.scopeStandart.project_uuid",
      value: route.params.id_project,
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
  dataActivity.value = null;
  params.filters = [
    {
      group: "AND",
      operator: "EQ",
      column: "activity.equipment.scopeStandart.project_uuid",
      value: route.params.id_project,
    },
  ];
};

const handleOnFilter = (
  data: FilterPartStdInterface,
  activity: ActivityInterface
) => {
  is_loading_filter.value = true;
  dataForm.value = data;
  dataActivity.value = activity;
  setFilter();
  refetchPart();
};

const handleResetFilter = () => {
  is_loading_filter.value = true;
  resetFilter();
  refetchPart();
};

const handleRemoveSuccess = () => {
  refetchPart();
};

const handleEdit = (value: string) => {
  edit_id.value = null;
  edit_qty.value = false;
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
          :loading="is_loading_filter"
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
                  name="trash"
                  class="icon-action-table"
                  @click="handleDelete(entity)"
                />
              </div>
            </template>

            <template #column_part="{ entity }">
              <p class="text-neutral-50">
                {{ entity.part?.name ?? "-" }}
              </p>
            </template>

            <template #column_total_qty="{ entity, index }">
              <InputQty
                :qty="Number(entity.total_qty)"
                v-if="edit_qty && edit_id == index"
                @change="handleEdit"
              />
              <p
                class="text-base text-neutral-50 text-left underline cursor-pointer"
                v-else
                @click="handleUpdate(index)"
              >
                {{ Number(entity.total_qty)?.toLocaleString("id") ?? "-" }}
              </p>
            </template>
            <template #column_price="{ entity, index }">
              <InputQty
                :qty="Number(entity.total_qty)"
                v-if="edit_qty && edit_id == index"
                @change="handleEdit"
              />
              <p
                class="text-base text-neutral-50 text-left underline cursor-pointer"
                v-else
                @click="handleUpdate(index)"
              >
                Rp. {{ Number(entity.part.price)?.toLocaleString("id") ?? "-" }}
              </p>
            </template>
            <template #column_total="{ entity, index }">
              <InputQty
                :qty="Number(entity.total_qty)"
                v-if="edit_qty && edit_id == index"
                @change="handleEdit"
              />
              <p
                class="text-base text-neutral-50 text-left underline cursor-pointer"
                v-else
                @click="handleUpdate(index)"
              >
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
