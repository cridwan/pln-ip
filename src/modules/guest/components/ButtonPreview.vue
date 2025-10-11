<script setup lang="ts">
const emit = defineEmits(["click"]);
</script>

<template>
  <div class="w-full flex justify-center">
    <div
      class="bg-cyan-500 text-center border border-neutral-50 rounded-lg px-2 min-w-[120px] text-base text-neutral-50 cursor-pointer"
      @click="$emit('click')"
    >
      Preview
    </div>
  </div>
</template>
