<script setup lang="ts">
import { RouterLink, useRoute } from "vue-router";
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";

import { Menus } from "@/constants/Menus";
import { Icon } from "@/components";
import { useAuthStore } from "@/modules/auth/stores/AuthStore";
import { UserEnum } from "@/modules/auth/types/AuthType";
import { useProjectStore } from "@/modules/auth/stores/ProjectStore";
import { dateToYear } from "@/helpers/global";

const authStore = useAuthStore();
const projectStore = useProjectStore();
const { projects } = storeToRefs(projectStore)
const { users } = storeToRefs(authStore);
const route = useRoute();
const selected_menu = ref<number | null>(null);

const ListMenu = computed(() => {
  return Menus.filter((item) => {
    if (item.name === "Approval") {
      if (users.value?.role === UserEnum.APPROVAL) {
        return true;
      } else {
        return false;
      }
    } else if (item.name === "Request Approval") {
      if (users.value?.role === UserEnum.PLANNER) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  });
});

const openChildren = (e: { id: number; name: string; url: string }) => {
  selected_menu.value = e.id;
};

const isActive = (item: { id: number; name: string; url: string }) => {
  const path = route.path.split("/");
  const last_path = "/" + path[path.length - 1];

  return (
    selected_menu.value === item.id ||
    (item.url === "/scope" &&
      last_path.startsWith("/scope") &&
      !last_path.includes("add-scope")) ||
    (item.url === "/add-scope" && last_path.startsWith("/add-scope")) ||
    (item.url === "/work-instruction" &&
      last_path.startsWith("/work-instruction"))
  );
};

const projectDetails = computed(() => {
  return `${projects.value?.name} Tahun ${dateToYear(projects.value?.created_at as string)} ${projects.value?.inspection_type?.machine?.unit?.location?.name} (Created By ${projects.value?.generate_by?.user?.name})`;
});
</script>

<template>
  <div class="sidebar-main">
    <p class="sidebar-main--title">MAIN MENU</p>
    <div class="sidebar-main--menus">
      <div v-for="(item, key) in ListMenu" :key="key" class="flex flex-col gap-2">
        <RouterLink v-if="!item.children" :to="{
          path:
            item.url === '/'
              ? `/${route.params?.id}/create/unit/${route.params?.id_unit}/${route.params?.id_machine}`
              : `/${route.params?.id}/create/unit/${route.params?.id_unit}/${route.params?.id_machine}/${route?.params?.menu}/${route?.params?.id_project}/${route?.params?.id_inspection}${item.url}`,
          query:
            item.url === '/'
              ? { sequence: route?.params?.id_inspection }
              : route.query,
        }" replace :class="item.url === '/'
          ? ''
          : route.path.includes(item.url)
            ? 'menu-active'
            : ''
          " class="menu-item" @click="selected_menu = null">
          <Icon :name="item.icon" class="menu-icon" />
          <p class="menu-title">{{ item.name }}</p>
        </RouterLink>

        <div v-else class="flex flex-col gap-2" @click="openChildren(item)">
          <div class="menu-item" :class="isActive(item) ? 'menu-active' : ''">
            <Icon :name="item.icon" class="menu-icon" />
            <p class="menu-title">{{ item.name }}</p>
          </div>
          <div v-if="isActive(item)" class="pl-5 flex flex-col gap-2">
            <RouterLink v-for="(element, index) in item.children" :key="index" :to="item.url === '/'
              ? `/${route.params?.id}/create/unit/${route.params?.id_unit}/${route.params?.id_machine}?sequence=${route?.params?.id_inspection}`
              : `/${route.params?.id}/create/unit/${route.params?.id_unit}/${route.params?.id_machine}/${route?.params?.menu}/${route?.params?.id_project}/${route?.params?.id_inspection}${element.url}`
              " :class="item.url === '/'
                ? ''
                : route.path.includes(element.url)
                  ? 'menu-active'
                  : ''
                " class="menu-item">
              <p class="menu-title">{{ element.name }}</p>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
    <p class="sidebar-main--description">{{ projectDetails }}</p>
  </div>
</template>

<style lang="sass">
.sidebar-main
  @apply w-[240px] z-[2] fixed top-[80px] bottom-[10px] left-[10px] bg-blue-900 rounded-lg px-6 py-4
  &--title
    @apply text-lg font-bold text-neutral-50
  &--description
    @apply mt-11 text-neutral-200 text-sm
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
