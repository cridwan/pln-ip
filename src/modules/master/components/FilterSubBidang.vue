<script setup lang="ts">
import { reactive, ref, computed, type PropType, watch } from "vue";

import { Button, Select } from "@/components";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useInfiniteQuery, useQueryClient } from "@tanstack/vue-query";
import type { IPagination, IParams } from "@/types/GlobalType";
import { mergeArrays } from "@/helpers/global";

import type { LocationInterface } from "../types/LocationType";

import type {
  InspectionTypeInterface,
  InspectionTypeModelCreateInterface,
} from "../types/InspectionType";
import { useMasterStore } from "../stores/MasterStore";
import type { UnitTypeModelCreateInterface } from "../types/UnitType";
import type { BidangTypeModelCreateInterface } from "../types/BidangType";

type OptionType = {
  value: string;
  label: string;
};

const props = defineProps({
  selectedValue: {
    type: Object as PropType<InspectionTypeInterface | null>,
  },
  loading: {
    type: Boolean,
  },
});

const emit = defineEmits(["success", "error", "filter", "resetFilter"]);

const masterStore = useMasterStore();

const queryClient = useQueryClient();
const modelValue = defineModel<boolean>({ default: false });
const is_loading_bidang = ref(false);
const options_bidang = ref<OptionType[]>([]);

const model = ref<BidangTypeModelCreateInterface>({
  uuid: "",
});
const v$_form = reactive(useVuelidate());
const rules = computed(() => {
  return {
    uuid: {
      required: helpers.withMessage(`This field is required`, required),
    },
  };
});

//--- GET LOCATION
const params_bidang = reactive<IParams>({
  search: "",
  filters: "",
  currentPage: 1,
  perPage: 10,
});
const {
  data: dataBidang,
  refetch: refetchBidang,
  fetchNextPage: fetchNextPageBidang,
  hasNextPage: hasNextPageBidang,
  isFetchingNextPage: isFetchingNextPageBidang,
} = useInfiniteQuery({
  queryKey: ["getLocationFilterInspection"],
  enabled: !props.selectedValue && !is_loading_bidang.value,
  queryFn: async ({ pageParam = 1 }) => {
    try {
      const { data } = await masterStore.getBidang({
        ...params_bidang,
        currentPage: pageParam,
      });

      const response = data.data as IPagination<LocationInterface[]>;

      return response;
    } catch (error: any) {
      throw error.response;
    } finally {
      is_loading_bidang.value = false;
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

const handleSubmit = async () => {
  const isValid = await v$_form.value.$validate();

  if (!isValid) return;

  emit("filter", model.value);
};

const setValue = () => {
  model.value = {
    uuid: props?.selectedValue?.machine?.unit?.location_uuid || "",
  };
};

const resetValue = () => {
  model.value = {
    uuid: "",
  };
  refetchBidang();
  emit("resetFilter");
};

const timeout_location = ref(0);
const searchLocation = () => {
  clearTimeout(timeout_location.value);
  timeout_location.value = window.setTimeout(() => {
    is_loading_bidang.value = true;
    params_bidang.currentPage = 1;
    refetchBidang();
  }, 1000);
};
const scrollLocation = (e: Event) => {
  const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLElement;
  if (
    scrollTop + clientHeight >= scrollHeight - 1 &&
    hasNextPageBidang.value &&
    !isFetchingNextPageBidang.value
  ) {
    fetchNextPageBidang();
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

const selectLocation = (e: OptionType) => {
  // queryClient.removeQueries({ queryKey: ["getUnitFilterInspection"] });
  // queryClient.removeQueries({ queryKey: ["getMachineFilterInspection"] });
  model.value.uuid = e.value;
};

watch(
  [modelValue, dataBidang],
  ([newModel, newLocation]) => {
    if (props.selectedValue) {
      const new_data: OptionType[] =
        newLocation?.pages
          .flatMap((page) => page?.data)
          ?.map((item) => {
            return { value: item.uuid, label: item.name };
          }) || [];

      options_bidang.value = mergeArrays(
        [
          {
            value: props.selectedValue?.machine.unit?.location_uuid,
            label: props.selectedValue?.machine.unit?.location?.name,
          },
        ],
        new_data.filter(
          (item) =>
            item.value !== props.selectedValue?.machine?.unit?.location_uuid
        )
      );
    } else {
      const new_data: OptionType[] =
        newLocation?.pages
          .flatMap((page) => page?.data)
          ?.map((item) => {
            return { value: item.uuid, label: item.name };
          }) || [];

      options_bidang.value = new_data;
    }
  },
  { deep: true, immediate: true }
);
</script>

<template>
  <div
    class="flex flex-col gap-4 max-h-[calc(100vh-200px)] overflow-y-auto mx-[-20px] p-5 bg-white shadow-md rounded-md"
  >
    <span class="text-blue-950 font-semibold">Filter Sub Bidang</span>
    <form class="" @submit.prevent="handleSubmit">
      <Select
        v-model="model.uuid"
        label="Bidang"
        options_label="label"
        options_value="value"
        v-model:model-search="params_bidang.search"
        :search="true"
        :loading="is_loading_bidang"
        :loading-next-page="isFetchingNextPageBidang"
        :rules="rules.uuid"
        :options="options_bidang"
        @scroll="scrollLocation"
        @search="searchLocation"
        @select="selectLocation"
      />

      <div class="w-full flex items-center gap-4 mt-4">
        <Button
          text="Reset"
          class="w-full"
          variant="secondary"
          :disabled="props.loading"
          @click="resetValue"
        />
        <Button
          type="submit"
          text="Terapkan"
          class="w-full"
          color="blue"
          :disabled="props.loading"
          :loading="props.loading"
        />
      </div>
    </form>
  </div>
</template>
