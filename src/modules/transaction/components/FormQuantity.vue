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
import { Button, Input } from "@/components";
import { numbers_decimals, numbers_positive_negative } from "@/helpers/global";

const props = defineProps({
  value: {
    type: String,
    default: "",
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
const modelQuantity = ref("");

const cancel = () => {
  modelOpenInputData.value = false;
  modelQuantity.value = "";
};

const save = () => {
  emit("save", { quantity: modelQuantity.value });
};

watch(
  () => props.value,
  (val) => {
    if (val) {
      modelQuantity.value = val;
    } else {
      modelQuantity.value = "";
    }
  },
  { deep: true }
);

watch(modelOpenInputData, (val) => {
  if (props.value) {
    modelQuantity.value = props.value;
  } else {
    modelQuantity.value = "";
  }
});

defineExpose({
  modelOpenInputData,
});
</script>

<template>
  <p v-if="disabled" class="text-base text-neutral-50 text-left">{{ value }}</p>
  <PopoverRoot v-else v-model:open="modelOpenInputData">
    <PopoverTrigger>
      <button
        class="button-trigger"
        :class="[
          {
            'button-trigger-active': modelOpenInputData === true,
          },
        ]"
      >
        {{ value !== "" ? value : "+" }}
      </button>
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent :side-offset="5" class="popover-content-quantity">
        <p class="popover-title">{{ label }}</p>
        <div class="mt-4">
          <Input
            v-model="modelQuantity"
            type="text"
            :is_decimal="true"
            :custom_symbols="numbers_decimals"
            label="Quantity"
          />
        </div>
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
.value-trigger
  @apply text-base text-neutral-50

.popover-content-quantity
  @apply rounded mx-4 px-2 pt-2 pb-4 min-w-[250px] bg-white shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2)] will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade
  .popover-title
    @apply text-base font-medium text-neutral-950
</style>
