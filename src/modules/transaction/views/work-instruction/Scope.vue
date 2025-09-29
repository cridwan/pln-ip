<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import type { AxiosError } from "axios";
import { storeToRefs } from "pinia";

import type {
  // CreateDocumentInterface,
  IPagination,
  ResponseDocumentInterface,
} from "@/types/GlobalType";
import { Button, ModalDelete, Table, Toast } from "@/components";
// import type { ValueUploadType } from "@/components/fields/Upload.vue";
import { useQuery, useMutation } from "@tanstack/vue-query";
// import { useGlobalStore } from "@/stores/GlobalStore";
import type {
  // CreateScopeInterface,
  FilterScopeInterface,
  ResponseScopeInterface,
  ScopeInterface,
} from "@/modules/transaction/types/ScopeType";
import { useTransactionStore } from "@/modules/transaction/stores/TransactionStore";
import FilterScope from "@/modules/transaction/components/FilterScope.vue";
import FormScope from "@/modules/transaction/components/FormScope.vue";
import type { EquipmentInterface } from "@/modules/transaction/types/EquipmentType";
import { useAuthStore } from "@/modules/auth/stores/AuthStore";

import { ColumnsWorkInstruction } from "../../constants/WorkInstructionConstant";
import ButtonPreview from "../../components/ButtonPreview.vue";
// import FormOnlyUploadFile from "../../components/FormOnlyUploadFile.vue";
import type { ProjectInterface } from "../../types/ProjectType";
import TableEquipment from "../../components/scope/TableEquipment.vue";

// const attachment = ref<any>(null);
const open_form = ref(false);
const authStore = useAuthStore();
const { access_token } = storeToRefs(authStore);
const entitiesScope = ref<ScopeInterface[]>([]);
const selected_item = ref<ScopeInterface>();
const dataForm = ref<FilterScopeInterface | null>(null);
const transactionStore = useTransactionStore();
// const globalStore = useGlobalStore();
const route = useRoute();
const params = reactive({
  search: "",
  filters: [
    {
      group: "AND",
      operator: "EQ",
      column: "project_uuid",
      value: route.params.id_project,
    },
  ],
  currentPage: 1,
  perPage: 10,
});
const total_item = ref(0);
const toastRef = ref<InstanceType<typeof Toast> | null>(null);
// const asset_welness = ref<any>(null);
// const oh_recom = ref<any>(null);
// const wo_priority = ref<any>(null);
// const history = ref<any>(null);
// const rla = ref<any>(null);
// const ncr = ref<any>(null);
const open_delete = ref(false);
// const file = ref<File | null>(null);
// const is_loading_create = ref(false);
const timeout = ref(0);
// const file_deleted = ref("");
const children_active = ref<{ id: string; open: boolean }[]>([]);
const is_loading_filter = ref(false);

//--- GET STATUS APPROVAL
const { data: dataApproval } = useQuery({
  queryKey: ["getApprovalAtWorkInstruction"],
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

//--- GET SCOPE
const { isFetching: isLoadingScope, refetch: refetchScope } = useQuery({
  queryKey: ["getScopeTransaction"],
  queryFn: async () => {
    try {
      const { data } = await transactionStore.getScopeStandar(params);
      const response = data.data as IPagination<ResponseScopeInterface[]>;
      total_item.value = response.total;
      const new_arr: ScopeInterface[] =
        response?.data?.map((item) => {
          return {
            id: item.uuid,
            asset: item.name || "",
            children: [],
            asset_welness: item.asset_welnes
              ? {
                  color: item.asset_welnes?.color,
                  note: item.asset_welnes?.note,
                  file: item.asset_welnes?.document
                    ? [
                        {
                          id: item.asset_welnes.document.uuid,
                          name: item.asset_welnes.document
                            .document_original_name,
                          size: item.asset_welnes.document.document_size,
                          file: item.asset_welnes.document.document_link,
                        },
                      ]
                    : [],
                }
              : null,
            oh_recom: item.oh_recom
              ? {
                  note: item.oh_recom?.note,
                  file: item.oh_recom?.document
                    ? [
                        {
                          id: item.oh_recom.document.uuid,
                          name: item.oh_recom.document.document_original_name,
                          size: item.oh_recom.document.document_size,
                          file: item.oh_recom.document.document_link,
                        },
                      ]
                    : [],
                }
              : null,
            wo_priority: item.wo_priority
              ? {
                  note: item.wo_priority?.note,
                  file: item.wo_priority?.document
                    ? [
                        {
                          id: item.wo_priority.document.uuid,
                          name: item.wo_priority.document
                            .document_original_name,
                          size: item.wo_priority.document.document_size,
                          file: item.wo_priority.document.document_link,
                        },
                      ]
                    : [],
                }
              : null,
            history: item.history
              ? {
                  note: item.history?.note,
                  file: item.history?.document
                    ? [
                        {
                          id: item.history.document.uuid,
                          name: item.history.document.document_original_name,
                          size: item.history.document.document_size,
                          file: item.history.document.document_link,
                        },
                      ]
                    : [],
                }
              : null,
            rla: item.rla
              ? {
                  note: item.rla?.note,
                  file: item.rla?.document
                    ? [
                        {
                          id: item.rla.document.uuid,
                          name: item.rla.document.document_original_name,
                          size: item.rla.document.document_size,
                          file: item.rla.document.document_link,
                        },
                      ]
                    : [],
                }
              : null,
            ncr: item.ncr
              ? {
                  note: item.ncr?.note,
                  file: item.ncr?.document
                    ? [
                        {
                          id: item.ncr.document.uuid,
                          name: item.ncr.document.document_original_name,
                          size: item.ncr.document.document_size,
                          file: item.ncr.document.document_link,
                        },
                      ]
                    : [],
                }
              : null,
            document: item.document,
          };
        }) || [];
      entitiesScope.value = new_arr;
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

//--- GET TOTAL DURATION
const params_duration = reactive({
  project_uuid: route.params.id_project,
});
const {
  data: dataDuration,
  isFetching: isLoadingDuration,
  refetch: refetchDuration,
} = useQuery({
  queryKey: ["getTotalDurationScope"],
  queryFn: async () => {
    try {
      const { data } = await transactionStore.getTotalDurationScope(
        params_duration
      );
      return data.data.data;
    } catch (error: any) {
      const err = error as AxiosError;
      throw err.response;
    }
  },
  retry: 0,
  refetchOnWindowFocus: false,
});
//--- END

// //--- CREATE SCOPE
// const { mutate: createScope } = useMutation({
//   mutationFn: async (payload: CreateScopeInterface) => {
//     return await transactionStore.createScopeStandar(payload);
//   },
//   onSuccess: async (data) => {
//     if (file.value === null && file_deleted.value === "") {
//       refetchScope();
//       refetchDuration();
//       asset_welness.value.modelOpenInputData = false;
//       toastRef.value?.showToast({
//         title: "Success",
//         description: "Saved successfully",
//         type: "success",
//       });
//       file.value = null;
//       is_loading_create.value = false;
//     } else {
//       if (file_deleted.value) {
//         try {
//           await globalStore.deleteDocument([file_deleted.value]);

//           refetchScope();
//           refetchDuration();
//           asset_welness.value.modelOpenInputData = false;
//           toastRef.value?.showToast({
//             title: "Success",
//             description: "Saved successfully",
//             type: "success",
//           });
//           file.value = null;
//           is_loading_create.value = false;
//         } catch (error) {
//           toastRef.value?.showToast({
//             title: "Error",
//             description: "Something went wrong",
//             type: "error",
//           });
//           file.value = null;
//           is_loading_create.value = false;
//         }
//       } else {
//         createDocument({
//           document: file.value as File,
//           document_type: "App\\Models\\Transaction\\ScopeStandartAsset",
//           document_uuid: data.data.data.uuid,
//         });
//       }
//     }
//   },
//   onError: (error: any) => {
//     console.log(error);
//     toastRef.value?.showToast({
//       title: "Error",
//       description: error?.response?.data?.message || "Something went wrong",
//       type: "error",
//     });
//     file.value = null;
//     is_loading_create.value = false;
//   },
//   retry: 0,
// });
// //--- END

// //--- CREATE DOCUMENT
// const { mutate: createDocument } = useMutation({
//   mutationFn: async (payload: CreateDocumentInterface) => {
//     return await globalStore.createDocument(payload);
//   },
//   onSuccess: () => {
//     refetchScope();
//     refetchDuration();
//     oh_recom.value.modelOpenInputData = false;
//     wo_priority.value.modelOpenInputData = false;
//     history.value.modelOpenInputData = false;
//     rla.value.modelOpenInputData = false;
//     ncr.value.modelOpenInputData = false;
//     toastRef.value?.showToast({
//       title: "Success",
//       description: "Saved successfully",
//       type: "success",
//     });
//     file.value = null;
//     is_loading_create.value = false;
//   },
//   onError: (error: any) => {
//     console.log(error);
//     toastRef.value?.showToast({
//       title: "Error",
//       description: error?.response?.data?.message || "Something went wrong",
//       type: "error",
//     });
//     file.value = null;
//     is_loading_create.value = false;
//   },
//   retry: 0,
// });
// //--- END

//--- DELETE SCOPE
const { mutate: deleteScope, isPending: isLoadingDelete } = useMutation({
  mutationFn: async (id: string) => {
    return await transactionStore.deleteScopeStandar(id);
  },
  onSuccess: () => {
    refetchScope();
    refetchDuration();
    toastRef.value?.showToast({
      title: "Success",
      description: "Deleted successfully",
      type: "success",
    });
    open_delete.value = false;
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
  refetchScope();
};

const changeLimit = (e: string) => {
  params.perPage = parseInt(e);
  params.currentPage = 1;
  refetchScope();
};

// const handleDelete = (e: ScopeInterface) => {
//   selected_item.value = e;
//   open_delete.value = true;
// };

const onDelete = () => {
  deleteScope(selected_item.value?.id as string);
};

function searchTable() {
  clearTimeout(timeout.value);
  timeout.value = window.setTimeout(() => {
    params.currentPage = 1;
    refetchScope();
  }, 1000);
}

const setFilter = () => {
  params.filters = [
    {
      group: "AND",
      operator: "EQ",
      column: "project_uuid",
      value: route.params.id_project,
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
      column: "project_uuid",
      value: route.params.id_project,
    },
  ];
};

const handleResetFilter = () => {
  is_loading_filter.value = true;
  resetFilter();
  refetchScope();
};

const handleOnFilter = (data: FilterScopeInterface) => {
  is_loading_filter.value = true;
  dataForm.value = data;
  setFilter();
  refetchScope();
};

const handleCreate = () => {
  console.log(dataForm);
  open_form.value = true;
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

const preview = (item: ResponseDocumentInterface) => {
  const a = document.createElement("a");
  a.href =
    import.meta.env.VITE_API_BASE_URL.replace("api", "") + item?.document_link;
  a.download = item?.document_original_name || "";
  a.target = "_blank";
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

// const saveFile = async (
//   e: { file: ValueUploadType[] },
//   entity: ScopeInterface
// ) => {
//   if (e.file.length === 0) {
//     is_loading_create.value = true;
//     try {
//       await globalStore.deleteDocument([entity.document?.uuid as string]);
//       refetchScope();
//       attachment.value.modelOpenInputData = false;
//       toastRef.value?.showToast({
//         title: "Success",
//         description: "Saved successfully",
//         type: "success",
//       });
//       is_loading_create.value = false;
//     } catch (error) {
//       toastRef.value?.showToast({
//         title: "Error",
//         description: "Something went wrong",
//         type: "error",
//       });
//       is_loading_create.value = false;
//     }
//   } else {
//     is_loading_create.value = true;
//     createDocument({
//       document: e.file?.[0]?.file as File,
//       document_type: "App\\Models\\Transaction\\ScopeStandart",
//       document_uuid: entity.id,
//     });
//   }
// };

const openChildren = (value: boolean, item: ScopeInterface) => {
  const find_index = children_active.value.findIndex((el) => el.id === item.id);
  if (find_index < 0) {
    children_active.value = [
      ...children_active.value,
      { id: item.id, open: value },
    ];
  } else {
    children_active.value[find_index].open = value;
  }
};

const getData = (id: string, response: EquipmentInterface[]) => {
  entitiesScope.value = entitiesScope.value.map((item) => {
    if (item.id === id) {
      return { ...item, children: response };
    } else {
      return { ...item };
    }
  });
};
</script>

<template>
  <Toast ref="toastRef" />
  <ModalDelete
    v-model="open_delete"
    :title="selected_item?.asset"
    :loading="isLoadingDelete"
    @delete="onDelete"
  />
  <div
    class="absolute right-12 rounded-full bg-cyan-500 text-neutral-50 text-center w-fit px-4 py-1"
  >
    <span v-if="isLoadingDuration">Loading...</span>
    <span v-else>{{ dataDuration }} Days</span>
  </div>
  <Button
    v-if="
      dataForm?.sub_bidang_uuid &&
      dataApproval?.status !== 'approve' &&
      access_token
    "
    icon_only="plus"
    class="absolute right-[9rem] top-[6.5rem]"
    size="sm"
    rounded="full"
    color="blue"
    @click="handleCreate"
  />
  <div class="flex gap-8">
    <div class="basis-1/5">
      <FilterScope
        @filter="handleOnFilter"
        @reset-filter="handleResetFilter"
        :loading="is_loading_filter"
      />
    </div>
    <div class="flex-1 overflow-auto">
      <div class="max-w-full min-w-full">
        <Table
          label-create="Asset"
          :columns="ColumnsWorkInstruction"
          :entities="entitiesScope"
          :loading="isLoadingScope"
          :pagination="pagination"
          :is-create="false"
          :isAction="false"
          v-model:model-search="params.search"
          @change-page="changePage"
          @change-limit="changeLimit"
          @search="searchTable"
          @open-children="openChildren"
        >
          <template #column_preview="{ entity }">
            <p v-if="!entity.document" class="text-white">No Document</p>
            <ButtonPreview v-else @click="preview(entity.document)" />
          </template>
          <template #children="{ entity, index, parentActive }">
            <tr
              v-if="
                children_active.find((el) => el.id === entity.id)?.open === true
              "
            >
              <td :colspan="ColumnsWorkInstruction.length + 1">
                <div class="bg-[rgb(207,225,255,0.4)] px-3 py-2 rounded">
                  <TableEquipment
                    :is-action="false"
                    :id="entity.id"
                    :entity="entity.children"
                    :status-approval="dataApproval?.status"
                    :open="
                      children_active.find((el) => el.id === entity.id)?.open
                    "
                    @get-data="getData"
                  />
                </div>
              </td>
            </tr>
          </template>
        </Table>
      </div>
    </div>

    <FormScope
      v-model="open_form"
      :dataForm="dataForm"
      :selected-value="selected_item"
      @success="handleSuccess"
      @error="handleError"
    />
  </div>
</template>
