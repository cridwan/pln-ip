<script setup lang="ts">
import { reactive, ref, computed, type PropType, watch } from "vue";
import { useRoute } from "vue-router";

import { Button, Select } from "@/components";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useInfiniteQuery, useQueryClient } from "@tanstack/vue-query";
import type { IPagination, IParams } from "@/types/GlobalType";

import { useMasterStore } from "../stores/MasterStore";
import type { ScopeInterface } from "../types/ScopeType";
import type { SubBidangInterface } from "../types/SubBidangType";
import type { BidangInterface } from "../types/BidangType";
import type { EquipmentInterface } from "../types/EquipmentType";
import type {
  ActivityInterface,
  ActivityFilterInterface,
} from "../types/AcitivityType";

type OptionType = {
  value: string;
  label: string;
};

const props = defineProps({
  selectedValue: {
    type: Object as PropType<ActivityInterface | null>,
  },
  loading: {
    type: Boolean,
  },
});

const emit = defineEmits(["success", "error", "filter", "resetFilter"]);

const masterStore = useMasterStore();

const route = useRoute();
const queryClient = useQueryClient();
const modelValue = defineModel<boolean>({ default: false });
const is_loading_sub_bidang = ref(false);
const options_sub_bidang = ref<OptionType[]>([]);
const is_loading_bidang = ref(false);
const options_bidang = ref<OptionType[]>([]);
const is_loading_scope = ref(false);
const options_scope = ref<OptionType[]>([]);
const is_loading_equipment = ref(false);
const options_equipment = ref<OptionType[]>([]);

const model = ref<ActivityFilterInterface>({
  bidang_uuid: "",
  sub_bidang_uuid: "",
  scope_standart_uuid: "",
  equipment_uuid: "",
});
const v$_form = reactive(useVuelidate());
const rules = computed(() => {
  return {
    bidang_uuid: {
      required: helpers.withMessage(`This field is required`, required),
    },
    sub_bidang_uuid: {
      required: helpers.withMessage(`This field is required`, required),
    },
    scope_standart_uuid: {
      required: helpers.withMessage(`This field is required`, required),
    },
    equipment_uuid: {
      required: helpers.withMessage(`This field is required`, required),
    },
  };
});

//--- GET BIDANG
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
  queryKey: ["getBidangFilterActivityAdditionalMaster"],
  enabled: !props.selectedValue && !is_loading_bidang.value,
  queryFn: async ({ pageParam = 1 }) => {
    try {
      const { data } = await masterStore.getBidang({
        ...params_bidang,
        currentPage: pageParam,
      });

      const response = data.data as IPagination<BidangInterface[]>;

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

//--- GET SUB BIDANG
const params_sub_bidang = reactive<IParams>({
  search: "",
  filters: [
    {
      group: "AND",
      operator: "EQ",
      column: "bidang_uuid",
      value: null,
    },
  ],
  currentPage: 1,
  perPage: 10,
});
const {
  data: dataSubBidang,
  refetch: refetchSubBidang,
  fetchNextPage: fetchNextPageSubBidang,
  hasNextPage: hasNextPageSubBidang,
  isFetchingNextPage: isFetchingNextPageSubBidang,
} = useInfiniteQuery({
  queryKey: ["getSubBidangFilterActivityAdditionalMaster"],
  enabled: false,
  queryFn: async ({ pageParam = 1 }) => {
    try {
      const { data } = await masterStore.getSubBidang({
        ...params_sub_bidang,
        currentPage: pageParam,
      });

      const response = data.data as IPagination<SubBidangInterface[]>;

      return response;
    } catch (error: any) {
      throw error.response;
    } finally {
      is_loading_sub_bidang.value = false;
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

//--- GET SCOPE
const params_scope = reactive<IParams>({
  search: "",
  filters: [],
  currentPage: 1,
  perPage: 10,
});
const {
  data: dataScope,
  refetch: refetchScope,
  fetchNextPage: fetchNextPageScope,
  hasNextPage: hasNextPageScope,
  isFetchingNextPage: isFetchingNextPageScope,
} = useInfiniteQuery({
  queryKey: ["getScopeFilterActivityAdditionalMaster"],
  enabled: false,
  queryFn: async ({ pageParam = 1 }) => {
    try {
      const { data } = await masterStore.getScope({
        ...params_scope,
        currentPage: pageParam,
      });

      const response = data as IPagination<ScopeInterface[]>;

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

//--- GET EQUIPMENT
const params_equipment = reactive<IParams>({
  search: "",
  filters: "",
  currentPage: 1,
  perPage: 10,
});
const {
  data: dataEquipment,
  refetch: refetchEquipment,
  fetchNextPage: fetchNextPageEquipment,
  hasNextPage: hasNextPageEquipment,
  isFetchingNextPage: isFetchingNextPageEquipment,
} = useInfiniteQuery({
  queryKey: ["getEquipmentFilterActivityAdditionalMaster"],
  enabled: false,
  queryFn: async ({ pageParam = 1 }) => {
    try {
      const { data } = await masterStore.getEquipment({
        ...params_equipment,
        currentPage: pageParam,
      });

      const response = data.data as IPagination<EquipmentInterface[]>;

      return response;
    } catch (error: any) {
      throw error.response;
    } finally {
      is_loading_equipment.value = false;
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

// const setValue = () => {
// model.value = {
//   location_uuid:
//     props.selectedValue?.activity?.equipment?.scope_standart?.inspection_type
//       ?.machine?.unit?.location_uuid || "",
//   unit_uuid:
//     props.selectedValue?.activity?.equipment?.scope_standart?.inspection_type
//       ?.machine?.unit_uuid || "",
//   machine_uuid:
//     props.selectedValue?.activity?.equipment?.scope_standart?.inspection_type
//       ?.machine_uuid || "",
//   inspection_type_uuid:
//     props.selectedValue?.activity?.equipment?.scope_standart
//       ?.inspection_type_uuid || "",
//   sub_bidang_uuid:
//     props.selectedValue?.activity?.equipment?.scope_standart
//       ?.sub_bidang_uuid || "",
//   bidang_uuid:
//     props.selectedValue?.activity?.equipment?.scope_standart?.sub_bidang
//       ?.bidang_uuid || "",
//   scope_standart_uuid:
//     props.selectedValue?.activity?.equipment?.scope_standart_uuid || "",
//   equipment_uuid: props.selectedValue?.activity?.equipment_uuid || "",
//   activity_uuid: props.selectedValue?.activity_uuid || "",
//   part_uuid: props.selectedValue?.part_uuid || "",
//   qty: String(props.selectedValue?.qty) || "",
// };
// };

const resetValue = () => {
  model.value = {
    location_uuid: "",
    unit_uuid: "",
    machine_uuid: "",
    inspection_type_uuid: "",
    sub_bidang_uuid: "",
    bidang_uuid: "",
    scope_standart_uuid: "",
    equipment_uuid: "",
  };
  emit("resetFilter");
};

// BIDANG
const timeout_bidang = ref(0);
const searchBidang = () => {
  clearTimeout(timeout_bidang.value);
  timeout_bidang.value = window.setTimeout(() => {
    is_loading_bidang.value = true;
    params_bidang.currentPage = 1;
    refetchBidang();
  }, 1000);
};
const scrollBidang = (e: Event) => {
  const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLElement;
  if (
    scrollTop + clientHeight >= scrollHeight - 1 &&
    hasNextPageBidang.value &&
    !isFetchingNextPageBidang.value
  ) {
    fetchNextPageBidang();
  }
};
// END

// SUB BIDANG
const timeout_sub_bidang = ref(0);
const searchSubBidang = () => {
  clearTimeout(timeout_sub_bidang.value);
  timeout_sub_bidang.value = window.setTimeout(() => {
    is_loading_sub_bidang.value = true;
    params_sub_bidang.currentPage = 1;
    refetchSubBidang();
  }, 1000);
};
const scrollSubBidang = (e: Event) => {
  const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLElement;
  if (
    scrollTop + clientHeight >= scrollHeight - 1 &&
    hasNextPageSubBidang.value &&
    !isFetchingNextPageSubBidang.value
  ) {
    fetchNextPageSubBidang();
  }
};
// END

// SCOPE
const timeout_scope = ref(0);
const searchScope = () => {
  clearTimeout(timeout_scope.value);
  timeout_scope.value = window.setTimeout(() => {
    is_loading_bidang.value = true;
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
// END

// EQUIPMENT
const timeout_equipment = ref(0);
const searchEquipment = () => {
  clearTimeout(timeout_equipment.value);
  timeout_equipment.value = window.setTimeout(() => {
    is_loading_equipment.value = true;
    params_equipment.currentPage = 1;
    refetchEquipment();
  }, 1000);
};
const scrollEquipment = (e: Event) => {
  const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLElement;
  if (
    scrollTop + clientHeight >= scrollHeight - 1 &&
    hasNextPageEquipment.value &&
    !isFetchingNextPageEquipment.value
  ) {
    fetchNextPageEquipment();
  }
};
// END

// watch(modelValue, (value) => {
//   if (!value) {
//     setTimeout(() => {
//       resetValue();
//     }, 500);
//   } else {
//     if (props.selectedValue) {
//       setValue();
//     } else {
//       resetValue();
//     }
//   }
// });

const selectBidang = (e: OptionType) => {
  queryClient.removeQueries({
    queryKey: ["getScopeFilterActivityAdditionalMaster"],
  });
  queryClient.removeQueries({
    queryKey: ["getEquipmentFilterActivityAdditionalMaster"],
  });
  options_scope.value = [];
  options_equipment.value = [];
  model.value.sub_bidang_uuid = "";
  model.value.scope_standart_uuid = "";
  model.value.equipment_uuid = "";
  params_sub_bidang.filters = [
    {
      group: "AND",
      operator: "EQ",
      column: "bidang_uuid",
      value: e.value,
    },
  ];
  refetchSubBidang();
};

const selectSubBidang = (e: OptionType) => {
  queryClient.removeQueries({
    queryKey: ["getEquipmentFilterActivityAdditionalMaster"],
  });
  options_equipment.value = [];
  model.value.scope_standart_uuid = "";
  model.value.equipment_uuid = "";
  params_scope.filters = [
    {
      group: "AND",
      operator: "EQ",
      column: "sub_bidang_uuid",
      value: e.value,
    },
    {
      group: "AND",
      operator: "EQ",
      column: "additional_scope_uuid",
      value: route.params?.id,
    },
  ];
  refetchScope();
};

const selectScope = (e: OptionType) => {
  model.value.equipment_uuid = "";
  params_equipment.filters = [
    {
      group: "AND",
      operator: "EQ",
      column: "scope_standart_uuid",
      value: e.value,
    },
  ];
  refetchEquipment();
};

watch(
  dataBidang,
  (newBidang) => {
    // if (props.selectedValue) {
    //   const new_data: OptionType[] =
    //     newBidang?.pages
    //       .flatMap((page) => page?.data)
    //       ?.map((item) => {
    //         return { value: item.uuid, label: item.name };
    //       }) || [];
    //   options_bidang.value = mergeArrays(
    //     [
    //       {
    //         value:
    //           props.selectedValue?.activity?.equipment?.scope_standart
    //             ?.sub_bidang?.bidang_uuid,
    //         label:
    //           props.selectedValue?.activity?.equipment?.scope_standart
    //             ?.sub_bidang?.bidang?.name,
    //       },
    //     ],
    //     new_data.filter(
    //       (item) =>
    //         item.value !==
    //         props.selectedValue?.activity?.equipment?.scope_standart?.sub_bidang
    //           ?.bidang_uuid
    //     )
    //   );
    // } else {
    const new_data: OptionType[] =
      newBidang?.pages
        .flatMap((page) => page?.data)
        ?.map((item) => {
          return { value: item.uuid, label: item.name };
        }) || [];

    options_bidang.value = new_data;
    // }
  },
  { deep: true, immediate: true }
);

watch(
  dataSubBidang,
  (newSubBidang) => {
    // if (props.selectedValue) {
    //   const new_data: OptionType[] =
    //     newSubBidang?.pages
    //       .flatMap((page) => page?.data)
    //       ?.map((item) => {
    //         return { value: item.uuid, label: item.name };
    //       }) || [];
    //   options_sub_bidang.value = mergeArrays(
    //     [
    //       {
    //         value:
    //           props.selectedValue?.activity?.equipment?.scope_standart
    //             ?.sub_bidang_uuid,
    //         label:
    //           props.selectedValue?.activity?.equipment?.scope_standart
    //             ?.sub_bidang?.name,
    //       },
    //     ],
    //     new_data.filter(
    //       (item) =>
    //         item.value !==
    //         props.selectedValue?.activity?.equipment?.scope_standart
    //           ?.sub_bidang_uuid
    //     )
    //   );
    // } else {
    const new_data: OptionType[] =
      newSubBidang?.pages
        .flatMap((page) => page?.data)
        ?.map((item) => {
          return { value: item.uuid, label: item.name };
        }) || [];

    options_sub_bidang.value = new_data;
    // }
  },
  { deep: true, immediate: true }
);

watch(
  [modelValue, dataScope],
  ([_, newLocation]) => {
    // if (props.selectedValue) {
    //   const new_data: OptionType[] =
    //     newLocation?.pages
    //       .flatMap((page) => page?.data)
    //       ?.map((item) => {
    //         return { value: item.uuid, label: item.name };
    //       }) || [];
    //   options_scope.value = mergeArrays(
    //     [
    //       {
    //         value:
    //           props.selectedValue?.activity?.equipment?.scope_standart
    //             ?.inspection_type?.machine?.unit?.location_uuid,
    //         label:
    //           props.selectedValue?.activity?.equipment?.scope_standart
    //             ?.inspection_type?.machine?.unit?.location?.name,
    //       },
    //     ],
    //     new_data.filter(
    //       (item) =>
    //         item.value !==
    //         props.selectedValue?.activity?.equipment?.scope_standart
    //           ?.inspection_type?.machine?.unit?.location_uuid
    //     )
    //   );
    // } else {
    const new_data: OptionType[] =
      newLocation?.pages
        .flatMap((page) => page?.data)
        ?.map((item) => {
          return { value: item.uuid, label: item.name };
        }) || [];

    options_scope.value = new_data;
    // }
  },
  { deep: true, immediate: true }
);

watch(
  [modelValue, dataEquipment],
  ([_, newEquipment]) => {
    // if (props.selectedValue) {
    //   const new_data: OptionType[] =
    //     newEquipment?.pages
    //       .flatMap((page) => page?.data)
    //       ?.map((item) => {
    //         return { value: item.uuid, label: item.name };
    //       }) || [];
    //   options_equipment.value = mergeArrays(
    //     [
    //       {
    //         value: props.selectedValue?.activity?.equipment_uuid,
    //         label: props.selectedValue?.activity?.equipment?.name,
    //       },
    //     ],
    //     new_data.filter(
    //       (item) => item.value !== props.selectedValue?.activity?.equipment_uuid
    //     )
    //   );
    // } else {
    const new_data: OptionType[] =
      newEquipment?.pages
        .flatMap((page) => page?.data)
        ?.map((item) => {
          return { value: item.uuid, label: item.name };
        }) || [];

    options_equipment.value = new_data;
    // }
  },
  { deep: true, immediate: true }
);

watch(
  () => props.selectedValue,
  (value) => {
    if (value) {
      // if (
      //   value?.activity?.equipment?.scope_standart?.inspection_type?.machine
      //     ?.unit?.location
      // ) {
      //   refetchLocation();
      // }
      // if (
      //   value?.activity?.equipment?.scope_standart?.inspection_type?.machine
      //     ?.unit
      // ) {
      //   params_unit.filters = [
      //     {
      //       group: "AND",
      //       operator: "EQ",
      //       column: "location_uuid",
      //       value:
      //         value?.activity?.equipment?.scope_standart?.inspection_type
      //           ?.machine?.unit?.location_uuid,
      //     },
      //   ];
      //   refetchUnit();
      // }
      // if (
      //   value?.activity?.equipment?.scope_standart?.inspection_type?.machine
      // ) {
      //   params_machine.filters = [
      //     {
      //       group: "AND",
      //       operator: "EQ",
      //       column: "unit_uuid",
      //       value:
      //         value?.activity?.equipment?.scope_standart?.inspection_type
      //           ?.machine?.unit_uuid,
      //     },
      //   ];
      //   refetchMachine();
      // }
      // if (value?.activity?.equipment?.scope_standart?.inspection_type) {
      //   params_inspection.filters = [
      //     {
      //       group: "AND",
      //       operator: "EQ",
      //       column: "machine_uuid",
      //       value:
      //         value?.activity?.equipment?.scope_standart?.inspection_type
      //           ?.machine_uuid,
      //     },
      //   ];
      //   refetchInspection();
      // }
    }
  }
);
</script>

<template>
  <div
    class="flex flex-col gap-4 max-h-[calc(100vh-200px)] overflow-y-auto mx-[-20px] p-5 bg-white shadow-md rounded-md"
  >
    <span class="text-blue-950 font-semibold">Filter Activity</span>
    <form class="" @submit.prevent="handleSubmit">
      <div class="flex flex-col gap-2">
        <Select
          v-model="model.bidang_uuid"
          label="Bidang"
          options_label="label"
          options_value="value"
          v-model:model-search="params_bidang.search"
          :search="true"
          :loading="is_loading_bidang"
          :loading-next-page="isFetchingNextPageBidang"
          :rules="rules.bidang_uuid"
          :options="options_bidang"
          @scroll="scrollBidang"
          @search="searchBidang"
          @select="selectBidang"
        />
        <Select
          v-model="model.sub_bidang_uuid"
          label="Sub Bidang"
          options_label="label"
          options_value="value"
          v-model:model-search="params_sub_bidang.search"
          :search="true"
          :loading="is_loading_sub_bidang"
          :loading-next-page="isFetchingNextPageSubBidang"
          :rules="rules.sub_bidang_uuid"
          :options="options_sub_bidang"
          @scroll="scrollSubBidang"
          @search="searchSubBidang"
          @select="selectSubBidang"
        />
        <Select
          v-model="model.scope_standart_uuid"
          label="Scope Standart"
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
          @select="selectScope"
        />
        <Select
          v-model="model.equipment_uuid"
          label="Equipment"
          options_label="label"
          options_value="value"
          v-model:model-search="params_equipment.search"
          :search="true"
          :loading="is_loading_equipment"
          :loading-next-page="isFetchingNextPageEquipment"
          :rules="rules.equipment_uuid"
          :options="options_equipment"
          @scroll="scrollEquipment"
          @search="searchEquipment"
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
