<script setup lang="ts">
import { reactive, ref, computed, type PropType, watch } from "vue";

import { Button, Input, Modal } from "@/components";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useMutation } from "@tanstack/vue-query";
import { all_characters } from "@/helpers/global";

import type {
  GlobalUnitCreateInterface,
  GlobalUnitInterface,
} from "../types/GlobalUnitType";
import { useMasterStore } from "../stores/MasterStore";

const props = defineProps({
  selectedValue: {
    type: Object as PropType<GlobalUnitInterface | null>,
  },
});

const emit = defineEmits(["success", "error"]);

const masterStore = useMasterStore();

const modelValue = defineModel<boolean>({ default: false });

const model = ref<GlobalUnitCreateInterface>({
  name: "",
  slug: "",
});
const v$_form = reactive(useVuelidate());
const rules = computed(() => {
  return {
    name: {
      required: helpers.withMessage(`This field is required`, required),
    },
    slug: {
      required: helpers.withMessage(`This field is required`, required),
    },
  };
});

//--- CREATE GLOBAL UNIT
const { mutate: createGlobalUnit, isPending: isLoadingCreate } = useMutation({
  mutationFn: async (payload: GlobalUnitCreateInterface) => {
    return await masterStore.createGlobalUnit(payload);
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

//--- UPDATE GLOBAL UNIT
const { mutate: updateGlobalUnit, isPending: isLoadingUpdate } = useMutation({
  mutationFn: async ({
    id,
    payload,
  }: {
    id: string;
    payload: GlobalUnitCreateInterface;
  }) => {
    return await masterStore.updateGlobalUnit(id, payload);
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
    updateGlobalUnit({ id: props.selectedValue?.uuid, payload: model.value });
  } else {
    createGlobalUnit(model.value);
  }
};

const setValue = () => {
  model.value = {
    name: props.selectedValue?.name || "",
    slug: props.selectedValue?.slug || "",
  };
};

const resetValue = () => {
  model.value = {
    name: "",
    slug: "",
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
    :title="props.selectedValue ? 'Ubah Global Unit' : 'Tambah Global Unit'"
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
        v-model="model.slug"
        star
        :rules="rules.slug"
        :custom_symbols="all_characters"
        label="Singkatan"
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
