<script setup lang="ts">
import { Icon, Loading, Input } from "@/components";
import {
  ref,
  computed,
  watch,
  reactive,
  onMounted,
  type PropType,
  type Prop,
} from "vue";
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxLabel,
  ComboboxRoot,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxViewport,
  ComboboxCancel,
} from "radix-vue";
import useVuelidate from "@vuelidate/core";
import { v4 as uuidv4 } from "uuid";

const props = defineProps({
  label: {
    type: String,
  },
  placeholder: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: [String, Array],
    default: null,
  },
  status: {
    type: String as PropType<"default" | "success" | "error">,
    default: "default",
    validator: function (value: string) {
      return ["default", "success", "error"].indexOf(value) !== -1;
    },
  },
  status_message: {
    type: String,
    default: "",
  },
  options: {
    type: Array,
    default: () => {
      return [];
    },
  },
  options_label: {
    type: String,
  },
  options_value: {
    type: String,
  },
  size: {
    type: String as PropType<"sm" | "md" | "lg">,
    default: "md",
    validator: function (value: string) {
      return ["sm", "md", "lg"].indexOf(value) !== -1;
    },
  },
  search: {
    type: Boolean,
    default: false,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  notes: {
    type: String,
  },
  rules: {
    type: Object,
  },
  instruction: {
    type: String,
  },
  prevent_default: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    defaault: false,
  },
  show_icon_arrow: {
    type: Boolean,
    default: true,
  },
  show_icon_search: {
    type: Boolean,
    default: false,
  },
  hide_options: {
    type: Boolean,
    default: false,
  },
  modelSearch: {
    type: String,
    default: null,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  loadingNextPage: {
    type: Boolean,
    default: false,
  },
  is_free_text: {
    type: Boolean,
    default: false,
  },
  star: {
    type: Boolean,
    default: false,
  },
});

const id = ref(uuidv4());
const open = ref(false);
const value_disabled = ref(false);
const element_input = ref<HTMLElement | null>(null);
const element_free_text = ref<HTMLElement | null>(null);
const element_value = ref<HTMLElement | null>(null);
const height_element_value = ref(0);
const value_placeholder = ref("");

const element_container = reactive({
  offset_left: 0,
  client_width: 0,
});

const emit = defineEmits([
  "update:modelValue",
  "update:modelSearch",
  "search",
  "select",
  "clear",
  "scroll",
]);

const model = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

const model_shadow = computed({
  get() {
    const selected: any = props.options.find((item: any) => {
      type ObjectKey = keyof typeof item;
      const option_value = props.options_value as ObjectKey;
      return item[option_value] == props.modelValue;
    });

    type ObjectKey = keyof typeof selected;
    const option_label = props.options_label as ObjectKey;
    return props.options_label === undefined
      ? model.value
      : selected?.[option_label];
  },
  set(value) {
    model.value = value;
  },
});

const model_search = computed({
  get() {
    return props.modelSearch;
  },
  set(value) {
    emit("update:modelSearch", value);
  },
});

const classLabel = computed(() => {
  return [`v-select--label--text--${props.size}`];
});

const classSelectInput = computed(() => {
  return [
    `v-select-input--${props.size}`,
    props.status === "default" ? "" : `v-select-input--${props.status}`,
    props.rules ? (checkErrorSelect() ? `v-select-input--error` : "") : "",
    props.show_icon_search ? "pl-9 pr-10" : "pl-3 pr-10",
  ];
});

const classSelectFreeText = computed(() => {
  return [
    `v-select-free-text--${props.size}`,
    props.status === "default" ? "" : `v-select-free-text--${props.status}`,
    props.rules
      ? checkErrorSelect()
        ? `v-select-free-text--error`
        : !checkErrorSelect() && model.value !== "" && model.value.length > 0
        ? "v-select-free-text--success"
        : ""
      : "",
  ];
});

const styleSelectInput = computed(() => {
  const padding_y: any = {
    sm: 4,
    md: 8,
    lg: 12,
  };
  return {
    minHeight: `${height_element_value.value}px`,
  };
});

watch(model, (value) => {
  setTimeout(() => {
    height_element_value.value = element_value.value?.clientHeight || 0;
  }, 1);

  if (!props.multiple) {
    if (value !== "") {
      value_placeholder.value = "";
    } else {
      value_placeholder.value = props.placeholder;
    }
  }
});

watch(open, (value) => {
  if (props.search) {
    if (value) {
      value_placeholder.value = props.placeholder;
    } else {
      if (model.value === "" && !props.multiple) {
        value_placeholder.value = props.placeholder;
      } else {
        if (props.multiple) {
          value_placeholder.value = props.placeholder;
        } else {
          value_placeholder.value = "";
        }
      }
    }
  }

  if (!value) {
    if (
      !props.is_free_text ||
      (props.is_free_text && props.options.length > 0)
    ) {
      model_search.value = "";
    }
    setTimeout(() => {
      value_disabled.value = true;
    }, 2);
  }
});

const classTextStatus = computed(() => {
  return [
    checkErrorSelect() && `select-text-validation--error`,
    `select-text-validation--${props.status} select-text-validation--${props.size}`,
  ];
});

const classValue = computed(() => {
  return [
    `v-select-value--${props.size}`,
    props.show_icon_search ? "pl-9 pr-10" : "pl-3 pr-10",
    open.value && props.search
      ? "v-select-value--transparent"
      : "v-select-value--color",
  ];
});

function selectItem(event: Event, item: any) {
  if (props.prevent_default) {
    event.preventDefault();
  } else {
    open.value = false;
  }

  const new_value = props.options_value ? item?.[props.options_value] : item;
  if (props.multiple) {
    const new_model = [...model.value];
    if (Array.isArray(model.value)) {
      const index = model.value.indexOf(new_value);
      if (index === -1) {
        new_model.push(new_value);
      } else {
        new_model.splice(index, 1);
      }
    }
    model.value = new_model;
  } else {
    model.value = new_value;
  }
  emit("select", item);
}

function clearSearch() {
  model_search.value = "";
  if (element_input.value) {
    element_input.value.focus();
  }

  emit("clear");
}

function click() {
  if (props.search) {
    if (!props.disabled) {
      value_disabled.value = false;
      setTimeout(() => {
        if (element_input.value) {
          element_input.value.focus();
        }
      }, 1);
    }
  }
}

watch(
  () => props.options,
  (value) => {
    if (value.length === 0) {
      if (props.is_free_text) {
        open.value = false;
        setTimeout(() => {
          element_free_text.value?.focus();
        }, 1);
      }
    } else {
      if (props.is_free_text) {
        setTimeout(() => {
          open.value = true;
          click();
        }, 1);
      }
    }
  },
  { deep: true }
);

function search(value: Event) {
  emit("search", value);
}

const rules_select = computed(() => {
  return { model: { ...props.rules } };
});
const v$_select = reactive(useVuelidate(rules_select, { model }));

function checkErrorSelect() {
  return v$_select?.value?.model.$errors?.length > 0 ? true : false;
}

function checkErrorMessageSelect() {
  return v$_select?.value?.model.$errors?.[0]?.$message;
}

function getElementContainer() {
  const element_datepicker_range = document.getElementById(
    `${id.value}-anchor`
  );
  const count = {
    offset_left: element_datepicker_range?.offsetLeft || 0,
    client_width: element_datepicker_range?.clientWidth || 0,
  };

  element_container.offset_left = count.offset_left;
  element_container.client_width = count.client_width;
}

const popoverContent = computed(() => {
  return {
    width: `${element_container.client_width}px`,
  };
});

watch(model, () => {
  v$_select.value.$validate();
});

watch(open, (value) => {
  if (value) {
    getElementContainer();
  }
});

onMounted(() => {
  setTimeout(() => {
    getElementContainer();
  }, 500);
  height_element_value.value = element_value.value?.clientHeight || 0;

  if (props.modelValue !== "" && !props.multiple) {
    value_placeholder.value = "";
  } else {
    value_placeholder.value = props.placeholder;
  }

  value_disabled.value = props.disabled;
});
</script>

<template>
  <div class="v-select">
    <div class="v-select--label" ref="element_label" v-if="label !== undefined">
      <div class="flex gap-1">
        <label class="v-select--label--text" :class="classLabel" :for="id">
          {{ label }}
        </label>
        <div v-if="star" class="text-red-500">*</div>
      </div>
      <div class="v-select--label--instruction">{{ instruction }}</div>
    </div>
    <input
      v-if="is_free_text && options.length === 0"
      ref="element_free_text"
      v-model="model_search"
      class="v-select-free-text"
      :placeholder="value_placeholder"
      :class="[classSelectFreeText]"
      @input="(e) => search(e)"
    />
    <ComboboxRoot
      class="v-select-root"
      v-else
      :id="`${id}-root`"
      :multiple="multiple"
      :open="open"
      @click="click"
      @update:open="(e) => (open = hide_options ? false : disabled ? false : e)"
    >
      <ComboboxAnchor class="v-select-anchor" :id="`${id}-anchor`">
        <input
          class="v-select-input"
          :id="`${id}-element-input`"
          ref="element_input"
          v-model="model_search"
          :disabled="value_disabled"
          :placeholder="value_placeholder"
          :class="[classSelectInput, { 'v-select-input--disabled': disabled }]"
          :style="styleSelectInput"
          @input="(e) => search(e)"
        />
        <ComboboxTrigger class="v-select-trigger">
          <div class="v-select-trigger--wrapper">
            <Icon
              v-if="show_icon_search"
              name="search"
              class="v-select-icon-search"
            />
            <span
              ref="element_value"
              class="v-select-value"
              :class="classValue"
              >{{ multiple ? "" : model_shadow }}</span
            >
            <ComboboxCancel
              class="v-select-cancel"
              v-if="clearable && model_search !== '' && open"
              @click="clearSearch"
            >
              <Icon name="close-circle" class="v-select-icon-clear" />
            </ComboboxCancel>
            <Icon
              v-if="
                (show_icon_arrow && clearable && model_search !== '') ||
                (show_icon_arrow && !clearable)
              "
              name="caret-down"
              class="v-select-icon-arrow"
              :class="{ 'v-select-icon-active': open }"
            />
          </div>
        </ComboboxTrigger>
      </ComboboxAnchor>
      <ComboboxContent
        class="v-select-content"
        :id="`${id}-content`"
        position="popper"
        :style="popoverContent"
      >
        <div
          class="v-select-content-wrapper"
          @scroll="(e) => $emit('scroll', e)"
        >
          <ComboboxViewport v-if="loading">
            <div class="v-select-item p-2">
              <span class="text-blue-950 font-semibold">Loading...</span>
            </div>
          </ComboboxViewport>
          <ComboboxViewport class="v-select-viewport" v-else>
            <div v-if="loading" class="v-select-loading">
              <Loading />
            </div>
            <ComboboxEmpty class="v-select-empty" v-if="!loading">
              <p>Not found</p>
            </ComboboxEmpty>
            <ComboboxItem
              v-if="!loading"
              v-for="(item, index) in options"
              class="v-select-item"
              :key="index"
              :value="
                options_value === undefined ? item : item?.[options_value]
              "
              :class="{
                'v-select-item-active':
                  options_value === undefined
                    ? item === model
                    : item?.[options_value] === model,
              }"
              @select="(e) => selectItem(e, item)"
            >
              <slot name="options_label" :item="item" :index="index">
                <span>
                  {{
                    options_label === undefined ? item : item?.[options_label]
                  }}
                </span>
              </slot>
            </ComboboxItem>
            <div v-if="loadingNextPage" class="flex justify-center my-3">
              <span class="text-blue-950 font-semibold">Loading...</span>
              <!-- <Loading /> -->
            </div>
          </ComboboxViewport>
        </div>
      </ComboboxContent>
      <span v-if="notes !== undefined" class="v-select-notes">{{ notes }}</span>
      <span
        v-if="status !== 'default' || checkErrorSelect()"
        :class="classTextStatus"
        >{{ status_message || checkErrorMessageSelect() }}</span
      >
      <slot name="support-text" />
    </ComboboxRoot>
  </div>
</template>

<style lang="sass">
.v-select
  @apply flex flex-col
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
      @apply text-xs text-neutral-500
  .v-select-root
    @apply relative
    .v-select-anchor
      @apply w-full min-w-14 inline-flex items-center justify-between gap-2 outline-none cursor-pointer relative
      .v-select-input
        @apply w-full bg-transparent outline-none cursor-pointer pointer-events-none rounded text-neutral-950 bg-white border border-blue-900
        &:hover
          @apply border-cyan-500
        &--disabled
          @apply bg-neutral-200
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
      .v-select-trigger
        @apply w-full absolute left-0 right-0 top-0 bottom-0
        &--wrapper
          @apply w-full flex items-center relative
          .v-select-value
            @apply absolute top-[50%] translate-y-[-50%] text-left
            &--lg
              @apply py-3 text-base
            &--md
              @apply py-2 text-sm leading-[22.4px]
            &--sm
              @apply py-1 text-sm
            &--color
              @apply text-neutral-950
            &--transparent
              opacity: 0
          .v-select-cancel
            @apply absolute right-3 top-[50%] translate-y-[-50%]
            .v-select-icon-clear
              @apply text-base cursor-pointer text-neutral-500
          .v-select-icon-search
            @apply text-base absolute left-3 top-[50%] translate-y-[-50%] text-neutral-500
          .v-select-icon-arrow
            @apply text-base duration-300 absolute right-3 top-[50%] translate-y-[-50%] text-neutral-950
          .v-select-icon-active
            @apply rotate-180
    .v-select-content
      @apply relative z-10 my-1 min-w-14 border rounded will-change-[opacity,transform] bg-white border-gray-500
      .v-select-content-wrapper
        @apply max-h-[200px] overflow-x-auto
        .v-select-viewport
          @apply py-2 flex flex-col gap-2
          .v-select-empty
            @apply text-xs leading-[19.6px] px-3 rounded flex items-center relative text-neutral-500
          .v-select-loading
            @apply flex items-center justify-center p-4
          .v-select-item
            @apply text-sm leading-[19.6px] rounded flex items-center relative select-none cursor-pointer px-3 text-neutral-600
            &:hover
              @apply text-neutral-950
          .v-select-item-active
            @apply text-neutral-950
    &:hover
      .v-select-input
        @apply border-cyan-500 #{!important}

.v-select-free-text
  @apply w-full bg-transparent outline-none cursor-default border rounded px-3 text-neutral-950 bg-white border-neutral-200
  &:hover
    @apply border-cyan-500
  &--disabled
    @apply bg-neutral-200
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

.select-text-validation
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

.v-select-notes
  @apply text-xs mt-1 text-neutral-500
</style>
