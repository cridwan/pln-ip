<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { AxiosError } from "axios";

import { Breadcrumb, Button, Icon, ModalDelete, Table, Toast } from "@/components";
import { useMutation, useQuery } from "@tanstack/vue-query";
import type {
  IPagination,
  ResponseDocumentInterface,
} from "@/types/GlobalType";

import { useMasterStore } from "../../stores/MasterStore";
import FormManpowerStd from "../../components/FormManpowerStd.vue";
import FilterManpowerStd from "../../components/additional/FilterManpowerStd.vue";
import type {
  ManpowerStdCreateModelInterface,
  ManpowerStdInterface,
} from "../../types/ManpowerStdType";
import { ColumnsManpowerStd } from "../../constants/ManpowerStdConstant";
import { useRoute } from "vue-router";
import ButtonGroup from "../../components/ButtonGroup.vue";
import type { BreadcrumbType } from "@/components/navigations/Breadcrumb.vue";

const route = useRoute();
const dataForm = ref<ManpowerStdCreateModelInterface | null>(null);
const formManpowerStd = ref<InstanceType<typeof FormManpowerStd> | null>(null);
const breadcrumb = ref<BreadcrumbType[]>([]);
const masterStore = useMasterStore();
const total_item = ref(0);
const params = reactive({
  search: "",
  filter: "",
  filters: [
    {
      group: "AND",
      operator: "EQ",
      column: "activity_uuid",
      value: "",
    },
    {
      group: "AND",
      operator: "EQ",
      column: "activity.equipment.scopeStandart.additionalScope",
      value: route.params.id,
    },
  ],
  currentPage: 1,
  perPage: 10,
});
const open_form = ref(false);
const open_delete = ref(false);
const selected_item = ref<ManpowerStdInterface | null>(null);
const toastRef = ref<InstanceType<typeof Toast> | null>(null);
const timeout = ref(0);

//--- GET SCOPE
const {
  data: dataManpowerStd,
  isFetching: isLoadingManpowerStd,
  refetch: refetchManpowerStd,
} = useQuery({
  queryKey: ["getManpowerStd"],
  queryFn: async () => {
    try {
      console.log(params);
      const { data } = await masterStore.getManpowerStd(params, '/add-scope/detail');
      const response = data.data as IPagination<ManpowerStdInterface[]>;
      total_item.value = response.total;

      return response;
    } catch (error: any) {
      const err = error as AxiosError;
      throw err.response;
    }
  },
  refetchOnWindowFocus: false,
  enabled: computed(() =>
    params.filters.some((e) => e.column === "activity_uuid" && e.value !== "")
  ),
  gcTime: 0,
});
//--- END

//--- DELETE SCOPE
const { mutate: deleteScope, isPending: isLoadingDelete } = useMutation({
  mutationFn: async (id: string) => {
    return await masterStore.deleteManpowerStd(id, '/add-scope/detail');
  },
  onSuccess: () => {
    toastRef.value?.showToast({
      title: "Success",
      description: "Deleted successfully",
      type: "success",
    });
    open_delete.value = false;
    refetchManpowerStd();
    if (formManpowerStd.value?.refetchManpower) {
      formManpowerStd.value.refetchManpower()
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
const { mutate: downloadManpowerStd, isPending: isLoadingDownload } =
  useMutation({
    mutationFn: async () => {
      return await masterStore.downloadManpowerStd(params, '/add-scope/detail');
    },
    onSuccess: () => { },
    onError: (error) => {
      console.log(error);
    },
  });
//--- END

//--- DOWNLOAD TEMPLATE
const { mutate: templateManpowerStd, isPending: isLoadingTemplate } =
  useMutation({
    mutationFn: async () => {
      return await masterStore.templateManpowerStd('/add-scope/detail', {
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
const { mutate: importManpowerStd, isPending: isLoadingImport } = useMutation({
  mutationFn: async (payload: File) => {
    return await masterStore.importManpowerStd(payload, '/add-scope/detail');
  },
  onSuccess: () => {
    toastRef.value?.showToast({
      title: "Success",
      description: "Import successfully",
      type: "success",
    });
    refetchManpowerStd();
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

    refetchManpowerStd();
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
  refetchManpowerStd();
};

const changeLimit = (e: string) => {
  params.perPage = parseInt(e);
  params.currentPage = 1;
  refetchManpowerStd();
};

const searchTable = () => {
  clearTimeout(timeout.value);
  timeout.value = window.setTimeout(() => {
    params.currentPage = 1;
    refetchManpowerStd();
  }, 1000);
};

const handleSuccess = () => {
  toastRef.value?.showToast({
    title: "Success",
    description: "Saved successfully",
    type: "success",
  });
  params.currentPage = 1;
  refetchManpowerStd();
  if (formManpowerStd.value?.refetchManpower) {
    formManpowerStd.value.refetchManpower()
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

const handleUpdate = (item: ManpowerStdInterface) => {
  selected_item.value = item;
  open_form.value = true;
};

const handleDelete = (item: ManpowerStdInterface) => {
  selected_item.value = item;
  open_delete.value = true;
};

const onDelete = () => {
  deleteScope(selected_item.value?.uuid as string);
};

const setFilter = () => {
  params.filters = [
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
      operator: "EQ",
      column: "activity_uuid",
      value: "",
    },
    {
      group: "AND",
      operator: "EQ",
      column: "activity.equipment.scopeStandart.additionalScope",
      value: route.params.id,
    },
  ];
};

const handleOnFilter = (data: ManpowerStdCreateModelInterface) => {
  dataForm.value = data;
  setFilter();
  refetchManpowerStd();
};

const handleResetFilter = () => {
  resetFilter();
  refetchManpowerStd();
};

const previewDocument = (document: ResponseDocumentInterface) => {
  window.open(
    import.meta.env.VITE_API_BASE_URL.replace("api", "") +
    document.document_link,
    "_blank"
  );
};

const handleRemoveSuccess = () => {
  refetchManpowerStd();
};

const handleDownload = () => {
  downloadManpowerStd();
};

const handleExportTemplate = () => {
  templateManpowerStd();
};

const handleImport = (file: File) => {
  importManpowerStd(file);
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
  ];
});
</script>

<template>
  <Toast ref="toastRef" />
  <ModalDelete v-model="open_delete" :title="selected_item?.manpower?.name" :loading="isLoadingDelete"
    @delete="onDelete" />
  <div class="relative w-full">
    <div class="flex items-center gap-2 absolute right-0 top-0">
      <ButtonGroup :loading-import="isLoadingImport" :loading-download="isLoadingDownload"
        :loading-template="isLoadingTemplate" @download="handleDownload" @template="handleExportTemplate"
        @import="handleImport" />
      <Button v-if="dataForm?.activity_uuid" icon_only="plus" size="sm" rounded="full" color="blue"
        @click="handleCreate" />
    </div>

    <div class="flex gap-8">
      <div class="w-[330px]">
        <FilterManpowerStd @filter="handleOnFilter" @reset-filter="handleResetFilter" :loading="isLoadingManpowerStd" />
      </div>
      <div class="w-full">
        <Breadcrumb :items="breadcrumb" />
        <Table label-create="User" :columns="ColumnsManpowerStd" :entities="dataManpowerStd?.data || []"
          :loading="isLoadingManpowerStd" :pagination="pagination" :is-create="false"
          v-model:model-search="params.search" @change-page="changePage" @change-limit="changeLimit"
          @search="searchTable">
          <template #column_action="{ entity }">
            <div class="flex items-center justify-center gap-4">
              <Icon name="pencil" class="icon-action-table" @click="handleUpdate(entity)" />
              <Icon name="trash" class="icon-action-table" @click="handleDelete(entity)" />
            </div>
          </template>
          <template #column_manpower="{ entity }">
            <p class="text-base text-neutral-50 text-left">
              {{ entity.manpower?.name ?? "-" }}
            </p>
          </template>
        </Table>
      </div>
    </div>

    <FormManpowerStd :data-form="dataForm" v-model="open_form" :selected-value="selected_item" @success="handleSuccess"
      @error="handleError" @removeSucess="handleRemoveSuccess" ref="formManpowerStd" />
  </div>
</template>
