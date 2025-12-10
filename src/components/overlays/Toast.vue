<!-- src/components/ui/Toast.vue -->
<script setup lang="ts">
import { ref } from "vue";
import {
  ToastAction,
  ToastDescription,
  ToastProvider,
  ToastRoot,
  ToastTitle,
  ToastViewport,
} from "radix-vue";
import { Icon } from "@/components";

export type ToastType = "info" | "success" | "warning" | "error";

export interface ToastOptions {
  title: string;
  description?: string;
  type?: ToastType;
  duration?: number;
}

const open = ref(false);
const toastData = ref<ToastOptions | null>(null);

const showToast = (options: ToastOptions) => {
  toastData.value = options;
  open.value = true;

  setTimeout(() => {
    open.value = false;
  }, options.duration || 3000); // Default 3 detik
};

defineExpose({ showToast });
</script>

<template>
  <ToastProvider>
    <Teleport to="body">
      <ToastRoot
        v-model:open="open"
        class="bg-white rounded-md shadow-lg p-4 flex flex-col gap-2 items-start border-l-4"
        :class="{
          'border-blue-500': toastData?.type === 'info',
          'border-green-500': toastData?.type === 'success',
          'border-yellow-500': toastData?.type === 'warning',
          'border-red-500': toastData?.type === 'error',
        }"
      >
        <ToastTitle class="font-semibold text-lg text-neutral-950">
          {{ toastData?.title }}
        </ToastTitle>
        <ToastDescription
          v-if="toastData?.description"
          class="text-neutral-950"
        >
          {{ toastData.description }}
        </ToastDescription>
        <ToastAction as-child alt-text="Close" class="absolute top-4 right-4">
          <button
            class="text-neutral-950 hover:underline"
            @click="open = false"
          >
            <Icon name="close-circle" />
          </button>
        </ToastAction>
      </ToastRoot>
      <ToastViewport
        class="fixed bottom-4 right-4 flex flex-col gap-2 w-96 max-w-full z-[1000000]"
      />
    </Teleport>
  </ToastProvider>
</template>
