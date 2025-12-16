<script setup lang="ts">
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  VisuallyHidden,
} from "radix-vue";
import { computed, ref, watch } from "vue";

import { Icon } from "@/components";
import { useModalStack } from "@/helpers/useModalStack";

const props = defineProps({
  width: {
    type: [Number, String],
    default: null,
  },
  height: {
    type: [Number, String],
    default: null,
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
  showButtonClose: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
  },
});

const emit = defineEmits(["update:modelValue"]);

const show = ref(props.modelValue);
const { overlayZ, contentZ } = useModalStack();

watch(
  () => props.modelValue,
  (value) => {
    show.value = value;
  }
);

const styles = computed(() => {
  const styleData: Record<string, string> = {};

  if (props.width !== null) {
    styleData["max-width"] = `${props.width}px`;
  }

  if (props.height !== null) {
    styleData["max-height"] = `${props.height}px`;
  }

  styleData["zIndex"] = contentZ.toString();

  return styleData;
});

function handleOpenChange(value: boolean) {
  show.value = value;
  emit("update:modelValue", value);
}
</script>

<template>
  <DialogRoot :open="show" @update:open="handleOpenChange">
    <DialogTrigger>
      <slot name="trigger" />
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay class="v-modal-overlay" :style="{ zIndex: overlayZ }" />
      <DialogContent class="v-modal-content" :style="styles">
        <VisuallyHidden>
          <DialogDescription />
        </VisuallyHidden>
        <DialogTitle class="v-modal-title">
          {{ title }}
        </DialogTitle>
        <div class="v-modal-body">
          <slot />
        </div>
        <DialogClose
          v-if="showButtonClose"
          class="v-modal-close"
          aria-label="Close"
        >
          <Icon name="close-circle" />
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style lang="sass">
.v-modal-overlay
  @apply backdrop-blur-[25px] fixed inset-0 flex items-center justify-center bg-neutral-500/30
  &[data-state="open"]
    @apply animate-[overlayModalShow_150ms_cubic-bezier(0.16,_1,_0.3,_1)]

.v-modal-title
  @apply text-lg font-bold text-blue-900 px-4 py-2

.v-modal-content
  @apply bg-white fixed top-[50%] left-[50%] w-full translate-x-[-50%] translate-y-[-50%] rounded shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none
  max-height: fit-content !important
  &[data-state="open"]
    @apply animate-[contentModalShow_300ms_cubic-bezier(0.16,_1,_0.3,_1)]
  &[data-state="closed"]
    @apply animate-[contentModalClosed_300ms_cubic-bezier(0.16,_1,_0.3,_1)]
  .v-modal-body
    @apply w-full h-full relative z-[1] overflow-hidden rounded-lg py-4 px-5
  .v-modal-close
    @apply absolute top-[4px] right-[4px] appearance-none items-center justify-center focus:outline-none text-xl text-blue-800 hover:text-blue-950 cursor-pointer z-[2]

@keyframes overlayModalShow
  from
    opacity: 0
  to
    opacity: 1

@keyframes contentModalShow
  from
    opacity: 0
    transform: translate(-50%, -48%) scale(0.96)
  to
    opacity: 1
    transform: translate(-50%, -50%) scale(1)

@keyframes contentModalClosed
  from
    opacity: 1
    transform: translate(-50%, -50%) scale(1)
  to
    opacity: 0
    transform: translate(-50%, -48%) scale(0.96)
</style>
