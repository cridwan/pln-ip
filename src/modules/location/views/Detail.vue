<script setup lang="ts">
import { onMounted, onUnmounted, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import type { AxiosError } from "axios";

import eventBus from "@/utils/eventBus";
import { useGlobalStore } from "@/stores/GlobalStore";
import { useQuery } from "@tanstack/vue-query";
import type { IPagination } from "@/types/GlobalType";
import type { LocationInterface } from "@/modules/master/types/LocationType";
import { useMasterStore } from "@/modules/master/stores/MasterStore";

const imgUrl = new URL("@/assets/images/priok.png", import.meta.url).href;

const globalStore = useGlobalStore();
const { titleHeader, disabledNext } = storeToRefs(globalStore);
const router = useRouter();
const route = useRoute();

const masterStore = useMasterStore();

//--- GET LOCATION
const { data: dataLocation, isFetching: isLoadingLocation } = useQuery({
  queryKey: ["getLocationDetail"],
  queryFn: async () => {
    try {
      const { data } = await masterStore.getLocation({
        search: "",
        filter: `uuid,${route.params.id}`,
        currentPage: 1,
        perPage: 1,
      });
      const response = data.data as IPagination<LocationInterface[]>;

      titleHeader.value = `${response.data?.[0]?.name}`;

      return response.data;
    } catch (error: any) {
      const err = error as AxiosError;
      throw err.response;
    }
  },
  refetchOnWindowFocus: false,
});
//--- END

const handleBack = () => {
  router.push("/");
};

onMounted(() => {
  disabledNext.value = true;
  eventBus.on("back", handleBack);
});

onUnmounted(() => {
  eventBus.off("back", handleBack);
});
</script>

<template>
  <div class="w-full min-h-screen" :style="{
    backgroundImage: `url(${imgUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }">
    <div class="trapezoid">
      <p>{{ dataLocation?.[0]?.name }}</p>
      <p>
        {{ dataLocation?.[0]?.description }}
      </p>
    </div>
  </div>
</template>

<style lang="sass">
.trapezoid
  @apply w-[40vw] min-h-screen bg-neutral-950 bg-opacity-50 pt-[90px] pl-4 pr-[140px]
  clip-path: polygon(0 0, 100% 0, 80% 100%, 0 100%)
  > p
    &:first-child
      @apply text-[24px] font-extrabold text-cyan-500
    &:last-child
      @apply text-[20px] font-medium text-neutral-50 mt-4 ml-6 text-justify
</style>
