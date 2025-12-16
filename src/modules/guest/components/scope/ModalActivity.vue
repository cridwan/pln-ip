<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import type { AxiosError } from "axios";

import { Modal, Table } from "@/components";
import { ColumnsActivityGuest } from "@/modules/master/constants/ActivityConstant";
import type { IPagination } from "@/types/GlobalType";
import type {
  ActivityInterface,
} from "@/modules/master/types/AcitivityType";
import { useQuery } from "@tanstack/vue-query";
import { useMasterStore } from "@/modules/master/stores/MasterStore";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  id: {
    type: String,
    default: "",
  },
  isAdditional: {
    type: Boolean,
    default: false,
  },
  scopeName: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(["update:modelValue"]);
const masterStore = useMasterStore();
const total_item = ref(0);
const params = reactive({
  search: "",
  filter: "",
  filters: [
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
  queryKey: [`getActivityGuestDetail${props.id}`],
  queryFn: async () => {
    try {
      const { data } = await masterStore.getActivity(params);
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

watch(model, (value) => {
  if (value === true) {
    params.filters[0].value = props.id;
    params.currentPage = 1;
    refetchActivity();
  }
});
</script>

<template>
  <Modal width="1000" height="500" :showButtonClose="false" :title="`Data Activity > ${scopeName}`" v-model="model">
    <div class="flex flex-col">
      <Table label-create="Sub Bidang" :columns="ColumnsActivityGuest" :entities="dataActivity?.data || []"
        :is_logging="false" :loading="isLoading" :pagination="pagination" :is-create="false" :is-search="false"
        :is-action="false" class="mt-6" @change-page="changePage" @change-limit="changeLimit">
        <template #column_equipment="{ entity }">
          <p class="text-base text-neutral-50 text-left">
            {{ entity.equipment?.name }}
          </p>
        </template>
      </Table>
    </div>
  </Modal>
</template>
