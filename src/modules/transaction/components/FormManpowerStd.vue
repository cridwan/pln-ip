<script setup lang="ts">
import { reactive, ref, computed, type PropType, watch } from "vue";
import { useRoute } from "vue-router";

import { Button, Modal, Select } from "@/components";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useInfiniteQuery, useMutation } from "@tanstack/vue-query";
import { mergeArrays } from "@/helpers/global";
// import { useMasterStore } from "@/modules/master/stores/MasterStore";
import type { IPagination, IParams } from "@/types/GlobalType";
import type {
  FilterManpowerStdInterface,
  ManpowerStdCreateModelInterface,
  ManpowerStdInterface,
} from "@/modules/master/types/ManpowerStdType";

import { useTransactionStore } from "../stores/TransactionStore";
import type { FormManpowerCloneInterface } from "../types/ManpowerStdType";

type OptionType = {
  label: string;
  value: string;
};

const props = defineProps({
  selectedValue: {
    type: Object as PropType<ManpowerStdInterface | null>,
  },
  dataForm: {
    type: Object as PropType<FilterManpowerStdInterface | null>,
  },
});

const emit = defineEmits(["success", "error"]);

const route = useRoute();
// const masterStore = useMasterStore();
const transactionStore = useTransactionStore();
const is_loading_manpower = ref(false);
const options_manpower = ref<OptionType[]>([]);
const modelValue = defineModel<boolean>({ default: false });

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

//--- GET MANPOWER
const params_manpower = reactive<
  IParams & { activity_uuid: string; project_uuid: string }
>({
  search: "",
  filters: [],
  currentPage: 1,
  perPage: 10,
  activity_uuid: props.dataForm?.activity_uuid as string,
  project_uuid: route.params.id_project as string,
});
const {
  data: dataManpower,
  refetch: refetchManpower,
  fetchNextPage: fetchNextPageManpower,
  hasNextPage: hasNextPageManpower,
  isFetchingNextPage: isFetchingNextPageManpower,
} = useInfiniteQuery({
  queryKey: ["getManpowerStdFormTransaction"],
  enabled: !props.selectedValue && !is_loading_manpower.value,
  queryFn: async ({ pageParam = 1 }) => {
    try {
      const { data } = await transactionStore.getManPowerSelect({
        ...params_manpower,
        currentPage: pageParam,
      });

      const response = data as IPagination<ManpowerStdInterface[]>;

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

//--- CREATE MANPOWER
const { mutate: createManpowerStd, isPending: isLoadingCreate } = useMutation({
  mutationFn: async (payload: FormManpowerCloneInterface) => {
    return await transactionStore.cloneManPowerStd(payload);
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

const handleSubmit = async () => {
  const isValid = await v$_form.value.$validate();

  if (!isValid) return;

  if (props.selectedValue) {
    // updateManpowerStd({
    //   id: props.selectedValue.uuid,
    //   payload: {
    //     activity_uuid: model.value.activity_uuid,
    //     manpower_uuid: model.value.manpower_uuid,
    //     qty: parseFloat(model.value.qty),
    //   },
    // });
  } else {
    createManpowerStd({
      activity_uuid: props.dataForm?.activity_uuid as string,
      manpower_uuid: model.value.manpower_uuid,
    });
  }
};

const setValue = () => {
  model.value.manpower_uuid = "";
};

const resetValue = () => {
  model.value.manpower_uuid = "";
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
  [modelValue, dataManpower],
  ([_, newPart]) => {
    if (props.selectedValue) {
      const new_data: OptionType[] =
        newPart?.pages
          .flatMap((page) => page?.data)
          ?.map((item) => {
            return { value: item?.uuid, label: item?.manpower?.name };
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
            return { value: item?.uuid, label: item?.manpower?.name };
          }) || [];
      options_manpower.value = new_data;
    }
  },
  { deep: true, immediate: true }
);

watch(
  () => props.dataForm,
  (newVal) => {
    params_manpower.activity_uuid = newVal?.activity_uuid as string;
    refetchManpower();
  },
  { deep: true, immediate: true }
);
</script>

<template>
  <Modal
    width="440"
    height="200"
    :showButtonClose="false"
    :title="props.selectedValue ? 'Ubah Manpower' : 'Tambah Manpower'"
    v-model="modelValue"
  >
    <form
      class="flex flex-col gap-4 max-h-[calc(100vh-200px)] overflow-y-auto mx-[-20px] px-5"
      @submit.prevent="handleSubmit"
    >
      <Select
        v-model="model.manpower_uuid"
        label="Manpower"
        options_label="label"
        options_value="value"
        v-model:model-search="params_manpower.search"
        :search="true"
        :loading="is_loading_manpower"
        :loading-next-page="isFetchingNextPageManpower"
        :rules="rules.manpower_uuid"
        :options="options_manpower"
        @scroll="scrollManpower"
        @search="searchManpower"
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
