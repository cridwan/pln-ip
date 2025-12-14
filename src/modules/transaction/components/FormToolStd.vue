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
  FilterToolStdInterface,
  ToolStdCreateModelInterface,
  ToolStdInterface,
} from "@/modules/master/types/ToolStdType";

import type {
  FormToolCloneInterface,
  ToolStdTransactionInterface,
} from "../types/ToolStdType";
import { useTransactionStore } from "../stores/TransactionStore";

type OptionType = {
  label: string;
  value: string;
};

const props = defineProps({
  selectedValue: {
    type: Object as PropType<ToolStdTransactionInterface | null>,
  },
  dataForm: {
    type: Object as PropType<FilterToolStdInterface | null>,
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
const is_loading_tool = ref(false);
const options_tool = ref<OptionType[]>([]);
const modelValue = defineModel<boolean>({ default: false });

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
    tools_uuid: {
      required: helpers.withMessage(`This field is required`, required),
    },
  };
});

//--- GET TOOL
const params_tool = reactive({
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
  data: dataTool,
  refetch: refetchTool,
  fetchNextPage: fetchNextPageTool,
  hasNextPage: hasNextPageTool,
  isFetchingNextPage: isFetchingNextPageTool,
} = useInfiniteQuery({
  queryKey: ["getToolStdFormTransaction"],
  enabled: !props.selectedValue && !is_loading_tool.value,
  queryFn: async ({ pageParam = 1 }) => {
    try {
      const { data } = await transactionStore.getToolStdSelect(
        {
          ...params_tool,
          currentPage: pageParam,
        },
        props.isAdditional ? "/add-scope/detail" : ""
      );

      const response = data as IPagination<ToolStdInterface[]>;

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

//--- CREATE TOOL
const { mutate: createToolStd, isPending: isLoadingCreate } = useMutation({
  mutationFn: async (payload: FormToolCloneInterface) => {
    return await transactionStore.cloneToolStd(
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

const handleSubmit = async () => {
  const isValid = await v$_form.value.$validate();

  if (!isValid) return;

  if (props.selectedValue) {
    // updateToolStd logic if needed
  } else {
    createToolStd({
      activity_uuid: props.dataForm?.activity_uuid as string,
      tools_uuid: model.value.tool_uuid,
    });
  }
};

const setValue = () => {
  model.value.tool_uuid = "";
};

const resetValue = () => {
  model.value.tool_uuid = "";
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
  [modelValue, dataTool],
  ([_, newTool]) => {
    if (props.selectedValue) {
      const new_data: OptionType[] =
        newTool?.pages
          .flatMap((page) => page?.data)
          ?.map((item) => {
            return { value: item.uuid, label: item.tool.name };
          }) || [];
      options_tool.value = mergeArrays(
        [
          {
            value: props.selectedValue?.tool_uuid,
            label: props.selectedValue?.name,
          },
        ],
        new_data.filter((item) => item.value !== props.selectedValue?.tool_uuid)
      );
    } else {
      const new_data: OptionType[] =
        newTool?.pages
          .flatMap((page) => page?.data)
          ?.map((item) => {
            return {
              value: item.uuid,
              label: `${item.tool.name} / ${item.tool?.global_unit?.name}`,
            };
          }) || [];
      options_tool.value = new_data;
    }
  },
  { deep: true, immediate: true }
);

watch(
  () => props.original_uuid,
  () => {
    params_tool.activity_uuid = props.original_uuid as string;

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
    :title="props.selectedValue ? 'Ubah Tool' : 'Tambah Tool'"
    v-model="modelValue"
  >
    <form
      class="flex flex-col gap-4 max-h-[calc(100vh-200px)] overflow-y-auto mx-[-20px] px-5"
      @submit.prevent="handleSubmit"
    >
      <Select
        v-model="model.tool_uuid"
        v-model:model-search="params_tool.search"
        label="Tool"
        options_label="label"
        options_value="value"
        :search="true"
        :loading="is_loading_tool"
        :loading-next-page="isFetchingNextPageTool"
        :rules="rules.tools_uuid"
        :options="options_tool"
        @scroll="scrollTool"
        @search="searchTool"
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
