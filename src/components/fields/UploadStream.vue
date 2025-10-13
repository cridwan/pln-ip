<script setup lang="ts">
import { ref, type PropType } from "vue";

import type { ResponseDocumentInterface } from "@/types/GlobalType";
import { useMutation } from "@tanstack/vue-query";
import { useGlobalStore } from "@/stores/GlobalStore";

import { Icon } from "..";

const props = defineProps({
  selectedValues: {
    type: Object as PropType<ResponseDocumentInterface | null>,
  },
  progress: {
    type: Number,
    required: true,
    default: 0,
  },
  star: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: "File",
  },
});
const globalStore = useGlobalStore();

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
const emit = defineEmits(["success", "error", "changes", "removeSuccess"]);

const file = ref<File | null>(null);
const inputFileRef = ref<HTMLInputElement | undefined>(undefined);
const handleClick = () => {
  inputFileRef.value?.click();
};

const handleChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const files = target?.files;
  if (files && files.length > 0) {
    file.value = files[0];
  }

  emit("changes", file.value);
};

const handleRemove = (item: ResponseDocumentInterface) => {
  if (confirm("Yakin ingin menghapus data ?")) {
    deleteDocument(item.uuid);
  }
};
</script>

<template>
  <div>
    <div v-if="props.selectedValues" class="relative">
      <div
        v-if="isLoadingDeleteDocument"
        class="bg-red-500 size-6 flex items-center justify-center rounded-sm !cursor-pointer absolute right-1 top-1 z-50"
      >
        <span class="animate-pulse">...</span>
      </div>
      <div
        v-else
        class="bg-red-500 size-6 flex items-center justify-center rounded-sm !cursor-pointer absolute right-1 top-1 z-50"
        @click="handleRemove(props.selectedValues)"
      >
        <Icon name="trash" />
      </div>
      <video :src="parsedUrl()" controls></video>
    </div>
    <div v-else>
      <div class="flex gap-1">
        <label class="font-bold text-neutral-950">{{ label }}</label>
        <div v-if="star" class="text-red-500">*</div>
      </div>
      <div
        class="w-full border border-blue-900 rounded-md p-4 flex items-center justify-center flex-col gap-3"
      >
        <input
          ref="inputFileRef"
          type="file"
          accept="video/*"
          class="hidden"
          @change="handleChange"
        />
        <button
          class="bg-blue-900 text-white py-1 px-2 rounded-sm"
          type="button"
          @click="handleClick"
        >
          Choose File
        </button>
        <span class="text-sm text-gray-600 italic" v-if="!file">
          * Hanya file video yang diperbolehkan (format mp4, mov, avi, dll)
        </span>
        <span class="font-semibold text-neutral-950" v-if="file">
          {{ file.name }}
        </span>
        <span
          class="text-black font-semibold text-sm"
          v-if="props.progress > 0"
        >
          Processing...
          <span class="text-blue-900 font-semibold">
            {{ props.progress }}
          </span>
          /100%
        </span>
      </div>
    </div>
  </div>
</template>

<style></style>
