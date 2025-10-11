<script setup lang="ts">
import { reactive, ref, computed, type PropType, watch } from "vue";
import { useRoute } from "vue-router";

import { Button, Select, Modal } from "@/components";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useInfiniteQuery, useMutation } from "@tanstack/vue-query";
import { mergeArrays } from "@/helpers/global";

import { useMasterStore } from "@/modules/master/stores/MasterStore";
import type { IPagination, IParams } from "@/types/GlobalType";
import type {
  ConsumableMaterialStdCreateModelInterface,
  ConsumableMaterialStdInterface,
  FilterConsumableMaterialStdInterface,
} from "@/modules/master/types/ConsumableMaterialStdType";
import { useTransactionStore } from "@/modules/transaction/stores/TransactionStore";
import type { FormConsMatCloneInterface } from "@/modules/transaction/types/ConsumableMaterialStdType";

type OptionType = {
  label: string;
  value: string;
};

const props = defineProps({
  selectedValue: {
    type: Object as PropType<ConsumableMaterialStdInterface | null>,
  },
  dataForm: {
    type: Object as PropType<FilterConsumableMaterialStdInterface | null>,
  },
});

// const modelUpload = ref<File | null>(null);
// const documentValues = ref<ResponseDocumentInterface | null>(null);
const emit = defineEmits(["success", "error", "removeSucess"]);
const route = useRoute();
const masterStore = useMasterStore();
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
    cons_mat_uuid: {
      required: helpers.withMessage(`This field is required`, required),
    },
  };
});

//--- GET CONSMAT
const params_consumable_material = reactive<
  IParams & {
    from_transaction: boolean;
    additional_scope_uuid: string;
    from_add_scope: true;
    original_uuid: string;
  }
>({
  search: "",
  filters: [],
  currentPage: 1,
  perPage: 10,
  from_transaction: true,
  additional_scope_uuid: route.params.id_scope as string,
  from_add_scope: true,
  original_uuid: route.query.original_uuid as string,
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
      const { data } = await masterStore.getConsumableMaterialStd({
        ...params_consumable_material,
        currentPage: pageParam,
      });

      const response = data.data as IPagination<
        ConsumableMaterialStdInterface[]
      >;

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
      return await transactionStore.cloneConsMatStd(payload);
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
            return { value: item.uuid, label: item.consmat?.name };
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
        ? 'Ubah Consumable Material Std'
        : 'Tambah Consumable Material Std'
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
