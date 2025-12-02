<script setup lang="ts">
import { reactive, ref, computed, type PropType, watch } from "vue";

import { Button, Input, Modal, Select, Textarea } from "@/components";
import useVuelidate from "@vuelidate/core";
import { required, helpers, requiredIf } from "@vuelidate/validators";
import { useInfiniteQuery, useMutation } from "@tanstack/vue-query";
import { all_characters, mergeArrays } from "@/helpers/global";

import type {
  LocationCreateInterface,
  LocationInterface,
} from "../types/LocationType";
import { useMasterStore } from "../stores/MasterStore";
import type { IPagination, IParams } from "@/types/GlobalType";
import type { SubAreaInterface } from "../types/SubAreaType";
import type { GeneratorTypeInterface } from "../types/GeneratorType";

const props = defineProps({
  selectedValue: {
    type: Object as PropType<LocationInterface | null>,
  },
});
type OptionType = {
  value: string;
  label: string;
};
const emit = defineEmits(["success", "error"]);
const masterStore = useMasterStore();
const is_loading_sub_area = ref<boolean>(false);
const is_loading_generator_type = ref<boolean>(false);
const options_area = ref<OptionType[]>([]);
const options_generator_type = ref<OptionType[]>([]);
const modelValue = defineModel<boolean>({ default: false });
const OptionsType = [
  {
    label: "PLTG/U",
    value: "#D84040",
  },
  {
    label: "PLTU",
    value: "#000000",
  },
  {
    label: "PLTA",
    value: "#EB5A3C",
  },
  {
    label: "PLTP",
    value: "#7E5CAD",
  },
  {
    label: "PLTD/G",
    value: "#ECE852",
  },
  {
    label: "PLTMG",
    value: "#FFFFFF",
  },
];

const model = ref<LocationCreateInterface>({
  name: "",
  lat: "",
  lon: "",
  slug: "",
  description: "",
  generator_type_uuid: "",
  sub_area_uuid: "",
});
const v$_form = reactive(useVuelidate());
const rules = computed(() => {
  return {
    name: {
      required: helpers.withMessage(`This field is required`, required),
    },
    lat: {
      required: helpers.withMessage(`This field is required`, required),
    },
    lon: {
      required: helpers.withMessage(`This field is required`, required),
    },
    slug: {
      required: helpers.withMessage(`This field is required`, required),
    },
    description: {
      required: helpers.withMessage(
        `This field is required`,
        requiredIf(false)
      ),
    },
    generator_type_uuid: {
      required: helpers.withMessage(`This field is required`, required),
    },
    sub_area_uuid: {
      required: helpers.withMessage(`This field is required`, required),
    },
  };
});

//--- GET SUB AREA
const params_sub_area = reactive<IParams>({
  search: "",
  filters: "",
  currentPage: 1,
  perPage: 10,
});
const {
  data: dataSubArea,
  refetch: refetchSubArea,
  fetchNextPage: fetchNextPageSubArea,
  hasNextPage: hasNextPageSubArea,
  isFetchingNextPage: isFetchingNextPageSubArea,
} = useInfiniteQuery({
  queryKey: ["getLocationFilterInspection"],
  enabled: !props.selectedValue && !is_loading_sub_area.value,
  queryFn: async ({ pageParam = 1 }) => {
    try {
      const { data } = await masterStore.getSubArea({
        ...params_sub_area,
        currentPage: pageParam,
      });

      const response = data as IPagination<SubAreaInterface[]>;

      return response;
    } catch (error: any) {
      throw error.response;
    } finally {
      is_loading_sub_area.value = false;
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

//--- GET GENERATOR TYPE
const selected_generator_type = ref<GeneratorTypeInterface>();
const params_generator_type = reactive<IParams>({
  search: "",
  filters: "",
  currentPage: 1,
  perPage: 10,
});
const {
  data: dataGeneratorType,
  refetch: refetchGeneratorType,
  fetchNextPage: fetchNextPageGeneratorType,
  hasNextPage: hasNextPageGeneratorType,
  isFetchingNextPage: isFetchingNextPageGeneratorType,
} = useInfiniteQuery({
  queryKey: ["getGeneratorFilterInspection"],
  enabled: !props.selectedValue && !is_loading_generator_type.value,
  queryFn: async ({ pageParam = 1 }) => {
    try {
      const { data } = await masterStore.getGeneratorType({
        ...params_generator_type,
        currentPage: pageParam,
      });

      const response = data as IPagination<GeneratorTypeInterface[]>;

      return response;
    } catch (error: any) {
      throw error.response;
    } finally {
      is_loading_generator_type.value = false;
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

//--- CREATE LOCATION
const { mutate: createLocation, isPending: isLoadingCreate } = useMutation({
  mutationFn: async (payload: LocationCreateInterface) => {
    return await masterStore.createLocation(payload);
  },
  onSuccess: () => {
    modelValue.value = false;
    emit("success");
  },
  onError: (error) => {
    console.log(error);
    emit("error", error);
  },
});
//--- END

//--- UPDATE LOCATION
const { mutate: updateLocation, isPending: isLoadingUpdate } = useMutation({
  mutationFn: async ({
    id,
    payload,
  }: {
    id: string;
    payload: LocationCreateInterface;
  }) => {
    return await masterStore.updateLocation(id, payload);
  },
  onSuccess: async () => {
    modelValue.value = false;
    emit("success");
  },
  onError: (error) => {
    console.log(error);
    emit("error", error);
  },
});
//--- END

const handleSubmit = async () => {
  const isValid = await v$_form.value.$validate();

  if (!isValid) return;

  if (props.selectedValue) {
    updateLocation({ id: props.selectedValue?.uuid, payload: model.value });
  } else {
    createLocation(model.value);
  }
};

const setValue = () => {
  model.value = {
    name: props.selectedValue?.name || "",
    lat: props.selectedValue?.lat || "",
    lon: props.selectedValue?.lon || "",
    slug: props.selectedValue?.slug || "",
    description: props.selectedValue?.description || "",
    generator_type_uuid: props.selectedValue?.generator_type_uuid || "",
    sub_area_uuid: props.selectedValue?.sub_area_uuid || "",
  };
};

const resetValue = () => {
  model.value = {
    name: "",
    lat: "",
    lon: "",
    slug: "",
    description: "",
    generator_type_uuid: "",
    sub_area_uuid: "",
  };
};

const timeout_sub_area = ref(0);
const searchSubArea = () => {
  clearTimeout(timeout_sub_area.value);
  timeout_sub_area.value = window.setTimeout(() => {
    is_loading_sub_area.value = true;
    params_sub_area.currentPage = 1;
    refetchSubArea();
  }, 1000);
};
const scrollSubArea = (e: Event) => {
  const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLElement;
  if (
    scrollTop + clientHeight >= scrollHeight - 1 &&
    hasNextPageSubArea.value &&
    !isFetchingNextPageSubArea.value
  ) {
    fetchNextPageSubArea();
  }
};

const timeout_generator_type = ref(0);
const searchGeneratorType = () => {
  clearTimeout(timeout_generator_type.value);
  timeout_generator_type.value = window.setTimeout(() => {
    is_loading_generator_type.value = true;
    params_generator_type.currentPage = 1;
    refetchGeneratorType();
  }, 1000);
};
const scrollGeneratorType = (e: Event) => {
  const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLElement;
  if (
    scrollTop + clientHeight >= scrollHeight - 1 &&
    hasNextPageGeneratorType.value &&
    !isFetchingNextPageGeneratorType.value
  ) {
    fetchNextPageGeneratorType();
  }
};
const selectGeneratorType = (e: OptionType) => {
  const find_item = dataGeneratorType.value?.pages
    ?.flatMap((page) => page?.data)
    .find((item) => item.uuid === e.value);
  selected_generator_type.value = find_item;
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
  [modelValue, dataSubArea],
  ([newModel, newSubArea]) => {
    if (props.selectedValue) {
      const new_data: OptionType[] =
        newSubArea?.pages
          .flatMap((page) => page?.data)
          ?.map((item) => {
            return { value: item.uuid, label: item.name };
          }) || [];

      options_area.value = mergeArrays(
        [
          {
            value: props.selectedValue?.sub_area_uuid,
            label: props.selectedValue?.sub_area?.name,
          },
        ],
        new_data.filter(
          (item) => item.value !== props.selectedValue?.sub_area_uuid
        )
      ).filter((item) => item.value !== "");
    } else {
      const new_data: OptionType[] =
        newSubArea?.pages
          .flatMap((page) => page?.data)
          ?.map((item) => {
            return { value: item.uuid, label: item.name };
          }) || [];

      options_area.value = new_data;
    }
  },
  { deep: true, immediate: true }
);

watch(
  [modelValue, dataGeneratorType],
  ([newModel, newGeneratorType]) => {
    if (props.selectedValue) {
      const new_data: OptionType[] =
        newGeneratorType?.pages
          .flatMap((page) => page?.data)
          ?.map((item) => {
            return { value: item.uuid, label: item.name };
          }) || [];

      options_generator_type.value = mergeArrays(
        [
          {
            value: "",
            label: "",
          },
        ],
        new_data.filter(
          (item) => item.value !== props.selectedValue?.sub_area_uuid
        )
      ).filter((item) => item.value !== "");
    } else {
      const new_data: OptionType[] =
        newGeneratorType?.pages
          .flatMap((page) => page?.data)
          ?.map((item) => {
            return { value: item.uuid, label: item.name };
          }) || [];

      options_generator_type.value = new_data;
    }
  },
  { deep: true, immediate: true }
);
</script>

<template>
  <Modal width="440" height="200" :showButtonClose="false"
    :title="props.selectedValue ? 'Ubah Lokasi' : 'Tambah Lokasi'" v-model="modelValue">
    <form class="flex flex-col gap-4 max-h-[calc(100vh-200px)] overflow-y-auto mx-[-20px] px-5"
      @submit.prevent="handleSubmit">
      <Input v-model="model.name" star :rules="rules.name" :custom_symbols="all_characters" label="Nama" />
      <Input v-model="model.lat" star :rules="rules.lat" :custom_symbols="all_characters" label="Latitude" />
      <Input v-model="model.lon" star :rules="rules.lon" :custom_symbols="all_characters" label="Longitude" />
      <Input v-model="model.slug" star :rules="rules.slug" :custom_symbols="all_characters" label="Kode" />
      <Textarea v-model="model.description" label="Deskripsi" :rules="rules.description" :rows="3" />
      <Select v-model="model.generator_type_uuid" star label="Jenis Pembangkit" options_label="label"
        options_value="value" v-model:model-search="params_generator_type.search" :search="true"
        :loading="is_loading_generator_type" :loading-next-page="isFetchingNextPageGeneratorType"
        :rules="rules.generator_type_uuid" :options="options_generator_type" @scroll="scrollGeneratorType"
        @search="searchGeneratorType" @select="selectGeneratorType" />
      <Select v-model="model.sub_area_uuid" star label="Sub Area" options_label="label" options_value="value"
        v-model:model-search="params_sub_area.search" :search="true" :loading="is_loading_sub_area"
        :loading-next-page="isFetchingNextPageSubArea" :rules="rules.sub_area_uuid" :options="options_area"
        @scroll="scrollSubArea" @search="searchSubArea" />

      <div class="w-full flex items-center gap-4 mt-4">
        <Button text="Batal" class="w-full" variant="secondary" :disabled="isLoadingCreate || isLoadingUpdate"
          @click="modelValue = false" />
        <Button type="submit" text="Simpan" class="w-full" color="blue" :disabled="isLoadingCreate || isLoadingUpdate"
          :loading="isLoadingCreate || isLoadingUpdate" />
      </div>
    </form>
  </Modal>
</template>
