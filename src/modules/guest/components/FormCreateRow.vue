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
import { Input, Icon, Button } from "@/components";

const props = defineProps({
  label: {
    type: String,
    default: "",
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["save"]);

const modelOpenInputData = ref(false);
const model = ref("");

const cancel = () => {
  modelOpenInputData.value = false;
  model.value = "";
};

const save = () => {
  emit("save", model.value);
};

const reset = () => {
  modelOpenInputData.value = false;
  model.value = "";
};

defineExpose({
  reset,
});
</script>

<template>
  <PopoverRoot v-model:open="modelOpenInputData">
    <PopoverTrigger>
      <button class="button-trigger-cr">
        <Icon name="plus" />
      </button>
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent :side-offset="5" class="popover-content">
        <Input :label="label" v-model="model" />
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
.button-trigger-cr
  @apply bg-blue-900 hover:bg-blue-950 rounded-full p-2 text-[10px] text-neutral-50

.popover-content
  @apply rounded mx-4 px-2 pt-2 pb-4 min-w-[400px] bg-white shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2)] will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade
  .popover-title
    @apply text-base font-medium text-neutral-950
  .button-colors
    @apply flex items-center gap-2 mt-2
    > button
      @apply min-w-[100px] rounded-lg bg-buttonGray py-1 px-3 cursor-pointer text-[13px] text-neutral-50
    .button-red
      @apply hover:bg-red-500
    .button-yellow
      @apply hover:bg-yellow-400
    .button-green
      @apply hover:bg-green-500
    .red-active
      @apply bg-red-500
    .yellow-active
      @apply bg-yellow-400
    .green-active
      @apply bg-green-500
</style>
