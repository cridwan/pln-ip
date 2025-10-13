<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import type { AxiosError } from "axios";

import { Button, Icon, ModalDelete, Table, Toast } from "@/components";
import { useMutation, useQuery } from "@tanstack/vue-query";
import type {
  IPagination,
  IParams,
  ResponseDocumentInterface,
} from "@/types/GlobalType";

import { ColumnsScope } from "../../constants/ScopeConstant";
import type {
  ScopeAdditionalFilterInterface,
  ScopeCreateModelInterface,
  ScopeInterface,
} from "../../types/ScopeType";
import { useMasterStore } from "../../stores/MasterStore";
import { useRoute } from "vue-router";
import FormAdScope from "../../components/FormAdScope.vue";
import FilterAdScope from "../../components/FilterAdScope.vue";
import ButtonGroup from "../../components/ButtonGroup.vue";

const masterStore = useMasterStore();
const route = useRoute();
const total_item = ref(0);
const params = reactive<IParams>({
  search: "",
  filter: "",
  filters: [
    {
      group: "AND",
      operator: "EQ",
      column: "additional_scope_uuid",
      value: route.params?.id,
    },
  ],
  currentPage: 1,
  perPage: 10,
});
const open_form = ref(false);
const open_delete = ref(false);
const selected_item = ref<ScopeInterface | null>(null);
const toastRef = ref<InstanceType<typeof Toast> | null>(null);
const timeout = ref(0);
const dataForm = ref<ScopeAdditionalFilterInterface | null>(null);

//--- GET SCOPE
const {
  data: dataScope,
  isFetching: isLoadingScope,
  refetch: refetchScope,
} = useQuery({
  queryKey: ["getScopeMaster"],
  queryFn: async () => {
    try {
      const { data } = await masterStore.getScope(params);
      const response = data as IPagination<ScopeInterface[]>;

      total_item.value = response.total;

      return response;
    } catch (error: any) {
      const err = error as AxiosError;
      throw err.response;
    }
  },
  refetchOnWindowFocus: false,
  enabled: computed(() => {
    return Boolean(params.filters?.[1]);
  }),
  gcTime: 0,
});
//--- END

//--- DELETE SCOPE
const { mutate: deleteScope, isPending: isLoadingDelete } = useMutation({
  mutationFn: async (id: string) => {
    return await masterStore.deleteScope(id);
  },
  onSuccess: () => {
    toastRef.value?.showToast({
      title: "Success",
      description: "Deleted successfully",
      type: "success",
    });
    open_delete.value = false;
    refetchScope();
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
const { mutate: downloadScope, isPending: isLoadingDownload } = useMutation({
  mutationFn: async () => {
    return await masterStore.downloadScope(params);
  },
  onSuccess: () => {},
  onError: (error) => {
    console.log(error);
  },
});
//--- END

//--- DOWNLOAD TEMPLATE
const { mutate: templateScope, isPending: isLoadingTemplate } = useMutation({
  mutationFn: async () => {
    return await masterStore.templateScope();
  },
  onSuccess: () => {},
  onError: (error) => {
    console.log(error);
  },
});
//--- END

//--- IMPORT
const { mutate: importScope, isPending: isLoadingImport } = useMutation({
  mutationFn: async (payload: File) => {
    return await masterStore.importScope(payload);
  },
  onSuccess: () => {
    refetchScope();
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
  refetchScope();
};

const changeLimit = (e: string) => {
  params.perPage = parseInt(e);
  params.currentPage = 1;
  refetchScope();
};

const searchTable = () => {
  clearTimeout(timeout.value);
  timeout.value = window.setTimeout(() => {
    params.currentPage = 1;
    refetchScope();
  }, 1000);
};

const handleSuccess = () => {
  toastRef.value?.showToast({
    title: "Success",
    description: "Saved successfully",
    type: "success",
  });
  params.currentPage = 1;
  refetchScope();
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

const handleUpdate = (item: ScopeInterface) => {
  selected_item.value = item;
  open_form.value = true;
};

const handleDelete = (item: ScopeInterface) => {
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
      column: "additional_scope_uuid",
      value: route.params?.id,
    },
    {
      group: "AND",
      operator: "EQ",
      column: "sub_bidang_uuid",
      value: String(dataForm.value?.sub_bidang_uuid),
    },
  ];
};

const resetFilter = () => {
  dataForm.value = null;

  params.filters = [
    {
      group: "AND",
      operator: "EQ",
      column: "additional_scope_uuid",
      value: route.params?.id,
    },
  ];
};

const handleOnFilter = (data: ScopeCreateModelInterface) => {
  dataForm.value = data;
  setFilter();
  refetchScope();
};

const handleResetFilter = () => {
  resetFilter();
  refetchScope();
};

const previewDocument = (document: ResponseDocumentInterface) => {
  window.open(
    import.meta.env.VITE_API_BASE_URL.replace("api", "") +
      document.document_link,
    "_blank"
  );
};

const handleRemoveSuccess = () => {
  refetchScope();
};

const handleDownload = () => {
  downloadScope();
};

const handleExportTemplate = () => {
  templateScope();
};

const handleImport = (file: File) => {
  importScope(file);
};
</script>

<template>
  <Toast ref="toastRef" />
  <ModalDelete
    v-model="open_delete"
    :title="selected_item?.name"
    :loading="isLoadingDelete"
    @delete="onDelete"
  />

  <div class="relative w-full">
    <div class="flex items-center gap-2 absolute right-0 top-0">
      <ButtonGroup
        :loading-import="isLoadingImport"
        :loading-download="isLoadingDownload"
        :loading-template="isLoadingTemplate"
        @download="handleDownload"
        @template="handleExportTemplate"
        @import="handleImport"
      />
      <Button
        v-if="dataForm?.sub_bidang_uuid"
        icon_only="plus"
        size="sm"
        rounded="full"
        color="blue"
        @click="handleCreate"
      />
    </div>

    <div class="flex gap-8">
      <div class="w-[330px]">
        <FilterAdScope
          @filter="handleOnFilter"
          @reset-filter="handleResetFilter"
          :loading="isLoadingScope"
        />
      </div>
      <div class="w-full">
        <Table
          label-create="User"
          :columns="ColumnsScope"
          :entities="dataScope?.data || []"
          :loading="isLoadingScope"
          :pagination="pagination"
          :is-create="false"
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
          <template #column_document="{ entity }">
            <p
              class="text-base text-neutral-50 text-left underline cursor-pointer"
              v-if="entity.document"
              @click="previewDocument(entity.document)"
            >
              {{ entity.document?.document_name ?? "-" }}
            </p>
            <p v-else>-</p>
          </template>
          <template #column_link="{ entity }">
            <a
              :href="entity.link"
              target="_blank"
              class="text-base text-neutral-50 text-left underline cursor-pointer"
              v-if="entity.link"
            >
              {{ entity.link ?? "-" }}
            </a>
            <p v-else>-</p>
          </template>
        </Table>
      </div>
    </div>

    <FormAdScope
      v-model="open_form"
      :selected-value="selected_item"
      :data-form="dataForm"
      @success="handleSuccess"
      @error="handleError"
      @removeSucess="handleRemoveSuccess"
    />
  </div>
</template>
