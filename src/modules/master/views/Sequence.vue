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
import type { SequenceInterface } from "../types/SequenceTypes";
import FormSequence from "../components/FormSequence.vue";
import { ColumnSequence } from "../constants/SequenceConstant";
import ButtonGroup from "../components/ButtonGroup.vue";

const masterStore = useMasterStore();
const total_item = ref(0);
const params = reactive({
  search: "",
  filter: "",
  filters: [
    {
      group: "AND",
      operator: "NOT_NULL",
      column: "inspection_type_uuid",
      value: null,
    },
  ],
  currentPage: 1,
  perPage: 10,
});
const open_form = ref(false);
const open_delete = ref(false);
const selected_item = ref<SequenceInterface | null>(null);
const toastRef = ref<InstanceType<typeof Toast> | null>(null);
const timeout = ref(0);
const breadcrumb = ref<BreadcrumbType[]>([]);

//--- GET HSE
const {
  data: dataSequence,
  isFetching: isLoadingSequence,
  refetch: refetchSequence,
} = useQuery({
  queryKey: ["getSequenceMaster"],
  queryFn: async () => {
    try {
      const { data } = await masterStore.getSequence(params);
      const response = data.data as IPagination<SequenceInterface[]>;

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

//--- DELETE SUBBIDANG
const { mutate: deleteSequence, isPending: isLoadingDelete } = useMutation({
  mutationFn: async (id: string) => {
    return await masterStore.deleteSequence(id);
  },
  onSuccess: () => {
    toastRef.value?.showToast({
      title: "Success",
      description: "Deleted successfully",
      type: "success",
    });
    open_delete.value = false;
    refetchSequence();
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
const { mutate: downloadSequence, isPending: isLoadingDownload } = useMutation({
  mutationFn: async () => {
    return await masterStore.downloadSequence();
  },
  onSuccess: () => { },
  onError: (error) => {
    console.log(error);
  },
});
//--- END

//--- DOWNLOAD TEMPLATE
const { mutate: templateSequence, isPending: isLoadingTemplate } = useMutation({
  mutationFn: async () => {
    return await masterStore.templateSequence();
  },
  onSuccess: () => { },
  onError: (error) => {
    console.log(error);
  },
});
//--- END

//--- IMPORT
const { mutate: importSequence, isPending: isLoadingImport } = useMutation({
  mutationFn: async (payload: File) => {
    return await masterStore.importSequence(payload);
  },
  onSuccess: () => {
    toastRef.value?.showToast({
      title: "Success",
      description: "Import successfully",
      type: "success",
    });
    refetchSequence();
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

    refetchSequence();
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
  refetchSequence();
};

const changeLimit = (e: string) => {
  params.perPage = parseInt(e);
  params.currentPage = 1;
  refetchSequence();
};

const searchTable = () => {
  clearTimeout(timeout.value);
  timeout.value = window.setTimeout(() => {
    params.currentPage = 1;
    refetchSequence();
  }, 1000);
};

const handleSuccess = () => {
  toastRef.value?.showToast({
    title: "Success",
    description: "Saved successfully",
    type: "success",
  });
  params.currentPage = 1;
  refetchSequence();
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

const handleUpdate = (item: SequenceInterface) => {
  selected_item.value = item;
  open_form.value = true;
};

const handleDelete = (item: SequenceInterface) => {
  selected_item.value = item;
  open_delete.value = true;
};

const onDelete = () => {
  deleteSequence(selected_item.value?.uuid as string);
};

const handleRemoveSuccess = () => {
  refetchSequence();
};

const redirectDocument = (document: ResponseDocumentInterface) => {
  window.open(
    import.meta.env.VITE_API_BASE_URL.replace("api", "") +
    document.document_link,
    "_blank"
  );
};

const handleDownload = () => {
  downloadSequence();
};

const handleExportTemplate = () => {
  templateSequence();
};

const handleImport = (file: File) => {
  importSequence(file);
};

onMounted(() => {
  breadcrumb.value = [
    {
      name: "Main Menu",
      as_link: false,
      url: "",
    },
    {
      name: "Master Data",
      as_link: false,
      url: "",
    },
    {
      name: "Sequence",
      as_link: false,
      url: "",
    },
  ];
});
</script>

<template>
  <Breadcrumb :items="breadcrumb" />
  <div class="relative w-full mt-6">
    <div class="flex items-center gap-2 absolute right-0">
      <!-- <Button text="Import" rounded="full" color="blue" />
      <Button text="Download" rounded="full" color="blue" />
      <Button text="Export Template" rounded="full" color="blue" /> -->
      <ButtonGroup :loading-import="isLoadingImport" :loading-download="isLoadingDownload"
        :loading-template="isLoadingTemplate" @download="handleDownload" @template="handleExportTemplate"
        @import="handleImport" />
      <Button icon_only="plus" size="sm" rounded="full" color="blue" @click="handleCreate" />
    </div>

    <Table label-create="Sub Bidang" :columns="ColumnSequence" :entities="dataSequence?.data || []"
      :loading="isLoadingSequence" :pagination="pagination" :is-create="false" v-model:model-search="params.search"
      @change-page="changePage" @change-limit="changeLimit" @search="searchTable">
      <template #column_action="{ entity }">
        <div class="flex items-center justify-center gap-4">
          <Icon name="pencil" class="icon-action-table" @click="handleUpdate(entity)" />
          <Icon name="trash" class="icon-action-table" @click="handleDelete(entity)" />
        </div>
      </template>
      <template #column_document="{ entity }">
        <p @click="redirectDocument(entity.document)"
          class="text-base text-neutral-50 text-left underline cursor-pointer" v-if="entity.document">
          {{ entity.document?.document_name }}
        </p>
        <p v-else class="text-base text-neutral-50 text-center">-</p>
      </template>
    </Table>

    <FormSequence v-model="open_form" :selected-value="selected_item" @success="handleSuccess" @error="handleError"
      @removeSucess="handleRemoveSuccess" />
  </div>

  <Toast ref="toastRef" />
  <ModalDelete v-model="open_delete" :title="selected_item?.name" :loading="isLoadingDelete" @delete="onDelete" />
</template>

<style lang="sass"></style>
