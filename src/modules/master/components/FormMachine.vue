<script setup lang="ts">
import { reactive, ref, computed, type PropType, watch } from "vue";

import { Button, Input, Modal } from "@/components";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useMutation } from "@tanstack/vue-query";
import { all_characters } from "@/helpers/global";

import type {
  MachineCreateInterface,
  MachineInterface,
  MachineModelCreateInterface,
  MachineTypeModelCreateInterface,
} from "../types/MachineType";
import { useMasterStore } from "../stores/MasterStore";

type OptionType = {
  value: string;
  label: string;
};

const props = defineProps({
  selectedValue: {
    type: Object as PropType<MachineInterface | null>,
  },
  dataForm: {
    type: Object as PropType<MachineTypeModelCreateInterface | null>,
  },
});

const emit = defineEmits(["success", "error"]);

const masterStore = useMasterStore();
const modelValue = defineModel<boolean>({ default: false });

const model = ref<MachineModelCreateInterface>({
  name: "",
  unit_uuid: "",
  location_uuid: "",
});
const v$_form = reactive(useVuelidate());
const rules = computed(() => {
  return {
    name: {
      required: helpers.withMessage(`This field is required`, required),
    },
    unit_uuid: {
      required: helpers.withMessage(`This field is required`, required),
    },
    location_uuid: {
      required: helpers.withMessage(`This field is required`, required),
    },
  };
});

//--- CREATE MACHINE
const { mutate: createMachine, isPending: isLoadingCreate } = useMutation({
  mutationFn: async (payload: MachineCreateInterface) => {
    return await masterStore.createMachine(payload);
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

//--- UPDATE MACHINE
const { mutate: updateMachine, isPending: isLoadingUpdate } = useMutation({
  mutationFn: async ({
    id,
    payload,
  }: {
    id: string;
    payload: MachineCreateInterface;
  }) => {
    return await masterStore.updateMachine(id, payload);
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
    updateMachine({
      id: props.selectedValue?.uuid,
      payload: model.value,
    });
  } else {
    createMachine(model.value);
  }
};

const setValue = () => {
  model.value = {
    name: props.selectedValue?.name || "",
    unit_uuid: props.dataForm?.unit_uuid || "",
    location_uuid: props.dataForm?.location_uuid || "",
  };
};

const resetValue = () => {
  model.value = {
    name: "",
    unit_uuid: props.dataForm?.unit_uuid || "",
    location_uuid: props.dataForm?.location_uuid || "",
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
    :title="props.selectedValue ? 'Ubah Mesin' : 'Tambah Mesin'"
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
        label="Nama Mesin"
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
