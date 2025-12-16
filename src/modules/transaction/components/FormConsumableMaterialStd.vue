<script setup lang="ts">
import { reactive, ref, computed, type PropType, watch } from "vue";

import { Button, Select, Modal } from "@/components";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useInfiniteQuery, useMutation } from "@tanstack/vue-query";
import { mergeArrays } from "@/helpers/global";

// import { useMasterStore } from "@/modules/master/stores/MasterStore";
import type {
  IPagination,
  // IParams,
  // ResponseDocumentInterface,
} from "@/types/GlobalType";
import type {
  ConsumableMaterialStdCreateModelInterface,
  ConsumableMaterialStdInterface,
  FilterConsumableMaterialStdInterface,
} from "@/modules/master/types/ConsumableMaterialStdType";
import { useTransactionStore } from "../stores/TransactionStore";
import type {
  ConsumableMaterialStdTransactionInterface,
  FormConsMatCloneInterface,
} from "../types/ConsumableMaterialStdType";
import { useRoute } from "vue-router";

type OptionType = {
  label: string;
  value: string;
};

const props = defineProps({
  selectedValue: {
    type: Object as PropType<ConsumableMaterialStdTransactionInterface | null>,
  },
  dataForm: {
    type: Object as PropType<FilterConsumableMaterialStdInterface | null>,
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

// const modelUpload = ref<File | null>(null);
// const documentValues = ref<ResponseDocumentInterface | null>(null);
const emit = defineEmits(["success", "error", "removeSucess"]);
const route = useRoute();
// const masterStore = useMasterStore();
const transactionStore = useTransactionStore();
const is_loading_consumable_material = ref(false);
const options_consumable_material = ref<OptionType[]>([]);
const modelValue = defineModel<boolean>({ default: false });

const model = ref<ConsumableMaterialStdCreateModelInterface>({
  location_uuid: "",
  unit_uuid: "",
  machine_uuid: "",
  inspection_type_uuid: "",
  sub_bidang_uuid: "",
  bidang_uuid: "",
  scope_standart_uuid: "",
  equipment_uuid: "",
  activity_uuid: "",
  cons_mat_uuid: "",
  qty: "",
});
const v$_form = reactive(useVuelidate());
const rules = computed(() => {
  return {
    qty: {
      required: helpers.withMessage(`This field is required`, required),
    },
    cons_mat_uuid: {
      required: helpers.withMessage(`This field is required`, required),
    },
  };
});

//--- GET CONSMAT
const params_consumable_material = reactive({
  search: "",
  filters: [],
  currentPage: 1,
  perPage: 10,
  ...(props.isAdditional
    ? {
        activity_uuid: props?.original_uuid as string,
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
  data: dataConsumableMaterial,
  refetch: refetchConsumableMaterial,
  fetchNextPage: fetchNextPageConsumableMaterial,
  hasNextPage: hasNextPageConsumableMaterial,
  isFetchingNextPage: isFetchingNextPageConsumableMaterial,
} = useInfiniteQuery({
  queryKey: ["getConsumableMaterialStdFormTransaction"],
  enabled: !props.selectedValue && !is_loading_consumable_material.value,
  queryFn: async ({ pageParam = 1 }) => {
    try {
      const { data } = await transactionStore.getConsMatSelect(
        {
          ...params_consumable_material,
          currentPage: pageParam,
        },
        props.isAdditional ? "/add-scope/detail" : ""
      );

      const response = data as IPagination<ConsumableMaterialStdInterface[]>;

      return response;
    } catch (error: any) {
      throw error.response;
    } finally {
      is_loading_consumable_material.value = false;
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

//--- CREATE CONSMAT
const { mutate: createConsumableMaterial, isPending: isLoadingCreate } =
  useMutation({
    mutationFn: async (payload: FormConsMatCloneInterface) => {
      return await transactionStore.cloneConsMatStd(
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

const timeout_consumable_material = ref(0);
const searchConsumableMaterial = () => {
  clearTimeout(timeout_consumable_material.value);
  timeout_consumable_material.value = window.setTimeout(() => {
    is_loading_consumable_material.value = true;
    params_consumable_material.currentPage = 1;
    refetchConsumableMaterial();
  }, 1000);
};
const scrollConsumableMaterial = (e: Event) => {
  const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLElement;
  if (
    scrollTop + clientHeight >= scrollHeight - 1 &&
    hasNextPageConsumableMaterial.value &&
    !isFetchingNextPageConsumableMaterial.value
  ) {
    fetchNextPageConsumableMaterial();
  }
};

const handleSubmit = async () => {
  const isValid = await v$_form.value.$validate();

  if (!isValid) return;

  if (props.selectedValue) {
    // updateConsumableMaterialStd({
    //   id: props.selectedValue.uuid,
    //   payload: {
    //     activity_uuid: model.value.activity_uuid,
    //     cons_mat_uuid: model.value.cons_mat_uuid,
    //     qty: parseFloat(model.value.qty),
    //   },
    // });
  } else {
    createConsumableMaterial({
      activity_uuid: props.dataForm?.activity_uuid as string,
      cons_mat_uuid: model.value.cons_mat_uuid,
    });
  }
};

const setValue = () => {
  model.value.cons_mat_uuid = "";
};

const resetValue = () => {
  model.value.cons_mat_uuid = "";
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
  [modelValue, dataConsumableMaterial],
  ([_, newConsumableMaterial]) => {
    if (props.selectedValue) {
      const new_data: OptionType[] =
        newConsumableMaterial?.pages
          .flatMap((page) => page?.data)
          ?.map((item) => {
            return { value: item.uuid, label: item.consmat.name };
          }) || [];
      options_consumable_material.value = mergeArrays(
        [
          {
            value: props.selectedValue?.uuid,
            label: props.selectedValue?.name,
          },
        ],
        new_data.filter((item) => item.value !== props.selectedValue?.uuid)
      );
    } else {
      const new_data: OptionType[] =
        newConsumableMaterial?.pages
          .flatMap((page) => page?.data)
          ?.map((item) => {
            return {
              value: item.uuid,
              label: `${item.consmat?.name} / ${item.consmat?.global_unit?.name}`,
            };
          }) || [];
      options_consumable_material.value = new_data;
    }
  },
  { deep: true, immediate: true }
);

watch(
  () => props.original_uuid,
  () => {
    params_consumable_material.activity_uuid = props.original_uuid as string;

    refetchConsumableMaterial();
  },
  { deep: true, immediate: true }
);

defineExpose({ refetchConsumableMaterial });
</script>

<template>
  <Modal
    width="440"
    height="200"
    :showButtonClose="false"
    :title="
      props.selectedValue
        ? 'Ubah Consumable Material'
        : 'Tambah Consumable Material'
    "
    v-model="modelValue"
  >
    <form
      class="flex flex-col gap-4 max-h-[calc(100vh-200px)] overflow-y-auto mx-[-20px] px-5"
      @submit.prevent="handleSubmit"
    >
      <Select
        v-model="model.cons_mat_uuid"
        label="Consumable Material"
        options_label="label"
        options_value="value"
        v-model:model-search="params_consumable_material.search"
        :search="true"
        :loading="is_loading_consumable_material"
        :loading-next-page="isFetchingNextPageConsumableMaterial"
        :rules="rules.cons_mat_uuid"
        :options="options_consumable_material"
        @scroll="scrollConsumableMaterial"
        @search="searchConsumableMaterial"
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
