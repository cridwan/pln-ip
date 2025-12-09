<script setup lang="ts">
import { ref, watch, type PropType } from "vue";
import {
  PopoverArrow,
  PopoverClose,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from "radix-vue";
import { Upload, Button } from "@/components";
import type { ValueUploadType } from "@/components/fields/Upload.vue";

const props = defineProps({
  value: {
    type: Object as PropType<{
      file: ValueUploadType[];
    } | null>,
  },
  label: {
    type: String,
    default: "",
  },
  loading: {
    type: Boolean,
    default: false,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["save"]);

const modelOpenInputData = ref(false);
const modelUpload = ref<ValueUploadType[]>([]);

const cancel = () => {
  modelOpenInputData.value = false;
  modelUpload.value = [];
};

const save = () => {
  emit("save", { file: modelUpload.value });
};

watch(
  () => props.value,
  (val) => {
    if (val) {
      modelUpload.value = val.file;
    } else {
      modelUpload.value = [];
    }
  },
  { deep: true }
);

watch(modelOpenInputData, (val) => {
  if (props.value) {
    modelUpload.value = props.value.file;
  } else {
    modelUpload.value = [];
  }
});

defineExpose({
  modelOpenInputData,
});
</script>

<template>
  <PopoverRoot v-model:open="modelOpenInputData">
    <PopoverTrigger>
      <button
        class="button-trigger"
        :class="[
          {
            'button-trigger-active': modelOpenInputData === true,
          },
          value && value?.file?.length > 0 ? 'button-trigger-active' : '',
          'cursor-pointer',
        ]"
      >
        {{ value && value?.file?.length > 0 ? "Active" : "Add" }}
      </button>
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent :side-offset="5" class="popover-content-upload">
        <p class="popover-title">{{ label }}</p>
        <div class="mt-4">
          <Upload
            v-model="modelUpload"
            :disabled="disabled"
            :multiple="multiple"
            :max-count="10"
          />
        </div>
        <div class="popover-footer">
          <Button
            text="Cancel"
            size="sm"
            rounded="full"
            color="grey"
            :disabled="loading"
            @click="cancel"
          />
          <Button
            v-if="!disabled"
            text="Save"
            size="sm"
            rounded="full"
            color="blue"
            :disabled="loading"
            :loading="loading"
            @click="save"
          />
        </div>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>

<style lang="sass">
.button-trigger
  @apply bg-transparent border border-neutral-50 rounded-lg px-2 min-w-[120px] text-base text-neutral-50
  &:hover
    @apply bg-cyan-500
.button-trigger-active
  @apply bg-cyan-500

.popover-content-upload
  @apply rounded mx-4 px-2 pt-2 pb-4 min-w-[400px] bg-white shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2)] will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade
  .popover-title
    @apply text-base font-medium text-neutral-950
</style>
