<script setup lang="ts">
import { computed, watch, reactive, type PropType, ref } from "vue";
import { v4 as uuidv4 } from "uuid";

import useVuelidate from "@vuelidate/core";

defineOptions({
  inheritAttrs: false,
});

const props = defineProps({
  label: {
    type: String,
  },
  cols: {
    type: [String, Number],
    default: "30",
  },
  rows: {
    type: [String, Number],
    default: "10",
  },
  placeholder: {
    type: String,
    default: null,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: String,
    Number,
    default: null,
  },
  required: {
    type: Boolean,
    default: false,
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
  size: {
    type: String as PropType<"sm" | "md" | "lg">,
    default: "md",
    validator: function (value: string) {
      return ["sm", "md", "lg"].indexOf(value) !== -1;
    },
  },
  instruction: {
    type: String,
  },
  notes: {
    type: String,
  },
  disabledResize: {
    type: Boolean,
    default: false,
  },
  allowSymbols: {
    type: Boolean,
    default: true,
  },
  customSymbols: {
    type: [RegExp],
  },
  allowCopy: {
    type: Boolean,
    default: true,
  },
  allowPaste: {
    type: Boolean,
    default: true,
  },
  rules: {
    type: Object,
  },
  rounded: {
    type: String as PropType<
      "none" | "default" | "sm" | "md" | "lg" | "xl" | "full"
    >,
    default: "default",
    validator: function (value: string) {
      return (
        ["none", "default", "sm", "md", "lg", "xl", "full"].indexOf(value) !==
        -1
      );
    },
  },
  star: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([
  "update:modelValue",
  "input",
  "keypress",
  "paste",
  "copy",
]);

const id = ref(uuidv4());

const model = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

const classes = computed(() => {
  return [
    props.status === "default" ? "" : `v-textarea--input--${props.status}`,
    props.rules ? (checkErrorTextarea() ? `v-textarea--input--error` : "") : "",
    `v-textarea--input--${props.size}`,
    `v-textarea--input--rounded--${props.rounded}`,
  ];
});

const classLabel = computed(() => {
  return [`v-textarea--label--text--${props.size}`];
});

const classTextStatus = computed(() => {
  return [
    checkErrorTextarea() && `textarea-text-validation--error`,
    `textarea-text-validation--${props.status} textarea-text-validation--${props.size}`,
  ];
});

function onInput(e: string) {
  v$_textarea.value.$validate();
  emit("update:modelValue", e);
  emit("input", e);
}

function onKeyPress(e: KeyboardEvent) {
  emit("keypress", e);
}

function disablePaste(e: ClipboardEvent) {
  if (!props.allowPaste) {
    e.preventDefault();
  }
  emit("paste", e);
}

function disableCopy(e: ClipboardEvent) {
  if (!props.allowCopy) {
    e.preventDefault();
  }
  emit("copy", e);
}

const rules_input = computed(() => {
  return { model: { ...props.rules } };
});
const v$_textarea = reactive(useVuelidate(rules_input, { model }));

function checkErrorTextarea() {
  return v$_textarea?.value?.model.$errors?.length > 0 ? true : false;
}

function checkErrorMessageTextarea() {
  return v$_textarea?.value?.model.$errors?.[0]?.$message;
}

watch(model, () => {
  v$_textarea.value.$validate();
});
</script>

<template>
  <div class="v-textarea">
    <div v-if="label !== undefined" class="v-textarea--label">
      <div class="flex gap-1">
        <label class="v-textarea--label--text" :class="classLabel" :for="id">
          {{ label }}
        </label>
        <div v-if="star" class="text-red-500">*</div>
      </div>
      <div class="v-textarea--label--instruction">{{ instruction }}</div>
    </div>
    <div class="v-textarea--container">
      <textarea
        class="v-textarea--input"
        :class="classes"
        :id="id"
        :placeholder="placeholder"
        :disabled="disabled"
        v-model="model"
        :required="required"
        :cols="cols"
        :rows="rows"
        @input="(event) => onInput((event?.target as HTMLTextAreaElement)?.value)"
        @keypress="onKeyPress($event)"
        @paste="disablePaste"
        @copy="disableCopy"
        v-bind="$attrs"
      />
      <span v-if="notes !== undefined" class="v-textarea-notes">{{
        notes
      }}</span>
      <span
        v-if="status !== 'default' || checkErrorTextarea()"
        :class="classTextStatus"
      >
        {{ statusMessage || checkErrorMessageTextarea() }}
      </span>
    </div>
  </div>
</template>

<style lang="sass">
.v-textarea
  @apply relative flex flex-col w-full
  &--label
    @apply flex justify-between items-center mb-1
    &--text
      &--lg
        @apply text-sm font-bold text-neutral-950
      &--md
        @apply text-sm font-bold text-neutral-950
      &--sm
        @apply text-sm font-bold text-neutral-950
    &--instruction
      @apply text-xs text-neutral-950
  &--container
    @apply flex flex-col
  &--input
    @apply w-full outline-none px-2 text-neutral-950 bg-white border border-blue-900
    &::placeholder
      @apply text-neutral-500
    &:disabled
      @apply bg-neutral-200
    &:hover
      @apply border-cyan-500
    &:focus
      @apply border-cyan-500
    &--error
      @apply border-red-500
    &--success
      @apply border-green-500
    &--lg
      @apply py-3 text-base
    &--md
      @apply py-2 text-sm leading-[22.4px]
    &--sm
      @apply py-1 text-sm
    &--rounded
      &--none
        @apply rounded-none
      &--default
        @apply rounded
      &--sm
        @apply rounded-sm
      &--md
        @apply rounded-md
      &--lg
        @apply rounded-lg
      &--xl
        @apply rounded-xl
      &--full
        @apply rounded-full

.textarea-text-validation
  &--error
    @apply text-red-500
  &--success
    @apply text-green-500
  &--sm
    @apply mt-1 text-xs
  &--md
    @apply mt-1 text-xs
  &--lg
    @apply mt-1 text-xs

.v-textarea-notes
  @apply text-xs mt-1 text-neutral-500
</style>
