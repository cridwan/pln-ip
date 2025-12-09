<script setup lang="ts">
import { reactive, ref, computed, type PropType, watch } from "vue";
import { useRoute } from "vue-router";

import { Button, Modal, Select } from "@/components";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useInfiniteQuery, useMutation } from "@tanstack/vue-query";
import type { IPagination, IParams } from "@/types/GlobalType";
import type { ScopeInterface } from "@/modules/master/types/ScopeType";

import type {
  FilterScopeInterface,
  FormScopeInterface,
} from "../types/ScopeType";
import { useTransactionStore } from "../stores/TransactionStore";

const props = defineProps({
  dataForm: {
    type: Object as PropType<FilterScopeInterface | null>,
  },
  isAdditional: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    default: "Scope",
  },
});

type OptionType = {
  value: string;
  label: string;
};
const transactionStore = useTransactionStore();
const uploadProgress = ref<number>(0);
const emit = defineEmits(["success", "error", "removeSucess", "refetchScope"]);
const is_loading_scope = ref(false);
const options_scope = ref<OptionType[]>([]);
const modelValue = defineModel<boolean>({ default: false });
const model_details = ref<{ name: string; id: string }[]>([
  { id: "0", name: "" },
]);

const model = ref<FormScopeInterface>({
  scope_standart_uuid: "",
  project_uuid: "",
});
const route = useRoute();
const v$_form = reactive(useVuelidate());
const rules = computed(() => {
  return {
    scope_standart_uuid: {
      required: helpers.withMessage(`This field is required`, required),
    },
  };
});

const handleSubmit = async () => {
  const isValid = await v$_form.value.$validate();

  if (!isValid) return;

  createScope(
    props.isAdditional
      ? {
          scope_standart_uuid: model.value.scope_standart_uuid,
          additional_scope_uuid: route.params.id_scope as string,
        }
      : {
          scope_standart_uuid: model.value.scope_standart_uuid,
          project_uuid: route.params.id_project as string,
        }
  );
};

const setValue = () => {
  model.value.scope_standart_uuid = "";
};

const resetValue = () => {
  model.value.scope_standart_uuid = "";
  model_details.value = [{ name: "", id: "0" }];
  uploadProgress.value = 0;
};

const { mutate: createScope, isPending: isLoadingScope } = useMutation({
  mutationFn: async (payload: FormScopeInterface) => {
    return transactionStore.cloneScopeStandar(
      payload,
      props.isAdditional ? "/add-scope/detail" : ""
    );
  },
  onSuccess: (data) => {
    modelValue.value = false;
    emit("success");
  },
  onError: (error) => {
    console.log(error);
    emit("error", error);
  },
});
//--- GET SCOPE
const params_scope = reactive({
  search: "",
  filter: "",
  filters: [],
  currentPage: 1,
  perPage: 10,
  ...(props.isAdditional
    ? {
        sub_bidang_uuid: props.dataForm?.sub_bidang_uuid as string,
        additional_scope_uuid: route.query?.original_uuid as string,
      }
    : {
        inspection_type_uuid: route.params.id_inspection as string,
        sub_bidang_uuid: props.dataForm?.sub_bidang_uuid as string,
      }),
});
const {
  data: dataScope,
  refetch: refetchScope,
  fetchNextPage: fetchNextPageScope,
  hasNextPage: hasNextPageScope,
  isFetchingNextPage: isFetchingNextPageScope,
} = useInfiniteQuery({
  queryKey: ["getScopeTransactionForm"],
  enabled: !is_loading_scope.value,
  queryFn: async ({ pageParam = 1 }) => {
    try {
      const { data } = await transactionStore.getSelectScopeStandar(
        {
          ...params_scope,
          currentPage: pageParam,
        },
        props.isAdditional ? "/add-scope/detail" : ""
      );

      const response = data.data as IPagination<ScopeInterface[]>;

      return response;
    } catch (error: any) {
      throw error.response;
    } finally {
      is_loading_scope.value = false;
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

const timeout_scope = ref(0);
const searchScope = () => {
  clearTimeout(timeout_scope.value);
  timeout_scope.value = window.setTimeout(() => {
    is_loading_scope.value = true;
    params_scope.currentPage = 1;
    refetchScope();
  }, 1000);
};
const scrollScope = (e: Event) => {
  const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLElement;
  if (
    scrollTop + clientHeight >= scrollHeight - 1 &&
    hasNextPageScope.value &&
    !isFetchingNextPageScope.value
  ) {
    fetchNextPageScope();
  }
};

watch(
  [modelValue, dataScope],
  ([newModel, newScope]) => {
    const new_data: OptionType[] =
      newScope?.pages
        .flatMap((page) => page?.data)
        ?.map((item) => {
          return { value: item?.uuid, label: item?.name };
        }) || [];
    options_scope.value = new_data;
  },
  { deep: true, immediate: true }
);

watch(
  () => props.dataForm,
  (newVal) => {
    params_scope.sub_bidang_uuid = newVal?.sub_bidang_uuid as string;
    refetchScope();
  },
  { deep: true, immediate: true }
);

watch(modelValue, (value) => {
  if (!value) {
    setTimeout(() => {
      resetValue();
    }, 500);
  } else {
    setValue();
  }
});

defineExpose({ refetchScope });
</script>

<template>
  <Modal
    width="440"
    height="200"
    :showButtonClose="false"
    :title="`Tambah ${name}`"
    v-model="modelValue"
  >
    <form
      class="flex flex-col gap-4 max-h-[calc(100vh-200px)] overflow-y-auto mx-[-20px] px-5"
      @submit.prevent="handleSubmit"
    >
      <Select
        v-model="model.scope_standart_uuid"
        label="Scope"
        options_label="label"
        options_value="value"
        v-model:model-search="params_scope.search"
        :search="true"
        :loading="is_loading_scope"
        :loading-next-page="isFetchingNextPageScope"
        :rules="rules.scope_standart_uuid"
        :options="options_scope"
        @scroll="scrollScope"
        @search="searchScope"
      />

      <div class="w-full flex items-center gap-4 mt-4">
        <Button
          text="Batal"
          class="w-full"
          variant="secondary"
          :disabled="isLoadingScope"
          @click="modelValue = isLoadingScope"
        />
        <Button
          type="submit"
          text="Simpan"
          class="w-full"
          color="blue"
          :disabled="isLoadingScope"
          :loading="isLoadingScope"
        />
      </div>
    </form>
  </Modal>
</template>
