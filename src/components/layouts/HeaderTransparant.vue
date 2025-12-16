<script setup lang="ts">
// import { useAuthStore } from "@/modules/auth/stores/AuthStore";
import { useRouter } from "vue-router";

const imgUrl = new URL("@/assets/images/logo.png", import.meta.url).href;

// const authStore = useAuthStore();
const router = useRouter();

// const logout = () => {
//   authStore.logout();
//   router.push({ name: 'login' });
// };

const toHome = () => {
  router.push("/");
};
</script>

<template>
  <div class="pln-header-transparant">
    <img :src="imgUrl" @click="toHome" />
    <!-- <p @click="logout">LOGOUT</p> -->
  </div>
</template>

<style lang="sass">
.pln-header-transparant
  @apply w-full h-full flex items-center justify-between px-4
  img
    @apply h-10 cursor-pointer
  p
    @apply text-neutral-950 text-sm cursor-pointer font-semibold hover:text-cyan-500
</style>
