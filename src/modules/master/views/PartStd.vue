<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { AxiosError } from "axios";

import {
  Breadcrumb,
  Button,
  Icon,
  ModalDelete,
  Table,
  Toast,
} from "@/components";
import { useMutation, useQuery } from "@tanstack/vue-query";
import type {
  IPagination,
  ResponseDocumentInterface,
} from "@/types/GlobalType";
import type { BreadcrumbType } from "@/components/navigations/Breadcrumb.vue";

import { useMasterStore } from "../stores/MasterStore";
import type {
  PartStdCreateModelInterface,
  PartStdInterface,
} from "../types/PartStdType";
import { ColumnsPartStd } from "../constants/PartStdConstant";
import FilterPartStd from "../components/FilterPartStd.vue";
import FormPartStd from "../components/FormPartStd.vue";
import ButtonGroup from "../components/ButtonGroup.vue";

const dataForm = ref<PartStdCreateModelInterface | null>(null);
const masterStore = useMasterStore();
const total_item = ref(0);
const params = reactive({
  search: "",
  filter: "",
  filters: [
    {
      group: "AND",
      operator: "NOT_NULL",
      column: "activity.equipment.scopeStandart.inspection_type_uuid",
      value: "",
    },
    {
      group: "AND",
      operator: "EQ",
      column: "activity_uuid",
      value: "",
    },
  ],
  currentPage: 1,
  perPage: 10,
});
const open_form = ref(false);
const open_delete = ref(false);
const selected_item = ref<PartStdInterface | null>(null);
const toastRef = ref<InstanceType<typeof Toast> | null>(null);
const timeout = ref(0);
const breadcrumb = ref<BreadcrumbType[]>([]);
const is_loading_filter = ref(false);
const formPartStd = ref<InstanceType<typeof FormPartStd> | null>(null);

//--- GET PART STD
const {
  data: dataPartStd,
  isFetching: isLoadingPartStd,
  refetch: refetchpartStd,
} = useQuery({
  queryKey: ["getPartStd"],
  queryFn: async () => {
    try {
      const { data } = await masterStore.getPartStd(params);
      const response = data.data as IPagination<PartStdInterface[]>;

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
  enabled: computed(() => params.filters.some((e) => e.value !== "")),
  gcTime: 0,
});
//--- END

//--- DELETE SCOPE
const { mutate: deletePartStd, isPending: isLoadingDelete } = useMutation({
  mutationFn: async (id: string) => {
    return await masterStore.deletePartStd(id);
  },
  onSuccess: () => {
    toastRef.value?.showToast({
      title: "Success",
      description: "Deleted successfully",
      type: "success",
    });
    open_delete.value = false;
    refetchpartStd();
    if (formPartStd.value?.refetchPart) {
      formPartStd.value?.refetchPart();
    }
  },
  onError: (error: any) => {
    toastRef.value?.showToast({
      title: "Error",
      description: error?.response?.data?.message || "Something went wrong",
      type: "error",
    });
  },
});
//--- END

//--- DOWNLOAD
const { mutate: downloadPartStd, isPending: isLoadingDownload } = useMutation({
  mutationFn: async () => {
    return await masterStore.downloadPartStd(params);
  },
  onSuccess: () => {},
  onError: (error) => {
    console.log(error);
  },
});
//--- END

//--- DOWNLOAD TEMPLATE
const { mutate: templatePartStd, isPending: isLoadingTemplate } = useMutation({
  mutationFn: async () => {
    return await masterStore.templatePartStd();
  },
  onSuccess: () => {},
  onError: (error) => {
    console.log(error);
  },
});
//--- END

//--- IMPORT
const { mutate: importPartStd, isPending: isLoadingImport } = useMutation({
  mutationFn: async (payload: File) => {
    return await masterStore.importPartStd(payload);
  },
  onSuccess: () => {
    toastRef.value?.showToast({
      title: "Success",
      description: "Import successfully",
      type: "success",
    });
    refetchpartStd();
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

    refetchpartStd();
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
  refetchpartStd();
};

const changeLimit = (e: string) => {
  params.perPage = parseInt(e);
  params.currentPage = 1;
  refetchpartStd();
};

const searchTable = () => {
  clearTimeout(timeout.value);
  timeout.value = window.setTimeout(() => {
    params.currentPage = 1;
    refetchpartStd();
  }, 1000);
};

const handleSuccess = () => {
  toastRef.value?.showToast({
    title: "Success",
    description: "Saved successfully",
    type: "success",
  });
  params.currentPage = 1;
  refetchpartStd();
  if (formPartStd.value?.refetchPart) {
    formPartStd.value?.refetchPart();
  }
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
      operator: "NOT_NULL",
      column: "inspection_type_uuid",
      value: "",
    },
    {
      group: "AND",
      operator: "EQ",
      column: "activity_uuid",
      value: String(dataForm.value?.activity_uuid),
    },
  ];
};

const resetFilter = () => {
  dataForm.value = null;
  params.filters = [
    {
      group: "AND",
      operator: "NOT_NULL",
      column: "inspection_type_uuid",
      value: "",
    },
    {
      group: "AND",
      operator: "EQ",
      column: "activity_uuid",
      value: "",
    },
  ];
};

const handleOnFilter = (data: PartStdCreateModelInterface) => {
  is_loading_filter.value = true;
  dataForm.value = data;
  setFilter();
  refetchpartStd();
};

const handleResetFilter = () => {
  is_loading_filter.value = true;
  resetFilter();
  refetchpartStd();
};

const previewDocument = (document: ResponseDocumentInterface) => {
  window.open(
    import.meta.env.VITE_API_BASE_URL.replace("api", "") +
      document.document_link,
    "_blank"
  );
};

const handleRemoveSuccess = () => {
  refetchpartStd();

  if (formPartStd.value?.refetchPart) {
    formPartStd.value?.refetchPart();
  }
};

const handleDownload = () => {
  downloadPartStd();
};

const handleExportTemplate = () => {
  templatePartStd();
};

const handleImport = (file: File) => {
  importPartStd(file);
};

onMounted(() => {
  breadcrumb.value = [
    {
      name: "Main Menu",
      as_link: false,
      url: "",
    },
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
        v-if="dataForm?.activity_uuid"
        icon_only="plus"
        size="sm"
        rounded="full"
        color="blue"
        @click="handleCreate"
      />
    </div>

    <div class="flex gap-8">
      <div class="w-[330px]">
        <FilterPartStd
          @filter="handleOnFilter"
          @reset-filter="handleResetFilter"
          :loading="is_loading_filter"
        />
      </div>
      <div class="w-full">
        <Breadcrumb :items="breadcrumb" />
        <Table
          label-create="User"
          :columns="ColumnsPartStd"
          :entities="dataPartStd?.data || []"
          :loading="isLoadingPartStd"
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
                v-if="Number(entity?.has_transaction || 0) === 0"
                name="pencil"
                class="icon-action-table"
                @click="handleUpdate(entity)"
              />
              <Icon
                v-if="Number(entity?.has_transaction || 0) === 0"
                name="trash"
                class="icon-action-table"
                @click="handleDelete(entity)"
                v-show="Number(entity.has_transaction) == 0"
              />
            </div>
          </template>
          <template #column_part="{ entity }">
            <p class="text-base text-neutral-50 text-left">
              {{ entity.part?.name ?? "-" }}
            </p>
          </template>
          <template #column_globalUnit="{ entity }">
            <p class="text-base text-neutral-50 text-left">
              {{ entity.part?.global_unit?.name ?? "-" }}
            </p>
          </template>
        </Table>
      </div>
    </div>

    <FormPartStd
      :data-form="dataForm"
      v-model="open_form"
      :selected-value="selected_item"
      @success="handleSuccess"
      @error="handleError"
      @removeSucess="handleRemoveSuccess"
      ref="formPartStd"
    />
  </div>

  <Toast ref="toastRef" />
  <ModalDelete
    v-model="open_delete"
    :title="`${selected_item?.part?.name} / ${selected_item?.part?.global_unit?.name}`"
    :loading="isLoadingDelete"
    @delete="onDelete"
  />
</template>
