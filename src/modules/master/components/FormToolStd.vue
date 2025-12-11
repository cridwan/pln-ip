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
  ToolStdCreateInterface,
  ToolStdCreateModelInterface,
  ToolStdInterface,
} from "../types/ToolStdType";
import type { ToolsInterface } from "../types/ToolsType";

type OptionType = {
  label: string;
  value: string;
};

const props = defineProps({
  selectedValue: {
    type: Object as PropType<ToolStdInterface | null>,
  },
  dataForm: {
    type: Object as PropType<ToolStdCreateModelInterface | null>,
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
const is_loading_tool = ref(false);
const options_tool = ref<OptionType[]>([]);
const modelValue = defineModel<boolean>({ default: false });
const model_details = ref<{ name: string; id: string }[]>([
  { id: "0", name: "" },
]);

const model = ref<ToolStdCreateModelInterface>({
  location_uuid: "",
  unit_uuid: "",
  machine_uuid: "",
  inspection_type_uuid: "",
  sub_bidang_uuid: "",
  bidang_uuid: "",
  scope_standart_uuid: "",
  equipment_uuid: "",
  activity_uuid: "",
  tool_uuid: "",
  qty: "",
});
const v$_form = reactive(useVuelidate());
const rules = computed(() => {
  return {
    qty: {
      required: helpers.withMessage(`This field is required`, required),
    },
    tool_uuid: {
      required: helpers.withMessage(`This field is required`, required),
    },
  };
});

//--- GET tool
const params_tool = reactive<IParams>({
  search: "",
  filters: [],
  currentPage: 1,
  perPage: 10,
});
const {
  data: dataTool,
  refetch: refetchTool,
  fetchNextPage: fetchNextPageTool,
  hasNextPage: hasNextPageTool,
  isFetchingNextPage: isFetchingNextPageTool,
} = useInfiniteQuery({
  queryKey: ["getToolStdForm"],
  enabled: !props.selectedValue && !is_loading_tool.value,
  queryFn: async ({ pageParam = 1 }) => {
    try {
      const { data } = await masterStore.getTools({
        ...params_tool,
        currentPage: pageParam,
      });

      const response = data.data as IPagination<ToolsInterface[]>;

      return response;
    } catch (error: any) {
      throw error.response;
    } finally {
      is_loading_tool.value = false;
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
const { mutate: createToolStd, isPending: isLoadingCreate } = useMutation({
  mutationFn: async (payload: ToolStdCreateInterface) => {
    return await masterStore.createToolStd(payload);
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
const { mutate: updateToolStd, isPending: isLoadingUpdate } = useMutation({
  mutationFn: async ({
    id,
    payload,
  }: {
    id: string;
    payload: ToolStdCreateInterface;
  }) => {
    return await masterStore.updateToolStd(id, payload);
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

// tool
const timeout_tool = ref(0);
const searchTool = () => {
  clearTimeout(timeout_tool.value);
  timeout_tool.value = window.setTimeout(() => {
    is_loading_tool.value = true;
    params_tool.currentPage = 1;
    refetchTool();
  }, 1000);
};
const scrollTool = (e: Event) => {
  const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLElement;
  if (
    scrollTop + clientHeight >= scrollHeight - 1 &&
    hasNextPageTool.value &&
    !isFetchingNextPageTool.value
  ) {
    fetchNextPageTool();
  }
};
// end

const handleSubmit = async () => {
  const isValid = await v$_form.value.$validate();

  if (!isValid) return;

  if (props.selectedValue) {
    updateToolStd({
      id: props.selectedValue.uuid,
      payload: {
        activity_uuid: model.value.activity_uuid,
        tools_uuid: model.value.tool_uuid,
        qty: parseFloat(model.value.qty),
      },
    });
  } else {
    createToolStd({
      activity_uuid: model.value.activity_uuid,
      tools_uuid: model.value.tool_uuid,
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
    tool_uuid: props.selectedValue?.tools_uuid || "",
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
    tool_uuid: "",
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
  [modelValue, dataTool],
  ([_, newTool]) => {
    if (props.selectedValue) {
      const new_data: OptionType[] =
        newTool?.pages
          .flatMap((page) => page?.data)
          ?.map((item) => {
            return { value: item.uuid, label: item.name };
          }) || [];
      options_tool.value = mergeArrays(
        [
          {
            value: props.selectedValue?.tools_uuid,
            label: props.selectedValue?.tool?.name,
          },
        ],
        new_data.filter(
          (item) => item.value !== props.selectedValue?.tools_uuid
        )
      );
    } else {
      const new_data: OptionType[] =
        newTool?.pages
          .flatMap((page) => page?.data)
          ?.map((item) => {
            return { value: item.uuid, label: item.name };
          }) || [];
      options_tool.value = new_data;
    }
  },
  { deep: true, immediate: true }
);

watch(
  () => props.dataForm,
  (newVal) => {
    params_tool.filters = [
      {
        group: "AND",
        operator: "EQ",
        column: "activity_uuid",
        value: String(props.dataForm?.activity_uuid),
      },
    ];

    refetchTool();
  },
  { deep: true, immediate: true }
);
defineExpose({ refetchTool });
</script>

<template>
  <Modal
    width="440"
    height="200"
    :showButtonClose="false"
    :title="
      props.selectedValue
        ? `Ubah Tool ${isAdditional ? '' : 'Standart'}`
        : `Tambah Tool ${isAdditional ? '' : 'Standart'}`
    "
    v-model="modelValue"
  >
    <form
      class="flex flex-col gap-4 max-h-[calc(100vh-200px)] overflow-y-auto mx-[-20px] px-5"
      @submit.prevent="handleSubmit"
    >
      <Select
        v-model="model.tool_uuid"
        star
        label="Tool"
        options_label="label"
        options_value="value"
        v-model:model-search="params_tool.search"
        :search="true"
        :loading="is_loading_tool"
        :loading-next-page="isFetchingNextPageTool"
        :rules="rules.tool_uuid"
        :options="options_tool"
        @scroll="scrollTool"
        @search="searchTool"
      />
      <Input
        v-model="model.qty"
        star
        label="Qty"
        :rules="rules.qty"
        :custom_symbols="numbers_positive"
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
