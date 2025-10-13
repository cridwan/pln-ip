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
import type {
  ConsumableMaterialStdCreateInterface,
  ConsumableMaterialStdCreateModelInterface,
  ConsumableMaterialStdInterface,
} from "../types/ConsumableMaterialStdType";
import type { ConsMatInterface } from "../types/ConsumableMaterialType";

type OptionType = {
  label: string;
  value: string;
};

const props = defineProps({
  selectedValue: {
    type: Object as PropType<ConsumableMaterialStdInterface | null>,
  },
  dataForm: {
    type: Object as PropType<ConsumableMaterialStdCreateModelInterface | null>,
  },
});

const modelUpload = ref<File | null>(null);
const documentValues = ref<ResponseDocumentInterface | null>(null);
const emit = defineEmits(["success", "error", "removeSucess"]);

const masterStore = useMasterStore();
const is_loading_consumable_material = ref(false);
const options_consumable_material = ref<OptionType[]>([]);
const modelValue = defineModel<boolean>({ default: false });
const model_details = ref<{ name: string; id: string }[]>([
  { id: "0", name: "" },
]);

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

//--- GET manpower
const params_consumable_material = reactive<IParams>({
  search: "",
  filters: [],
  currentPage: 1,
  perPage: 10,
});
const {
  data: dataConsumableMaterial,
  refetch: refetchConsumableMaterial,
  fetchNextPage: fetchNextPageConsumableMaterial,
  hasNextPage: hasNextPageConsumableMaterial,
  isFetchingNextPage: isFetchingNextPageConsumableMaterial,
} = useInfiniteQuery({
  queryKey: ["getConsumableMaterialStdForm"],
  enabled: !props.selectedValue && !is_loading_consumable_material.value,
  queryFn: async ({ pageParam = 1 }) => {
    try {
      const { data } = await masterStore.getConsMat({
        ...params_consumable_material,
        currentPage: pageParam,
      });

      const response = data.data as IPagination<ConsMatInterface[]>;

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

//--- CREATE SCOPE
const { mutate: createConsumableMaterial, isPending: isLoadingCreate } =
  useMutation({
    mutationFn: async (payload: ConsumableMaterialStdCreateInterface) => {
      return await masterStore.createConsumableMaterialStd(payload);
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
const { mutate: updateConsumableMaterialStd, isPending: isLoadingUpdate } =
  useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: ConsumableMaterialStdCreateInterface;
    }) => {
      return await masterStore.updateConsumableMaterialStd(id, payload);
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
// end

const handleSubmit = async () => {
  const isValid = await v$_form.value.$validate();

  if (!isValid) return;

  if (props.selectedValue) {
    updateConsumableMaterialStd({
      id: props.selectedValue.uuid,
      payload: {
        activity_uuid: model.value.activity_uuid,
        cons_mat_uuid: model.value.cons_mat_uuid,
        qty: parseFloat(model.value.qty),
      },
    });
  } else {
    createConsumableMaterial({
      activity_uuid: model.value.activity_uuid,
      cons_mat_uuid: model.value.cons_mat_uuid,
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
    cons_mat_uuid: props.selectedValue?.cons_mat_uuid || "",
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
    cons_mat_uuid: "",
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
  [modelValue, dataConsumableMaterial],
  ([_, newConsumableMaterial]) => {
    if (props.selectedValue) {
      const new_data: OptionType[] =
        newConsumableMaterial?.pages
          .flatMap((page) => page?.data)
          ?.map((item) => {
            return { value: item.uuid, label: item.name };
          }) || [];
      options_consumable_material.value = mergeArrays(
        [
          {
            value: props.selectedValue?.cons_mat_uuid,
            label: props.selectedValue?.consmat?.name,
          },
        ],
        new_data.filter(
          (item) => item.value !== props.selectedValue?.cons_mat_uuid
        )
      );
    } else {
      const new_data: OptionType[] =
        newConsumableMaterial?.pages
          .flatMap((page) => page?.data)
          ?.map((item) => {
            return { value: item.uuid, label: item.name };
          }) || [];
      options_consumable_material.value = new_data;
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
    :title="
      props.selectedValue
        ? 'Ubah Consumable Material Standart'
        : 'Tambah Consumable Material Standart'
    "
    v-model="modelValue"
  >
    <form
      class="flex flex-col gap-4 max-h-[calc(100vh-200px)] overflow-y-auto mx-[-20px] px-5"
      @submit.prevent="handleSubmit"
    >
      <Select
        v-model="model.cons_mat_uuid"
        star
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
