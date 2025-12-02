<script setup lang="ts">
import { storeToRefs } from "pinia";
import type { AxiosError } from "axios";
import { useRoute, useRouter } from "vue-router";
import { onMounted, onUnmounted, ref, watch } from "vue";

import { useGlobalStore } from "@/stores/GlobalStore";
import { Breadcrumb } from "@/components";
import eventBus from "@/utils/eventBus";
import { useQuery } from "@tanstack/vue-query";
import type { IPagination } from "@/types/GlobalType";
import type { UnitInterface } from "@/modules/master/types/UnitType";
import type { MachineInterface } from "@/modules/master/types/MachineType";
import { useMasterStore } from "@/modules/master/stores/MasterStore";
import type { LocationInterface } from "@/modules/master/types/LocationType";

const imgBlok1 = new URL("@/assets/images/bg-blok1.png", import.meta.url).href;
const imgBlok3 = new URL("@/assets/images/bg-blok3.png", import.meta.url).href;
const imgBlok4 = new URL("@/assets/images/bg-blok4.png", import.meta.url).href;

const dataBg = [imgBlok1, imgBlok3, imgBlok4];

const globalStore = useGlobalStore();
const { titleHeader, disabledNext } = storeToRefs(globalStore);
const router = useRouter();
const route = useRoute();
const locationId = route.params.id;
const breadcrumb = ref([
  {
    name: "Loading...",
    as_link: false,
    url: "",
  },
  {
    name: "Unit",
    as_link: false,
    url: "",
  },
]);

const bgActive = ref<number>(0);
const masterStore = useMasterStore();
const unit_active = ref<string | null>(null);

//--- GET UNIT
const { data: dataUnit, isFetching: isLoadingUnit } = useQuery({
  queryKey: ["getUnit"],
  queryFn: async () => {
    try {
      const { data } = await masterStore.getUnit({
        search: "",
        filter: `location_uuid,${route.params.id}`,
        currentPage: 1,
        perPage: 1000,
      });
      const response = data.data as IPagination<UnitInterface[]>;

      return response;
    } catch (error: any) {
      const err = error as AxiosError;
      throw err.response;
    }
  },
  refetchOnWindowFocus: false,
});
//--- END

//--- GET MACHINE
const {
  data: dataMachine,
  isFetching: isLoadingMachine,
  refetch: refetchMachine,
} = useQuery({
  queryKey: ["getMachine"],
  queryFn: async () => {
    try {
      const { data } = await masterStore.getMachine({
        search: "",
        filter: `unit_uuid,${unit_active.value}`,
        currentPage: 1,
        perPage: 1000,
      });
      const response = data.data as IPagination<MachineInterface[]>;

      return response;
    } catch (error: any) {
      const err = error as AxiosError;
      throw err.response;
    }
  },
  enabled: false,
  refetchOnWindowFocus: false,
});
//--- END

// get location
const { data: dataLocation } = useQuery({
  queryKey: ["getLocation"],
  queryFn: async () => {
    try {
      const { data } = await masterStore.getLocation({
        search: "",
        filter: `uuid,${route.params.id}`,
        currentPage: 1,
        perPage: 1000,
      });
      const response = data.data as IPagination<LocationInterface[]>;
      return response;
    } catch (error: any) {
      const err = error as AxiosError;
      throw err.response;
    }
  },
  refetchOnWindowFocus: false,
});
// get location

watch(dataUnit, (value) => {
  if ((value?.data || []).length > 0) {
    unit_active.value = value?.[0]?.uuid || "";
    refetchMachine();
  }
});

watch(dataLocation, (value) => {
  if ((value?.data || []).length > 0) {
    breadcrumb.value = [
      {
        name: value?.data?.[0]?.name || "",
        as_link: false,
        url: "",
      },
      {
        name: "Unit",
        as_link: false,
        url: "",
      },
    ];
  }
}, { immediate: true, deep: true })

const handleClick = (uuid: string, index: number) => {
  bgActive.value = index;
  if (unit_active.value === uuid) {
    unit_active.value = null;
  } else {
    unit_active.value = uuid;
    refetchMachine();
  }
};

const toScope = (item: UnitInterface, element: MachineInterface) => {
  router.push({
    path: `/${locationId}/create/unit/${item.uuid}/${element.uuid}`,
  });
};

const handleBack = () => {
  router.push(`/${locationId}`);
};

onMounted(() => {
  titleHeader.value = "Unit";
  disabledNext.value = true;
  eventBus.on("back", handleBack);
});

onUnmounted(() => {
  eventBus.off("back", handleBack);
});
</script>

<template>
  <div class="w-full min-h-screen" :style="{
    backgroundImage: `url(${dataBg[bgActive]})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }">
    <div class="container-unit">
      <Breadcrumb :items="breadcrumb" />
      <div class="content-unit">
        <div class="wrapper-button-unit">
          <div v-for="(item, key) in dataUnit?.data" :key="key" class="button-group">
            <button class="button-unit" :class="{ 'button-active': item.uuid === unit_active }"
              @click="handleClick(item.uuid, key)">
              {{ item.name }}
            </button>
            <div v-if="isLoadingMachine" :class="[
              item.uuid === unit_active ? 'flex' : 'hidden',
              'w-full justify-center py-6',
            ]">
              <p class="text-base font-bold text-neutral-950">Loading...</p>
            </div>
            <div class="button-group-gt" :class="{ 'children-active': item.uuid === unit_active }">
              <button v-if="!isLoadingMachine" v-for="(element, index) in dataMachine?.data" :key="index"
                class="button-gt" @click="toScope(item, element)">
                {{ element.name }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="sass">
.button-active
  @apply bg-cyan-500 #{!important}

.children-active
  @apply max-h-full opacity-100 pointer-events-auto mt-4 #{!important}

.container-unit
  @apply pt-[90px] pl-4
  .content-unit
    @apply p-10
    .wrapper-button-unit
      @apply flex flex-col gap-4
      .button-group
        @apply flex flex-col
        .button-unit
          @apply bg-buttonGray w-[200px] py-2 text-center text-sm text-neutral-50 font-bold cursor-pointer
          clip-path: polygon(90% 0, 100% 50%, 90% 100%, 0 100%, 0 0)
          &:hover
            @apply bg-cyan-500
        .button-group-gt
          @apply grid grid-cols-4 gap-y-4 gap-x-0 ml-[200px] max-h-0 opacity-0 pointer-events-none duration-300 transition-all
          .button-gt
            @apply bg-buttonGray w-full py-2 text-center text-sm text-neutral-50 font-bold cursor-pointer mr-[-30px]
            clip-path: polygon(5% 0, 100% 0, 95% 100%, 0% 100%)
            &:hover
              @apply bg-cyan-500
</style>
