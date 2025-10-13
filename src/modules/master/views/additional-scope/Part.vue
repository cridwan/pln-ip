<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import type { AxiosError } from "axios";

import { Button, Icon, ModalDelete, Table, Toast } from "@/components";
import { useMutation, useQuery } from "@tanstack/vue-query";
import type {
  IPagination,
  ResponseDocumentInterface,
} from "@/types/GlobalType";

import { useMasterStore } from "../../stores/MasterStore";
import type { SequenceInterface } from "../../types/SequenceTypes";
import type {
  PartStdCreateModelInterface,
  PartStdInterface,
} from "../../types/PartStdType";
import { ColumnsPartStd } from "../../constants/PartStdConstant";
import FilterPartStd from "../../components/additional/FilterPartStd.vue";
import FormPartStd from "../../components/FormPartStd.vue";
import { useRoute } from "vue-router";
import ButtonGroup from "../../components/ButtonGroup.vue";

const route = useRoute();
const dataForm = ref<PartStdCreateModelInterface | null>(null);
const masterStore = useMasterStore();
const total_item = ref(0);
const params = reactive({
  search: "",
  filter: "",
  filters: [
    {
      group: "AND",
      operator: "EQ",
      column: "activity.equipment.scopeStandart.additional_scope_uuid",
      value: route.params?.id,
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

//--- GET SCOPE
const {
  data: dataPartStd,
  isFetching: isLoadingPartStd,
  refetch: refetchPartStd,
} = useQuery({
  queryKey: ["getPartStd"],
  queryFn: async () => {
    try {
      const { data } = await masterStore.getPartStd(params);
      const response = data.data as IPagination<PartStdInterface[]>;
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
    return await masterStore.deletePartStd(id);
  },
  onSuccess: () => {
    toastRef.value?.showToast({
      title: "Success",
      description: "Deleted successfully",
      type: "success",
    });
    open_delete.value = false;
    refetchPartStd();
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
    refetchPartStd();
  },
  onError: (error) => {
    console.log(error);
  },
});
//--- END
const handleDownload = () => {
  downloadPartStd();
};

const handleExportTemplate = () => {
  templatePartStd();
};

const handleImport = (file: File) => {
  importPartStd(file);
};

const pagination = computed(() => {
  return {
    totalItems: total_item.value,
    itemsPerPage: params.perPage,
    currentPage: params.currentPage,
  };
});

const changePage = (e: number) => {
  params.currentPage = e;
  refetchPartStd();
};

const changeLimit = (e: string) => {
  params.perPage = parseInt(e);
  params.currentPage = 1;
  refetchPartStd();
};

const searchTable = () => {
  clearTimeout(timeout.value);
  timeout.value = window.setTimeout(() => {
    params.currentPage = 1;
    refetchPartStd();
  }, 1000);
};

const handleSuccess = () => {
  toastRef.value?.showToast({
    title: "Success",
    description: "Saved successfully",
    type: "success",
  });
  params.currentPage = 1;
  refetchPartStd();
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
      column: "activity.equipment.scopeStandart.additional_scope_uuid",
      value: route.params?.id,
    },
  ];
};

const handleOnFilter = (data: PartStdCreateModelInterface) => {
  dataForm.value = data;
  setFilter();
  refetchPartStd();
};

const handleResetFilter = () => {
  resetFilter();
  refetchPartStd();
};

const previewDocument = (document: ResponseDocumentInterface) => {
  window.open(
    import.meta.env.VITE_API_BASE_URL.replace("api", "") +
      document.document_link,
    "_blank"
  );
};

const handleRemoveSuccess = () => {
  refetchPartStd();
};
</script>

<template>
  <Toast ref="toastRef" />
  <ModalDelete
    v-model="open_delete"
    :title="selected_item?.uuid"
    :loading="isLoadingDelete"
    @delete="onDelete"
  />
  <div class="relative w-full">
    <div class="flex items-center gap-2 absolute right-0">
      <!-- <Button text="Import" rounded="full" color="blue" />
      <Button text="Download" rounded="full" color="blue" />
      <Button text="Export Template" rounded="full" color="blue" /> -->
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
          :loading="isLoadingPartStd"
        />
      </div>
      <div class="w-full">
        <Table
          label-create="User"
          :columns="ColumnsPartStd"
          :entities="dataPartStd?.data || []"
          :loading="isLoadingPartStd"
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
          <template #column_part="{ entity }">
            <p class="text-base text-neutral-50 text-left">
              {{ entity.part?.name ?? "-" }}
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
    />
  </div>
</template>
