<script setup lang="ts">
import { reactive, ref, computed, type PropType, watch } from "vue";

import { Button, Input, Modal } from "@/components";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useMutation } from "@tanstack/vue-query";
import { all_characters } from "@/helpers/global";
import { useGlobalStore } from "@/stores/GlobalStore";
import type {
  CreateDocumentInterface,
  ResponseDocumentInterface,
} from "@/types/GlobalType";
import UploadStream from "@/components/fields/UploadStream.vue";

import { useMasterStore } from "../stores/MasterStore";
import type {
  ActivityCreateInterface,
  ActivityFilterInterface,
  ActivityInterface,
} from "../types/AcitivityType";

const props = defineProps({
  selectedValue: {
    type: Object as PropType<ActivityInterface | null>,
  },
  dataForm: {
    type: Object as PropType<ActivityFilterInterface | null>,
  },
});

const uploadProgress = ref<number>(0);
const modelUpload = ref<File | null>(null);
const documentValues = ref<ResponseDocumentInterface | null>(null);
const emit = defineEmits(["success", "error", "removeSucess"]);

const masterStore = useMasterStore();
const globalStore = useGlobalStore();
const modelValue = defineModel<boolean>({ default: false });

const model = ref<ActivityCreateInterface>({
  name: "",
  duration: "",
  link_ik1: "",
  equipment_uuid: props.dataForm?.equipment_uuid || "",
});
const v$_form = reactive(useVuelidate());
const rules = computed(() => {
  return {
    name: {
      required: helpers.withMessage(`This field is required`, required),
    },
    duration: {
      required: helpers.withMessage(`This field is required`, required),
    },
    link_ik1: {
      required: helpers.withMessage(`This field is required`, required),
    },
  };
});

// create documnet
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

//--- CREATE ACTIVITY
const { mutate: createActivity, isPending: isLoadingCreate } = useMutation({
  mutationFn: async (payload: ActivityCreateInterface) => {
    return await masterStore.createActivity(payload);
  },
  onSuccess: (data) => {
    console.log(data);
    if (modelUpload.value) {
      createDocument({
        document: modelUpload.value as File,
        document_type: "App\\Models\\Activity",
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

//--- UPDATE ACTIVITY
const { mutate: updateActivity, isPending: isLoadingUpdate } = useMutation({
  mutationFn: async ({
    id,
    payload,
  }: {
    id: string;
    payload: ActivityCreateInterface;
  }) => {
    return await masterStore.updateActivity(id, payload);
  },
  onSuccess: async () => {
    if (modelUpload.value) {
      createDocument({
        document: modelUpload.value as File,
        document_type: "App\\Models\\Activity",
        document_uuid: props.selectedValue?.uuid as string,
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

const handleSubmit = async () => {
  const isValid = await v$_form.value.$validate();

  if (!isValid) return;

  if (props.selectedValue) {
    updateActivity({
      id: props.selectedValue?.uuid,
      payload: {
        name: model.value.name,
        duration: model.value.duration,
        link_ik1: model.value.link_ik1,
        equipment_uuid: model.value.equipment_uuid,
      },
    });
  } else {
    createActivity({
      name: model.value.name,
      duration: model.value.duration,
      link_ik1: model.value.link_ik1,
      equipment_uuid: model.value.equipment_uuid,
    });
  }
};

const setValue = () => {
  model.value.name = props.selectedValue?.name || "";
  model.value.duration = (props.selectedValue?.duration || 0).toString() || "";
  model.value.link_ik1 = props.selectedValue?.link_ik1 || "";
  model.value.equipment_uuid = props.selectedValue?.equipment_uuid || "";
};

const resetValue = () => {
  model.value = {
    name: "",
    duration: "",
    link_ik1: "",
    equipment_uuid: props.dataForm?.equipment_uuid || "",
  };
  uploadProgress.value = 0;
  documentValues.value = null
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
  () => props.selectedValue,
  (newValue) => {
    if (newValue) {
      documentValues.value = newValue.document as ResponseDocumentInterface;
    }
  }
);

const handleChangeFile = (e: File) => {
  modelUpload.value = e;
};

const removeSuccess = () => {
  documentValues.value = null;
  emit("removeSucess");
};
</script>

<template>
  <Modal width="440" height="200" :showButtonClose="false"
    :title="props.selectedValue ? 'Ubah Activity' : 'Tambah Activity'" v-model="modelValue">
    <form class="flex flex-col gap-4 max-h-[calc(100vh-200px)] overflow-y-auto mx-[-20px] px-5"
      @submit.prevent="handleSubmit">
      <Input v-model="model.name" star label="Nama" :rules="rules.name" :custom_symbols="all_characters" />
      <Input v-model="model.duration" star label="Durasi (Jam)" :rules="rules.duration"
        :custom_symbols="all_characters" />
      <Input v-model="model.link_ik1" label="IK Online ex. (http://google.com)" :custom_symbols="all_characters" />
      <UploadStream label="File IK" :progress="uploadProgress" :selectedValues="documentValues"
        @changes="handleChangeFile" @removeSuccess="removeSuccess" :fileType="['pdf', 'doc', 'docx', 'xls', 'xlsx']" />

      <div class="w-full flex items-center gap-4 mt-4">
        <Button text="Batal" class="w-full" variant="secondary"
          :disabled="isLoadingCreate || isLoadingUpdate || isLoadingDocument" @click="modelValue = false" />
        <Button type="submit" text="Simpan" class="w-full" color="blue"
          :disabled="isLoadingCreate || isLoadingUpdate || isLoadingDocument"
          :loading="isLoadingCreate || isLoadingUpdate || isLoadingDocument" />
      </div>
    </form>
  </Modal>
</template>
