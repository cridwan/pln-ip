<script setup lang="ts">
import { Footer, HeaderMain } from "@/components";
import { useRoute } from "vue-router";

const page = ["blok", "unit"];

const route = useRoute();
</script>

<template>
  <div class="guest-layout-default">
    <header>
      <HeaderMain />
    </header>
    <main>
      <slot />
    </main>
    <footer v-if="page.includes((route?.name || '') as string)">
      <Footer />
    </footer>
  </div>
</template>

<style lang="sass">
.guest-layout-default
  @apply relative w-full h-full min-h-screen bg-transparent flex flex-col
  > header
    @apply fixed h-[80px] w-full z-[9999]
  > main
    @apply h-full w-full flex-1 relative
  > footer
    @apply fixed bottom-0 w-full z-[9999]
</style>
