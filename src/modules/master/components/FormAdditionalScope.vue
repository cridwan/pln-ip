<script setup lang="ts">
import { reactive, ref, computed, type PropType, watch } from "vue";

import { Button, Input, Modal, Select } from "@/components";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/vue-query";
import type { IPagination, IParams } from "@/types/GlobalType";
import {
  all_characters,
  mergeArrays,
  // numbers_positive_negative,
} from "@/helpers/global";

// import type { LocationInterface } from "../types/LocationType";
// import type { UnitInterface } from "../types/UnitType";
// import type { MachineInterface } from "../types/MachineType";
// import type { InspectionTypeInterface } from "../types/InspectionType";
import { useMasterStore } from "../stores/MasterStore";
import type {
  AdditionalScopeCreateInterface,
  AdditionalScopeCreateModelInterface,
  AdditionalScopeFilterInterface,
  AdditionalScopeInterface,
} from "../types/AdditionalScopeType";
import type { SequenceInterface } from "../types/SequenceTypes";

type OptionType = {
  value: string;
  label: string;
};

const props = defineProps({
  selectedValue: {
    type: Object as PropType<AdditionalScopeInterface | null>,
  },
  dataForm: {
    type: Object as PropType<AdditionalScopeFilterInterface | null>,
  },
});

const emit = defineEmits(["success", "error"]);

const masterStore = useMasterStore();

const queryClient = useQueryClient();
const modelValue = defineModel<boolean>({ default: false });
const is_loading_sequence = ref(false);
const options_sequence = ref<OptionType[]>([]);

const model = ref<AdditionalScopeCreateModelInterface>({
  name: "",
  sequence_uuid: "",
  inspection_type_uuid: props.dataForm?.inspection_type_uuid || "",
});
const v$_form = reactive(useVuelidate());
const rules = computed(() => {
  return {
    name: {
      required: helpers.withMessage(`This field is required`, required),
    },
    sequence_uuid: {
      required: helpers.withMessage(`This field is required`, required),
    },
  };
});

//--- GET SEQUENCE
const params_sequence = reactive<IParams>({
  search: "",
  filter: "",
  filters: [],
  currentPage: 1,
  perPage: 10,
});
const {
  data: dataSequence,
  refetch: refetchSequence,
  fetchNextPage: fetchNextPageSequence,
  hasNextPage: hasNextPageSequence,
  isFetchingNextPage: isFetchingNextPageSequence,
} = useInfiniteQuery({
  queryKey: ["getSequenceInspection"],
  enabled: !props.selectedValue && !is_loading_sequence.value,
  queryFn: async ({ pageParam = 1 }) => {
    try {
      const { data } = await masterStore.getSequence({
        ...params_sequence,
        currentPage: pageParam,
      });

      const response = data.data as IPagination<SequenceInterface[]>;

      return response;
    } catch (error: any) {
      throw error.response;
    } finally {
      is_loading_sequence.value = false;
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

//--- CREATE ADDITIONAL SCOPE
const { mutate: createAdditionalScope, isPending: isLoadingCreate } =
  useMutation({
    mutationFn: async (payload: AdditionalScopeCreateInterface) => {
      return await masterStore.createAdditionalScope(payload);
    },
    onSuccess: () => {
      modelValue.value = false;
      emit("success");
    },
    onError: (error) => {
      console.log(error);
      emit("error", error);
    },
  });
//--- END

//--- UPDATE ADDITIONAL SCOPE
const { mutate: updateAdditionalScope, isPending: isLoadingUpdate } =
  useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: AdditionalScopeCreateInterface;
    }) => {
      return await masterStore.updateAdditionalScope(id, payload);
    },
    onSuccess: async () => {
      modelValue.value = false;
      emit("success");
    },
    onError: (error) => {
      console.log(error);
      emit("error", error);
    },
  });
//--- END

const handleSubmit = async () => {
  const isValid = await v$_form.value.$validate();

  if (!isValid) return;

  if (props.selectedValue) {
    updateAdditionalScope({
      id: props.selectedValue?.uuid,
      payload: {
        name: model.value.name,
        sequence_uuid: model.value.sequence_uuid || "",
        inspection_type_uuid: model.value.inspection_type_uuid || "",
      },
    });
  } else {
    createAdditionalScope({
      name: model.value.name,
      sequence_uuid: model.value.sequence_uuid || "",
      inspection_type_uuid: model.value.inspection_type_uuid || "",
    });
  }
};

const setValue = () => {
  model.value.name = props.selectedValue?.name || "";

  model.value.sequence_uuid = props.selectedValue?.sequence?.uuid || "";
  model.value.inspection_type_uuid =
    props.selectedValue?.inspection_type_uuid || "";
};

const resetValue = () => {
  model.value = {
    name: "",
    sequence_uuid: "",
    inspection_type_uuid: props.dataForm?.inspection_type_uuid || "",
  };
};

const timeout_sequence = ref(0);
const searchSequence = () => {
  clearTimeout(timeout_sequence.value);
  timeout_sequence.value = window.setTimeout(() => {
    is_loading_sequence.value = true;
    params_sequence.currentPage = 1;
    refetchSequence();
  }, 1000);
};
const scrollSequence = (e: Event) => {
  const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLElement;
  if (
    scrollTop + clientHeight >= scrollHeight - 1 &&
    hasNextPageSequence.value &&
    !isFetchingNextPageSequence.value
  ) {
    fetchNextPageSequence();
  }
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
  [modelValue, dataSequence],
  ([newModel, newSequence]) => {
    if (props.selectedValue) {
      const new_data: OptionType[] =
        newSequence?.pages
          .flatMap((page) => page?.data)
          ?.map((item) => {
            return { value: item.uuid, label: item.name };
          }) || [];

      options_sequence.value = mergeArrays(
        [
          {
            value: props.selectedValue?.sequence_uuid,
            label: props.selectedValue?.sequence?.name,
          },
        ],
        new_data.filter(
          (item) => item.value !== props.selectedValue?.sequence_uuid
        )
      );
    } else {
      const new_data: OptionType[] =
        newSequence?.pages
          .flatMap((page) => page?.data)
          ?.map((item) => {
            return { value: item.uuid, label: item.name };
          }) || [];

      options_sequence.value = new_data;
    }
  },
  { deep: true, immediate: true }
);
</script>

<template>
  <Modal
    width="440"
    height="200"
    :showButtonClose="false"
    title="Tambah Additional Scope"
    v-model="modelValue"
  >
    <form
      class="flex flex-col gap-4 max-h-[calc(100vh-200px)] overflow-y-auto mx-[-20px] px-5"
      @submit.prevent="handleSubmit"
    >
      <Input
        v-model="model.name"
        star
        label="Nama"
        :rules="rules.name"
        :custom_symbols="all_characters"
      />
      <Select
        v-model="model.sequence_uuid"
        star
        label="Sequence"
        options_label="label"
        options_value="value"
        v-model:model-search="params_sequence.search"
        :search="true"
        :loading="is_loading_sequence"
        :loading-next-page="isFetchingNextPageSequence"
        :rules="rules.sequence_uuid"
        :options="options_sequence"
        @scroll="scrollSequence"
        @search="searchSequence"
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
