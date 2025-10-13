<script setup lang="ts">
import { MenuAdditional } from "@/constants/Menus";
import { Icon } from "@/components";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { ref } from "vue";

const route = useRoute();
const router = useRouter();
const selected_menu = ref<number | null>(null);

const openChildren = (e: { id: number; name: string; url: string }) => {
  selected_menu.value = e.id;
};

const isActive = (item: { id: number; name: string; url: string }) => {
  const path = route.path.split("/");
  const last_path = "/" + path[path.length - 1];

  return selected_menu.value === item.id || last_path === item.url;
};

const isMenuActive = (item: { url: string }) => {
  const paths = route.path.split("/").filter((el) => el != "");
  paths[2] = ":id";
  paths[3] = ":name";

  const path = `/${paths.join("/")}`;
  return path.includes(item.url);
};

const handleBack = () => {
  router.push({ name: "master location" });
};
</script>

<template>
  <div class="sidebar-master">
    <p class="sidebar-master--title flex items-center gap-2">
      <Icon name="logout" class="cursor-pointer size-6" @click="handleBack" />
      ADDITIONAL MENU
    </p>
    <div class="sidebar-master--menus">
      <div
        v-for="(item, key) in MenuAdditional"
        :key="key"
        class="flex flex-col gap-2"
      >
        <RouterLink
          v-if="!item.children"
          :to="{
            path: `${
              item.url === '/'
                ? '/master/additional-scope'
                : item.url
                    .replace(':id', String(route.params?.id))
                    .replace(':name', String(route.params?.name))
            }`,
          }"
          replace
          :class="
            item.url === '/' ? '' : isMenuActive(item) ? 'menu-active' : ''
          "
          class="menu-item"
          @click="selected_menu = null"
        >
          <Icon :name="item.icon" class="menu-icon" />
          <p class="menu-title">{{ item.name }}</p>
        </RouterLink>
        <div v-else class="flex flex-col gap-2" @click="openChildren(item)">
          <div class="menu-item" :class="isActive(item) ? 'menu-active' : ''">
            <Icon :name="item.icon" class="menu-icon" />
            <p class="menu-title">{{ item.name }}</p>
          </div>
          <div v-if="isActive(item)" class="pl-5 flex flex-col gap-2">
            <RouterLink
              v-for="(element, index) in item.children"
              :key="index"
              :to="`${element.url
                .replace(':id', String(route.params?.id))
                .replace(':name', String(route.params.name))}`"
              :class="route.path.includes(element?.url) ? 'menu-active' : ''"
              class="menu-item"
            >
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
  @apply w-[240px] z-[2] fixed top-[80px] bottom-[10px] left-[10px] bg-blue-900 rounded-lg px-6 py-4
  &--title
    @apply text-sm font-bold text-neutral-50
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
