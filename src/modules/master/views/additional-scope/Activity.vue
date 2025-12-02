<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { AxiosError } from "axios";

import { Breadcrumb, Button, Icon, ModalDelete, Table, Toast } from "@/components";
import { useMutation, useQuery } from "@tanstack/vue-query";
import type { IPagination } from "@/types/GlobalType";

import { ColumnsActivity } from "../../constants/ActivityConstant";
import { useMasterStore } from "../../stores/MasterStore";
import type {
  ActivityFilterInterface,
  ActivityInterface,
} from "../../types/AcitivityType";
import FormAdActivity from "../../components/FormAdActivity.vue";
import FilterAdActivity from "../../components/FilterAdActivity.vue";
import { useRoute } from "vue-router";
import ButtonGroup from "../../components/ButtonGroup.vue";
import type { BreadcrumbType } from "@/components/navigations/Breadcrumb.vue";
import { parsedUrl } from "@/helpers/global";

const dataForm = ref<ActivityFilterInterface | null>(null);
const breadcrumb = ref<BreadcrumbType[]>([]);
const masterStore = useMasterStore();
const route = useRoute();
const total_item = ref(0);
const params = reactive({
  search: "",
  filter: "",
  filters: [
    {
      group: "AND",
      operator: "EQ",
      column: "equipment.scopeStandart.additional_scope_uuid",
      value: route.params?.id,
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

//--- GET ACTIVITY
const {
  data: dataActivity,
  isFetching: isLoadingActivity,
  refetch: refetchActivity,
} = useQuery({
  queryKey: ["getActivityMaster"],
  queryFn: async () => {
    try {
      const { data } = await masterStore.getActivity(params, '/add-scope/detail');
      const response = data.data as IPagination<ActivityInterface[]>;

      total_item.value = response.total;

      return response;
    } catch (error: any) {
      const err = error as AxiosError;
      throw err.response;
    }
  },
  refetchOnWindowFocus: false,
  enabled: computed(() =>
    params.filters.some((e) => e.column === "equipment_uuid" && e.value !== "")
  ),
  gcTime: 0,
});
//--- END

//--- DELETE ACTIVITY
const { mutate: deleteActivity, isPending: isLoadingDelete } = useMutation({
  mutationFn: async (id: string) => {
    return await masterStore.deleteActivity(id, '/add-scope/detail');
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

//--- DOWNLOAD
const { mutate: downloadActivity, isPending: isLoadingDownload } = useMutation({
  mutationFn: async () => {
    return await masterStore.downloadActivity(params, '/add-scope/detail');
  },
  onSuccess: () => { },
  onError: (error) => {
    console.log(error);
  },
});
//--- END

//--- DOWNLOAD TEMPLATE
const { mutate: templateActivity, isPending: isLoadingTemplate } = useMutation({
  mutationFn: async () => {
    return await masterStore.templateActivity('/add-scope/detail', {
      filters: params.filters
    });
  },
  onSuccess: () => { },
  onError: (error) => {
    console.log(error);
  },
});
//--- END

//--- IMPORT
const { mutate: importActivity, isPending: isLoadingImport } = useMutation({
  mutationFn: async (payload: File) => {
    return await masterStore.importActivity(payload, '/add-scope/detail');
  },
  onSuccess: () => {
    toastRef.value?.showToast({
      title: "Success",
      description: "Import successfully",
      type: "success",
    });
    refetchActivity();
  },
  onError: (error) => {
    let message = "Something went wrong";

    if (error instanceof AxiosError) {
      message = error?.response?.data?.message || "Something went wrong";
    }

    toastRef.value?.showToast({
      title: "Error",
      description: message,
      type: "error",
    });

    refetchActivity();
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

const handleUpdate = (item: ActivityInterface) => {
  selected_item.value = item;
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
  params.filters = [
    {
      group: "AND",
      operator: "EQ",
      column: "equipment.scopeStandart.additional_scope_uuid",
      value: route.params?.id,
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
      value: route.params?.id,
    },
    {
      group: "AND",
      operator: "EQ",
      column: "equipment_uuid",
      value: "",
    },
  ];
};

const handleOnFilter = (data: ActivityFilterInterface) => {
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

const handleDownload = () => {
  downloadActivity();
};

const handleExportTemplate = () => {
  templateActivity();
};

const handleImport = (file: File) => {
  importActivity(file);
};


onMounted(() => {
  breadcrumb.value = [
    {
      name: String(route.query?.location),
      as_link: false,
      url: "",
    },
    {
      name: String(route.query?.unit),
      as_link: false,
      url: "",
    },
    {
      name: String(route.query?.machine),
      as_link: false,
      url: "",
    },
    {
      name: String(route.query?.inspectionType),
      as_link: false,
      url: "",
    },
    {
      name: String(route.query?.addScope),
      as_link: false,
      url: "",
    },
  ];
});
</script>

<template>
  <Toast ref="toastRef" />
  <ModalDelete v-model="open_delete" :title="selected_item?.name" :loading="isLoadingDelete" @delete="onDelete" />

  <div class="relative w-full">
    <div class="flex items-center gap-2 absolute right-0 top-10">
      <ButtonGroup :loading-import="isLoadingImport" :loading-download="isLoadingDownload"
        :loading-template="isLoadingTemplate" @download="handleDownload" @template="handleExportTemplate"
        @import="handleImport" />
      <Button v-if="dataForm?.equipment_uuid" icon_only="plus" size="sm" rounded="full" color="blue"
        @click="handleCreate" />
    </div>

    <div class="flex gap-8">
      <div class="w-[330px]">
        <FilterAdActivity @filter="handleOnFilter" @reset-filter="handleResetFilter" :loading="isLoadingActivity" />
      </div>
      <div class="w-full">
        <Breadcrumb :items="breadcrumb" class="mb-6" />
        <Table label-create="Sub Bidang" :columns="ColumnsActivity" :entities="dataActivity?.data || []"
          :loading="isLoadingActivity" :pagination="pagination" :is-create="false" v-model:model-search="params.search"
          @change-page="changePage" @change-limit="changeLimit" @search="searchTable">
          <template #column_action="{ entity }">
            <div class="flex items-center justify-center gap-4">
              <Icon name="pencil" class="icon-action-table" @click="handleUpdate(entity)" />
              <Icon name="trash" class="icon-action-table" @click="handleDelete(entity)"
                v-show="Number(entity.has_transaction) == 0" />
            </div>
          </template>
          <template #column_equipment="{ entity }">
            <p class="text-base text-neutral-50 text-left">
              {{ entity.equipment?.name }}
            </p>
          </template>
          <template #column_ik_link="{ entity }">
            <a target="_blank" :href="entity.link_ik1" class="text-base text-neutral-50 text-left"
              v-if="entity.link_ik1">
              {{ entity.link_ik1 ?? '-' }}
            </a>
            <span v-else>-</span>
          </template>
          <template #column_ik_doc="{ entity }">
            <a target="_blank" :href="parsedUrl(entity.document.document_link)"
              class="text-base text-neutral-50 text-left" v-if="entity.document">
              {{ entity.document?.document_name }}
            </a>
            <span v-else>-</span>
          </template>
        </Table>
      </div>
    </div>

    <FormAdActivity v-model="open_form" :data-form="dataForm" :selected-value="selected_item" @success="handleSuccess"
      @error="handleError" @removeSucess="handleRemoveSuccess" />
  </div>
</template>

<style lang="sass"></style>
