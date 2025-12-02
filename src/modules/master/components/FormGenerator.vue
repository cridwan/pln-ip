<script setup lang="ts">
import { reactive, ref, computed, type PropType, watch } from "vue";

import { Button, Input, Modal } from "@/components";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useMutation } from "@tanstack/vue-query";
import { all_characters } from "@/helpers/global";

import { useMasterStore } from "../stores/MasterStore";
import type {
  GeneratorTypeCreateInterface,
  GeneratorTypeInterface,
} from "../types/GeneratorType";

const props = defineProps({
  selectedValue: {
    type: Object as PropType<GeneratorTypeInterface | null>,
  },
});

const emit = defineEmits(["success", "error"]);
const masterStore = useMasterStore();
const modelValue = defineModel<boolean>({ default: false });

const model = ref<GeneratorTypeCreateInterface>({
  name: "",
  color: "#ffffff",
});
const v$_form = reactive(useVuelidate());
const rules = computed(() => {
  return {
    name: {
      required: helpers.withMessage(`This field is required`, required),
    },
  };
});

//--- CREATE GENERATOR TYPE
const { mutate: createGeneratorType, isPending: isLoadingCreate } = useMutation(
  {
    mutationFn: async (payload: GeneratorTypeCreateInterface) => {
      return await masterStore.createGeneratorType(payload);
    },
    onSuccess: () => {
      modelValue.value = false;
      emit("success");
    },
    onError: (error) => {
      console.log(error);
      emit("error", error);
    },
  }
);
//--- END

//--- UPDATE GENERATOR TYPE
const { mutate: updateGeneratorType, isPending: isLoadingUpdate } = useMutation(
  {
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: GeneratorTypeCreateInterface;
    }) => {
      return await masterStore.updateGeneratorType(id, payload);
    },
    onSuccess: async () => {
      modelValue.value = false;
      emit("success");
    },
    onError: (error) => {
      console.log(error);
      emit("error", error);
    },
  }
);
//--- END

const handleSubmit = async () => {
  const isValid = await v$_form.value.$validate();

  if (!isValid) return;

  if (props.selectedValue) {
    updateGeneratorType({
      id: props.selectedValue?.uuid,
      payload: model.value,
    });
  } else {
    createGeneratorType(model.value);
  }
};

const setValue = () => {
  model.value = {
    name: props.selectedValue?.name || "",
    color: props.selectedValue?.color || "",
  };
};

const resetValue = () => {
  model.value = {
    name: "",
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
    :title="
      props.selectedValue ? 'Ubah Jenis Pembangkit' : 'Tambah Jenis Pembangkit'
    "
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
      <div class="flex items-center justify-center">
        <color-picker
          is-widget
          picker-type="fk"
          disable-alpha
          format="hex"
          class="w-full"
          v-model:pureColor="model.color"
        />
      </div>

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

<style lang="sass"></style>
