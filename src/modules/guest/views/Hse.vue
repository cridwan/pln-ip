<script setup lang="ts">
import type { AxiosError } from "axios";
import { computed, reactive, ref } from "vue";
import { useRoute } from "vue-router";

import { Icon, ModalDelete, Table, Toast } from "@/components";

import type { ValueUploadType } from "@/components/fields/Upload.vue";
import { useMutation, useQuery } from "@tanstack/vue-query";
import type { IPagination } from "@/types/GlobalType";
import { useGlobalStore } from "@/stores/GlobalStore";

import { ColumnsHse, ColumnsHseAdditional } from "../constants/HseConstant";
import type {
  CreateHseInterface,
  HseInterface,
  ResponseHseInterface,
} from "../types/HseType";
import FormOnlyUploadFile from "../components/FormOnlyUploadFile.vue";
import FormCreateRow from "../components/FormCreateRow.vue";
import FormEditHse from "../components/FormEditHse.vue";
import { useTransactionStore } from "../stores/TransactionStore";

const entitiesHse = ref<HseInterface[]>([]);

const transactionStore = useTransactionStore();
const globalStore = useGlobalStore();
const route = useRoute();
const params = reactive({
  search: "",
  filters: `project_uuid,${route.params.id_project}&type,standart`,
  currentPage: 1,
  perPage: 10,
});
const total_item = ref(0);
const toastRef = ref<InstanceType<typeof Toast> | null>(null);
const attachment = ref<any>(null);
const createRow = ref<any>(null);
const updateHse = ref<any>(null);
const type = ref<"standart" | "additionals">("standart");
const is_loading_file = ref(false);
const selected_item = ref<HseInterface | null>(null);
const open_form = ref(false);
const open_delete = ref(false);

//--- GET HSE
const {
  data: dataHse,
  isFetching: isLoadingHse,
  refetch: refetchHse,
} = useQuery({
  queryKey: ["getHse"],
  queryFn: async () => {
    try {
      const { data } = await transactionStore.getHse(params);
      const response = data as IPagination<ResponseHseInterface[]>;

      total_item.value = response.total;

      const new_arr: HseInterface[] =
        response.data?.map((item) => {
          return {
            id: item.uuid,
            name: item.title,
            document: item.documents
              ? {
                  file: item.documents
                    ? item.documents.map((el) => ({
                        id: el.uuid,
                        name: el.document_original_name,
                        size: el.document_size,
                        file: el.document_link,
                      }))
                    : [],
                }
              : null,
            note: null,
            document_original: item.document,
            documents_original: item.documents,
          };
        }) || [];
      entitiesHse.value = new_arr;

      return response;
    } catch (error: any) {
      const err = error as AxiosError;
      throw err.response;
    }
  },
  refetchOnWindowFocus: false,
});
//--- END

//--- CREATE HSE
const { mutate: createHse, isPending: isLoadingCreateHse } = useMutation({
  mutationFn: async (payload: CreateHseInterface) => {
    return await transactionStore.createHse(payload);
  },
  onSuccess: () => {
    refetchHseAdditional();
    createRow.value.reset();
    toastRef.value?.showToast({
      title: "Success",
      description: "Saved successfully",
      type: "success",
    });
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
  refetchHse();
};

const changeLimit = (e: string) => {
  params.perPage = parseInt(e);
  params.currentPage = 1;
  refetchHse();
};

const preview = (item: HseInterface) => {
  const a = document.createElement("a");
  a.href =
    import.meta.env.VITE_API_BASE_URL.replace("api", "") +
    item?.document_original?.document_link;
  a.download = item?.document_original?.document_original_name || "";
  a.target = "_blank";
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const saveFile = async (
  e: { file: ValueUploadType[] },
  entity: HseInterface,
  type_save: "standart" | "additionals"
) => {
  // const duplicate_data = [...entitiesHse.value];
  // const find_index = entitiesHse.value.findIndex(
  //   (item) => item.id === entity.id
  // );

  // if (find_index !== -1) {
  //   duplicate_data[find_index].document = {
  //     file: e.file,
  //   };
  //   entitiesHse.value = duplicate_data;
  // }
  type.value = type_save;

  const filter_file = e.file.filter((item) => typeof item.file !== "string");
  const deleted_file =
    entity.document?.file.filter(
      (item) => !e.file.some((el) => el.file === item.file)
    ) || [];

  is_loading_file.value = true;

  const promises = filter_file.map(async (item) => {
    try {
      const data = await globalStore.createDocument({
        document: item.file as File,
        document_type: "App\\Models\\Transaction\\Hse",
        document_uuid: entity.id,
      });
      return data;
    } catch (error) {
      return error;
    }
  });

  if (deleted_file.length > 0) {
    try {
      await globalStore.deleteDocument(deleted_file?.map((item) => item.id));

      try {
        await Promise.all(promises);

        if (type.value === "standart") {
          refetchHse();
        } else {
          refetchHseAdditional();
        }
        attachment.value.modelOpenInputData = false;
        toastRef.value?.showToast({
          title: "Success",
          description: "Saved successfully",
          type: "success",
        });
        is_loading_file.value = false;
      } catch (error) {
        toastRef.value?.showToast({
          title: "Error",
          description: "Something went wrong",
          type: "error",
        });
        is_loading_file.value = false;
      }
    } catch (error) {
      toastRef.value?.showToast({
        title: "Error",
        description: "Something went wrong",
        type: "error",
      });
      is_loading_file.value = false;
    }
  } else {
    try {
      await Promise.all(promises);

      if (type.value === "standart") {
        refetchHse();
      } else {
        refetchHseAdditional();
      }
      attachment.value.modelOpenInputData = false;
      toastRef.value?.showToast({
        title: "Success",
        description: "Saved successfully",
        type: "success",
      });
      is_loading_file.value = false;
    } catch (error) {
      toastRef.value?.showToast({
        title: "Error",
        description: "Something went wrong",
        type: "error",
      });
      is_loading_file.value = false;
    }
  }
};

// function searchTable() {
//   clearTimeout(timeout.value);
//   timeout.value = window.setTimeout(() => {
//     params.currentPage = 1;
//     refetchHse();
//   }, 1000);
// }

// ADDITIONAL
const params_additional = reactive({
  search: "",
  filters: `project_uuid,${route.params.id_project}&type,additionals`,
  currentPage: 1,
  perPage: 10,
});
const total_item_additional = ref(0);
const entitiesHseAdditional = ref<HseInterface[]>([]);

//--- GET HSE ADDITIONAL
const {
  data: dataHseAdditional,
  isFetching: isLoadingHseAdditional,
  refetch: refetchHseAdditional,
} = useQuery({
  queryKey: ["getHseAdditional"],
  queryFn: async () => {
    try {
      const { data } = await transactionStore.getHse(params_additional);
      const response = data as IPagination<ResponseHseInterface[]>;

      total_item_additional.value = response.total;

      const new_arr: HseInterface[] =
        response.data?.map((item) => {
          return {
            id: item.uuid,
            name: item.title,
            document: item.documents
              ? {
                  file: item.documents
                    ? item.documents.map((el) => ({
                        id: el.uuid,
                        name: el.document_original_name,
                        size: el.document_size,
                        file: el.document_link,
                      }))
                    : [],
                }
              : null,
            note: null,
            document_original: item.document,
            documents_original: item.documents,
          };
        }) || [];
      entitiesHseAdditional.value = new_arr;

      return response;
    } catch (error: any) {
      const err = error as AxiosError;
      throw err.response;
    }
  },
  refetchOnWindowFocus: false,
});
//--- END

//--- DELETE HSE ADDITIONAL
const { mutate: deleteHseAdditional, isPending: isLoadingDeleteHseAdditional } =
  useMutation({
    mutationFn: async (id: string) => {
      return await transactionStore.deleteHse(id);
    },
    onSuccess: () => {
      toastRef.value?.showToast({
        title: "Success",
        description: "Deleted successfully",
        type: "success",
      });
      open_delete.value = false;
      refetchHseAdditional();
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

//--- UPDATE HSE ADDITIONAL
const { mutate: updateAdditional, isPending: isLoadingUpdateHseAdditional } =
  useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: CreateHseInterface;
    }) => {
      return await transactionStore.updateHse(id, payload);
    },
    onSuccess: async () => {
      updateHse.value.modelOpenInputData = false;
      toastRef.value?.showToast({
        title: "Success",
        description: "Deleted successfully",
        type: "success",
      });
      refetchHseAdditional();
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

const paginationAdditional = computed(() => {
  return {
    totalItems: total_item_additional.value,
    itemsPerPage: params_additional.perPage,
    currentPage: params_additional.currentPage,
  };
});

const changePageAdditional = (e: number) => {
  params_additional.currentPage = e;
  refetchHse();
};

const changeLimitAdditional = (e: string) => {
  params_additional.perPage = parseInt(e);
  params_additional.currentPage = 1;
  refetchHse();
};

const handleCreateAdditional = (e: string) => {
  createHse({
    title: e,
    document: null,
    project_uuid: route.params?.id_project as string,
    type: "additionals",
  });
};

const handleUpdate = (item: HseInterface) => {
  selected_item.value = item;
};

const onUpdate = (name: string) => {
  updateAdditional({
    id: selected_item.value?.id as string,
    payload: {
      title: name,
      type: "additionals",
      project_uuid: route.params?.id_project as string,
      document: selected_item.value?.documents_original || [],
    },
  });
};

const handleDelete = (item: HseInterface) => {
  selected_item.value = item;
  open_delete.value = true;
};

const onDeleteHseAdditional = () => {
  deleteHseAdditional(selected_item.value?.id as string);
};
</script>

<template>
  <Toast ref="toastRef" />

  <ModalDelete
    v-model="open_delete"
    :title="selected_item?.name"
    :loading="isLoadingDeleteHseAdditional"
    @delete="onDeleteHseAdditional"
  />

  <div class="flex flex-col gap-16">
    <Table
      label-create="HSE"
      :columns="ColumnsHse"
      :entities="entitiesHse"
      :loading="isLoadingHse"
      :pagination="pagination"
      :is-create="false"
      :is-action="false"
      :is-search="false"
      @change-page="changePage"
      @change-limit="changeLimit"
    >
      <template #column_attachment="{ entity }">
        <div class="w-full flex justify-center">
          <FormOnlyUploadFile
            ref="attachment"
            :multiple="true"
            :value="entity.document"
            :label="entity.name"
            :loading="is_loading_file"
            @save="(e) => saveFile(e, entity, 'standart')"
          />
        </div>
      </template>
      <template #column_preview="{ entity }">
        <div
          v-if="
            entity.document?.file?.length && entity.document?.file?.length > 0
          "
          class="w-full flex justify-center"
        >
          <div
            class="bg-cyan-500 text-center border border-neutral-50 rounded-lg px-2 min-w-[120px] text-base text-neutral-50 cursor-pointer"
            @click="preview(entity)"
          >
            Preview
          </div>
        </div>
        <div v-else class="text-center">-</div>
      </template>
    </Table>

    <div class="relative">
      <div class="absolute right-0">
        <FormCreateRow
          ref="createRow"
          label="HSE"
          :loading="isLoadingCreateHse"
          @save="handleCreateAdditional"
        />
      </div>

      <Table
        label-create="HSE"
        class="mt-8"
        :columns="ColumnsHseAdditional"
        :entities="entitiesHseAdditional"
        :pagination="paginationAdditional"
        :loading="isLoadingHseAdditional"
        :is-create="false"
        :is-search="false"
        @change-page="changePageAdditional"
        @change-limit="changeLimitAdditional"
      >
        <template #header_action>
          <div class="px-3 py-1.5">
            <p class="v-table-th-text">Action</p>
          </div>
        </template>
        <template #column_attachment="{ entity }">
          <div class="w-full flex justify-center">
            <FormOnlyUploadFile
              ref="attachment"
              :multiple="true"
              :value="entity.document"
              :label="entity.name"
              :loading="is_loading_file"
              @save="(e) => saveFile(e, entity, 'additionals')"
            />
          </div>
        </template>
        <template #column_preview="{ entity }">
          <div
            v-if="
              entity.document?.file?.length && entity.document?.file?.length > 0
            "
            class="w-full flex justify-center"
          >
            <div
              class="bg-cyan-500 text-center border border-neutral-50 rounded-lg px-2 min-w-[120px] text-base text-neutral-50 cursor-pointer"
              @click="preview(entity)"
            >
              Preview
            </div>
          </div>
          <div v-else class="text-center">-</div>
        </template>
        <template #column_action="{ entity }">
          <div class="flex items-center justify-center gap-4">
            <FormEditHse
              ref="updateHse"
              :value="entity.name"
              :loading="isLoadingUpdateHseAdditional"
              label="Name"
              @save="onUpdate"
              @open="handleUpdate(entity)"
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
</template>
