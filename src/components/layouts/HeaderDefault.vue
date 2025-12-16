<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";

import { Icon } from "@/components";
import eventBus from "@/utils/eventBus";
import { useAuthStore } from "@/modules/auth/stores/AuthStore";
import { useGlobalStore } from "@/stores/GlobalStore";
import { computed } from "vue";

const imgUrl = new URL("@/assets/images/logo.png", import.meta.url).href;

const globalStore = useGlobalStore();
const {
  titleHeader,
  disabledBack,
  disabledNext,
  isFinish,
  isAddScope,
  isRemoveNext,
  isStepNavigation,
} = storeToRefs(globalStore);
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const locationId = route.params.id;

const toHome = () => {
  router.push("/");
};

const handleBack = () => {
  eventBus.emit("back");
};

const handleNext = () => {
  eventBus.emit("next");
};

const handleSave = () => {
  eventBus.emit("save");
};

const handleAddScope = () => {
  eventBus.emit("addScope");
};

const handleStepNavigation = () => {
  eventBus.emit("stepNavigation");
};

const logout = () => {
  authStore.logout();
  router.push({ name: "login" });
};

const login = () => {
  router.push({ name: "login" });
};

const toCreate = () => {
  router.push(`/${locationId}/create/unit`);
};

const toReport = () => {
  const name = route.name;

  if (
    name === "combustion inspection" ||
    name === "combustion inspection add scope" ||
    name === "combustion inspection add scope section" ||
    name === "combustion inspection add scope section result"
  ) {
    router.push(
      `/${route.params.id}/create/unit/${route.params.id_unit}/result`
    );
  }
};
</script>

<template>
  <div class="pln-header-default">
    <img :src="imgUrl" @click="toHome" />
    <div class="menu-bar">
      <div class="menu-wrapper">
        <button
          v-if="authStore.users"
          class="user-info"
          @click="router.push('/profile')"
        >
          <p>User : {{ authStore.users?.email }}</p>
        </button>
        <button class="menu-button" @click="router.push('/')">Location</button>
        <button
          class="menu-button"
          :class="{ active: route.path.includes('create') }"
          @click="toCreate"
        >
          Generate Scope
        </button>
        <button
          v-if="authStore.users?.role === 'planner'"
          class="menu-button"
          @click="router.push('/master/user')"
        >
          Master
        </button>
        <!-- <button class="menu-button">Preview</button>
        <button class="menu-button">Expert</button> -->
        <!-- <button class="menu-button" @click="toReport">Report</button> -->
        <button class="sign-out-button" @click="logout" v-if="authStore.users">
          Sign Out
        </button>
        <button class="sign-out-button" @click="login" v-else>Login</button>
      </div>
      <div class="navigation">
        <!-- <div class="page-info">
          <p>{{ titleHeader }}</p>
        </div> -->
        <!-- <div class="home-button" @click="toHome">
          <Icon name="home" class="text-white text-xl" />
        </div> -->
        <div class="arrow-buttons">
          <button
            class="arrow-button back"
            :disabled="disabledBack"
            @click="handleBack"
          >
            Back
          </button>
          <button
            v-if="!isFinish && !isRemoveNext"
            class="arrow-button next"
            :disabled="disabledNext"
            @click="handleNext"
          >
            Next
          </button>
          <button
            v-if="isFinish && !isRemoveNext"
            class="arrow-button next"
            :disabled="disabledNext"
            @click="handleSave"
          >
            Save
          </button>
        </div>
      </div>
      <div v-if="isStepNavigation" class="step-navigation">
        <Icon
          name="double-arrow-left"
          class="text-[24px] text-buttonGray cursor-pointer hover:text-cyan-500"
          @click="handleStepNavigation"
        />
      </div>
      <div v-if="isAddScope" class="add-scope">
        <button :disabled="disabledNext" @click="handleAddScope">
          Add Scope
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="sass">
.pln-header-default
  @apply w-full h-full flex justify-between
  img
    @apply h-[50px] pl-4 pt-4
  .menu-bar
    @apply h-full flex flex-col gap-2 items-end
    .menu-wrapper
      @apply flex text-sm text-neutral-50
      .user-info
        @apply w-[300px] py-2 bg-buttonGray mr-[-22px] text-center
        clip-path: polygon(7.5% 0, 100% 0, 92.5% 100%, 0% 100%)
        &:hover
          @apply bg-cyan-500
      .menu-button
        @apply px-6 py-2 bg-buttonGray w-[150px] mr-[-22px]
        clip-path: polygon(15% 0, 100% 0, 85% 100%, 0% 100%)
        &:hover
          @apply bg-cyan-500
      .active
        @apply bg-cyan-500
      .sign-out-button
        @apply px-6 py-2 bg-red-500 w-[150px]
        clip-path: polygon(15% 0, 100% 0, 100% 100%, 0% 100%)
        &:hover
          @apply bg-red-700

    .navigation
      @apply flex items-center gap-2 justify-end
      .page-info
        @apply bg-cyan-500 bg-opacity-55 w-[300px] text-center py-1 text-base text-neutral-50 font-bold
        clip-path: polygon(7% 0, 100% 0, 93% 100%, 0% 100%)
      .home-button
        @apply rounded-full w-10 h-10 bg-buttonGray flex items-center justify-center cursor-pointer
        &:hover
          @apply bg-cyan-500
      .arrow-buttons
        @apply flex gap-[1px] items-center pr-4
        .arrow-button
          @apply flex items-center justify-center text-sm font-bold text-neutral-50 py-1.5 px-6 border-0 cursor-pointer
        .back
          @apply bg-buttonGray
          clip-path: polygon(0 50%, 20% 0, 100% 0, 100% 100%, 20% 100%)
          &:hover
            @apply bg-yellow-500
          &:disabled
            @apply bg-neutral-500 cursor-default
        .next
          @apply bg-buttonGray
          clip-path: polygon(80% 0, 100% 50%, 80% 100%, 0 100%, 0 0)
          &:hover
            @apply bg-yellow-500
          &:disabled
            @apply bg-neutral-500 cursor-default

    .step-navigation
      @apply absolute flex justify-end right-4 top-[105px]

    .add-scope
      @apply absolute flex justify-end right-4 top-[150px]
      > button
        @apply bg-buttonGray flex items-center justify-start text-base font-bold text-neutral-50 py-1.5 pl-6 pr-12 border-0 cursor-pointer
        clip-path: polygon(80% 0, 100% 50%, 80% 100%, 0 100%, 0 0)
        &:hover
          @apply bg-cyan-500
        &:disabled
          @apply bg-neutral-500 cursor-default
</style>
