<script setup lang="ts">
import { type PropType } from "vue";

import { Icon } from "@/components";
import { RouterLink } from "vue-router";

export interface BreadcrumbType {
  name: string;
  as_link?: boolean;
  url?: string;
}

const props = defineProps({
  items: {
    type: Array as PropType<BreadcrumbType[]>,
    default: () => {
      return [];
    },
  },
  class: {
    type: String,
  },
});
</script>

<template>
  <div :class="['breadcrumb', props.class]">
    <div v-for="(item, key) in items" :key="key" class="breadcrumb-container">
      <RouterLink
        v-if="item.as_link"
        :to="item?.url || ''"
        class="breadcrumb-link"
        :class="
          key + 1 === items.length
            ? 'text-cyan-500'
            : 'text-neutral-950 hover:text-[#668415] cursor-pointer'
        "
        >{{ item.name?.replace("Std", "Standart") }}</RouterLink
      >
      <p
        v-else
        class="breadcrumb-normal"
        :class="key + 1 === items.length ? 'text-cyan-500' : 'text-neutral-950'"
      >
        {{ item.name?.replace("Std", "Standart") }}
      </p>
      <Icon
        v-if="key + 1 !== items.length"
        :class="key + 2 === items.length ? 'text-cyan-500' : 'text-neutral-950'"
        name="caret-right"
      />
    </div>
  </div>
</template>

<style lang="sass">
.breadcrumb
  @apply flex items-start gap-1
  .breadcrumb-container
    @apply flex items-center gap-1
    .breadcrumb-link
      @apply text-base font-bold uppercase
    .breadcrumb-normal
      @apply text-base font-bold uppercase
</style>
