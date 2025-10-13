<script setup lang="ts">
import { RouterLink, useRoute } from "vue-router";
import { onMounted, ref } from "vue";

import { MenusMaster } from "@/constants/Menus";
import { Icon } from "@/components";

const route = useRoute();
const activeSubMenu = ref<boolean>(false);

const openChildren = () => {
  activeSubMenu.value = !activeSubMenu.value;
};

onMounted(() => {
  const path = route.path;
  if (MenusMaster?.[0]?.children?.find((item) => path.includes(item.url))) {
    activeSubMenu.value = true;
  } else {
    activeSubMenu.value = false;
  }
});
</script>

<template>
  <div class="sidebar-master">
    <p class="sidebar-master--title">MAIN MENU</p>
    <div class="sidebar-master--menus">
      <div
        v-for="(item, key) in MenusMaster"
        :key="key"
        class="flex flex-col gap-2"
      >
        <RouterLink
          v-if="!item.children"
          :to="{
            path: `/master${item.url}`,
          }"
          replace
          :class="route.path.includes(item.url) ? 'menu-active' : ''"
          class="menu-item"
        >
          <Icon :name="item.icon" class="menu-icon" />
          <p class="menu-title">{{ item.name }}</p>
        </RouterLink>
        <div v-else class="flex flex-col gap-2">
          <div
            class="menu-item"
            :class="activeSubMenu ? 'menu-active' : ''"
            @click="openChildren()"
          >
            <Icon name="arrow-up" class="menu-icon" v-if="activeSubMenu" />
            <Icon name="arrow" class="menu-icon" v-else />
            <p class="menu-title">{{ item.name }}</p>
          </div>
          <div v-if="activeSubMenu" class="pl-5 flex flex-col gap-2">
            <RouterLink
              v-for="(element, index) in item.children"
              :key="index"
              :to="`/master${element.url}`"
              :class="route.path.includes(element?.url) ? 'menu-active' : ''"
              class="menu-item"
            >
              <Icon
                :name="element.icon"
                class="menu-icon"
                v-if="element.icon"
              />
              <p class="menu-title">{{ element?.name }}</p>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="sass">
.sidebar-master
  @apply w-[240px] z-[2] fixed top-[80px] bottom-[10px] left-[10px] bg-blue-900 rounded-lg px-6 py-4 overflow-y-scroll
  &--title
    @apply text-lg font-bold text-neutral-50
  &--menus
    @apply flex flex-col gap-2 mt-6
    .menu-active
      .menu-icon
        @apply text-cyan-500 #{!important}
      .menu-title
        @apply text-cyan-500 #{!important}
    .menu-item
      @apply flex items-center gap-1 cursor-pointer w-full
      .menu-icon
        @apply text-neutral-50 text-base
      .menu-title
        @apply text-neutral-50 text-base font-bold
      &:hover
        .menu-icon
          @apply text-cyan-500
        .menu-title
          @apply text-cyan-500
</style>
