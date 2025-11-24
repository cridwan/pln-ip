<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import type { AxiosError } from "axios";
import { storeToRefs } from "pinia";

import { Modal, Table, Button, Icon, Toast, ModalDelete } from "@/components";
import { ColumnsActivity } from "@/modules/master/constants/ActivityConstant";
import type { IPagination } from "@/types/GlobalType";
import type {
  ActivityInterface,
  ActivityModelCreateInterface,
} from "@/modules/master/types/AcitivityType";
import { useMutation, useQuery } from "@tanstack/vue-query";
import { useAuthStore } from "@/modules/auth/stores/AuthStore";

import { useTransactionStore } from "../../stores/TransactionStore";
import FormActivity from "../../components/FormActivity.vue";
import { parsedUrl } from "@/helpers/global";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  id: {
    type: String,
    default: "",
  },
  original_uuid: {
    type: String,
    default: "",
  },
  statusApproval: {
    type: String,
    default: "approve",
  },
  isAdditional: {
    type: Boolean,
    default: false,
  },
  isAction: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["update:modelValue"]);
const formActivity = ref<InstanceType<typeof FormActivity> | null>(null)
const authStore = useAuthStore();
const { access_token } = storeToRefs(authStore);
const transactionStore = useTransactionStore();
const total_item = ref(0);
const params = reactive({
  search: "",
  filter: "",
  filters: [
    // {
    //   group: "AND",
    //   operator: "EQ",
    //   column: "equipment.scopeStandart.project_uuid",
    //   value: route.params.id_project,
    // },
    {
      group: "AND",
      operator: "EQ",
      column: "equipment.uuid",
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
const dataForm = ref<ActivityModelCreateInterface | null>(null);

const model = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

//--- GET ACTIVITY
const {
  data: dataActivity,
  isFetching: isLoading,
  refetch: refetchActivity,
} = useQuery({
  queryKey: [`getActivityTransactionDetail${props.id}`],
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
  retry: 0,
  enabled: false,
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

    if (formActivity.value?.refetchActivity) {
      formActivity.value.refetchActivity()
    }
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
  refetchActivity();
};

const changeLimit = (e: string) => {
  params.perPage = parseInt(e);
  params.currentPage = 1;
  refetchActivity();
};

const handleCreate = () => {
  dataForm.value = {
    equipment_uuid: props.id,
    bidang_uuid: "",
    sub_bidang_uuid: "",
    scope_standart_uuid: "",
  };
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

const handleSuccess = () => {
  toastRef.value?.showToast({
    title: "Success",
    description: "Saved successfully",
    type: "success",
  });
  params.currentPage = 1;
  refetchActivity();

  if (formActivity.value?.refetchActivity) {
    formActivity.value.refetchActivity()
  }
};

const handleError = (error: any) => {
  toastRef.value?.showToast({
    title: "Error",
    description: error?.response?.data?.message || "Something went wrong",
    type: "error",
  });
};

const handleRemoveSuccess = () => {
  refetchActivity();
};

watch(model, (value) => {
  if (value === true) {
    params.filters[0].value = props.id;
    params.currentPage = 1;
    refetchActivity();
  }
});
</script>

<template>
  <Modal width="1000" height="500" :showButtonClose="false" :title="'Data Activity'" v-model="model">
    <div class="flex flex-col">
      <div v-if="statusApproval !== 'approve' && access_token" class="flex justify-end">
        <Button icon_only="plus" size="sm" rounded="full" color="blue" @click="handleCreate" v-show="props.isAction" />
      </div>
      <Table label-create="Sub Bidang" :columns="ColumnsActivity" :entities="dataActivity?.data || []"
        :loading="isLoading" :pagination="pagination" :is-create="false" :is-search="false"
        :is-action="props.isAction && (statusApproval !== 'approve' && access_token !== '')" class="mt-6"
        @change-page="changePage" @change-limit="changeLimit">
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
        <template #column_ik_link="{ entity }">
          <a target="_blank" :href="entity.link_ik1" class="text-base text-neutral-50 text-left" v-if="entity.link_ik1">
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
  </Modal>

  <FormActivity :is-additional="props.isAdditional" v-model="open_form" :data-form="dataForm"
    :original_uuid="props.original_uuid" :selected-value="selected_item" @success="handleSuccess" @error="handleError"
    @removeSucess="handleRemoveSuccess" ref="formActivity" />

  <ModalDelete v-model="open_delete" :title="selected_item?.name" :loading="isLoadingDelete" @delete="onDelete" />
  <Toast ref="toastRef" />
</template>
