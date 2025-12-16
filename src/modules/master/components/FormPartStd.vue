<script setup lang="ts">
import { reactive, ref, computed, type PropType, watch } from "vue";

import { Button, Input, Modal } from "@/components";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useInfiniteQuery, useMutation } from "@tanstack/vue-query";
import {
  mergeArrays,
  numbers_decimals,
  numbers_positive,
} from "@/helpers/global";

import { useMasterStore } from "../stores/MasterStore";
import type {
  IPagination,
  IParams,
  ResponseDocumentInterface,
} from "@/types/GlobalType";
import type {
  PartStdCreateInterface,
  PartStdCreateModelInterface,
  PartStdInterface,
} from "../types/PartStdType";
import type { PartInterface } from "../types/PartType";
import { Select } from "@/components";

type OptionType = {
  label: string;
  value: string;
};

const props = defineProps({
  selectedValue: {
    type: Object as PropType<PartStdInterface | null>,
  },
  dataForm: {
    type: Object as PropType<PartStdCreateModelInterface | null>,
  },
  isAdditional: {
    type: Boolean,
    default: false,
  },
});

const modelUpload = ref<File | null>(null);
const documentValues = ref<ResponseDocumentInterface | null>(null);
const emit = defineEmits(["success", "error", "removeSucess"]);

const masterStore = useMasterStore();
const is_loading_part = ref(false);
const options_part = ref<OptionType[]>([]);
const modelValue = defineModel<boolean>({ default: false });
const model_details = ref<{ name: string; id: string }[]>([
  { id: "0", name: "" },
]);

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
    qty: {
      required: helpers.withMessage(`This field is required`, required),
    },
    part_uuid: {
      required: helpers.withMessage(`This field is required`, required),
    },
  };
});

//--- GET PART
const params_part = reactive<IParams>({
  search: "",
  filters: [
    {
      group: "AND",
      operator: "EQ",
      column: "activity_uuid",
      value: null,
    },
  ],
  currentPage: 1,
  perPage: 10,
});
const {
  data: dataPart,
  refetch: refetchPart,
  fetchNextPage: fetchNextPagePart,
  hasNextPage: hasNextPagePart,
  isFetchingNextPage: isFetchingNextPagePart,
} = useInfiniteQuery({
  queryKey: ["getPartStdForm"],
  enabled: !props.selectedValue && !is_loading_part.value,
  queryFn: async ({ pageParam = 1 }) => {
    try {
      const { data } = await masterStore.getPart({
        ...params_part,
        currentPage: pageParam,
      });

      const response = data.data as IPagination<PartInterface[]>;

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

//--- CREATE SCOPE
const { mutate: createPartStd, isPending: isLoadingCreate } = useMutation({
  mutationFn: async (payload: PartStdCreateInterface) => {
    return await masterStore.createPartStd(payload);
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

//--- UPDATE SCOPE
const { mutate: updatePartStd, isPending: isLoadingUpdate } = useMutation({
  mutationFn: async ({
    id,
    payload,
  }: {
    id: string;
    payload: PartStdCreateInterface;
  }) => {
    return await masterStore.updatePartStd(id, payload);
  },
  onSuccess: async () => {
    modelValue.value = false;
    emit("success");
  },
  onError: (error) => {
    emit("error", error);
  },
});
//--- END

// part
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
// end

const handleSubmit = async () => {
  const isValid = await v$_form.value.$validate();

  if (!isValid) return;

  if (props.selectedValue) {
    updatePartStd({
      id: props.selectedValue.uuid,
      payload: {
        activity_uuid: model.value.activity_uuid,
        part_uuid: model.value.part_uuid,
        qty: parseFloat(model.value.qty),
      },
    });
  } else {
    createPartStd({
      activity_uuid: model.value.activity_uuid,
      part_uuid: model.value.part_uuid,
      qty: parseFloat(model.value.qty),
    });
  }
};

const setValue = () => {
  model.value = {
    location_uuid:
      props.selectedValue?.activity?.equipment?.scope_standart?.inspection_type
        ?.machine?.unit?.location_uuid || "",
    unit_uuid:
      props.selectedValue?.activity?.equipment?.scope_standart?.inspection_type
        ?.machine?.unit_uuid || "",
    machine_uuid:
      props.selectedValue?.activity?.equipment?.scope_standart?.inspection_type
        ?.machine_uuid || "",
    inspection_type_uuid:
      props.selectedValue?.activity?.equipment?.scope_standart
        ?.inspection_type_uuid || "",
    sub_bidang_uuid:
      props.selectedValue?.activity?.equipment?.scope_standart
        ?.sub_bidang_uuid || "",
    bidang_uuid:
      props.selectedValue?.activity?.equipment?.scope_standart?.sub_bidang
        ?.bidang_uuid || "",
    scope_standart_uuid:
      props.selectedValue?.activity?.equipment?.scope_standart_uuid || "",
    equipment_uuid: props.selectedValue?.activity?.equipment_uuid || "",
    activity_uuid: props.selectedValue?.activity_uuid || "",
    part_uuid: props.selectedValue?.part_uuid || "",
    qty: String(props.selectedValue?.qty) || "",
  };
};

const resetValue = () => {
  model.value = {
    location_uuid: props.dataForm?.location_uuid || "",
    unit_uuid: props.dataForm?.unit_uuid || "",
    machine_uuid: props.dataForm?.machine_uuid || "",
    inspection_type_uuid: props.dataForm?.inspection_type_uuid || "",
    sub_bidang_uuid: props.dataForm?.sub_bidang_uuid || "",
    bidang_uuid: props.dataForm?.bidang_uuid || "",
    scope_standart_uuid: props.dataForm?.scope_standart_uuid || "",
    equipment_uuid: props.dataForm?.equipment_uuid || "",
    activity_uuid: props.dataForm?.activity_uuid || "",
    part_uuid: "",
    qty: "",
  };
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
  () => props.dataForm,
  (newData) => {
    params_part.filters = [
      {
        group: "AND",
        operator: "EQ",
        column: "activity_uuid",
        value: String(props.dataForm?.activity_uuid),
      },
    ];

    refetchPart();
  },
  { immediate: true, deep: true }
);

const handleChangeFile = (e: File) => {
  modelUpload.value = e;
};

const removeSuccess = () => {
  documentValues.value = null;
  emit("removeSucess");
};

// scope
watch(
  [modelValue, dataPart],
  ([_, newPart]) => {
    if (props.selectedValue) {
      const new_data: OptionType[] =
        newPart?.pages
          .flatMap((page) => page?.data)
          ?.map((item) => {
            return {
              value: item.uuid,
              label: `${item.name} / ${item.global_unit?.name}`,
            };
          }) || [];
      options_part.value = mergeArrays(
        [
          {
            value: props.selectedValue?.part_uuid,
            label: `${props.selectedValue?.part?.name} / ${props.selectedValue?.part?.global_unit?.name} `,
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
              label: `${item.name} / ${item.global_unit?.name}`,
            };
          }) || [];
      options_part.value = new_data;
    }
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
    :title="
      props.selectedValue
        ? `Ubah Part ${isAdditional ? '' : 'Standart'}`
        : `Tambah Part ${isAdditional ? '' : 'Standart'}`
    "
    v-model="modelValue"
  >
    <form
      class="flex flex-col gap-4 max-h-[calc(100vh-200px)] overflow-y-auto mx-[-20px] px-5"
      @submit.prevent="handleSubmit"
    >
      <Select
        v-model="model.part_uuid"
        star
        label="Part"
        options_label="label"
        options_value="value"
        v-model:model-search="params_part.search"
        :search="true"
        :loading="is_loading_part"
        :loading-next-page="isFetchingNextPagePart"
        :rules="rules.part_uuid"
        :options="options_part"
        @scroll="scrollPart"
        @search="searchPart"
      />
      <Input
        v-model="model.qty"
        star
        label="Qty"
        :is_decimal="true"
        :rules="rules.qty"
        :custom_symbols="numbers_decimals"
      />

      <div class="w-full flex items-center gap-4 mt-4">
        <Button
          text="Batal"
          class="w-full"
          variant="secondary"
          :disabled="isLoadingCreate || isLoadingUpdate"
          @click="modelValue = false"
        />
        <Button
          type="submit"
          text="Simpan"
          class="w-full"
          color="blue"
          :disabled="isLoadingCreate || isLoadingUpdate"
          :loading="isLoadingCreate || isLoadingUpdate"
        />
      </div>
    </form>
  </Modal>
</template>
