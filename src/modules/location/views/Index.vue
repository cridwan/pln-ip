<script setup lang="ts">
import { ref, onMounted, reactive, watch } from "vue";
import { useRouter } from "vue-router";
import type { AxiosError } from "axios";

import { useInfiniteQuery, useQuery } from "@tanstack/vue-query";
import { colorMarker } from "@/constants";
import type { IPagination, IParams } from "@/types/GlobalType";
import { useMasterStore } from "@/modules/master/stores/MasterStore";
import type { LocationInterface } from "@/modules/master/types/LocationType";
import { Select } from "@/components";

type OptionType = {
  value: string;
  label: string;
};
type TSeries = {
  name: string;
  lat: number;
  lon: number;
  color: string;
  uuid: string;
};
const model = ref<{ location_uuid: string }>({
  location_uuid: "",
});
const is_loading_location = ref<boolean>(false);
const options_location = ref<OptionType[]>([]);
const router = useRouter();
const masterStore = useMasterStore();
const params = reactive<IParams>({
  search: "",
  filter: "",
  currentPage: 1,
  perPage: 1000,
});

const dataLocation = ref<TSeries[]>([]);

//--- GET LOCATION
useQuery({
  queryKey: ["getLocation"],
  queryFn: async () => {
    try {
      const { data } = await masterStore.getLocation(params);
      const response = data.data as IPagination<LocationInterface[]>;

      const arr_location = response.data.map((item) => ({
        name: item.name,
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
        color: item.color,
        uuid: item.uuid,
      }));

      dataLocation.value = arr_location;
      return arr_location;
    } catch (error: any) {
      const err = error as AxiosError;
      throw err.response;
    }
  },
  refetchOnWindowFocus: false,
});
//--- END


// select location
const params_location = reactive<IParams>({
  search: "",
  filters: "",
  currentPage: 1,
  perPage: 10,
});
const {
  data: dataLocationSelect,
  refetch: refetchLocationSelect,
  fetchNextPage: fetchNextPageLocationSelect,
  hasNextPage: hasNextPageLocationSelect,
  isFetchingNextPage: isFetchingNextPageLocationSelect,
} = useInfiniteQuery({
  queryKey: ["getLocationSelect"],
  queryFn: async ({ pageParam = 1 }) => {
    try {
      const { data } = await masterStore.getLocation({
        ...params_location,
        currentPage: pageParam,
      });

      const response = data.data as IPagination<LocationInterface[]>;
      console.log(response)
      return response;
    } catch (error: any) {
      throw error.response;
    } finally {
      is_loading_location.value = false;
    }
  },
  refetchOnWindowFocus: false,
  getNextPageParam: (lastPage) => {
    if (!lastPage?.data?.length) return undefined;
    return lastPage.current_page + 1;
  },
  initialPageParam: 1,
});

const timeout_location = ref(0);
const searchLocation = () => {
  clearTimeout(timeout_location.value);
  timeout_location.value = window.setTimeout(() => {
    is_loading_location.value = true;
    params_location.currentPage = 1;
    refetchLocationSelect();
  }, 1000);
};
const scrollLocation = (e: Event) => {
  const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLElement;
  if (
    scrollTop + clientHeight >= scrollHeight - 1 &&
    hasNextPageLocationSelect.value &&
    !isFetchingNextPageLocationSelect.value
  ) {
    fetchNextPageLocationSelect();
  }
};

const selectLocation = (item: OptionType) => {
  router.push(`/${item.value}`);
}
// end select location

const chartOptions = ref<Record<string, any>>({
  chart: { map: null },
  legend: { enabled: false },
  title: { text: "" },
  mapNavigation: {
    enabled: true,
    enableDoubleClickZoomTo: true,
    buttonOptions: { alignTo: "spacingBox" },
  },
  colorAxis: {
    min: 0,
    stops: [
      [0, "#37AFE1"],
      [0.5, "#37AFE1"],
      [1, "#37AFE1"],
    ],
  },
  tooltip: {
    enabled: true,
    useHTML: true,
    formatter: function () {
      return this.series.name == "Lokasi"
        ? `<strong>${this.point.name}</strong>`
        : false;
    },
  },
  series: [
    {
      name: "Wilayah",
      enableMouseTracking: false,
      states: { hover: { enable: false } },
      dataLabels: {
        useHTML: true,
        enabled: true,
        format: "<b>{point.name}</b>",
        color: "#000000",
      },
      allAreas: true,
      data: [],
      joinBy: "slug",
    },
    {
      type: "mappoint",
      name: "Lokasi",
      dataLabels: { enabled: false },
      data: [],
      marker: { radius: 6, symbol: "circle" },
      point: {
        events: {
          click: (e) => {
            router.push(`/${e.point?.uuid}`);
          },
        },
      },
    },
  ],
});

watch(dataLocation, (newData) => {
  if (newData.length > 0) {
    chartOptions.value.series[1].data = newData;
  }
});

async function loadMapData() {
  try {
    const mapData = await fetch("/json/indonesia.json").then((res) =>
      res.json()
    );
    chartOptions.value.chart.map = mapData;

    chartOptions.value.series[0].data = mapData.features.map((item: any) => ({
      slug: item.properties.slug,
      color: ["Jawa Barat", "Aceh", "Bali"].includes(item.properties.state)
        ? "#0070c0"
        : "#2AB6C0",
      name: item.properties.state,
    }));
  } catch (error) {
    console.error("Error loading map data:", error);
  }
}

onMounted(() => {
  loadMapData();
});

watch(
  dataLocationSelect,
  (newMachine) => {
    const new_data: OptionType[] =
      newMachine?.pages
        .flatMap((page) => page?.data)
        ?.map((item) => {
          return { value: item.uuid, label: item.name };
        }) || [];

    options_location.value = new_data;
    // }
  },
  { deep: true, immediate: true }
);
</script>

<template>
  <div>
    <div class="map-title">
      <p class="text-center font-extrabold text-lg text-neutral-50">
        UNIT PEMBANGKIT PT PLN INDONESIA POWER
      </p>
    </div>
    <highcharts :constructorType="'mapChart'" class="hc" :options="chartOptions" ref="chart"></highcharts>
    <div class="absolute z-50 pointer-events-none bottom-10 left-10 text-[#2AB6C0] max-w-[400px]">
      <h1 class="text-2xl font-bold my-3 italic">GENERATE SCOPE</h1>
      <p class="text-justify indent-20">
        Aplikasi ini merupakan aplikasi berbasis web yang digunakan untuk
        membuat scope overhoul berdasarkan kondisi asset pembangkit yang
        dilengkapi dengan fitur visualisasi proses pekerjaan dan data penunjang,
        sehingga memudahkan planner untuk memastikan ketepatan durasi dan
        budgeting.
      </p>
    </div>
    <div class="flex gap-4 absolute right-16">
      <div class="flex flex-col items-center" v-for="(maker, i) in colorMarker" :key="i">
        <div class="w-4 h-4 rounded-full border shadow-md" :style="{ backgroundColor: maker.hexColor }" />
        <span class="text-md text-slate-950">{{ maker.title }}</span>
      </div>
    </div>
    <div class="max-w-60 bg-white absolute right-16 top-6">
      <Select v-model="model.location_uuid" label="Pilih Lokasi" options_label="label" options_value="value"
        v-model:model-search="params_location.search" :search="true" :loading="is_loading_location"
        :loading-next-page="isFetchingNextPageLocationSelect" :options="options_location" @scroll="scrollLocation"
        @search="searchLocation" @select="selectLocation" />
    </div>
  </div>
</template>

<style lang="sass">
.hc
  width: 100%
  height: 80vh

.map-title
  @apply w-[600px] py-2 bg-[#2AB6C0] opacity-[0.5] mr-[-22px] absolute z-[1] left-[50%] translate-x-[-50%]
  clip-path: polygon(5% 0, 100% 0, 95% 100%, 0% 100%)
</style>
