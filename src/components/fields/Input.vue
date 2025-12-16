<script setup lang="ts">
import {
  computed,
  onMounted,
  reactive,
  ref,
  useSlots,
  watch,
  onBeforeUnmount,
  type PropType,
} from "vue";
import { Icon } from "@/components";
import {
  all_characters,
  numbers_characters,
  numbers_letters,
  numbers_positive,
  numbers_positive_negative,
  numberFormat,
} from "@/helpers/global";
import useVuelidate from "@vuelidate/core";
import { v4 as uuidv4 } from "uuid";

defineOptions({
  inheritAttrs: false,
});

const props = defineProps({
  label: {
    type: String,
  },
  type: {
    type: String as PropType<"text" | "number" | "email" | "password" | "tel">,
    default: "text",
    validator: function (value: string) {
      return (
        ["text", "number", "email", "password", "tel"].indexOf(value) !== -1
      );
    },
  },
  prefix_icon: {
    type: String,
    default: "",
  },
  suffix_icon: {
    type: String,
    default: "",
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
  min: {
    type: [String, Number],
    default: "",
  },
  max: {
    type: [String, Number],
    default: "",
  },
  minlength: {
    type: String,
    default: "",
  },
  maxlength: {
    type: String,
    default: "",
  },
  required: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String as PropType<"default" | "error" | "success">,
    default: "default",
    validator: function (value: string) {
      return ["default", "error", "success"].indexOf(value) !== -1;
    },
  },
  status_message: {
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
  readonly: {
    type: Boolean,
    default: false,
  },
  is_password: {
    type: Boolean,
    value: false,
  },
  is_currency: {
    type: Boolean,
    value: false,
  },
  is_decimal: {
    type: Boolean,
    value: false,
  },
  allow_symbols: {
    type: Boolean,
    default: false,
  },
  custom_symbols: {
    type: [RegExp],
  },
  allow_copy: {
    type: Boolean,
    default: true,
  },
  allow_paste: {
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
  notes: {
    type: String,
  },
  instruction: {
    type: String,
  },
  is_date: {
    type: Boolean,
    default: false,
  },
  is_date_range: {
    type: Boolean,
    default: false,
  },
  autocomplete: {
    type: String,
    default: "off",
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
const slots = useSlots();
const input_type = ref("");
const element_before = ref<HTMLElement | null>(null);
const element_after = ref<HTMLElement | null>(null);
const width_element_before = ref<number>(0);
const width_element_after = ref<number>(0);

const model = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

const showPrefix = computed(() => {
  return !!slots.prefix;
});

const showSuffix = computed(() => {
  return !!slots.suffix;
});

const showNotes = computed(() => {
  return !!slots.notes;
});

const classes = computed(() => {
  return [
    props.rules ? (checkErrorInput() ? `pln-input--input--error` : "") : "",
    `pln-input--input--${props.size}`,
    `pln-input--input--rounded--${props.rounded}`,
    props.status === "default" ? "" : `pln-input--input--${props.status}`,
  ];
});

const classIcon = computed(() => {
  return [`pln-input--icon--${props.size}`];
});

const classLabel = computed(() => {
  return [`pln-input--label--text--${props.size}`];
});

const classTextStatus = computed(() => {
  return [
    checkErrorInput() && `input-text-validation--error`,
    `input-text-validation--${props.status} input-text-validation--${props.size}`,
  ];
});

const styles = computed(() => {
  if (
    (props.suffix_icon !== "" &&
      props.prefix_icon === "" &&
      !showPrefix.value) ||
    (props.is_password && props.prefix_icon === "") ||
    (showSuffix.value && !showPrefix.value && props.prefix_icon == "")
  ) {
    return {
      paddingRight: props.is_password
        ? "32px"
        : `${width_element_after.value + 16}px`,
      paddingLeft: "12px",
    };
  } else if (
    (props.suffix_icon === "" &&
      props.prefix_icon !== "" &&
      !showSuffix.value) ||
    (!showSuffix.value && showPrefix.value && props.suffix_icon === "")
  ) {
    return {
      paddingLeft: `${width_element_before.value + 16}px`,
      paddingRight: "12px",
    };
  } else if (
    (props.suffix_icon !== "" && props.prefix_icon !== "") ||
    (showSuffix.value && showPrefix.value) ||
    (props.suffix_icon !== "" && showPrefix.value) ||
    (showSuffix.value && props.prefix_icon !== "") ||
    (props.is_password && props.prefix_icon !== "")
  ) {
    return {
      paddingRight: props.is_password
        ? "32px"
        : `${width_element_after.value + 16}px`,
      paddingLeft: `${width_element_before.value + 16}px`,
    };
  } else {
    return { paddingRight: "12px", paddingLeft: "12px" };
  }
});

function handlerVisibility() {
  input_type.value === "password"
    ? (input_type.value = "text")
    : (input_type.value = "password");
}

function onInput(e: string) {
  v$_input.value.$validate();
  if (props.is_currency) {
    const value = e
      .replace(/[^0-9 .]*/g, "")
      .split(".")
      .join("");
    if (value === "") {
      emit("update:modelValue", "");
      emit("input", "");
    } else {
      emit("update:modelValue", numberFormat(parseInt(value), false));
      emit("input", numberFormat(parseInt(value), false));
    }
  } else {
    emit("update:modelValue", e);
    emit("input", e);
  }
}

function onKeyPress(e: KeyboardEvent) {
  switch (props.type) {
    case "text":
      if (props.is_currency) {
        let char_text = String.fromCharCode(e.keyCode);
        let disabled_char_text =
          props.custom_symbols !== undefined
            ? props.custom_symbols
            : props.allow_symbols
            ? numbers_characters
            : numbers_positive;

        if (disabled_char_text.test(char_text)) {
          return true;
        } else {
          if (e.code !== "Enter") {
            e.preventDefault();
          }
        }
      } else if (props.is_date) {
        const allowedChars = new RegExp(/^\d|\/$/);

        const charCode = e.keyCode;
        const char = String.fromCharCode(charCode);

        if (!allowedChars.test(char) || charCode < 48 || charCode > 57) {
          e.preventDefault();
          return;
        }

        let newFormattedDate = model.value;
        let splitDate = newFormattedDate.split("/");

        if (splitDate.length === 1 && splitDate[0].length === 2) {
          newFormattedDate += "/";
          model.value = newFormattedDate;
        } else if (splitDate.length === 2 && splitDate[1].length === 2) {
          newFormattedDate += "/";
          model.value = newFormattedDate;
        } else if (splitDate.length < 3) {
          return true;
        } else if (splitDate.length === 3 && newFormattedDate.length === 10) {
          e.preventDefault();
        }
      } else if (props.is_date_range) {
        const allowedChars = new RegExp(/^\d|\/$/);

        const charCode = e.keyCode;
        const char = String.fromCharCode(charCode);

        if (!allowedChars.test(char) || charCode < 48 || charCode > 57) {
          e.preventDefault();
          return;
        }

        let newFormattedDate = model.value;
        let split = newFormattedDate.split(" - ");
        let split_start = split?.[0]?.split("/");
        let split_end = split?.[1]?.split("/");

        if (
          split?.length === 1 &&
          split_start?.length === 1 &&
          split_start?.[0]?.length === 2
        ) {
          newFormattedDate += "/";
          model.value = newFormattedDate;
        } else if (
          split?.length === 1 &&
          split_start?.length === 2 &&
          split_start?.[1]?.length === 2
        ) {
          newFormattedDate += "/";
          model.value = newFormattedDate;
        } else if (
          split?.length === 1 &&
          split_start?.length === 3 &&
          split_start?.[2]?.length === 4
        ) {
          newFormattedDate += " - ";
          model.value = newFormattedDate;
        } else if (
          split?.length === 2 &&
          split_end?.length === 1 &&
          split_end?.[0]?.length === 2
        ) {
          newFormattedDate += "/";
          model.value = newFormattedDate;
        } else if (
          split?.length === 2 &&
          split_end?.length === 2 &&
          split_end?.[1]?.length === 2
        ) {
          newFormattedDate += "/";
          model.value = newFormattedDate;
        } else if (
          split_start?.length < 3 &&
          split_end?.length < 3 &&
          split?.length < 2
        ) {
          return true;
        } else if (
          split_start?.length === 3 &&
          split_end?.length === 3 &&
          newFormattedDate?.length === 23
        ) {
          e.preventDefault();
        }
      } else if (props.is_decimal) {
        let val = model.value;

        // hapus selain angka & titik
        val = val.replace(/[^0-9.]/g, "");

        // 🔥 hanya boleh 1 titik
        const parts = val.split(".");
        if (parts.length > 2) {
          val = parts[0] + "." + parts[1];
        }

        model.value = val;
      } else {
        let char_text = String.fromCharCode(e.keyCode);
        let disabled_char_text =
          props.custom_symbols !== undefined
            ? props.custom_symbols
            : props.allow_symbols
            ? all_characters
            : numbers_letters;

        if (disabled_char_text.test(char_text)) {
          return true;
        } else {
          if (e.code !== "Enter") {
            e.preventDefault();
          }
        }
      }
      break;
    case "number":
      {
        let char_number = String.fromCharCode(e.keyCode);
        let disabled_char_number: any = null;
        if (props.min === "" && props.max === "") {
          disabled_char_number =
            props.custom_symbols !== undefined
              ? props.custom_symbols
              : props.allow_symbols
              ? numbers_characters
              : numbers_positive_negative;
        } else {
          if (props.min !== "" && props.max === "") {
            if (parseInt(props.min.toString()) < 0) {
              disabled_char_number =
                props.custom_symbols !== undefined
                  ? props.custom_symbols
                  : props.allow_symbols
                  ? numbers_characters
                  : numbers_positive_negative;
            } else {
              disabled_char_number =
                props.custom_symbols !== undefined
                  ? props.custom_symbols
                  : props.allow_symbols
                  ? numbers_characters
                  : numbers_positive;
            }
          } else if (props.max !== "" && props.min === "") {
            disabled_char_number =
              props.custom_symbols !== undefined
                ? props.custom_symbols
                : props.allow_symbols
                ? numbers_characters
                : numbers_positive_negative;
          } else {
            if (parseInt(props.min.toString()) < 0) {
              disabled_char_number =
                props.custom_symbols !== undefined
                  ? props.custom_symbols
                  : props.allow_symbols
                  ? numbers_characters
                  : numbers_positive_negative;
            } else {
              disabled_char_number =
                props.custom_symbols !== undefined
                  ? props.custom_symbols
                  : props.allow_symbols
                  ? numbers_characters
                  : numbers_positive;
            }
          }
        }

        if (disabled_char_number.test(char_number)) {
          return true;
        } else {
          if (e.code !== "Enter") {
            e.preventDefault();
          }
        }
      }
      break;
    case "tel":
      {
        let char_tel = String.fromCharCode(e.keyCode);
        const disabled_char_tel =
          props.custom_symbols !== undefined
            ? props.custom_symbols
            : props.allow_symbols
            ? numbers_characters
            : numbers_positive;
        if (disabled_char_tel.test(char_tel)) {
          return true;
        } else {
          if (e.code !== "Enter") {
            e.preventDefault();
          }
        }
      }
      break;
    case "email":
      {
        let char_email = String.fromCharCode(e.keyCode);
        const disabled_char_email =
          props.custom_symbols !== undefined
            ? props.custom_symbols
            : props.allow_symbols
            ? all_characters
            : /[a-zA-Z0-9@.]/;
        if (disabled_char_email.test(char_email)) {
          return true;
        } else {
          if (e.code !== "Enter") {
            e.preventDefault();
          }
        }
      }
      break;
    case "password":
      {
        let char_password = String.fromCharCode(e.keyCode);
        const disabled_char_password =
          props.custom_symbols !== undefined
            ? props.custom_symbols
            : all_characters;
        if (disabled_char_password.test(char_password)) {
          return true;
        } else {
          if (e.code !== "Enter") {
            e.preventDefault();
          }
        }
      }
      break;
  }
  emit("keypress", e);
}

function disablePaste(e: ClipboardEvent) {
  if (!props.allow_paste) {
    e.preventDefault();
  }
  emit("paste", e);
}

function disableCopy(e: ClipboardEvent) {
  if (!props.allow_copy) {
    e.preventDefault();
  }
  emit("copy", e);
}

const rules_input = computed(() => {
  return { model: { ...props.rules } };
});
const v$_input = reactive(useVuelidate(rules_input, { model }));

function checkErrorInput() {
  return v$_input?.value?.model.$errors?.length > 0 ? true : false;
}

function checkErrorMessageInput() {
  return v$_input?.value?.model.$errors?.[0]?.$message;
}

watch(model, () => {
  v$_input.value.$validate();
});

function updateWidth() {
  if (element_before.value) {
    const newWidth = element_before.value.clientWidth;
    width_element_before.value = newWidth;
  }

  if (element_after.value) {
    const newWidth = element_after.value.clientWidth;
    width_element_after.value = newWidth;
  }
}

onMounted(() => {
  input_type.value = props.type;

  updateWidth();

  const observer = new MutationObserver(() => {
    updateWidth();
  });

  if (element_before.value) {
    observer.observe(element_before.value, {
      attributes: true,
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  if (element_after.value) {
    observer.observe(element_after.value, {
      attributes: true,
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  onBeforeUnmount(() => {
    observer.disconnect();
  });
});
const isFirstTime = ref(true);
watch(
  () => props.modelValue,
  (newVal) => {
    if (props.is_currency && isFirstTime) {
      isFirstTime.value = false;
      const value = newVal
        .replace(/[^0-9 .]*/g, "")
        .split(".")
        .join("");
      if (value === "") {
        emit("update:modelValue", "");
        emit("input", "");
      } else {
        emit("update:modelValue", numberFormat(parseInt(value), false));
        emit("input", numberFormat(parseInt(value), false));
      }
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="pln-input">
    <div class="pln-input--label" v-if="label !== undefined">
      <div class="flex gap-1">
        <label :for="id" class="pln-input--label--text" :class="classLabel">
          {{ label }}
        </label>
        <div v-if="star" class="text-red-500">*</div>
      </div>
      <slot name="instruction">
        <div class="pln-input--label--instruction">{{ instruction }}</div>
      </slot>
    </div>
    <div class="pln-input--container">
      <div class="pln-input--wrapper">
        <input
          class="pln-input--input"
          :id="id"
          :name="id"
          :type="input_type"
          :class="classes"
          :style="styles"
          :placeholder="placeholder"
          :disabled="disabled"
          v-model="model"
          :required="required"
          :min="min"
          :max="max"
          :minlength="minlength"
          :maxlength="maxlength"
          :readonly="readonly"
          @input="(e: any) => onInput(e?.target?.value)"
          @keypress="onKeyPress"
          @paste="disablePaste"
          @copy="disableCopy"
          :autocomplete="autocomplete"
          v-bind="$attrs"
        />
        <div
          class="pln-input--icon--before"
          v-if="showPrefix || prefix_icon !== ''"
          ref="element_before"
        >
          <icon
            v-if="prefix_icon !== '' && !showPrefix"
            :name="prefix_icon"
            :class="classIcon"
          />
          <slot v-if="showPrefix" name="prefix" />
        </div>
        <div
          class="pln-input--icon--after"
          v-if="showSuffix || suffix_icon !== ''"
          ref="element_after"
        >
          <icon
            v-if="suffix_icon !== '' && !showSuffix"
            :name="suffix_icon"
            :class="classIcon"
          />
          <slot v-if="showSuffix" name="suffix" />
        </div>
        <template v-if="is_password">
          <div
            class="pln-input--icon--password"
            @click="handlerVisibility"
            :class="classIcon"
          >
            <icon v-if="input_type === 'password'" name="eye-slash" />
            <icon v-else name="eye" />
          </div>
        </template>
      </div>
      <div class="pln-input-notes" v-if="showNotes || notes !== undefined">
        <slot name="notes">
          <span class="pln-input-notes">{{ notes }}</span>
        </slot>
      </div>
      <span
        v-if="status !== 'default' || checkErrorInput()"
        :class="classTextStatus"
        >{{ status_message || checkErrorMessageInput() }}</span
      >
    </div>
  </div>
</template>

<style lang="sass">
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button
  opacity: 0
  pointer-events: none

.pln-input
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
    @apply relative flex flex-col
  &--wrapper
    @apply relative
  &--input
    @apply w-full outline-none text-neutral-950 bg-white border border-blue-900
    &:-webkit-autofill
      @apply text-neutral-950
      transition: background-color 9999s ease-in-out 0s
    &:-moz-autofill
      @apply text-neutral-950
      transition: background-color 9999s ease-in-out 0s
    &::placeholder
      @apply text-neutral-500
    &:disabled
      @apply bg-neutral-200
    &:hover
      @apply border-cyan-500
    &:focus
      @apply border-cyan-500
    &--success
      @apply border-green-500
    &--error
      @apply border-red-500
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
  &--icon
    &--lg
      @apply text-base text-neutral-500
    &--md
      @apply text-base text-neutral-500
    &--sm
      @apply text-base text-neutral-500
    &--before
      @apply absolute left-2 top-0 bottom-0 flex items-center
    &--after
      @apply absolute right-2 top-0 bottom-0 flex items-center
    &--password
      @apply absolute right-2 top-0 bottom-0 flex items-center cursor-pointer

.input-text-validation
  &--success
    @apply text-green-500
  &--error
    @apply text-red-500
  &--sm
    @apply mt-1 text-xs
  &--md
    @apply mt-1 text-xs
  &--lg
    @apply mt-1 text-xs

.pln-input-notes
  @apply text-xs mt-1 text-neutral-500
</style>
