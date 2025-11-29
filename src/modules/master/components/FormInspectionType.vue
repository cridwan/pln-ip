<script setup lang="ts">
import { reactive, ref, computed, type PropType, watch } from "vue";

import { Button, Input, Modal, Select } from "@/components";
import useVuelidate from "@vuelidate/core";
import { required, helpers, requiredIf } from "@vuelidate/validators";
import {
  useInfiniteQuery,
  useMutation,
} from "@tanstack/vue-query";
import { all_characters, mergeArrays } from "@/helpers/global";
import type { IPagination, IParams } from "@/types/GlobalType";

import type {
  InspectionTypeCreateInterface,
  InspectionTypeInterface,
  InspectionTypeModelCreateInterface,
} from "../types/InspectionType";
import { useMasterStore } from "../stores/MasterStore";
import type { SequenceInterface } from "../types/SequenceTypes";

type OptionType = {
  value: string;
  label: string;
};

const props = defineProps({
  selectedValue: {
    type: Object as PropType<InspectionTypeInterface | null>,
  },
  dataForm: {
    type: Object as PropType<InspectionTypeModelCreateInterface | null>,
  },
});

const emit = defineEmits(["success", "error"]);

const masterStore = useMasterStore();
const modelValue = defineModel<boolean>({ default: false });
const is_loading_sequence = ref(false);
const options_sequence = ref<OptionType[]>([]);

const model = ref<InspectionTypeModelCreateInterface>({
  name: "",
  machine_uuid: "",
  location_uuid: "",
  unit_uuid: "",
  sequence_uuid: "",
});
const v$_form = reactive(useVuelidate());
const rules = computed(() => {
  return {
    name: {
      required: helpers.withMessage(`This field is required`, required),
    },
    sequence_uuid: {
      required: helpers.withMessage(`This field is required`, requiredIf(false)),
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

//--- CREATE INSPECTION TYPE
const { mutate: createInspectionType, isPending: isLoadingCreate } =
  useMutation({
    mutationFn: async (payload: InspectionTypeCreateInterface) => {
      return await masterStore.createInspectionType(payload);
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

//--- UPDATE INSPECTION TYPE
const { mutate: updateInspectionType, isPending: isLoadingUpdate } =
  useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: InspectionTypeCreateInterface;
    }) => {
      return await masterStore.updateInspectionType(id, payload);
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
    updateInspectionType({
      id: props.selectedValue?.uuid,
      payload: model.value,
    });
  } else {
    createInspectionType(model.value);
  }
};

const setValue = () => {
  model.value = {
    name: props.selectedValue?.name || "",
    machine_uuid: props.selectedValue?.machine_uuid || "",
    location_uuid: props?.selectedValue?.machine?.unit?.location_uuid || "",
    unit_uuid: props.selectedValue?.machine?.unit_uuid || "",
    sequence_uuid: props.selectedValue?.sequence_uuid || "",
  };
};

const resetValue = () => {
  model.value = {
    name: "",
    machine_uuid: props.dataForm?.machine_uuid || "",
    location_uuid: props.dataForm?.location_uuid || "",
    unit_uuid: props.dataForm?.unit_uuid || "",
    sequence_uuid: "",
  };
};
// sequence
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
// end sequence

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

// sequence
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
// end sequence
</script>

<template>
  <Modal width="440" height="200" :showButtonClose="false"
    :title="props.selectedValue ? 'Ubah Tipe Inspeksi' : 'Tambah Tipe Inspeksi'" v-model="modelValue">
    <form class="flex flex-col gap-4 max-h-[calc(100vh-200px)] overflow-y-auto mx-[-20px] px-5"
      @submit.prevent="handleSubmit">
      <Input v-model="model.name" star :rules="rules.name" :custom_symbols="all_characters" label="Nama Inspeksi" />
      <Select v-model="model.sequence_uuid" label="Sequence" options_label="label" options_value="value"
        v-model:model-search="params_sequence.search" :search="true" :loading="is_loading_sequence"
        :loading-next-page="isFetchingNextPageSequence" :rules="rules.sequence_uuid" :options="options_sequence"
        @scroll="scrollSequence" @search="searchSequence" />

      <div class="w-full flex items-center gap-4 mt-4">
        <Button text="Batal" class="w-full" variant="secondary" :disabled="isLoadingCreate || isLoadingUpdate"
          @click="modelValue = false" />
        <Button type="submit" text="Simpan" class="w-full" color="blue" :disabled="isLoadingCreate || isLoadingUpdate"
          :loading="isLoadingCreate || isLoadingUpdate" />
      </div>
    </form>
  </Modal>
</template>
