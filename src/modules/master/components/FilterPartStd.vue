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
  ScopeCreateModelInterface,
  ScopeInterface,
} from "../types/ScopeType";
import type { SubBidangInterface } from "../types/SubBidangType";
import type { BidangInterface } from "../types/BidangType";
import type { EquipmentInterface } from "../types/EquipmentType";
import type {
  PartStdCreateModelInterface,
  PartStdInterface,
} from "../types/PartStdType";

type OptionType = {
  value: string;
  label: string;
};

const props = defineProps({
  selectedValue: {
    type: Object as PropType<PartStdInterface | null>,
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
const is_loading_sub_bidang = ref(false);
const options_sub_bidang = ref<OptionType[]>([]);
const is_loading_bidang = ref(false);
const options_bidang = ref<OptionType[]>([]);
const is_loading_scope = ref(false);
const options_scope = ref<OptionType[]>([]);
const is_loading_equipment = ref(false);
const options_equipment = ref<OptionType[]>([]);
const is_loading_activity = ref(false);
const options_activity = ref<OptionType[]>([]);
const model_details = ref<{ name: string; id: string }[]>([
  { id: "0", name: "" },
]);

const model = ref<PartStdCreateModelInterface>({
  location_uuid: "",
  unit_uuid: "",
  machine_uuid: "",
  inspection_type_uuid: "",
  sub_bidang_uuid: "",
  bidang_uuid: "",
  scope_standart_uuid: "",
  equipment_uuid: "",
  activity_uuid: "",
  part_uuid: "",
  qty: "",
});
const v$_form = reactive(useVuelidate());
const rules = computed(() => {
  return {
    sub_bidang_uuid: {
      required: helpers.withMessage(`This field is required`, required),
    },
    bidang_uuid: {
      required: helpers.withMessage(`This field is required`, required),
    },
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
    scope_standart_uuid: {
      required: helpers.withMessage(`This field is required`, required),
    },
    equipment_uuid: {
      required: helpers.withMessage(`This field is required`, required),
    },
    activity_uuid: {
      required: helpers.withMessage(`This field is required`, required),
    },
  };
});

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
  queryKey: ["getScopeFilterPartStd"],
  enabled: !props.selectedValue && !is_loading_scope.value,
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

//--- GET  equipment
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
  queryKey: ["getEquipmentFIlterPartStd"],
  enabled: !props.selectedValue && !is_loading_equipment.value,
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

//--- GET ACTIVITY
const params_activity = reactive<IParams>({
  search: "",
  filters: "",
  currentPage: 1,
  perPage: 10,
});
const {
  data: dataActivity,
  refetch: refetchActivity,
  fetchNextPage: fetchNextPageActivity,
  hasNextPage: hasNextPageActivity,
  isFetchingNextPage: isFetchingNextPageActivity,
} = useInfiniteQuery({
  queryKey: ["getActivityFilterPartStd"],
  enabled: !props.selectedValue && !is_loading_activity.value,
  queryFn: async ({ pageParam = 1 }) => {
    try {
      const { data } = await masterStore.getActivity({
        ...params_activity,
        currentPage: pageParam,
      });

      const response = data.data as IPagination<ScopeInterface[]>;

      return response;
    } catch (error: any) {
      throw error.response;
    } finally {
      is_loading_activity.value = false;
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
  queryKey: ["getBidangScope"],
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
  queryKey: ["getSubBidangScope"],
  enabled: !props.selectedValue && !is_loading_sub_bidang.value,
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
  queryKey: ["getLocationManpower"],
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
  queryKey: ["getUnitManpower"],
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
  queryKey: ["getMachineManpower"],
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
  filters: [],
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
  queryKey: ["getInspectionManpower"],
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
    part_uuid: props.selectedValue?.part_uuid || "",
    qty: String(props.selectedValue?.qty) || "",
  };
};

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
    activity_uuid: "",
    part_uuid: "",
    qty: "",
  };
  refetchLocation();
  emit("resetFilter");
};

// bidang
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
// end

// scope
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
// end

// equipment
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
// end

// activity
const timeout_activity = ref(0);
const searchActivity = () => {
  clearTimeout(timeout_activity.value);
  timeout_activity.value = window.setTimeout(() => {
    is_loading_activity.value = true;
    params_activity.currentPage = 1;
    refetchActivity();
  }, 1000);
};
const scrollActivity = (e: Event) => {
  const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLElement;
  if (
    scrollTop + clientHeight >= scrollHeight - 1 &&
    hasNextPageActivity.value &&
    !isFetchingNextPageActivity.value
  ) {
    fetchNextPageActivity();
  }
};
// end

// sub bidang
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
// end

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
  queryClient.removeQueries({ queryKey: ["getMachineManpower"] });
  queryClient.removeQueries({ queryKey: ["getInspectionManpower"] });
  options_machine.value = [];
  options_inspection.value = [];
  model.value.unit_uuid = "";
  model.value.machine_uuid = "";
  model.value.inspection_type_uuid = "";
  model.value.scope_standart_uuid = "";
  model.value.bidang_uuid = "";
  model.value.sub_bidang_uuid = "";
  model.value.equipment_uuid = "";
  model.value.activity_uuid = "";
  params_unit.filters = [
    {
      group: "AND",
      operator: "EQ",
      column: "location_uuid",
      value: e.value,
    },
  ];
  refetchUnit();
};

const selectUnit = (e: OptionType) => {
  queryClient.removeQueries({ queryKey: ["getInspectionManpower"] });
  options_inspection.value = [];
  model.value.machine_uuid = "";
  model.value.inspection_type_uuid = "";
  model.value.scope_standart_uuid = "";
  model.value.bidang_uuid = "";
  model.value.sub_bidang_uuid = "";
  model.value.equipment_uuid = "";
  model.value.activity_uuid = "";
  params_machine.filters = [
    {
      group: "AND",
      operator: "EQ",
      column: "unit_uuid",
      value: e.value,
    },
  ];
  refetchMachine();
};

const selectMachine = (e: OptionType) => {
  model.value.inspection_type_uuid = "";
  model.value.bidang_uuid = "";
  model.value.sub_bidang_uuid = "";
  model.value.scope_standart_uuid = "";
  model.value.equipment_uuid = "";
  model.value.activity_uuid = "";
  params_inspection.filters = [
    {
      group: "AND",
      operator: "EQ",
      column: "machine_uuid",
      value: e.value,
    },
  ];
  refetchInspection();
};

const selectInspection = (e: OptionType) => {
  model.value.bidang_uuid = "";
  model.value.sub_bidang_uuid = "";
  model.value.scope_standart_uuid = "";
  model.value.equipment_uuid = "";
  model.value.activity_uuid = "";
  params_inspection.filters = [
    {
      group: "AND",
      operator: "EQ",
      column: "inspection_type_uuid",
      value: e.value,
    },
  ];
  refetchScope();
};

const selectBidang = (e: OptionType) => {
  queryClient.removeQueries({ queryKey: ["getSubBidangScope"] });
  model.value.scope_standart_uuid = "";
  model.value.sub_bidang_uuid = "";
  model.value.equipment_uuid = "";
  model.value.activity_uuid = "";
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
  model.value.scope_standart_uuid = "";
  model.value.equipment_uuid = "";
  model.value.activity_uuid = "";
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
      column: "inspection_type_uuid",
      value: model.value.inspection_type_uuid,
    },
  ];
  refetchScope();
};

const selectScope = (e: OptionType) => {
  model.value.equipment_uuid = "";
  model.value.activity_uuid = "";
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

const selectEquipment = (e: OptionType) => {
  model.value.activity_uuid = "";
  params_activity.filters = [
    {
      group: "AND",
      operator: "EQ",
      column: "equipment_uuid",
      value: e.value,
    },
  ];
  refetchActivity();
};

// scope
watch(
  [modelValue, dataScope],
  ([_, newScope]) => {
    if (props.selectedValue) {
      const new_data: OptionType[] =
        newScope?.pages
          .flatMap((page) => page?.data)
          ?.map((item) => {
            return { value: item.uuid, label: item.name };
          }) || [];
      options_scope.value = mergeArrays(
        [
          {
            value:
              props.selectedValue?.activity?.equipment?.scope_standart_uuid,
            label:
              props.selectedValue?.activity?.equipment?.scope_standart?.name,
          },
        ],
        new_data.filter(
          (item) =>
            item.value !==
            props.selectedValue?.activity?.equipment?.scope_standart_uuid
        )
      );
    } else {
      const new_data: OptionType[] =
        newScope?.pages
          .flatMap((page) => page?.data)
          ?.map((item) => {
            return { value: item.uuid, label: item.name };
          }) || [];

      options_scope.value = new_data;
    }
  },
  { deep: true, immediate: true }
);
// equipment
watch(
  [modelValue, dataEquipment],
  ([_, newEquipment]) => {
    if (props.selectedValue) {
      const new_data: OptionType[] =
        newEquipment?.pages
          .flatMap((page) => page?.data)
          ?.map((item) => {
            return { value: item.uuid, label: item.name };
          }) || [];
      options_equipment.value = mergeArrays(
        [
          {
            value: props.selectedValue?.activity?.equipment_uuid,
            label: props.selectedValue?.activity?.equipment?.name,
          },
        ],
        new_data.filter(
          (item) => item.value !== props.selectedValue?.activity?.equipment_uuid
        )
      );
    } else {
      const new_data: OptionType[] =
        newEquipment?.pages
          .flatMap((page) => page?.data)
          ?.map((item) => {
            return { value: item.uuid, label: item.name };
          }) || [];

      options_equipment.value = new_data;
    }
  },
  { deep: true, immediate: true }
);
// activity
watch(
  [modelValue, dataActivity],
  ([_, newActivity]) => {
    if (props.selectedValue) {
      const new_data: OptionType[] =
        newActivity?.pages
          .flatMap((page) => page?.data)
          ?.map((item) => {
            return { value: item.uuid, label: item.name };
          }) || [];
      options_activity.value = mergeArrays(
        [
          {
            value: props.selectedValue?.activity_uuid,
            label: props.selectedValue?.activity?.name,
          },
        ],
        new_data.filter(
          (item) => item.value !== props.selectedValue?.activity_uuid
        )
      );
    } else {
      const new_data: OptionType[] =
        newActivity?.pages
          .flatMap((page) => page?.data)
          ?.map((item) => {
            return { value: item.uuid, label: item.name };
          }) || [];

      options_activity.value = new_data;
    }
  },
  { deep: true, immediate: true }
);
// location
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
              props.selectedValue?.activity?.equipment?.scope_standart
                ?.inspection_type?.machine?.unit?.location_uuid,
            label:
              props.selectedValue?.activity?.equipment?.scope_standart
                ?.inspection_type?.machine?.unit?.location?.name,
          },
        ],
        new_data.filter(
          (item) =>
            item.value !==
            props.selectedValue?.activity?.equipment?.scope_standart
              ?.inspection_type?.machine?.unit?.location_uuid
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

// scope
watch(
  [modelValue, dataScope],
  ([_, newLocation]) => {
    if (props.selectedValue) {
      const new_data: OptionType[] =
        newLocation?.pages
          .flatMap((page) => page?.data)
          ?.map((item) => {
            return { value: item.uuid, label: item.name };
          }) || [];
      options_scope.value = mergeArrays(
        [
          {
            value:
              props.selectedValue?.activity?.equipment?.scope_standart
                ?.inspection_type?.machine?.unit?.location_uuid,
            label:
              props.selectedValue?.activity?.equipment?.scope_standart
                ?.inspection_type?.machine?.unit?.location?.name,
          },
        ],
        new_data.filter(
          (item) =>
            item.value !==
            props.selectedValue?.activity?.equipment?.scope_standart
              ?.inspection_type?.machine?.unit?.location_uuid
        )
      );
    } else {
      const new_data: OptionType[] =
        newLocation?.pages
          .flatMap((page) => page?.data)
          ?.map((item) => {
            return { value: item.uuid, label: item.name };
          }) || [];

      options_scope.value = new_data;
    }
  },
  { deep: true, immediate: true }
);

// bidang
watch(
  dataBidang,
  (newBidang) => {
    if (props.selectedValue) {
      const new_data: OptionType[] =
        newBidang?.pages
          .flatMap((page) => page?.data)
          ?.map((item) => {
            return { value: item.uuid, label: item.name };
          }) || [];
      options_bidang.value = mergeArrays(
        [
          {
            value:
              props.selectedValue?.activity?.equipment?.scope_standart
                ?.sub_bidang?.bidang_uuid,
            label:
              props.selectedValue?.activity?.equipment?.scope_standart
                ?.sub_bidang?.bidang?.name,
          },
        ],
        new_data.filter(
          (item) =>
            item.value !==
            props.selectedValue?.activity?.equipment?.scope_standart?.sub_bidang
              ?.bidang_uuid
        )
      );
    } else {
      const new_data: OptionType[] =
        newBidang?.pages
          .flatMap((page) => page?.data)
          ?.map((item) => {
            return { value: item.uuid, label: item.name };
          }) || [];

      options_bidang.value = new_data;
    }
  },
  { deep: true, immediate: true }
);
// end bidang
// sub bidang
watch(
  dataSubBidang,
  (newSubBidang) => {
    if (props.selectedValue) {
      const new_data: OptionType[] =
        newSubBidang?.pages
          .flatMap((page) => page?.data)
          ?.map((item) => {
            return { value: item.uuid, label: item.name };
          }) || [];
      options_sub_bidang.value = mergeArrays(
        [
          {
            value:
              props.selectedValue?.activity?.equipment?.scope_standart
                ?.sub_bidang_uuid,
            label:
              props.selectedValue?.activity?.equipment?.scope_standart
                ?.sub_bidang?.name,
          },
        ],
        new_data.filter(
          (item) =>
            item.value !==
            props.selectedValue?.activity?.equipment?.scope_standart
              ?.sub_bidang_uuid
        )
      );
    } else {
      const new_data: OptionType[] =
        newSubBidang?.pages
          .flatMap((page) => page?.data)
          ?.map((item) => {
            return { value: item.uuid, label: item.name };
          }) || [];

      options_sub_bidang.value = new_data;
    }
  },
  { deep: true, immediate: true }
);
// end sub bidang
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
              props.selectedValue?.activity?.equipment?.scope_standart
                ?.inspection_type?.machine?.unit?.location_uuid,
            label:
              props.selectedValue?.activity?.equipment?.scope_standart
                ?.inspection_type?.machine?.unit?.location?.name,
          },
        ],
        new_data.filter(
          (item) =>
            item.value !==
            props.selectedValue?.activity?.equipment?.scope_standart
              ?.inspection_type?.machine?.unit?.location_uuid
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
            value:
              props.selectedValue?.activity?.equipment?.scope_standart
                ?.inspection_type?.machine?.unit_uuid,
            label:
              props.selectedValue?.activity?.equipment?.scope_standart
                ?.inspection_type?.machine?.unit?.name,
          },
        ],
        new_data.filter(
          (item) =>
            item.value !==
            props.selectedValue?.activity?.equipment?.scope_standart
              ?.inspection_type?.machine?.unit_uuid
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
            value:
              props.selectedValue?.activity?.equipment?.scope_standart
                ?.inspection_type?.machine_uuid,
            label:
              props.selectedValue?.activity?.equipment?.scope_standart
                ?.inspection_type?.machine?.name,
          },
        ],
        new_data.filter(
          (item) =>
            item.value !==
            props.selectedValue?.activity?.equipment?.scope_standart
              ?.inspection_type?.machine_uuid
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
            value:
              props.selectedValue?.activity?.equipment?.scope_standart
                ?.inspection_type_uuid,
            label:
              props.selectedValue?.activity?.equipment?.scope_standart
                ?.inspection_type?.name,
          },
        ],
        new_data.filter(
          (item) =>
            item.value !==
            props.selectedValue?.activity?.equipment?.scope_standart
              ?.inspection_type?.uuid
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
      if (
        value?.activity?.equipment?.scope_standart?.inspection_type?.machine
          ?.unit?.location
      ) {
        refetchLocation();
      }

      if (
        value?.activity?.equipment?.scope_standart?.inspection_type?.machine
          ?.unit
      ) {
        params_unit.filters = [
          {
            group: "AND",
            operator: "EQ",
            column: "location_uuid",
            value:
              value?.activity?.equipment?.scope_standart?.inspection_type
                ?.machine?.unit?.location_uuid,
          },
        ];
        refetchUnit();
      }

      if (
        value?.activity?.equipment?.scope_standart?.inspection_type?.machine
      ) {
        params_machine.filters = [
          {
            group: "AND",
            operator: "EQ",
            column: "unit_uuid",
            value:
              value?.activity?.equipment?.scope_standart?.inspection_type
                ?.machine?.unit_uuid,
          },
        ];
        refetchMachine();
      }

      if (value?.activity?.equipment?.scope_standart?.inspection_type) {
        params_inspection.filters = [
          {
            group: "AND",
            operator: "EQ",
            column: "machine_uuid",
            value:
              value?.activity?.equipment?.scope_standart?.inspection_type
                ?.machine_uuid,
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
    <span class="text-blue-950 font-semibold">Pilih Aktifitas</span>
    <form class="" @submit.prevent="handleSubmit">
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
        @select="selectInspection"
      />
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
        @select="selectEquipment"
      />
      <Select
        v-model="model.activity_uuid"
        label="Activity"
        options_label="label"
        options_value="value"
        v-model:model-search="params_activity.search"
        :search="true"
        :loading="is_loading_activity"
        :loading-next-page="isFetchingNextPageActivity"
        :rules="rules.activity_uuid"
        :options="options_activity"
        @scroll="scrollActivity"
        @search="searchActivity"
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
