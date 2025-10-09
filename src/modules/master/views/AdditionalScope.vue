<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import type { AxiosError } from "axios";
import { useRouter } from "vue-router";

import {
  Breadcrumb,
  Button,
  Icon,
  ModalDelete,
  Table,
  Toast,
} from "@/components";
import { useMutation, useQuery } from "@tanstack/vue-query";
import type { IPagination, IParams } from "@/types/GlobalType";
import type { BreadcrumbType } from "@/components/navigations/Breadcrumb.vue";

import { ColumnsAdditionalScope } from "../constants/AdditionalScopeConstant";
import type {
  AdditionalScopeFilterInterface,
  AdditionalScopeInterface,
} from "../types/AdditionalScopeType";
import { useMasterStore } from "../stores/MasterStore";
import FormAdditionalScope from "../components/FormAdditionalScope.vue";
import FilterAdditionalScope from "../components/FilterAdditionalScope.vue";
import ButtonGroup from "../components/ButtonGroup.vue";

const masterStore = useMasterStore();
const total_item = ref(0);
const params = reactive<IParams>({
  search: "",
  filter: "",
  currentPage: 1,
  perPage: 10,
  filters: [],
});
const open_form = ref(false);
const open_delete = ref(false);
const selected_item = ref<AdditionalScopeInterface | null>(null);
const toastRef = ref<InstanceType<typeof Toast> | null>(null);
const timeout = ref(0);
const router = useRouter();
const dataForm = ref<AdditionalScopeFilterInterface | null>(null);
const breadcrumb = ref<BreadcrumbType[]>([]);
const is_loading_filter = ref(false);

//--- GET ADDITIONAL SCOPE
const {
  data: dataAdditionalScope,
  isFetching: isLoadingAdditionalScope,
  refetch: refetchAdditionalScope,
} = useQuery({
  queryKey: ["getAdditionalScopeMaster"],
  queryFn: async () => {
    try {
      const { data } = await masterStore.getAdditionalScope(params);
      const response = data as IPagination<AdditionalScopeInterface[]>;

      total_item.value = response.total;
      is_loading_filter.value = false;

      return response;
    } catch (error: any) {
      const err = error as AxiosError;
      is_loading_filter.value = false;
      throw err.response;
    }
  },
  refetchOnWindowFocus: false,
  enabled: computed(() => {
    return params.filters?.length !== 0;
  }),
  gcTime: 0,
});
//--- END

//--- DELETE ADDITIONAL SCOPE
const { mutate: deleteAdditionalScope, isPending: isLoadingDelete } =
  useMutation({
    mutationFn: async (id: string) => {
      return await masterStore.deleteAdditionalScope(id);
    },
    onSuccess: () => {
      toastRef.value?.showToast({
        title: "Success",
        description: "Deleted successfully",
        type: "success",
      });
      open_delete.value = false;
      refetchAdditionalScope();
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
const { mutate: downloadAdditionalScope, isPending: isLoadingDownload } =
  useMutation({
    mutationFn: async () => {
      return await masterStore.downloadAdditionalScope(params);
    },
    onSuccess: () => {},
    onError: (error) => {
      console.log(error);
    },
  });
//--- END

//--- DOWNLOAD TEMPLATE
const { mutate: templateAdditionalScope, isPending: isLoadingTemplate } =
  useMutation({
    mutationFn: async () => {
      return await masterStore.templateAdditionalScope();
    },
    onSuccess: () => {},
    onError: (error) => {
      console.log(error);
    },
  });
//--- END

//--- IMPORT
const { mutate: importAdditionalScope, isPending: isLoadingImport } =
  useMutation({
    mutationFn: async (payload: File) => {
      return await masterStore.importAdditionalScope(payload);
    },
    onSuccess: () => {
      refetchAdditionalScope();
    },
    onError: (error) => {
      console.log(error);
    },
  });
//--- END

const pagination = computed(() => {
  return {
    totalItems: total_item.value,
    itemsPerPage: params.perPage || 0,
    currentPage: params.currentPage || 1,
  };
});

const changePage = (e: number) => {
  params.currentPage = e;
  refetchAdditionalScope();
};

const changeLimit = (e: string) => {
  params.perPage = parseInt(e);
  params.currentPage = 1;
  refetchAdditionalScope();
};

const searchTable = () => {
  clearTimeout(timeout.value);
  timeout.value = window.setTimeout(() => {
    params.currentPage = 1;
    refetchAdditionalScope();
  }, 1000);
};

const handleSuccess = () => {
  toastRef.value?.showToast({
    title: "Success",
    description: "Saved successfully",
    type: "success",
  });
  params.currentPage = 1;
  refetchAdditionalScope();
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

const handleUpdate = (item: AdditionalScopeInterface) => {
  selected_item.value = item;
  open_form.value = true;
};

const handleDelete = (item: AdditionalScopeInterface) => {
  selected_item.value = item;
  open_delete.value = true;
};

const onDelete = () => {
  deleteAdditionalScope(selected_item.value?.uuid as string);
};

const handleShow = (item: AdditionalScopeInterface) => {
  router.push({
    name: "master additional scope standart",
    params: { id: item.uuid, name: item.name },
  });
};

const setFilter = () => {
  params.filters = [
    {
      group: "AND",
      operator: "EQ",
      column: "inspection_type_uuid",
      value: String(dataForm.value?.inspection_type_uuid),
    },
  ];
};

const resetFilter = () => {
  dataForm.value = null;
  params.filters = [];
};

const handleOnFilter = (data: AdditionalScopeFilterInterface) => {
  is_loading_filter.value = true;
  dataForm.value = data;
  setFilter();
  refetchAdditionalScope();
};

const handleResetFilter = () => {
  is_loading_filter.value = true;
  resetFilter();
  refetchAdditionalScope();
};

const handleRemoveSuccess = () => {
  refetchAdditionalScope();
};

const handleDownload = () => {
  downloadAdditionalScope();
};

const handleExportTemplate = () => {
  templateAdditionalScope();
};

const handleImport = (file: File) => {
  importAdditionalScope(file);
};

onMounted(() => {
  breadcrumb.value = [
    {
      name: "Main Menu",
      as_link: false,
      url: "",
    },
    {
      name: "Additional Scope",
      as_link: false,
      url: "",
    },
  ];
});
</script>

<template>
  <div class="relative w-full">
    <div class="flex items-center gap-2 absolute right-0 top-10">
      <ButtonGroup
        :loading-import="isLoadingImport"
        :loading-download="isLoadingDownload"
        :loading-template="isLoadingTemplate"
        @download="handleDownload"
        @template="handleExportTemplate"
        @import="handleImport"
      />
      <Button
        v-if="dataForm?.inspection_type_uuid"
        icon_only="plus"
        size="sm"
        rounded="full"
        color="blue"
        @click="handleCreate"
      />
    </div>

    <div class="flex gap-8">
      <div class="w-[330px]">
        <FilterAdditionalScope
          @filter="handleOnFilter"
          @reset-filter="handleResetFilter"
          :loading="isLoadingAdditionalScope"
        />
      </div>
      <div class="w-full">
        <Breadcrumb :items="breadcrumb" />
        <Table
          label-create="additional-scope"
          :columns="ColumnsAdditionalScope"
          :entities="dataAdditionalScope?.data || []"
          :loading="isLoadingAdditionalScope"
          :pagination="pagination"
          :is-create="false"
          v-model:model-search="params.search"
          class="mt-6"
          @change-page="changePage"
          @change-limit="changeLimit"
          @search="searchTable"
        >
          <template #column_action="{ entity }">
            <div class="flex items-center justify-center gap-4">
              <Icon
                name="eye"
                class="icon-action-table"
                @click="handleShow(entity)"
              />
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
        </Table>
      </div>
    </div>

    <FormAdditionalScope
      v-model="open_form"
      :data-form="dataForm"
      :selected-value="selected_item"
      @success="handleSuccess"
      @error="handleError"
      @removeSucess="handleRemoveSuccess"
    />
  </div>

  <Toast ref="toastRef" />
  <ModalDelete
    v-model="open_delete"
    :title="selected_item?.name"
    :loading="isLoadingDelete"
    @delete="onDelete"
  />
</template>
