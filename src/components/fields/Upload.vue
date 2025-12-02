<script setup lang="ts">
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
  watch,
  type PropType,
  reactive,
} from "vue";
import { v4 as uuidv4 } from "uuid";

import { Icon, Toast } from "@/components";
import useVuelidate from "@vuelidate/core";

export interface ValueUploadType {
  id: string;
  name: string;
  size: number;
  file: File | string;
}

const props = defineProps({
  label: {
    type: String,
  },
  status: {
    type: String as PropType<"default" | "success" | "error">,
    default: "default",
    validator: function (value: string) {
      return ["default", "success", "error"].indexOf(value) !== -1;
    },
  },
  statusMessage: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  fileType: {
    type: Array as PropType<
      ("png" | "jpg" | "jpeg" | "pdf" | "doc" | "docx" | "xls" | "xlsx")[]
    >,
    default() {
      return ["pdf", "xls", "xlsx"];
    },
    validator: function (value: string[]) {
      const format_value = value.map((item) => item.toLowerCase());
      const type_file = [
        "png",
        "jpg",
        "jpeg",
        "pdf",
        "doc",
        "docx",
        "xls",
        "xlsx",
      ];
      let result = true;
      for (const item of format_value) {
        if (!type_file.includes(item)) {
          result = false;
          break;
        }
      }
      return result;
    },
  },
  modelValue: {
    type: Array as PropType<ValueUploadType[]>,
    default() {
      return [];
    },
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  maxCount: {
    type: [Number, String],
    default: 1,
  },
  maxSize: {
    type: [Number, String],
    default: 1,
  },
  rules: {
    type: Object,
  },
  instruction: {
    type: Object,
  },
  notes: {
    type: Object,
  },
});

const events = ["dragenter", "dragleave", "dragover", "drop"];

onMounted(() => {
  events.forEach((event) =>
    document.body.addEventListener(event, (e) => e.preventDefault())
  );
});

onUnmounted(() => {
  events.forEach((event) =>
    document.body.removeEventListener(event, (e) => e.preventDefault())
  );
});

const id = ref(uuidv4());
const upload = ref<any>(null);
const error_message = ref("");
const emit = defineEmits(["change", "update:modelValue"]);
const toastRef = ref<InstanceType<typeof Toast> | null>(null);

const model = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

const classLabel = computed(() => {
  return [`v-upload--label--text`];
});

const classTextStatus = computed(() => {
  return [
    checkErrorUpload() || error_message.value !== ""
      ? `upload-text-validation--error`
      : "",
    `upload-text-validation--${props.status} upload-text-validation`,
  ];
});

const classUpload = computed(() => {
  return [
    `v-upload--${props.status}`,
    checkErrorUpload() && `v-upload--error`,
    props.disabled ? `v-upload--disabled` : "",
  ];
});

const check = {
  png: (type: string) => type === "image/png",
  jpg: (type: string) => type === "image/jpg",
  jpeg: (type: string) => type === "image/jpeg",
  pdf: (type: string) => type === "application/pdf",
  doc: (type: string) => type === "application/msword",
  docx: (type: string) =>
    type ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: (type: string) => type === "application/vnd.ms-excel",
  xlsx: (type: string) =>
    type ===
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};

function handleInput(e: InputEvent): void {
  const files_uploaded = (e.target as HTMLInputElement).files as FileList;

  const temp_type_file: File[] = [];
  for (let i = 0; i < files_uploaded.length; ++i) {
    const file = files_uploaded[i];
    if (checkFileType(file.type)) {
      temp_type_file.push(file);
    }
  }

  const temp_maz_size: File[] = [];
  for (let i = 0; i < files_uploaded.length; ++i) {
    const file = files_uploaded[i];
    if (file.size <= parseFloat(props.maxSize.toString()) * 1024 * 1024) {
      temp_maz_size.push(file);
    }
  }

  if (files_uploaded.length > parseInt(props.maxCount.toString())) {
    error_message.value = `Only ${props.maxCount} attachments are allowed`;
    toastRef.value?.showToast({
      title: "Error",
      description: `Only ${props.maxCount} attachments are allowed`,
      type: "error",
    });
  } else if (temp_type_file.length !== files_uploaded.length) {
    error_message.value = `The file must be a file of type: ${props.fileType
      .map((item) => item.toUpperCase())
      .join(", ")}`;
    toastRef.value?.showToast({
      title: "Error",
      description: `The file must be a file of type: ${props.fileType
        .map((item) => item.toUpperCase())
        .join(", ")}`,
      type: "error",
    });
  } else if (temp_maz_size.length !== files_uploaded.length) {
    error_message.value = `File size is greater than ${props.maxSize}mb. Please upload file below ${props.maxSize}mb`;
    toastRef.value?.showToast({
      title: "Error",
      description: `File size is greater than ${props.maxSize}mb. Please upload file below ${props.maxSize}mb`,
      type: "error",
    });
  } else {
    emit("change", [...files_uploaded]);

    const temp_model_value: ValueUploadType[] = [];
    for (let i = 0; i < files_uploaded.length; ++i) {
      const file = files_uploaded[i];

      temp_model_value.push({
        file,
        id: (i + props.modelValue.length).toString(),
        name: file.name,
        size: file.size,
      });
    }

    if (props.multiple) {
      emit("update:modelValue", [...props.modelValue, ...temp_model_value]);
    } else {
      emit("update:modelValue", [...temp_model_value]);
    }
    error_message.value = "";
  }
  upload.value.value = null;
}

function removeFiles(item: ValueUploadType) {
  emit(
    "update:modelValue",
    props.modelValue.filter((el) => el.id !== item.id)
  );
}

async function downloadFiles(item: ValueUploadType) {
  if (typeof item.file === "string") {
    const a = document.createElement("a");
    a.href = import.meta.env.VITE_API_BASE_URL.replace("api", "") + item.file;
    a.download = item.name;
    a.target = "_blank";
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // try {
    //   const response = await axios.get(
    //     import.meta.env.VITE_API_BASE_URL.replace("api", "") + item.file,
    //     {
    //       responseType: "blob", // Agar data diterima dalam bentuk binary
    //     }
    //   );

    //   // Membuat URL object dari blob
    //   const url = window.URL.createObjectURL(new Blob([response.data]));

    //   // Membuat link download
    //   const link = document.createElement("a");
    //   link.href = url;
    //   link.setAttribute("download", item.name);
    //   document.body.appendChild(link);
    //   link.click();
    //   document.body.removeChild(link);

    //   // Hapus URL setelah selesai
    //   window.URL.revokeObjectURL(url);
    // } catch (error) {
    //   console.error("Gagal mengunduh file:", error);
    // }
  } else {
    const url = window.URL.createObjectURL(item.file as File);
    const link = document.createElement("a");
    link.href = url;
    link.download = item.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}

function checkFileType(type: string) {
  let result = false;
  props.fileType.forEach((item) => {
    type ObjectKey = keyof typeof check;
    const key = item.toLowerCase() as ObjectKey;
    if (check[key](type)) {
      result = true;
    }
  });
  return result;
}

function formatAccept() {
  const format_type = props.fileType.map((item) => "." + item);
  return format_type.join(",");
}

const rules_upload = computed(() => {
  return { model: { ...props.rules } };
});
const v$_upload = reactive(useVuelidate(rules_upload, { model }));

function checkErrorUpload() {
  return v$_upload?.value?.model.$errors?.length > 0 ? true : false;
}

function checkErrorMessageUpload() {
  return v$_upload?.value?.model.$errors?.[0]?.$message;
}

watch(model, () => {
  v$_upload.value.$validate();
});

function clickUpload() {
  if (!props.disabled) {
    if (upload.value) {
      upload.value.click();
    }
  }
}
</script>

<template>
  <Toast ref="toastRef" />
  <div class="v-upload">
    <div class="v-upload--label" v-if="label !== undefined">
      <label class="v-upload--label--text" :class="classLabel" :for="id">{{
        label
      }}</label>
      <div class="v-upload--label--instruction">{{ instruction }}</div>
    </div>
    <div class="v-upload--container">
      <div class="v-upload--upload" :class="[
        disabled ? `v-upload--disabled` : '',
        classUpload,
        error_message ? 'v-upload--error' : null,
      ]" @click="clickUpload">
        <p>Choose File</p>
      </div>

      <div class="v-upload--preview">
        <div class="preview-item" v-for="(item, key) in modelValue" :key="key">
          <div class="preview-group">
            <Icon name="checklist" class="preview-icon" />
            <p class="preview-text">{{ item.name }}</p>
          </div>
          <div class="preview-action">
            <Icon name="download" class="preview-action--icon" @click="downloadFiles(item)" />
            <Icon name="trash" class="preview-action--icon" @click="removeFiles(item)" />
          </div>
        </div>
      </div>

      <input v-if="!disabled" ref="upload" class="v-upload--input" :id="id" :multiple="multiple"
        :accept="formatAccept()" type="file" @change="(e) => handleInput(e as InputEvent)" />
    </div>
    <span v-if="notes !== undefined" class="v-upload-notes">{{ notes }}</span>
    <span v-if="status !== 'default' || checkErrorUpload()" :class="classTextStatus">
      {{ statusMessage || checkErrorMessageUpload() }}
    </span>
  </div>
</template>

<style lang="sass">
.v-upload
  @apply relative flex flex-col w-full

  &--label
    @apply flex justify-between items-center mb-1
    &--text
      @apply text-sm font-bold text-neutral-950
    &--instruction
      @apply text-xs text-neutral-950

  &--container
    @apply flex flex-col gap-2

  &--input
    @apply hidden h-full w-full absolute top-0 left-0 right-0 bottom-0

  &--upload
    @apply relative px-4 py-1 border rounded-full cursor-pointer border-neutral-300 hover:border-blue-800 text-sm text-neutral-900 w-fit bg-neutral-300
  &--success
    @apply border-green-500
  &--error
    @apply border-red-500
  &--disabled
    @apply cursor-not-allowed border-neutral-300

  &--preview
    @apply w-full flex flex-col gap-1
    .preview-item
      @apply w-full flex items-center justify-between gap-6
      .preview-group
        @apply flex items-center gap-1
        .preview-text
          @apply text-sm text-neutral-950
        .preview-icon
          @apply text-sm text-neutral-950
      .preview-action
        @apply flex gap-2 items-center text-sm
        &--icon
          @apply text-neutral-950 hover:text-neutral-500 cursor-pointer

.upload-text-validation
  @apply mt-1 text-xs
  &--error
    color: var(--red-text)
  &--success
    color: var(--green-text)

.v-upload-notes
  @apply text-xs mt-1
  color: var(--neutral-100)
</style>
