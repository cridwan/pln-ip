<script setup lang="ts">
import { reactive, ref, computed, type PropType, watch } from "vue";
import { useRoute } from "vue-router";

import { Button, Modal, Select } from "@/components";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useInfiniteQuery, useMutation } from "@tanstack/vue-query";
import { mergeArrays } from "@/helpers/global";
import type { IPagination, IParams } from "@/types/GlobalType";
import type {
  FilterPartStdInterface,
  PartStdCreateModelInterface,
  PartStdInterface,
} from "@/modules/master/types/PartStdType";

import type {
  FormPartCloneInterface,
  PartStdTransactionInterface,
} from "../types/PartStdType";
import { useTransactionStore } from "../stores/TransactionStore";

type OptionType = {
  label: string;
  value: string;
};

const props = defineProps({
  selectedValue: {
    type: Object as PropType<PartStdTransactionInterface | null>,
  },
  dataForm: {
    type: Object as PropType<FilterPartStdInterface | null>,
  },
  isAdditional: {
    type: Boolean,
    default: false,
  },
  original_uuid: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["success", "error"]);

const route = useRoute();
const transactionStore = useTransactionStore();
const is_loading_part = ref(false);
const options_part = ref<OptionType[]>([]);
const modelValue = defineModel<boolean>({ default: false });

const model = ref<PartStdCreateModelInterface>({
  location_uuid: "",
  unit_uuid: "",
  machine_uuid: "",
  inspection_type_uuid: "",
  sub_bidang_uuid: "",
  bidang_uuid: "",
  scope_standart_uuid: "",
  equipment_uuid: "",
  activity_uuid: "",
  part_uuid: "",
  qty: "",
});
const v$_form = reactive(useVuelidate());
const rules = computed(() => {
  return {
    part_uuid: {
      required: helpers.withMessage(`This field is required`, required),
    },
  };
});

//--- GET PART
const params_part = reactive({
  search: "",
  filter: "",
  filters: [],
  currentPage: 1,
  perPage: 10,
  ...(props.isAdditional
    ? {
        activity_uuid: props.dataForm?.activity_uuid as string,
        additional_scope_uuid: route.query.original_uuid as string,
        project_uuid: route.params.id_project as string,
      }
    : {
        activity_uuid: props.dataForm?.activity_uuid as string,
        inspection_type_uuid: route.params.id_inspection as string,
        project_uuid: route.params.id_project as string,
      }),
});
const {
  data: dataPart,
  refetch: refetchPart,
  fetchNextPage: fetchNextPagePart,
  hasNextPage: hasNextPagePart,
  isFetchingNextPage: isFetchingNextPagePart,
} = useInfiniteQuery({
  queryKey: ["getPartStdFormTransaction"],
  enabled: !props.selectedValue && !is_loading_part.value,
  queryFn: async ({ pageParam = 1 }) => {
    try {
      const { data } = await transactionStore.getPartSelect(
        {
          ...params_part,
          currentPage: pageParam,
        },
        props.isAdditional ? "/add-scope/detail" : ""
      );

      const response = data as IPagination<PartStdInterface[]>;

      return response;
    } catch (error: any) {
      throw error.response;
    } finally {
      is_loading_part.value = false;
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

//--- CREATE PART
const { mutate: createPartStd, isPending: isLoadingCreate } = useMutation({
  mutationFn: async (payload: FormPartCloneInterface) => {
    return await transactionStore.clonePartStd(
      payload,
      props.isAdditional ? "/add-scope/detail" : ""
    );
  },
  onSuccess: (data) => {
    modelValue.value = false;
    emit("success");
  },
  onError: (error) => {
    emit("error", error);
  },
});
//--- END

const timeout_part = ref(0);
const searchPart = () => {
  clearTimeout(timeout_part.value);
  timeout_part.value = window.setTimeout(() => {
    is_loading_part.value = true;
    params_part.currentPage = 1;
    refetchPart();
  }, 1000);
};
const scrollPart = (e: Event) => {
  const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLElement;
  if (
    scrollTop + clientHeight >= scrollHeight - 1 &&
    hasNextPagePart.value &&
    !isFetchingNextPagePart.value
  ) {
    fetchNextPagePart();
  }
};

const handleSubmit = async () => {
  const isValid = await v$_form.value.$validate();

  if (!isValid) return;

  if (props.selectedValue) {
    // updatePartStd({
    //   id: props.selectedValue.uuid,
    //   payload: {
    //     activity_uuid: model.value.activity_uuid,
    //     part_uuid: model.value.part_uuid,
    //   },
    // });
  } else {
    createPartStd({
      activity_uuid: props.dataForm?.activity_uuid as string,
      part_uuid: model.value.part_uuid,
    });
  }
};

const setValue = () => {
  model.value.part_uuid = "";
};

const resetValue = () => {
  model.value.part_uuid = "";
};

watch(modelValue, (value) => {
  if (!value) {
    setTimeout(() => {
      resetValue();
    }, 500);
  } else {
    if (props.selectedValue) {
      setValue();
    } else {
      resetValue();
    }
  }
});

watch(
  [modelValue, dataPart],
  ([_, newPart]) => {
    if (props.selectedValue) {
      const new_data: OptionType[] =
        newPart?.pages
          .flatMap((page) => page?.data)
          ?.map((item) => {
            return { value: item.uuid, label: item.part.name };
          }) || [];
      options_part.value = mergeArrays(
        [
          {
            value: props.selectedValue?.part_uuid,
            label: props.selectedValue?.name,
          },
        ],
        new_data.filter((item) => item.value !== props.selectedValue?.part_uuid)
      );
    } else {
      const new_data: OptionType[] =
        newPart?.pages
          .flatMap((page) => page?.data)
          ?.map((item) => {
            return {
              value: item.uuid,
              label: `${item.part.name} / ${item.part?.global_unit?.name}`,
            };
          }) || [];
      options_part.value = new_data;
    }
  },
  { deep: true, immediate: true }
);

watch(
  () => props.original_uuid,
  () => {
    params_part.activity_uuid = props.original_uuid as string;

    refetchPart();
  },
  { deep: true, immediate: true }
);

defineExpose({ refetchPart });
</script>

<template>
  <Modal
    width="440"
    height="200"
    :showButtonClose="false"
    :title="props.selectedValue ? 'Ubah Part' : 'Tambah Part'"
    v-model="modelValue"
  >
    <form
      class="flex flex-col gap-4 max-h-[calc(100vh-200px)] overflow-y-auto mx-[-20px] px-5"
      @submit.prevent="handleSubmit"
    >
      <Select
        v-model="model.part_uuid"
        v-model:model-search="params_part.search"
        label="Part"
        options_label="label"
        options_value="value"
        :search="true"
        :loading="is_loading_part"
        :loading-next-page="isFetchingNextPagePart"
        :rules="rules.part_uuid"
        :options="options_part"
        @scroll="scrollPart"
        @search="searchPart"
      />

      <div class="w-full flex items-center gap-4 mt-4">
        <Button
          text="Batal"
          class="w-full"
          variant="secondary"
          :disabled="isLoadingCreate"
          @click="modelValue = false"
        />
        <Button
          type="submit"
          text="Simpan"
          class="w-full"
          color="blue"
          :disabled="isLoadingCreate"
          :loading="isLoadingCreate"
        />
      </div>
    </form>
  </Modal>
</template>
