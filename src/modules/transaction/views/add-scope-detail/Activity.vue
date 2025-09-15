<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import type { AxiosError } from "axios";
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
import { ColumnsActivity } from "@/modules/master/constants/ActivityConstant";
import type {
  ActivityInterface,
  ActivityModelCreateInterface,
} from "@/modules/master/types/AcitivityType";
import FormActivity from "@/modules/transaction/components/FormActivity.vue";
import FilterActivity from "@/modules/transaction/components/add-scope/FilterActivity.vue";
import { useTransactionStore } from "@/modules/transaction/stores/TransactionStore";

import type { ProjectInterface } from "../../types/ProjectType";
import FormAdActivity from "../../components/add-scope/FormAdActivity.vue";

const route = useRoute();
const dataForm = ref<ActivityModelCreateInterface | null>(null);
const transactionStore = useTransactionStore();
const total_item = ref(0);
const params = reactive({
  search: "",
  filter: "",
  filters: [
    {
      group: "AND",
      operator: "EQ",
      column: "equipment.scopeStandart.additional_scope_uuid",
      value: route.params.id_scope,
    },
    {
      group: "AND",
      operator: "EQ",
      column: "equipment_uuid",
      value: "",
    },
  ],
  currentPage: 1,
  perPage: 10,
});
const open_form = ref(false);
const open_delete = ref(false);
const selected_item = ref<ActivityInterface | null>(null);
const toastRef = ref<InstanceType<typeof Toast> | null>(null);
const timeout = ref(0);
const breadcrumb = ref<BreadcrumbType[]>([]);

//--- GET STATUS APPROVAL
const { data: dataApproval } = useQuery({
  queryKey: ["getApprovalAtActivityAddScope"],
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

//--- GET ACTIVITY
const {
  data: dataActivity,
  isFetching: isLoadingActivity,
  refetch: refetchActivity,
} = useQuery({
  queryKey: ["getActivityTransaction"],
  queryFn: async () => {
    try {
      const { data } = await transactionStore.getActivity(params);
      const response = data.data as IPagination<ActivityInterface[]>;

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

//--- DELETE ACTIVITY
const { mutate: deleteActivity, isPending: isLoadingDelete } = useMutation({
  mutationFn: async (id: string) => {
    return await transactionStore.deleteActivity(id);
  },
  onSuccess: () => {
    toastRef.value?.showToast({
      title: "Success",
      description: "Deleted successfully",
      type: "success",
    });
    open_delete.value = false;
    refetchActivity();
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
  refetchActivity();
};

const changeLimit = (e: string) => {
  params.perPage = parseInt(e);
  params.currentPage = 1;
  refetchActivity();
};

const searchTable = () => {
  clearTimeout(timeout.value);
  timeout.value = window.setTimeout(() => {
    params.currentPage = 1;
    refetchActivity();
  }, 1000);
};

const handleSuccess = () => {
  toastRef.value?.showToast({
    title: "Success",
    description: "Saved successfully",
    type: "success",
  });
  params.currentPage = 1;
  refetchActivity();
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

const handleDelete = (item: ActivityInterface) => {
  selected_item.value = item;
  open_delete.value = true;
};

const onDelete = () => {
  deleteActivity(selected_item.value?.uuid as string);
};

const setFilter = () => {
  console.log(dataForm, "test");
  params.filters = [
    {
      group: "AND",
      operator: "EQ",
      column: "equipment.scopeStandart.additional_scope_uuid",
      value: route.params.id_scope,
    },
    {
      group: "AND",
      operator: "EQ",
      column: "equipment_uuid",
      value: String(dataForm.value?.equipment_uuid),
    },
  ];
};

const resetFilter = () => {
  dataForm.value = null;
  params.filters = [
    {
      group: "AND",
      operator: "EQ",
      column: "equipment.scopeStandart.additional_scope_uuid",
      value: route.params.id_scope,
    },
    {
      group: "AND",
      operator: "EQ",
      column: "equipment_uuid",
      value: "",
    },
  ];
};

const handleOnFilter = (data: ActivityModelCreateInterface) => {
  dataForm.value = data;
  setFilter();
  refetchActivity();
};

const handleResetFilter = () => {
  resetFilter();
  refetchActivity();
};

const handleRemoveSuccess = () => {
  refetchActivity();
};

onMounted(() => {
  breadcrumb.value = [
    {
      name: "Activity",
      as_link: false,
      url: "",
    },
  ];
});
</script>

<template>
  <div class="relative w-full">
    <Button v-if="dataForm?.equipment_uuid && dataApproval?.status !== 'approve'" icon_only="plus"
      class="absolute right-0" size="sm" rounded="full" color="blue" @click="handleCreate" />

    <div class="flex gap-8">
      <div class="w-[330px]">
        <FilterActivity @filter="handleOnFilter" @reset-filter="handleResetFilter" :loading="isLoadingActivity" />
      </div>
      <div class="w-full">
        <Breadcrumb :items="breadcrumb" />
        <Table label-create="Sub Bidang" :columns="ColumnsActivity" :entities="dataActivity?.data || []"
          :loading="isLoadingActivity" :pagination="pagination" :is-create="false"
          :is-action="dataApproval?.status !== 'approve'" v-model:model-search="params.search" class="mt-6"
          @change-page="changePage" @change-limit="changeLimit" @search="searchTable">
          <template #column_action="{ entity }">
            <div class="flex items-center justify-center gap-4">
              <Icon name="trash" class="icon-action-table" @click="handleDelete(entity)" />
            </div>
          </template>
          <template #column_equipment="{ entity }">
            <p class="text-base text-neutral-50 text-left">
              {{ entity.equipment?.name }}
            </p>
          </template>
        </Table>
      </div>
    </div>

    <FormAdActivity v-model="open_form" :data-form="dataForm" :selected-value="selected_item" @success="handleSuccess"
      @error="handleError" @removeSucess="handleRemoveSuccess" />
  </div>

  <Toast ref="toastRef" />
  <ModalDelete v-model="open_delete" :title="selected_item?.name" :loading="isLoadingDelete" @delete="onDelete" />
</template>

<style lang="sass"></style>
