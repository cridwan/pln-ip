<script setup lang="ts">
import { useRouter } from "vue-router";

import { useAuthStore } from "@/modules/auth/stores/AuthStore";

const imgUrl = new URL("@/assets/images/logo.png", import.meta.url).href;

const authStore = useAuthStore();
const router = useRouter();

const toHome = () => {
  router.push("/master/user");
};

const logout = () => {
  authStore.logout();
  router.push({ name: 'login' });
};
</script>

<template>
  <div class="pln-header-main">
    <img :src="imgUrl" @click="toHome" />
    <div class="menu-bar">
      <div class="menu-wrapper">
        <button v-if="authStore.users" class="user-info" @click="router.push('/profile')">
          <p>User : {{ authStore.users?.email ?? '' }}</p>
        </button>
        <button v-if="authStore.users?.role === 'planner'" class="menu-button" @click="router.push('/')">
          Location
        </button>
        <button class="sign-out-button" @click="logout">Sign Out</button>
      </div>
    </div>
  </div>
</template>

<style lang="sass">
.pln-header-main
  @apply w-full h-full flex justify-between
  img
    @apply h-[50px] pl-4 pt-4
  .menu-bar
    @apply h-full flex flex-col gap-2
    .menu-wrapper
      @apply flex text-sm text-neutral-50
      .user-info
        @apply w-[300px] py-2 !bg-cyan-500 mr-[-22px] text-center
        clip-path: polygon(7.5% 0, 100% 0, 92.5% 100%, 0% 100%)
        &:hover
          @apply bg-cyan-500
      .menu-button
        @apply px-6 py-2 bg-buttonGray w-[300px] mr-[-22px]
        clip-path: polygon(7.5% 0, 100% 0, 92.5% 100%, 0% 100%)
        &:hover
          @apply bg-cyan-500
      .active
        @apply bg-cyan-500
      .sign-out-button
        @apply px-6 py-2 bg-red-500 w-[150px]
        clip-path: polygon(15% 0, 100% 0, 100% 100%, 0% 100%)
        &:hover
          @apply bg-red-700
</style>
