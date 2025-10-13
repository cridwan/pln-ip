<script setup lang="ts">
import { reactive, ref, computed, type PropType, watch } from "vue";

import { Button, Input, Modal, Select, Textarea } from "@/components";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useMutation } from "@tanstack/vue-query";
import { all_characters } from "@/helpers/global";

import type {
  LocationCreateInterface,
  LocationInterface,
} from "../types/LocationType";
import { useMasterStore } from "../stores/MasterStore";

const props = defineProps({
  selectedValue: {
    type: Object as PropType<LocationInterface | null>,
  },
});

const emit = defineEmits(["success", "error"]);

const masterStore = useMasterStore();

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
  color: "",
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
      required: helpers.withMessage(`This field is required`, required),
    },
    color: {
      required: helpers.withMessage(`This field is required`, required),
    },
  };
});

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
    color: props.selectedValue?.color || "",
  };
};

const resetValue = () => {
  model.value = {
    name: "",
    lat: "",
    lon: "",
    slug: "",
    description: "",
    color: "",
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
</script>

<template>
  <Modal
    width="440"
    height="200"
    :showButtonClose="false"
    :title="props.selectedValue ? 'Ubah Lokasi' : 'Tambah Lokasi'"
    v-model="modelValue"
  >
    <form
      class="flex flex-col gap-4 max-h-[calc(100vh-200px)] overflow-y-auto mx-[-20px] px-5"
      @submit.prevent="handleSubmit"
    >
      <Input
        v-model="model.name"
        star
        :rules="rules.name"
        :custom_symbols="all_characters"
        label="Nama"
      />
      <Input
        v-model="model.lat"
        star
        :rules="rules.lat"
        :custom_symbols="all_characters"
        label="Latitude"
      />
      <Input
        v-model="model.lon"
        star
        :rules="rules.lon"
        :custom_symbols="all_characters"
        label="Longitude"
      />
      <Input
        v-model="model.slug"
        star
        :rules="rules.slug"
        :custom_symbols="all_characters"
        label="Kode"
      />
      <Textarea
        v-model="model.description"
        star
        label="Deskripsi"
        :rules="rules.description"
        :rows="3"
      />
      <Select
        v-model="model.color"
        label="Jenis Pembangkit"
        options_label="label"
        options_value="value"
        star
        :rules="rules.color"
        :options="OptionsType"
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
