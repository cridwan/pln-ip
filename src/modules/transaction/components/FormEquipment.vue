<script setup lang="ts">
import { reactive, ref, computed, type PropType, watch } from "vue";

import { Button, Modal } from "@/components";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useInfiniteQuery, useMutation } from "@tanstack/vue-query";
import type {
  IPagination,
  IParams,
  ResponseDocumentInterface,
} from "@/types/GlobalType";
import { useMasterStore } from "@/modules/master/stores/MasterStore";
import Select from "@/components/fields/Select.vue";
import { useRoute } from "vue-router";
import type {
  EquipmentCreateInterface,
  EquipmentInterface,
} from "@/modules/master/types/EquipmentType";
import type {
  FormEquipmentCloneInterface,
  FormEquipmentInterface,
} from "../types/EquipmentType";
import { api } from "@/api/axios";
import { useTransactionStore } from "../stores/TransactionStore";

const props = defineProps({
  dataForm: {
    type: Object as PropType<EquipmentCreateInterface | null>,
  },
});

type OptionType = {
  value: string;
  label: string;
};
const localForm = ref<EquipmentCreateInterface | null | undefined>(
  props.dataForm
);
const uploadProgress = ref<number>(0);
const modelUpload = ref<File | null>(null);
const documentValues = ref<ResponseDocumentInterface | null>(null);
const emit = defineEmits(["success", "error", "removeSucess", "refetchScope"]);
const is_loading_Equipment = ref(false);
const options_equipment = ref<OptionType[]>([]);
const masterStore = useMasterStore();
const modelValue = defineModel<boolean>({ default: false });
const model_details = ref<{ name: string; id: string }[]>([
  { id: "0", name: "" },
]);

const model = ref<FormEquipmentInterface>({
  equipment_uuid: "",
});
const route = useRoute();
const transaction = useTransactionStore();
const v$_form = reactive(useVuelidate());
const rules = computed(() => {
  return {
    equipment_uuid: {
      required: helpers.withMessage(`This field is required`, required),
    },
  };
});

// --- CREATE EQUIPMENT

const { mutate: createEquipmentClone, isPending: isLoadingScope } = useMutation(
  {
    mutationFn: async (payload: FormEquipmentCloneInterface) => {
      return transaction.cloneEquipment(payload);
    },
    onSuccess: (data) => {
      modelValue.value = false;
      emit("success");
    },
    onError: (error) => {
      console.log(error);
      emit("error", error);
    },
  }
);

// ---END

const handleSubmit = async () => {
  const isValid = await v$_form.value.$validate();

  if (!isValid) return;

  console.log(model.value, props.dataForm);

  const payload: FormEquipmentCloneInterface = {
    equipment_uuid: model.value.equipment_uuid,
    scope_standart_uuid: props.dataForm?.scope_standart_uuid as string,
  };

  createEquipmentClone(payload);
};

const setValue = () => {
  model.value.equipment_uuid = "";
};

const resetValue = () => {
  model.value.equipment_uuid = "";
  model_details.value = [{ name: "", id: "0" }];
  uploadProgress.value = 0;
};

watch(modelValue, (value) => {
  if (!value) {
    setTimeout(() => {
      resetValue();
    }, 500);
  } else {
    setValue();
  }
});

//--- GET SCOPE
const params_Equipment = reactive<IParams & { scope_standart_uuid: string, project_uuid: string }>({
  search: "",
  filter: "",
  filters: [],
  currentPage: 1,
  perPage: 10,
  scope_standart_uuid: props.dataForm?.scope_standart_uuid as string,
  project_uuid: route.params.id_project as string,
});
const {
  data: dataEquipment,
  refetch: refetchEquipment,
  fetchNextPage: fetchNextPageEquipment,
  hasNextPage: hasNextPageEquipment,
  isFetchingNextPage: isFetchingNextPageEquipment,
} = useInfiniteQuery({
  queryKey: ["getEquipmentTransactionForm"],
  enabled: !is_loading_Equipment.value,
  queryFn: async ({ pageParam = 1 }) => {
    try {
      const { data } = await transaction.getSelectEquipment({
        ...params_Equipment,
        currentPage: pageParam,
      });

      //   const response = data as IPagination<EquipmentInterface[]>;
      const response = data.data as IPagination<EquipmentInterface[]>;

      return response;
    } catch (error: any) {
      throw error.response;
    } finally {
      is_loading_Equipment.value = false;
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

// Equipment
const timeout_equipment = ref(0);
const searchScope = () => {
  clearTimeout(timeout_equipment.value);
  timeout_equipment.value = window.setTimeout(() => {
    is_loading_Equipment.value = true;
    params_Equipment.currentPage = 1;
    refetchEquipment();
  }, 1000);
};
const scrollScope = (e: Event) => {
  const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLElement;
  if (
    scrollTop + clientHeight >= scrollHeight - 1 &&
    hasNextPageEquipment.value &&
    !isFetchingNextPageEquipment.value
  ) {
    fetchNextPageEquipment();
  }
};

watch(
  [modelValue, dataEquipment],
  ([newModel, newEquipment]) => {
    const new_data: OptionType[] =
      newEquipment?.pages
        .flatMap((page) => page?.data)
        ?.map((item) => {
          return { value: item?.uuid, label: item?.name };
        }) || [];
    options_equipment.value = new_data;
  },
  { deep: true, immediate: true }
);

watch(() => props.dataForm, (newVal) => {
  params_Equipment.scope_standart_uuid = newVal?.scope_standart_uuid as string
  refetchEquipment();
}, { immediate: true, deep: true })
</script>

<template>
  <Modal width="440" height="200" :showButtonClose="false" title="Tambah Equipment" v-model="modelValue">
    <form class="flex flex-col gap-4 max-h-[calc(100vh-200px)] overflow-y-auto mx-[-20px] px-5"
      @submit.prevent="handleSubmit">
      <Select v-model="model.equipment_uuid" label="Equipment" options_label="label" options_value="value"
        v-model:model-search="params_Equipment.search" :search="true" :loading="is_loading_Equipment"
        :loading-next-page="isFetchingNextPageEquipment" :rules="rules.equipment_uuid" :options="options_equipment"
        @scroll="scrollScope" @search="searchScope" />

      <div class="w-full flex items-center gap-4 mt-4">
        <Button text="Batal" class="w-full" variant="secondary" :disabled="false" @click="modelValue = false" />
        <Button type="submit" text="Simpan" class="w-full" color="blue" :disabled="false" :loading="false" />
      </div>
    </form>
  </Modal>
</template>
