<script setup lang="ts">
import { reactive, ref, computed, type PropType, watch } from "vue";

import { Button, Input, Modal } from "@/components";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useMutation } from "@tanstack/vue-query";
import { all_characters } from "@/helpers/global";

import { useMasterStore } from "../stores/MasterStore";
import type {
  ScopeCreateInterface,
  ScopeCreateModelInterface,
  ScopeInterface,
  ScopeUpdateInterface,
} from "../types/ScopeType";
import UploadStream from "@/components/fields/UploadStream.vue";
import type {
  CreateDocumentInterface,
  ResponseDocumentInterface,
} from "@/types/GlobalType";
import { useGlobalStore } from "@/stores/GlobalStore";

const props = defineProps({
  selectedValue: {
    type: Object as PropType<ScopeInterface | null>,
  },
  dataForm: {
    type: Object as PropType<ScopeCreateModelInterface | null>,
  },
});

const uploadProgress = ref<number>(0);
const modelUpload = ref<File | null>(null);
const documentValues = ref<ResponseDocumentInterface | null>(null);
const emit = defineEmits(["success", "error", "removeSucess"]);

const masterStore = useMasterStore();
const globalStore = useGlobalStore();
const modelValue = defineModel<boolean>({ default: false });
const model_details = ref<{ name: string; id: string }[]>([
  { id: "0", name: "" },
]);

const model = ref<ScopeCreateModelInterface>({
  name: "",
  location_uuid: props.dataForm?.location_uuid || "",
  unit_uuid: props.dataForm?.unit_uuid || "",
  machine_uuid: props.dataForm?.machine_uuid || "",
  inspection_type_uuid: props.dataForm?.inspection_type_uuid || "",
  category: "-",
  link: "",
  sub_bidang_uuid: props.dataForm?.sub_bidang_uuid || "",
  bidang_uuid: props.dataForm?.bidang_uuid || "",
});
const v$_form = reactive(useVuelidate());
const rules = computed(() => {
  return {
    name: {
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

//--- CREATE SCOPE
const { mutate: createScope, isPending: isLoadingCreate } = useMutation({
  mutationFn: async (payload: ScopeCreateInterface) => {
    return await masterStore.createScope(payload);
  },
  onSuccess: (data) => {
    if (modelUpload.value) {
      createDocument({
        document: modelUpload.value as File,
        document_type: "App\\Models\\ScopeStandart",
        document_uuid: data.data.uuid,
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

//--- UPDATE SCOPE
const { mutate: updateScope, isPending: isLoadingUpdate } = useMutation({
  mutationFn: async ({
    id,
    payload,
  }: {
    id: string;
    payload: ScopeUpdateInterface;
  }) => {
    return await masterStore.updateScope(id, payload);
  },
  onSuccess: async () => {
    if (modelUpload.value) {
      createDocument({
        document: modelUpload.value as File,
        document_type: "App\\Models\\ScopeStandart",
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
    const details =
      model_details.value.length === 1 && model_details.value?.[0]?.name === ""
        ? []
        : model_details.value.map((item) => {
          const find_item = props.selectedValue?.details?.find(
            (el) => el.uuid === item.id
          );

          if (find_item) {
            return {
              name: item.name,
              uuid: find_item.uuid,
            };
          } else {
            return {
              name: item.name,
              uuid: null,
            };
          }
        });

    updateScope({
      id: props.selectedValue?.uuid,
      payload: {
        name: model.value.name,
        additional_scope_uuid: null,
        inspection_type_uuid: model.value.inspection_type_uuid,
        category: model.value.category,
        link: model.value.link,
        details,
        sub_bidang_uuid: model.value.sub_bidang_uuid,
      },
    });
  } else {
    createScope({
      name: model.value.name,
      additional_scope_uuid: null,
      inspection_type_uuid: model.value.inspection_type_uuid,
      category: model.value.category,
      link: model.value.link,
      sub_bidang_uuid: model.value.sub_bidang_uuid,
      details:
        model_details.value.length === 1 &&
          model_details.value?.[0]?.name === ""
          ? []
          : model_details.value
            .map((item) => ({ name: item.name }))
            .filter((item) => item.name !== ""),
    });
  }
};

const setValue = () => {
  model.value.name = props.selectedValue?.name || "";
  model.value.category = props.selectedValue?.category || "";
  model.value.link = props.selectedValue?.link || "";
  model.value.sub_bidang_uuid = props.selectedValue?.sub_bidang_uuid || "";
  model.value.bidang_uuid = props.selectedValue?.sub_bidang?.bidang_uuid || "";

  model.value.location_uuid =
    props.selectedValue?.inspection_type?.machine?.unit?.location_uuid || "";
  model.value.unit_uuid =
    props.selectedValue?.inspection_type?.machine?.unit_uuid || "";
  model.value.machine_uuid =
    props.selectedValue?.inspection_type?.machine_uuid || "";
  model.value.inspection_type_uuid =
    props.selectedValue?.inspection_type_uuid || "";
  model_details.value =
    props.selectedValue?.details?.length === 0
      ? [{ name: "", id: "0" }]
      : props.selectedValue?.details?.map((item) => ({
        name: item.name,
        id: item.uuid,
      })) || [{ name: "", id: "0" }];
};

const resetValue = () => {
  model.value = {
    name: "",
    location_uuid: props.dataForm?.location_uuid || "",
    unit_uuid: props.dataForm?.unit_uuid || "",
    machine_uuid: props.dataForm?.machine_uuid || "",
    inspection_type_uuid: props.dataForm?.inspection_type_uuid || "",
    category: "-",
    link: "",
    sub_bidang_uuid: props.dataForm?.sub_bidang_uuid || "",
    bidang_uuid: props.dataForm?.bidang_uuid || "",
  };
  model_details.value = [{ name: "", id: "0" }];
  documentValues.value = null
  uploadProgress.value = 0;
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
  <Modal width="440" height="200" :showButtonClose="false" :title="props.selectedValue ? 'Ubah Scope' : 'Tambah Scope'"
    v-model="modelValue">
    <form class="flex flex-col gap-4 max-h-[calc(100vh-200px)] overflow-y-auto mx-[-20px] px-5"
      @submit.prevent="handleSubmit">
      <Input v-model="model.name" star label="Nama Scope Standart" :rules="rules.name"
        :custom_symbols="all_characters" />
      <Input v-model="model.link" label="IK Online ex. (http://google.com)" :custom_symbols="all_characters" />
      <UploadStream label="File IK" :progress="uploadProgress" :selectedValues="documentValues"
        :fileType="['pdf', 'doc', 'docx', 'xls', 'xlsx']" @changes="handleChangeFile" @removeSuccess="removeSuccess" />

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
