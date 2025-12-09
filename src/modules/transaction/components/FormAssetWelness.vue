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
import { Input, Icon, Textarea, Button, Upload } from "@/components";
import type { ValueUploadType } from "@/components/fields/Upload.vue";

import type { TColor } from "../types/ScopeType";

const props = defineProps({
  value: {
    type: Object as PropType<{
      color: TColor;
      note: string;
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
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["save"]);

const modelOpenInputData = ref(false);
const modelUpload = ref<ValueUploadType[]>([]);
const model = ref<{ color: TColor; note: string }>({
  color: "",
  note: "",
});

const cancel = () => {
  modelOpenInputData.value = false;
  modelUpload.value = [];
};

const save = () => {
  emit("save", { ...model.value, file: modelUpload.value });
};

const onClear = () => {
  model.value.color = "";
};

watch(
  () => props.value,
  (val) => {
    if (val) {
      model.value.color = val.color;
      model.value.note = val.note;
      modelUpload.value = val.file;
    } else {
      model.value.color = "";
      model.value.note = "";
      modelUpload.value = [];
    }
  },
  { deep: true }
);

watch(modelOpenInputData, (val) => {
  if (props.value) {
    model.value.color = props.value.color;
    model.value.note = props.value.note;
    modelUpload.value = props.value.file;
  } else {
    model.value.color = "";
    model.value.note = "";
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
          (value && value?.color) || (value && value?.note)
            ? value?.color === 'red'
              ? '!bg-red-500'
              : value?.color === 'yellow'
              ? '!bg-yellow-500'
              : value?.color === 'green'
              ? '!bg-green-500'
              : ''
            : '',
          'cursor-pointer',
        ]"
      >
        {{
          (value && value?.color) || (value && value?.note)
            ? value.color === "red"
              ? "Red"
              : value.color === "yellow"
              ? "Yellow"
              : value.color === "green"
              ? "Green"
              : "Clear"
            : "Add"
        }}
      </button>
    </PopoverTrigger>
    <PopoverPortal class="!z-[9999]">
      <PopoverContent :side-offset="5" class="popover-content">
        <p class="popover-title">{{ label }}</p>
        <div class="button-colors">
          <button
            :class="[
              { 'red-active': model.color === 'red' },
              disabled ? '!cursor-default' : 'button-red',
            ]"
            @click="
              () => {
                if (!disabled) model.color = 'red';
              }
            "
          >
            Red
          </button>
          <button
            :class="[
              { 'yellow-active': model.color === 'yellow' },
              disabled ? '!cursor-default' : 'button-yellow',
            ]"
            @click="
              () => {
                if (!disabled) model.color = 'yellow';
              }
            "
          >
            Yellow
          </button>
          <button
            :class="[
              { 'green-active': model.color === 'green' },
              disabled ? '!cursor-default' : 'button-green',
            ]"
            @click="
              () => {
                if (!disabled) model.color = 'green';
              }
            "
          >
            Green
          </button>
          <button
            :class="disabled ? '!cursor-default' : 'button-clear'"
            @click="
              () => {
                if (!disabled) onClear;
              }
            "
          >
            Clear
          </button>
        </div>
        <div class="mt-4">
          <Textarea
            label="Note"
            :rows="6"
            :disabled="disabled"
            v-model="model.note"
          />
        </div>
        <div class="mt-4">
          <Upload v-model="modelUpload" :disabled="disabled" :max-count="10" />
        </div>
        <!-- <div class="popover-input mt-4">
          <div class="w-[400px]">
            <Input id="input-note" size="sm" v-model="model" />
          </div>
          <button class="popover-button-trigger" @click="add">Add</button>
        </div>
        <div class="popover-body">
          <p class="popover-body-title">Note</p>
          <div class="popover-body-list">
            <div v-if="resultSaved?.length === 0" class="popover-body-empty">
              <p>Tidak ada data</p>
            </div>
            <div
              v-else
              v-for="(item, key) in resultSaved"
              :key="key"
              class="w-full flex justify-between items-center gap-6"
            >
              <p>{{ key + 1 }}. {{ item.note }}</p>
              <Icon
                name="trash"
                class="mr-2 cursor-pointer text-neutral-500 hover:text-neutral-950"
                @click="handleDelete(item.id)"
              />
            </div>
          </div>
        </div> -->
        <div class="popover-footer">
          <Button
            text="Cancel"
            size="sm"
            rounded="full"
            color="red"
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
  @apply bg-transparent border border-neutral-50 rounded-lg px-2 min-w-[120px] text-base text-neutral-50 hover:bg-cyan-500

.button-trigger-active
  @apply bg-cyan-500

.popover-content
  @apply rounded mx-4 px-2 pt-2 pb-4 min-w-[400px] bg-white shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2)] will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade
  .popover-title
    @apply text-base font-medium text-neutral-950
  .button-colors
    @apply flex items-center gap-2 mt-2
    > button
      @apply min-w-[100px] rounded-lg bg-black py-1 px-3 text-[13px] text-neutral-50
    .button-red
      @apply hover:bg-red-500
    .button-black
      @apply hover:bg-neutral-900
    .button-yellow
      @apply hover:bg-yellow-400
    .button-green
      @apply hover:bg-green-500
    .button-clear
      @apply hover:bg-cyan-500
    .red-active
      @apply bg-red-500
    .yellow-active
      @apply bg-yellow-400
    .green-active
      @apply bg-green-500
</style>
