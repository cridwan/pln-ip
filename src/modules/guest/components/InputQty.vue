<script setup lang="ts" generic="T">
import { ref } from "vue";

import { Input } from "@/components";
import { numbers_characters } from "@/helpers/global";

const props = defineProps({
  qty: {
    type: Number,
    required: false,
  },
});
const model = ref<string>(String(props.qty));
const emmit = defineEmits(["change"]);

const handleChange = () => {
  emmit("change", model.value);
};
</script>

<template>
  <Input
    v-model="model"
    @change="handleChange"
    class="!bg-transparent !text-white"
    :custom_symbols="numbers_characters"
  />
</template>
