<script setup lang="ts">
import { reactive, ref, computed, type PropType, watch } from "vue";

import { Button, Input, Modal } from "@/components";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useMutation } from "@tanstack/vue-query";
import {
  all_characters,
  formatToFloat,
  numbers_positive,
} from "@/helpers/global";

import { useMasterStore } from "../stores/MasterStore";
import type {
  ManpowerCreateInterface,
  ManpowerCreateModelInterface,
  ManpowerInterface,
} from "../types/ManpowerType";

const props = defineProps({
  selectedValue: {
    type: Object as PropType<ManpowerInterface | null>,
  },
});

const emit = defineEmits(["success", "error"]);

const masterStore = useMasterStore();

const modelValue = defineModel<boolean>({ default: false });

const model = ref<ManpowerCreateModelInterface>({
  name: "",
  price: "",
});
const v$_form = reactive(useVuelidate());
const rules = computed(() => {
  return {
    name: {
      required: helpers.withMessage(`This field is required`, required),
    },
    price: {
      required: helpers.withMessage(`This field is required`, required),
    },
  };
});

//--- CREATE MANPOWER
const { mutate: createManpower, isPending: isLoadingCreate } = useMutation({
  mutationFn: async (payload: ManpowerCreateInterface) => {
    return await masterStore.createManpower(payload);
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

//--- UPDATE MANPOWER
const { mutate: updateManpower, isPending: isLoadingUpdate } = useMutation({
  mutationFn: async ({
    id,
    payload,
  }: {
    id: string;
    payload: ManpowerCreateInterface;
  }) => {
    return await masterStore.updateManpower(id, payload);
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
    updateManpower({
      id: props.selectedValue?.uuid,
      payload: {
        name: model.value.name,
        price: formatToFloat(model.value.price),
      },
    });
  } else {
    createManpower({
      name: model.value.name,
      price: formatToFloat(model.value.price),
    });
  }
};

const setValue = () => {
  model.value.name = props.selectedValue?.name || "";
  model.value.price =
    parseFloat(props.selectedValue?.price || "0")?.toString() || "";
};

const resetValue = () => {
  model.value = {
    name: "",
    price: "",
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
    :title="props.selectedValue ? 'Ubah Manpower' : 'Tambah Manpower'"
    v-model="modelValue"
  >
    <form
      class="flex flex-col gap-4 max-h-[calc(100vh-200px)] overflow-y-auto mx-[-20px] px-5"
      @submit.prevent="handleSubmit"
    >
      <Input
        v-model="model.name"
        :disabled="Number(props.selectedValue?.has_transaction || 0) > 0"
        star
        label="Nama Manpower"
        :rules="rules.name"
        :custom_symbols="all_characters"
      />
      <Input
        v-model="model.price"
        star
        label="Harga (harian)"
        :rules="rules.price"
        :custom_symbols="numbers_positive"
        :is_currency="true"
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
