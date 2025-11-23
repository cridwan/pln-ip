<script setup lang="ts">
import { computed, reactive, ref, type PropType } from "vue";

import type { ResponseDocumentInterface } from "@/types/GlobalType";
import { useMutation } from "@tanstack/vue-query";
import { useGlobalStore } from "@/stores/GlobalStore";

import { Icon, Toast } from "..";
import type { ValueUploadType } from "./Upload.vue";
import useVuelidate from "@vuelidate/core";

const props = defineProps({
  selectedValues: {
    type: Object as PropType<ResponseDocumentInterface | null>,
  },
  progress: {
    type: Number,
    required: true,
    default: 0,
  },
  rules: {
    type: Object,
  },
  star: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: "File",
  },
  modelValue: {
    type: Array as PropType<ValueUploadType[]>,
    default() {
      return [];
    },
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  statusMessage: {
    type: String,
    default: "",
  },
  status: {
    type: String as PropType<"default" | "success" | "error">,
    default: "default",
    validator: function (value: string) {
      return ["default", "success", "error"].indexOf(value) !== -1;
    },
  },
  fileType: {
    type: Array as PropType<
      ("png" | "jpg" | "jpeg" | "pdf" | "doc" | "docx" | "xls" | "xlsx" | "mp4" | "avi" | "mov")[]
    >,
    default() {
      return [
        "mp4",
        "avi",
        "mov"
      ];
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
        "mp4",
        "avi",
        "mov"
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
});
const toastRef = ref<InstanceType<typeof Toast> | null>(null);
const globalStore = useGlobalStore();
const emit = defineEmits(["success", "error", "changes", "removeSuccess", "update:modelValue"]);
const error_message = ref("");
const file = ref<File | null>(null);
const inputFileRef = ref<HTMLInputElement | undefined>(undefined);
const model = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

const rules_upload = computed(() => {
  return { model: { ...props.rules } };
});
const v$_upload = reactive(useVuelidate(rules_upload, { model }));

function checkErrorUpload() {
  return v$_upload?.value?.model.$errors?.length > 0 ? true : false;
}

const { mutate: deleteDocument, isPending: isLoadingDeleteDocument } =
  useMutation({
    mutationFn: async (uuid: string) => {
      return globalStore.deleteDocument([uuid]);
    },
    onSuccess: () => {
      emit("removeSuccess");
    },
    onError: (err) => {
      emit("error", err);
    },
  });

const parsedUrl = () => {
  return (
    import.meta.env.VITE_API_BASE_URL.replace("api", "") +
    props.selectedValues?.document_link
  );
};

const handleClick = () => {
  inputFileRef.value?.click();
};

const check = {
  mp4: (type: string) => type === "video/mp4",
  avi: (type: string) => type === "video/avi",
  mov: (type: string) => type === "video/mov",
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

const handleChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files as FileList;

  const temp_type_file: File[] = [];
  for (let i = 0; i < files.length; ++i) {
    const file = files[i];
    if (checkFileType(file.type)) {
      temp_type_file.push(file);
    }
  }

  if (temp_type_file.length !== files.length) {
    console.log('err')
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
    return
  }

  if (files && files.length > 0) {
    file.value = files[0];
  }

  const temp_model_value: ValueUploadType[] = [];
  for (let i = 0; i < files.length; ++i) {
    const file = files[i];

    temp_model_value.push({
      file,
      id: (i + props.modelValue.length).toString(),
      name: file.name,
      size: file.size,
    });
  }

  emit("update:modelValue", [...temp_model_value]);
  emit("changes", file.value);
};

const handleRemove = (item: ResponseDocumentInterface) => {
  if (confirm("Yakin ingin menghapus data ?")) {
    deleteDocument(item.uuid);
  }
};

const className = computed(() => {
  return checkErrorUpload() ? "border-red-500" : "border-blue-900";
})
</script>

<template>
  <Toast ref="toastRef" />
  <div>
    <div v-if="props.selectedValues" class="relative">
      <div v-if="isLoadingDeleteDocument"
        class="bg-red-500 size-6 flex items-center justify-center rounded-sm !cursor-pointer absolute right-1 top-1 z-50">
        <span class="animate-pulse">...</span>
      </div>
      <div v-else
        class="bg-red-500 size-6 flex items-center justify-center rounded-sm !cursor-pointer absolute right-1 top-1 z-50"
        @click="handleRemove(props.selectedValues)">
        <Icon name="trash" />
      </div>
      <video :src="parsedUrl()" controls
        v-if="fileType.includes('mp4') || fileType.includes('mov') || fileType.includes('avi')"></video>
      <a target="_blank" :href="parsedUrl()" v-else class="text-blue-950">{{ props.selectedValues?.document_link }}</a>
    </div>
    <div v-else>
      <div class="flex gap-1">
        <label class="font-bold text-neutral-950">{{ label }}</label>
        <div v-if="star" class="text-red-500">*</div>
      </div>
      <div :class="['w-full border  rounded-md p-4 flex items-center justify-center flex-col gap-3', className]">
        <input ref="inputFileRef" type="file" :accept="formatAccept()" class="hidden" @change="handleChange" />
        <button class="bg-blue-900 text-white py-1 px-2 rounded-sm" type="button" @click="handleClick">
          Choose File
        </button>
        <span class="text-sm text-gray-600 italic" v-if="!file">
          * Format file yang diperbolehkan (format {{ props.fileType.join(', ') }})
        </span>
        <span class="font-semibold text-neutral-950" v-if="file">
          {{ file.name }}
        </span>
        <span class="text-black font-semibold text-sm" v-if="props.progress > 0">
          Processing...
          <span class="text-blue-900 font-semibold">
            {{ props.progress }}
          </span>
          /100%
        </span>
      </div>
      <span class="text-red-500 text-xs" v-if="checkErrorUpload()">This file is required</span>
    </div>
  </div>
</template>

<style></style>
