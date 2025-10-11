<script setup lang="ts">
import { ref } from "vue";

import { Button, Toast } from "@/components";
const toastRef = ref<InstanceType<typeof Toast> | null>(null);

const props = defineProps({
  loadingImport: {
    type: Boolean,
    default: false,
  },
  loadingDownload: {
    type: Boolean,
    default: false,
  },
  loadingTemplate: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["import", "download", "template"]);

const upload = ref<any>(null);

const clickUpload = () => {
  if (upload.value) {
    upload.value.click();
  }
};

const ALLOWED_FILE_TYPES = [
  // "image/png",
  // "image/jpg",
  // "image/jpeg",
  // "image/x-tiff",
  // "image/tiff",
  // "application/pdf",
  // "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  // "text/csv",
  // "application/msword",
  // "application/vnd.ms-excel",
  // "application/wps-office.doc",
  // "application/wps-office.docx",
  "application/wps-office.xls",
  "application/wps-office.xlsx",
  // "application/wps-office.ppt",
  // "application/wps-office.pptx",
];
const ALLOWED_EXTENSIONS = [
  // "png",
  // "jpg",
  // "jpeg",
  // "tiff",
  // "pdf",
  // "doc",
  // "docx",
  "xls",
  "xlsx",
  // "csv",
];

const handleInput = async (e: Event) => {
  const input = e.target as HTMLInputElement;
  const files = input.files ? Array.from(input.files) : [];

  if (!files.length) return;

  const validTypeFiles = files.filter((file) => {
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    return (
      ALLOWED_FILE_TYPES.includes(file.type) || ALLOWED_EXTENSIONS.includes(ext)
    );
  });

  if (validTypeFiles.length !== files.length) {
    toastRef.value?.showToast({
      title: "Error",
      description: `File harus berformat (${ALLOWED_EXTENSIONS.join(", ")})`,
      type: "error",
    });
    return;
  };

  for (const file of validTypeFiles) {
    // model_file.value.push({
    //   name: file.name,
    //   size: file.size,
    //   type: file.type,
    //   file,
    // });

    emit("import", file);
  }
};
</script>

<template>
  <div class="flex items-center gap-2">
    <Button text="Import" rounded="full" color="blue" :loading="loadingImport" @click="clickUpload" />
    <Button text="Download" rounded="full" color="blue" :loading="loadingDownload" @click="$emit('download')" />
    <Button text="Export Template" rounded="full" color="blue" :loading="loadingTemplate" @click="$emit('template')" />

    <input ref="upload" class="hidden" type="file" @change="(e) => handleInput(e as InputEvent)" />

    <Toast ref="toastRef" />
  </div>
</template>
