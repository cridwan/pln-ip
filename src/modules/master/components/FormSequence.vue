<script setup lang="ts">
import { reactive, ref, computed, type PropType, watch } from "vue";

import { Button, Input, Modal, Upload } from "@/components";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useMutation } from "@tanstack/vue-query";
import type {
  CreateActivityLogSyncInterface,
  CreateDocumentInterface,
  ResponseDocumentInterface,
} from "@/types/GlobalType";
import { all_characters } from "@/helpers/global";
import { useGlobalStore } from "@/stores/GlobalStore";
import UploadStream from "@/components/fields/UploadStream.vue";

import { useMasterStore } from "../stores/MasterStore";
import type {
  SequenceInterface,
  SequenceCreateModelInterface,
  SequenceCreateInterface,
} from "../types/SequenceTypes";

const props = defineProps({
  selectedValue: {
    type: Object as PropType<SequenceInterface | null>,
  },
});

const emit = defineEmits(["success", "error", "removeSucess"]);
const documentValues = ref<ResponseDocumentInterface | null>(null);
const masterStore = useMasterStore();
const globalStore = useGlobalStore();
const uploadProgress = ref<number>(0);

const modelValue = defineModel<boolean>({ default: false });

const model = ref<SequenceCreateModelInterface>({
  name: "",
  link: "",
  file: [],
});
const modelUpload = ref<File | null>(null);
const v$_form = reactive(useVuelidate());
const rules = computed(() => {
  return {
    name: {
      required: helpers.withMessage(`This field is required`, required),
    },
    file: {
      required: helpers.withMessage(`This field is required`, required),
    },
  };
});

//--- CREATE DOCUMENT
const { mutate: createDocument, isPending: isLoadingDocument } = useMutation({
  mutationFn: async (payload: CreateDocumentInterface) => {
    return globalStore.createStreamDocument(payload, (percent) => {
      uploadProgress.value = percent;
    });
  },
  onSuccess: (data) => {
    modelValue.value = false;
    emit("success");
  },
  onError: (error) => {
    console.log(error);
    emit("error", error);
  },
});
//---

//--- CREATE SEQUENCE
const { mutate: createHse, isPending: isLoadingCreate } = useMutation({
  mutationFn: async (payload: SequenceCreateInterface) => {
    return await masterStore.createSequence({
      name: payload.name,
      link: payload.link,
    });
  },
  onSuccess: (data) => {
    if (modelUpload.value) {
      createDocument({
        document: modelUpload.value as File,
        document_type: "App\\Models\\Sequence",
        document_uuid: data.data.data.uuid,
      });
    } else {
      modelValue.value = false;
      emit("success");
    }
  },
  onError: (error) => {
    console.log(error);
    emit("error", error);
  },
});
//--- END

//--- UPDATE HSE
const { mutate: updateSequence, isPending: isLoadingUpdate } = useMutation({
  mutationFn: async ({
    id,
    payload,
  }: {
    id: string;
    payload: SequenceCreateInterface;
  }) => {
    return await masterStore.updateSequence(id, {
      name: payload.name,
      link: payload.link,
    });
  },
  onSuccess: async () => {
    if (modelUpload.value) {
      const type = "App\\Models\\Sequence";
      createDocument({
        document: modelUpload.value as File,
        document_type: type,
        document_uuid: props.selectedValue?.uuid as string,
      });
      createActivityLogSync({
        activity_id: props.selectedValue?.uuid as string,
        activity_type: type,
      });
    } else {
      modelValue.value = false;
      emit("success");
    }
  },
  onError: (error) => {
    console.log(error);
    emit("error", error);
  },
});
//--- END

//--- CREATE ACTIVITY LOG SYNC
const { mutate: createActivityLogSync } = useMutation({
  mutationFn: async (payload: CreateActivityLogSyncInterface) => {
    return await globalStore.createActivityLogSync(payload);
  },
});
//--- END

const handleChangeFile = (e: File) => {
  modelUpload.value = e;
};

const handleRemove = () => {
  documentValues.value = null;
  model.value.file = [];
};

const handleSubmit = async () => {
  const isValid = await v$_form.value.$validate();

  console.log(
    "KK",
    modelUpload.value,
    isValid,
    model.value,
    documentValues.value,
    props.selectedValue
  );

  if (!isValid) return;

  if (props.selectedValue) {
    updateSequence({
      id: props.selectedValue?.uuid,
      payload: {
        name: model.value.name,
        link: model.value.link,
      },
    });
  } else {
    createHse({
      name: model.value.name,
      link: model.value.link,
    });
  }
};

const setValue = () => {
  model.value.name = props.selectedValue?.name || "";
  model.value.link = props.selectedValue?.link || "";

  if (props.selectedValue?.document) {
    model.value.file = [
      {
        id: "0",
        name: props.selectedValue.document?.document_name,
        size: props.selectedValue.document?.document_size,
        file: props.selectedValue.document?.document_link,
      },
    ];
  }
};

const resetValue = () => {
  model.value = {
    name: "",
    link: "",
  };
  uploadProgress.value = 0;
  documentValues.value = null;
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
  modelValue,
  (value) => {
    if (props.selectedValue && value) {
      documentValues.value = props.selectedValue
        .document as ResponseDocumentInterface;
    }
  },
  { immediate: true }
);
</script>

<template>
  <Modal
    width="440"
    height="200"
    :showButtonClose="false"
    :title="props.selectedValue ? 'Ubah Sequence' : 'Tambah Sequence'"
    v-model="modelValue"
  >
    <form
      class="flex flex-col gap-4 max-h-[calc(100vh-200px)] overflow-y-auto mx-[-20px] px-5"
      @submit.prevent="handleSubmit"
    >
      <Input
        v-model="model.name"
        label="Nama"
        star
        :rules="rules.name"
        :custom_symbols="all_characters"
      />
      <UploadStream
        v-model="model.file"
        star
        :rules="rules.file"
        :progress="uploadProgress"
        :selectedValues="documentValues"
        @changes="handleChangeFile"
        @handleRemove="handleRemove"
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
          :disabled="isLoadingCreate || isLoadingUpdate || isLoadingDocument"
          :loading="isLoadingCreate || isLoadingUpdate || isLoadingDocument"
        />
      </div>
    </form>
  </Modal>
</template>
