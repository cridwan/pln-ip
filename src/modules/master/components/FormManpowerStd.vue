<script setup lang="ts">
import { reactive, ref, computed, type PropType, watch } from "vue";

import { Button, Input, Modal } from "@/components";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useInfiniteQuery, useMutation } from "@tanstack/vue-query";
import { mergeArrays, numbers_positive } from "@/helpers/global";

import { useMasterStore } from "../stores/MasterStore";
import type {
  IPagination,
  IParams,
  ResponseDocumentInterface,
} from "@/types/GlobalType";
import { Select } from "@/components";
import type {
  ManpowerStdCreateInterface,
  ManpowerStdCreateModelInterface,
  ManpowerStdInterface,
} from "../types/ManpowerStdType";
import type { ManpowerInterface } from "../types/ManpowerType";

type OptionType = {
  label: string;
  value: string;
};

const props = defineProps({
  selectedValue: {
    type: Object as PropType<ManpowerStdInterface | null>,
  },
  dataForm: {
    type: Object as PropType<ManpowerStdCreateModelInterface | null>,
  },
});

const modelUpload = ref<File | null>(null);
const documentValues = ref<ResponseDocumentInterface | null>(null);
const emit = defineEmits(["success", "error", "removeSucess"]);

const masterStore = useMasterStore();
const is_loading_manpower = ref(false);
const options_manpower = ref<OptionType[]>([]);
const modelValue = defineModel<boolean>({ default: false });
const model_details = ref<{ name: string; id: string }[]>([
  { id: "0", name: "" },
]);

const model = ref<ManpowerStdCreateModelInterface>({
  location_uuid: "",
  unit_uuid: "",
  machine_uuid: "",
  inspection_type_uuid: "",
  sub_bidang_uuid: "",
  bidang_uuid: "",
  scope_standart_uuid: "",
  equipment_uuid: "",
  activity_uuid: "",
  manpower_uuid: "",
  qty: "",
});
const v$_form = reactive(useVuelidate());
const rules = computed(() => {
  return {
    qty: {
      required: helpers.withMessage(`This field is required`, required),
    },
    manpower_uuid: {
      required: helpers.withMessage(`This field is required`, required),
    },
  };
});

//--- GET manpower
const params_manpower = reactive<IParams>({
  search: "",
  filters: [],
  currentPage: 1,
  perPage: 10,
});
const {
  data: dataManpower,
  refetch: refetchManpower,
  fetchNextPage: fetchNextPageManpower,
  hasNextPage: hasNextPageManpower,
  isFetchingNextPage: isFetchingNextPageManpower,
} = useInfiniteQuery({
  queryKey: ["getManpowerStdForm"],
  enabled: !props.selectedValue && !is_loading_manpower.value,
  queryFn: async ({ pageParam = 1 }) => {
    try {
      const { data } = await masterStore.getManpower({
        ...params_manpower,
        currentPage: pageParam,
      });

      const response = data.data as IPagination<ManpowerInterface[]>;

      return response;
    } catch (error: any) {
      throw error.response;
    } finally {
      is_loading_manpower.value = false;
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
  mutationFn: async (payload: ManpowerStdCreateInterface) => {
    return await masterStore.createManpowerStd(payload);
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
    payload: ManpowerStdCreateInterface;
  }) => {
    return await masterStore.updateManpowerStd(id, payload);
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
const timeout_manpower = ref(0);
const searchManpower = () => {
  clearTimeout(timeout_manpower.value);
  timeout_manpower.value = window.setTimeout(() => {
    is_loading_manpower.value = true;
    params_manpower.currentPage = 1;
    refetchManpower();
  }, 1000);
};
const scrollManpower = (e: Event) => {
  const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLElement;
  if (
    scrollTop + clientHeight >= scrollHeight - 1 &&
    hasNextPageManpower.value &&
    !isFetchingNextPageManpower.value
  ) {
    fetchNextPageManpower();
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
        manpower_uuid: model.value.manpower_uuid,
        qty: parseFloat(model.value.qty),
      },
    });
  } else {
    createPartStd({
      activity_uuid: model.value.activity_uuid,
      manpower_uuid: model.value.manpower_uuid,
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
    manpower_uuid: props.selectedValue?.manpower_uuid || "",
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
    manpower_uuid: "",
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

const handleChangeFile = (e: File) => {
  modelUpload.value = e;
};

const removeSuccess = () => {
  documentValues.value = null;
  emit("removeSucess");
};

// scope
watch(
  [modelValue, dataManpower],
  ([_, newPart]) => {
    if (props.selectedValue) {
      const new_data: OptionType[] =
        newPart?.pages
          .flatMap((page) => page?.data)
          ?.map((item) => {
            return { value: item.uuid, label: item.name };
          }) || [];
      options_manpower.value = mergeArrays(
        [
          {
            value: props.selectedValue?.manpower_uuid,
            label: props.selectedValue?.manpower?.name,
          },
        ],
        new_data.filter(
          (item) => item.value !== props.selectedValue?.manpower_uuid
        )
      );
    } else {
      const new_data: OptionType[] =
        newPart?.pages
          .flatMap((page) => page?.data)
          ?.map((item) => {
            return { value: item.uuid, label: item.name };
          }) || [];
      options_manpower.value = new_data;
    }
  },
  { deep: true, immediate: true }
);

watch(() => props.dataForm, (newVal) => {
  params_manpower.filters = [
    {
      group: "AND",
      operator: "EQ",
      column: "activity_uuid",
      value: String(props.dataForm?.activity_uuid),
    }
  ];

  refetchManpower()
}, { deep: true, immediate: true })
defineExpose({ refetchManpower })
</script>

<template>
  <Modal width="440" height="200" :showButtonClose="false" :title="props.selectedValue
    ? 'Ubah Manpower Standart'
    : 'Tambah Manpower Standart'
    " v-model="modelValue">
    <form class="flex flex-col gap-4 max-h-[calc(100vh-200px)] overflow-y-auto mx-[-20px] px-5"
      @submit.prevent="handleSubmit">
      <Select v-model="model.manpower_uuid" star label="Manpower" options_label="label" options_value="value"
        v-model:model-search="params_manpower.search" :search="true" :loading="is_loading_manpower"
        :loading-next-page="isFetchingNextPageManpower" :rules="rules.manpower_uuid" :options="options_manpower"
        @scroll="scrollManpower" @search="searchManpower" />
      <Input v-model="model.qty" star label="Qty" :rules="rules.qty" :custom_symbols="numbers_positive" />

      <div class="w-full flex items-center gap-4 mt-4">
        <Button text="Batal" class="w-full" variant="secondary" :disabled="isLoadingCreate || isLoadingUpdate"
          @click="modelValue = false" />
        <Button type="submit" text="Simpan" class="w-full" color="blue" :disabled="isLoadingCreate || isLoadingUpdate"
          :loading="isLoadingCreate || isLoadingUpdate" />
      </div>
    </form>
  </Modal>
</template>
