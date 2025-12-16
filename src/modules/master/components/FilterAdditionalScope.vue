<script setup lang="ts">
import { reactive, ref, computed, type PropType, watch } from "vue";

import { Button, Select } from "@/components";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useInfiniteQuery, useQueryClient } from "@tanstack/vue-query";
import type { IPagination, IParams } from "@/types/GlobalType";
import { mergeArrays } from "@/helpers/global";

import type { LocationInterface } from "../types/LocationType";
import type { UnitInterface } from "../types/UnitType";
import type { MachineInterface } from "../types/MachineType";
import type { InspectionTypeInterface } from "../types/InspectionType";
import { useMasterStore } from "../stores/MasterStore";
import type {
  AdditionalScopeFilterInterface,
  AdditionalScopeInterface,
} from "../types/AdditionalScopeType";

type OptionType = {
  value: string;
  label: string;
};

const props = defineProps({
  selectedValue: {
    type: Object as PropType<AdditionalScopeInterface | null>,
  },
  loading: {
    type: Boolean,
  },
});

const emit = defineEmits(["success", "error", "filter", "resetFilter"]);

const masterStore = useMasterStore();

const queryClient = useQueryClient();
const modelValue = defineModel<boolean>({ default: false });
const is_loading_location = ref(false);
const options_location = ref<OptionType[]>([]);
const is_loading_unit = ref(false);
const options_unit = ref<OptionType[]>([]);
const is_loading_machine = ref(false);
const options_machine = ref<OptionType[]>([]);
const is_loading_inspection = ref(false);
const options_inspection = ref<OptionType[]>([]);
const model_details = ref<{ name: string; id: string }[]>([
  { id: "0", name: "" },
]);

const model = ref<AdditionalScopeFilterInterface>({
  location_uuid: "",
  unit_uuid: "",
  machine_uuid: "",
  inspection_type_uuid: "",
});
const v$_form = reactive(useVuelidate());
const rules = computed(() => {
  return {
    location_uuid: {
      required: helpers.withMessage(`This field is required`, required),
    },
    unit_uuid: {
      required: helpers.withMessage(`This field is required`, required),
    },
    machine_uuid: {
      required: helpers.withMessage(`This field is required`, required),
    },
    inspection_type_uuid: {
      required: helpers.withMessage(`This field is required`, required),
    },
  };
});

//--- GET LOCATION
const params_location = reactive<IParams>({
  search: "",
  filters: "",
  currentPage: 1,
  perPage: 10,
});
const {
  data: dataLocation,
  refetch: refetchLocation,
  fetchNextPage: fetchNextPageLocation,
  hasNextPage: hasNextPageLocation,
  isFetchingNextPage: isFetchingNextPageLocation,
} = useInfiniteQuery({
  queryKey: ["getLocationFilterAddScopeMaster"],
  enabled: !props.selectedValue && !is_loading_location.value,
  queryFn: async ({ pageParam = 1 }) => {
    try {
      const { data } = await masterStore.getLocation({
        ...params_location,
        currentPage: pageParam,
      });

      const response = data.data as IPagination<LocationInterface[]>;

      return response;
    } catch (error: any) {
      throw error.response;
    } finally {
      is_loading_location.value = false;
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

//--- GET UNIT
const params_unit = reactive<IParams>({
  search: "",
  filters: "",
  currentPage: 1,
  perPage: 10,
});
const {
  data: dataUnit,
  refetch: refetchUnit,
  fetchNextPage: fetchNextPageUnit,
  hasNextPage: hasNextPageUnit,
  isFetchingNextPage: isFetchingNextPageUnit,
} = useInfiniteQuery({
  queryKey: ["getUnitFilterAddScopeMaster"],
  enabled: false,
  queryFn: async ({ pageParam = 1 }) => {
    try {
      const { data } = await masterStore.getUnit({
        ...params_unit,
        currentPage: pageParam,
      });

      const response = data.data as IPagination<UnitInterface[]>;

      return response;
    } catch (error: any) {
      throw error.response;
    } finally {
      is_loading_unit.value = false;
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

//--- GET MACHINE
const params_machine = reactive<IParams>({
  search: "",
  filters: "",
  currentPage: 1,
  perPage: 10,
});
const {
  data: dataMachine,
  refetch: refetchMachine,
  fetchNextPage: fetchNextPageMachine,
  hasNextPage: hasNextPageMachine,
  isFetchingNextPage: isFetchingNextPageMachine,
} = useInfiniteQuery({
  queryKey: ["getMachineFilterAddScopeMaster"],
  enabled: false,
  queryFn: async ({ pageParam = 1 }) => {
    try {
      const { data } = await masterStore.getMachine({
        ...params_machine,
        currentPage: pageParam,
      });

      const response = data.data as IPagination<MachineInterface[]>;

      return response;
    } catch (error: any) {
      throw error.response;
    } finally {
      is_loading_machine.value = false;
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

//--- GET INSPECTION
const params_inspection = reactive<IParams>({
  search: "",
  filters: "",
  currentPage: 1,
  perPage: 10,
});
const {
  data: dataInspection,
  refetch: refetchInspection,
  fetchNextPage: fetchNextPageInspection,
  hasNextPage: hasNextPageInspection,
  isFetchingNextPage: isFetchingNextPageInspection,
} = useInfiniteQuery({
  queryKey: ["getInspectionFilterAddScopeMaster"],
  enabled: false,
  queryFn: async ({ pageParam = 1 }) => {
    try {
      const { data } = await masterStore.getInspectionType({
        ...params_inspection,
        currentPage: pageParam,
      });

      const response = data.data as IPagination<InspectionTypeInterface[]>;

      return response;
    } catch (error: any) {
      throw error.response;
    } finally {
      is_loading_inspection.value = false;
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
  model.value.location_uuid =
    props.selectedValue?.inspection_type?.machine?.unit?.location_uuid || "";
  model.value.unit_uuid =
    props.selectedValue?.inspection_type?.machine?.unit_uuid || "";
  model.value.machine_uuid =
    props.selectedValue?.inspection_type?.machine_uuid || "";
  model.value.inspection_type_uuid =
    props.selectedValue?.inspection_type_uuid || "";
};

const resetValue = () => {
  model.value = {
    location_uuid: "",
    unit_uuid: "",
    machine_uuid: "",
    inspection_type_uuid: "",
  };
  model_details.value = [{ name: "", id: "0" }];
  refetchLocation();
  emit("resetFilter");
};

const timeout_location = ref(0);
const searchLocation = () => {
  clearTimeout(timeout_location.value);
  timeout_location.value = window.setTimeout(() => {
    is_loading_location.value = true;
    params_location.currentPage = 1;
    refetchLocation();
  }, 1000);
};
const scrollLocation = (e: Event) => {
  const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLElement;
  if (
    scrollTop + clientHeight >= scrollHeight - 1 &&
    hasNextPageLocation.value &&
    !isFetchingNextPageLocation.value
  ) {
    fetchNextPageLocation();
  }
};

const timeout_unit = ref(0);
const searchUnit = () => {
  clearTimeout(timeout_unit.value);
  timeout_unit.value = window.setTimeout(() => {
    is_loading_unit.value = true;
    params_unit.currentPage = 1;
    refetchUnit();
  }, 1000);
};
const scrollUnit = (e: Event) => {
  const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLElement;
  if (
    scrollTop + clientHeight >= scrollHeight - 1 &&
    hasNextPageUnit.value &&
    !isFetchingNextPageUnit.value
  ) {
    fetchNextPageUnit();
  }
};

const timeout_machine = ref(0);
const searchMachine = () => {
  clearTimeout(timeout_machine.value);
  timeout_machine.value = window.setTimeout(() => {
    is_loading_machine.value = true;
    params_machine.currentPage = 1;
    refetchMachine();
  }, 1000);
};
const scrollMachine = (e: Event) => {
  const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLElement;
  if (
    scrollTop + clientHeight >= scrollHeight - 1 &&
    hasNextPageMachine.value &&
    !isFetchingNextPageMachine.value
  ) {
    fetchNextPageMachine();
  }
};

const timeout_inspection = ref(0);
const searchInspection = () => {
  clearTimeout(timeout_inspection.value);
  timeout_inspection.value = window.setTimeout(() => {
    is_loading_inspection.value = true;
    params_inspection.currentPage = 1;
    refetchInspection();
  }, 1000);
};
const scrollInspection = (e: Event) => {
  const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLElement;
  if (
    scrollTop + clientHeight >= scrollHeight - 1 &&
    hasNextPageInspection.value &&
    !isFetchingNextPageInspection.value
  ) {
    fetchNextPageInspection();
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
  queryClient.removeQueries({ queryKey: ["getMachineFilterAddScopeMaster"] });
  queryClient.removeQueries({
    queryKey: ["getInspectionFilterAddScopeMaster"],
  });
  options_machine.value = [];
  options_inspection.value = [];
  model.value.unit_uuid = "";
  model.value.machine_uuid = "";
  model.value.inspection_type_uuid = "";
  params_unit.filters = [
    {
      group: "AND",
      operator: "EQ",
      column: "location_uuid",
      value: e.value,
    },
  ];
  is_loading_unit.value = true;
  refetchUnit();
};

const selectUnit = (e: OptionType) => {
  queryClient.removeQueries({
    queryKey: ["getInspectionFilterAddScopeMaster"],
  });
  options_inspection.value = [];
  model.value.machine_uuid = "";
  model.value.inspection_type_uuid = "";
  params_machine.filters = [
    {
      group: "AND",
      operator: "EQ",
      column: "unit_uuid",
      value: e.value,
    },
  ];
  is_loading_machine.value = true;
  refetchMachine();
};

const selectMachine = (e: OptionType) => {
  model.value.inspection_type_uuid = "";
  params_inspection.filters = [
    {
      group: "AND",
      operator: "EQ",
      column: "machine_uuid",
      value: e.value,
    },
  ];
  is_loading_inspection.value = true;
  refetchInspection();
};

watch(
  [modelValue, dataLocation],
  ([_, newLocation]) => {
    if (props.selectedValue) {
      const new_data: OptionType[] =
        newLocation?.pages
          .flatMap((page) => page?.data)
          ?.map((item) => {
            return { value: item.uuid, label: item.name };
          }) || [];
      options_location.value = mergeArrays(
        [
          {
            value:
              props.selectedValue?.inspection_type?.machine?.unit
                ?.location_uuid,
            label:
              props.selectedValue?.inspection_type?.machine?.unit?.location
                ?.name,
          },
        ],
        new_data.filter(
          (item) =>
            item.value !==
            props.selectedValue?.inspection_type?.machine?.unit?.location_uuid
        )
      );
    } else {
      const new_data: OptionType[] =
        newLocation?.pages
          .flatMap((page) => page?.data)
          ?.map((item) => {
            return { value: item.uuid, label: item.name };
          }) || [];

      options_location.value = new_data;
    }
  },
  { deep: true, immediate: true }
);

watch(
  dataUnit,
  (newUnit) => {
    if (props.selectedValue) {
      const new_data: OptionType[] =
        newUnit?.pages
          .flatMap((page) => page?.data)
          ?.map((item) => {
            return { value: item.uuid, label: item.name };
          }) || [];
      options_unit.value = mergeArrays(
        [
          {
            value: props.selectedValue?.inspection_type?.machine?.unit_uuid,
            label: props.selectedValue?.inspection_type?.machine?.unit?.name,
          },
        ],
        new_data.filter(
          (item) =>
            item.value !==
            props.selectedValue?.inspection_type?.machine?.unit_uuid
        )
      );
    } else {
      const new_data: OptionType[] =
        newUnit?.pages
          .flatMap((page) => page?.data)
          ?.map((item) => {
            return { value: item.uuid, label: item.name };
          }) || [];

      options_unit.value = new_data;
    }
  },
  { deep: true, immediate: true }
);

watch(
  dataMachine,
  (newMachine) => {
    if (props.selectedValue) {
      const new_data: OptionType[] =
        newMachine?.pages
          .flatMap((page) => page?.data)
          ?.map((item) => {
            return { value: item.uuid, label: item.name };
          }) || [];
      options_machine.value = mergeArrays(
        [
          {
            value: props.selectedValue?.inspection_type?.machine_uuid,
            label: props.selectedValue?.inspection_type?.machine?.name,
          },
        ],
        new_data.filter(
          (item) =>
            item.value !== props.selectedValue?.inspection_type?.machine_uuid
        )
      );
    } else {
      const new_data: OptionType[] =
        newMachine?.pages
          .flatMap((page) => page?.data)
          ?.map((item) => {
            return { value: item.uuid, label: item.name };
          }) || [];

      options_machine.value = new_data;
    }
  },
  { deep: true, immediate: true }
);

watch(
  dataInspection,
  (newInspection) => {
    if (props.selectedValue) {
      const new_data: OptionType[] =
        newInspection?.pages
          .flatMap((page) => page?.data)
          ?.map((item) => {
            return { value: item.uuid, label: item.name };
          }) || [];
      options_inspection.value = mergeArrays(
        [
          {
            value: props.selectedValue?.inspection_type_uuid,
            label: props.selectedValue?.inspection_type?.name,
          },
        ],
        new_data.filter(
          (item) => item.value !== props.selectedValue?.inspection_type?.uuid
        )
      );
    } else {
      const new_data: OptionType[] =
        newInspection?.pages
          .flatMap((page) => page?.data)
          ?.map((item) => {
            return { value: item.uuid, label: item.name };
          }) || [];

      options_inspection.value = new_data;
    }
  },
  { deep: true, immediate: true }
);

watch(
  () => props.selectedValue,
  (value) => {
    if (value) {
      if (value.inspection_type?.machine?.unit?.location) {
        refetchLocation();
      }

      if (value.inspection_type?.machine?.unit) {
        params_unit.filters = [
          {
            group: "AND",
            operator: "EQ",
            column: "location_uuid",
            value: value?.inspection_type?.machine?.unit?.location_uuid,
          },
        ];
        refetchUnit();
      }

      if (value.inspection_type?.machine) {
        params_machine.filters = [
          {
            group: "AND",
            operator: "EQ",
            column: "unit_uuid",
            value: value?.inspection_type?.machine?.unit_uuid,
          },
        ];
        refetchMachine();
      }

      if (value.inspection_type) {
        params_inspection.filters = [
          {
            group: "AND",
            operator: "EQ",
            column: "machine_uuid",
            value: value?.inspection_type?.machine_uuid,
          },
        ];
        refetchInspection();
      }
    }
  }
);
</script>

<template>
  <div
    class="flex flex-col gap-4 max-h-[calc(100vh-200px)] overflow-y-auto mx-[-20px] p-5 bg-white shadow-md rounded-md"
  >
    <span class="text-blue-950 font-semibold">Filter Additional Scope</span>
    <form class="" @submit.prevent="handleSubmit">
      <div class="flex flex-col gap-2">
        <Select
          v-model="model.location_uuid"
          label="Lokasi"
          options_label="label"
          options_value="value"
          v-model:model-search="params_location.search"
          :search="true"
          :loading="is_loading_location"
          :loading-next-page="isFetchingNextPageLocation"
          :rules="rules.location_uuid"
          :options="options_location"
          @scroll="scrollLocation"
          @search="searchLocation"
          @select="selectLocation"
        />
        <Select
          v-model="model.unit_uuid"
          label="Unit"
          options_label="label"
          options_value="value"
          v-model:model-search="params_unit.search"
          :search="true"
          :loading="is_loading_unit"
          :loading-next-page="isFetchingNextPageUnit"
          :rules="rules.unit_uuid"
          :options="options_unit"
          @scroll="scrollUnit"
          @search="searchUnit"
          @select="selectUnit"
        />
        <Select
          v-model="model.machine_uuid"
          label="Mesin"
          options_label="label"
          options_value="value"
          v-model:model-search="params_machine.search"
          :search="true"
          :loading="is_loading_machine"
          :loading-next-page="isFetchingNextPageMachine"
          :rules="rules.machine_uuid"
          :options="options_machine"
          @scroll="scrollMachine"
          @search="searchMachine"
          @select="selectMachine"
        />
        <Select
          v-model="model.inspection_type_uuid"
          label="Tipe Inspeksi"
          options_label="label"
          options_value="value"
          v-model:model-search="params_inspection.search"
          :search="true"
          :loading="is_loading_inspection"
          :loading-next-page="isFetchingNextPageInspection"
          :rules="rules.inspection_type_uuid"
          :options="options_inspection"
          @scroll="scrollInspection"
          @search="searchInspection"
        />
      </div>

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
