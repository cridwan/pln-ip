<script setup lang="ts">
import { reactive, ref, computed, type PropType, watch } from "vue";

import { Button, Modal } from "@/components";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useInfiniteQuery, useMutation } from "@tanstack/vue-query";
import type {
  IPagination,
  IParams,
} from "@/types/GlobalType";
import { useMasterStore } from "@/modules/master/stores/MasterStore";
import Select from "@/components/fields/Select.vue";
import { useRoute } from "vue-router";
import type {
  EquipmentInterface,
} from "@/modules/master/types/EquipmentType";
import { useTransactionStore } from "../stores/TransactionStore";
import type { ActivityModelCreateInterface } from "@/modules/master/types/AcitivityType";
import type {
  FormActivityInterface,
  FormActivityInterfaceClone,
} from "../types/ActivityType";

const props = defineProps({
  dataForm: {
    type: Object as PropType<ActivityModelCreateInterface | null>,
  },
  isAdditional: {
    type: Boolean,
    default: false
  },
  original_uuid: {
    type: String,
    default: ''
  }
});

type OptionType = {
  value: string;
  label: string;
};
const localForm = ref<ActivityModelCreateInterface | null | undefined>(
  props.dataForm
);
const uploadProgress = ref<number>(0);
const emit = defineEmits(["success", "error", "removeSucess"]);
const is_loading_activity = ref(false);
const options_scope = ref<OptionType[]>([]);
const masterStore = useMasterStore();
const modelValue = defineModel<boolean>({ default: false });
const model_details = ref<{ name: string; id: string }[]>([
  { id: "0", name: "" },
]);

const model = ref<FormActivityInterface>({
  activity_uuid: "",
});
const route = useRoute();
const transaction = useTransactionStore();
const v$_form = reactive(useVuelidate());
const rules = computed(() => {
  return {
    activity_uuid: {
      required: helpers.withMessage(`This field is required`, required),
    },
  };
});

// --- CREATE EQUIPMENT
const { mutate: createActivityClone, isPending: isLoadingScope } = useMutation({
  mutationFn: async (payload: FormActivityInterfaceClone) => {
    return transaction.createActivityClone(payload);
  },
  onSuccess: (data) => {
    modelValue.value = false;
    emit("success");
  },
  onError: (error) => {
    emit("error", error);
  },
});
// ---END

const handleSubmit = async () => {
  const isValid = await v$_form.value.$validate();

  if (!isValid) return;

  const payload: FormActivityInterfaceClone = {
    activity_uuid: model.value.activity_uuid,
    equipment_uuid: props.dataForm?.equipment_uuid as string,
  };

  createActivityClone(payload);
};

const setValue = () => {
  model.value.activity_uuid = "";
};

const resetValue = () => {
  model.value.activity_uuid = "";
  model_details.value = [{ name: "", id: "0" }];
  uploadProgress.value = 0;
};

watch(modelValue, (value) => {
  if (!value) {
    setTimeout(() => {
      resetValue();
    }, 500);
  } else {
    setValue();
  }
});

//--- GET SCOPE
const params_activity = reactive({
  search: "",
  filter: "",
  filters: [],
  currentPage: 1,
  perPage: 10,
  ...(props.isAdditional ? {
    equipment_uuid: props.dataForm?.equipment_uuid as string,
    additional_scope_uuid: route.params.id_scope as string,
  } : {
    equipment_uuid: props.dataForm?.equipment_uuid as string,
    inspection_type_uuid: route.params.id_inspection as string,
  })
});
const {
  data: dataActivity,
  refetch: refetchActivity,
  fetchNextPage: fetchNextPageActivity,
  hasNextPage: hasNextPageActivity,
  isFetchingNextPage: isFetchingNextPageActivity,
} = useInfiniteQuery({
  queryKey: ["getActivityTransactionForm"],
  enabled: !is_loading_activity.value,
  queryFn: async ({ pageParam = 1 }) => {
    try {
      const { data } = await transaction.getSelectActivity({
        ...params_activity,
        currentPage: pageParam,
      });

      const response = data.data as IPagination<EquipmentInterface[]>;
      return response;
    } catch (error: any) {
      throw error.response;
    } finally {
      is_loading_activity.value = false;
    }
  },
  refetchOnWindowFocus: false,
  getNextPageParam: (lastPage) => {
    if (!lastPage?.data?.length) return undefined;
    return lastPage.current_page + 1;
  },
  initialPageParam: 1,
});
//--- END

// scope
const timeout_scope = ref(0);
const searchScope = () => {
  clearTimeout(timeout_scope.value);
  timeout_scope.value = window.setTimeout(() => {
    is_loading_activity.value = true;
    params_activity.currentPage = 1;
    refetchActivity();
  }, 1000);
};
const scrollScope = (e: Event) => {
  const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLElement;
  if (
    scrollTop + clientHeight >= scrollHeight - 1 &&
    hasNextPageActivity.value &&
    !isFetchingNextPageActivity.value
  ) {
    fetchNextPageActivity();
  }
};

watch(
  [modelValue, dataActivity],
  ([newModel, newScope]) => {
    console.log(newScope);
    const new_data: OptionType[] =
      newScope?.pages
        .flatMap((page) => page?.data)
        ?.map((item) => {
          return { value: item?.uuid, label: item?.name };
        }) || [];
    options_scope.value = new_data;
  },
  { deep: true, immediate: true }
);

watch(() => props.original_uuid, () => {
  params_activity.equipment_uuid = props.original_uuid as string;
  refetchActivity();
}, { deep: true, immediate: true })

defineExpose({ refetchActivity })
</script>

<template>
  <Modal width="440" height="200" :showButtonClose="false" title="Tambah Activity" v-model="modelValue">
    <form class="flex flex-col gap-4 max-h-[calc(100vh-200px)] overflow-y-auto mx-[-20px] px-5"
      @submit.prevent="handleSubmit">
      <Select v-model="model.activity_uuid" label="Activity" options_label="label" options_value="value"
        v-model:model-search="params_activity.search" :search="true" :loading="is_loading_activity"
        :loading-next-page="isFetchingNextPageActivity" :rules="rules.activity_uuid" :options="options_scope"
        @scroll="scrollScope" @search="searchScope" />

      <div class="w-full flex items-center gap-4 mt-4">
        <Button text="Batal" class="w-full" variant="secondary" :disabled="false" @click="modelValue = false" />
        <Button type="submit" text="Simpan" class="w-full" color="blue" :disabled="false" :loading="false" />
      </div>
    </form>
  </Modal>
</template>
