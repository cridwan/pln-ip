<script setup lang="ts">
import { HeaderMain, Footer } from "@/components";
import GuestSidebarAddScope from "@/components/layouts/GuestSidebarAddScope.vue";
import { useRoute } from "vue-router";

const imgUrl = new URL("@/assets/images/bg-main-page.jpg", import.meta.url)
    .href;

const page = ["blok", "unit"];

const route = useRoute();
</script>

<template>
    <div class="layout-main" :style="{
        backgroundImage: `url(${imgUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    }">
        <header>
            <HeaderMain />
        </header>
        <main>
            <GuestSidebarAddScope />
            <div class="layout-main--content">
                <slot />
            </div>
        </main>
        <footer v-if="page.includes((route?.name || '') as string)">
            <Footer />
        </footer>
    </div>
</template>

<style lang="sass">
.layout-main
  @apply relative w-full h-full min-h-screen bg-transparent flex flex-col
  > header
    @apply fixed h-[80px] w-full z-[9999]
  > main
    @apply h-full w-full flex-1 relative
  > footer
    @apply fixed bottom-0 w-full z-[9999]
  &--content
    @apply pl-[280px] pr-5 pt-[80px]
</style>
