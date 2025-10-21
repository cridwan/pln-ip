<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "@/modules/auth/stores/AuthStore";
import { Icon } from "..";
import NotificationMap from "./NotificationMap.vue";
import { useQuery } from "@tanstack/vue-query";
import { useMasterStore } from "@/modules/master/stores/MasterStore";
import type { NotificationInterface } from "@/types/GlobalType";

const imgUrl = new URL("@/assets/images/logo.png", import.meta.url).href;

const authStore = useAuthStore();
const router = useRouter();
const masterStore = useMasterStore();



// get notification
const {
  data: dataNotification,
  refetch: refetchNotification,
} = useQuery({
  queryKey: ["getNotificationLists"],
  queryFn: async () => {
    const { data } = await masterStore.getNotificationLatest({
      receiver_id: authStore.users?.id || ""
    });
    return data as NotificationInterface[];
  },
  retry: 0,
  refetchOnWindowFocus: false,
});

const toHome = () => {
  router.push("/");
};

const logout = () => {
  authStore.logout();
  router.push("/login");
};

const login = () => {
  router.push({ name: 'login' });
}
</script>

<template>
  <div class="pln-header-maps">
    <img :src="imgUrl" @click="toHome" />
    <div class="menu-bar">
      <div class="menu-wrapper">
        <div class="notification-map text-blue-950 flex items-center justify-center cursor-pointer mr-8 mt-1"
          v-show="authStore.users">
          <NotificationMap :data-notification="dataNotification">
            <div class="relative">
              <Icon name="bell-alert" size="10" />
              <span v-if="dataNotification && dataNotification?.length > 0"
                class="rounded-full size-3 text-[9px] flex items-center justify-center text-white bg-red-500 absolute top-0 right-0">{{
                  dataNotification.length }}</span>
            </div>
          </NotificationMap>
        </div>
        <div class="user-info" v-if="authStore.users">
          <p>User : {{ authStore.users?.email }}</p>
        </div>
        <!-- <button class="menu-button">UBH</button> -->
        <button class="menu-button active">Location</button>
        <!-- <button class="menu-button" @click="router.push('/user-history')">
          User History
        </button> -->
        <!-- <button class="menu-button">Report</button> -->
        <button class="sign-out-button" @click="logout" v-if="authStore.users">Sign Out</button>
        <button class="sign-out-button" @click="login" v-else>Login</button>
      </div>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.pln-header-maps
  @apply w-full h-full flex justify-between
  img
    @apply h-[50px] pl-4 pt-4
  .menu-bar
    @apply h-full flex flex-col gap-2
    .menu-wrapper
      @apply flex text-sm text-neutral-50
      .user-info
        @apply w-[300px] py-2 bg-buttonGray mr-[-22px] text-center
        clip-path: polygon(7.5% 0, 100% 0, 92.5% 100%, 0% 100%)
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
:deep(.notification-map)
  .pln-icon
    svg
      width: 1.4em !important
      height: 1.4em !important
      font-size: 1em !important

</style>
