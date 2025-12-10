<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
import {
  DialogContent,
  DialogDescription,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  VisuallyHidden,
} from "radix-vue";

import { useGlobalStore } from "@/stores/GlobalStore";
import { Icon, Loading } from "@/components";
import eventBus from "@/utils/eventBus";
import { useQuery } from "@tanstack/vue-query";
import type { SequenceInterface } from "@/modules/master/types/SequenceTypes";
import type { AxiosError } from "axios";
import { useTransactionStore } from "@/modules/transaction/stores/TransactionStore";
import SidebarAddScope from "@/components/layouts/SidebarAddScope.vue";
import GuestSidebar from "@/components/layouts/GuestSidebar.vue";

const videosData = ref<any>({
  main: [],
  ci: [],
  mi: [],
  ti: [],
});

const videos: any = computed(() => {
  return videosData.value.main;
});

const videoSrc = ref<string | null>(null);

const loadVideo = async () => {
  // if (videos.value[currentVideoIndex.value]) {
  //   videoSrc.value = (
  //     await videos.value[currentVideoIndex.value].video()
  //   ).default;
  //   preloadVideo(videoSrc.value as string);
  // }
  const item = videos.value[currentVideoIndex.value];

  console.log("ITEM", item);
  if (!item) return;

  videoSrc.value = item.video;
  preloadVideo(videoSrc.value as string);
};

const transactionStore = useTransactionStore();
const router = useRouter();
const route = useRoute();
const globalStore = useGlobalStore();
const {
  titleHeader,
  disabledBack,
  disabledNext,
  isFinish,
  isAddScope,
  isStepNavigation,
} = storeToRefs(globalStore);

//--- GET SEQUENCE
const params = reactive({
  search: "",
  filter: {
    inspectionType: route.params.id_inspection,
  },
  filters: [],
  currentPage: 1,
  perPage: 10,
});
const {
  data: dataSequence,
  isFetching: isLoadingSequence,
  refetch: refetchSequence,
} = useQuery({
  queryKey: ["getSequenceGuest"],
  queryFn: async () => {
    try {
      const { data } = await transactionStore.getSequences(params);
      console.log("DATA", data);
      const response = data.data as SequenceInterface;

      console.log("AAAAA", response);
      return response;
    } catch (error: any) {
      const err = error as AxiosError;
      throw err.response;
    }
  },
  refetchOnWindowFocus: false,
});
//--- END

const currentVideoIndex = ref(0);
const videoRef = ref<HTMLVideoElement | null>(null);
const isButtonVisible = ref(false);
const openStep = ref(false);
const isReversing = ref(false);
let reverseInterval: number | null = null;
const is_loading = ref(false);

const videoState = ref({
  isTransitioning: false,
});

async function preloadVideo(url: string): Promise<void> {
  is_loading.value = true;
  try {
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(`Gagal mengambil video: ${response.statusText}`);

    const blob = await response.blob();
    const videoUrl = URL.createObjectURL(blob);

    const videoElement = document.getElementById("video") as HTMLVideoElement;
    videoElement.src = videoUrl;

    videoElement.onloadeddata = () => {
      is_loading.value = false;
    };
  } catch (error) {
    console.error(error);
    is_loading.value = false;
  }
}

const handleVideoEnd = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const videoParam = urlParams.get("video") || "1";
  const toParam = urlParams.get("to");

  if (toParam) {
    if (currentVideoIndex.value < parseInt(toParam) - 1) {
      isButtonVisible.value = true;
      disabledNext.value = false;
      disabledBack.value = false;
      setTimeout(() => {
        const nextVideo = currentVideoIndex.value + 1;
        currentVideoIndex.value = nextVideo;
        isButtonVisible.value = false;
        disabledNext.value = true;
        disabledBack.value = true;

        const url = new URL(window.location.href);
        url.search = `?video=${parseInt(videoParam) + 1}&to=${toParam}`;
        window.history.replaceState({}, "", url);
      }, 500);
    } else if (currentVideoIndex.value > parseInt(toParam) - 1) {
      isButtonVisible.value = true;
      disabledNext.value = false;
      disabledBack.value = false;
      setTimeout(() => {
        isButtonVisible.value = false;
        disabledNext.value = true;
        disabledBack.value = true;
        if (videoRef.value) {
          reverseInterval = setInterval(reverseVideo, 100);
        }
      }, 500);
    } else if (currentVideoIndex.value === parseInt(toParam) - 1) {
      isButtonVisible.value = true;
      disabledNext.value = false;
      disabledBack.value = false;

      const { to, video, ...updatedQuery } = route.query;
      router.replace({
        path: route.path,
        query: { video: currentVideoIndex.value + 1, ...updatedQuery },
      });
    }
  } else {
    isButtonVisible.value = true;
    disabledNext.value = false;
    disabledBack.value = false;
  }
};

const index_temp = ref<number>(0);
const is_start_at_end = ref<boolean>(false);

const initializeVideo = async () => {
  videoState.value.isTransitioning = true;
  isButtonVisible.value = false;
  disabledNext.value = true;
  disabledBack.value = true;

  if (videoRef.value) {
    videoRef.value.pause();
  }

  currentVideoIndex.value = index_temp.value;

  await loadVideo();
  preloadVideo(videoSrc.value as string);
};

watch(is_loading, async (value) => {
  if (!value) {
    isFinish.value = index_temp.value === videos.value.length - 1;
    isAddScope.value = false;

    await new Promise<void>((resolve) => {
      if (videoRef.value) {
        videoRef.value.onloadedmetadata = null;

        videoRef.value.onloadedmetadata = () => {
          if (is_start_at_end.value && videoRef.value) {
            videoRef.value.currentTime = videoRef.value.duration - 0.1;
            isButtonVisible.value = true;
            disabledNext.value = false;
            disabledBack.value = false;
          } else {
            videoRef.value?.play();
          }

          resolve();
        };

        if (videoRef.value.readyState >= 1) {
          console.log("Force metadata ready");
          videoRef.value.dispatchEvent(new Event("loadedmetadata"));
        }
      } else {
        console.error("videoRef belum terinisialisasi!");
        resolve();
      }
    });

    videoState.value.isTransitioning = false;
  }
});

const updateURLParameter = (index: number, startAtEnd = false) => {
  const url = new URL(window.location.href);
  url.searchParams.set("video", (index + 1).toString());
  if (startAtEnd) {
    url.searchParams.set("start", "end");
  } else {
    url.searchParams.delete("start");
  }
  window.history.replaceState({}, "", url);
};

const reverseVideo = () => {
  if (!videoRef.value || videoRef.value.currentTime <= 0) {
    if (reverseInterval) {
      clearInterval(reverseInterval);
      reverseInterval = null;
    }
    isReversing.value = false;

    const prevIndex = currentVideoIndex.value - 1;

    if (prevIndex < 0) {
      router.push(
        `/${route.params.id}/create/unit/${route.params.id_unit}/ci/scope`
      );
      return;
    }

    index_temp.value = prevIndex;
    is_start_at_end.value = true;
    updateURLParameter(prevIndex, true);
    initializeVideo();
    return;
  }

  videoRef.value.currentTime = Math.max(0, videoRef.value.currentTime - 0.1);
};

const handleBack = async () => {
  if (videoState.value.isTransitioning) return;

  isReversing.value = true;
  videoState.value.isTransitioning = true;
  isButtonVisible.value = false;
  disabledNext.value = true;
  disabledBack.value = true;

  if (videoRef.value) {
    reverseInterval = setInterval(reverseVideo, 100);
  }
};

const handleNext = async () => {
  if (
    videoState.value.isTransitioning ||
    currentVideoIndex.value >= videos.value.length - 1
  )
    return;

  const nextIndex = currentVideoIndex.value + 1;
  index_temp.value = nextIndex;
  is_start_at_end.value = false;
  updateURLParameter(nextIndex);
  await initializeVideo();
};

const handleJumpStep = async (index: number) => {
  const nextIndex = index - 1;
  index_temp.value = nextIndex;
  is_start_at_end.value = false;
  updateURLParameter(nextIndex);
  await initializeVideo();
  openStep.value = false;

  // if (videoRef.value) {
  //   if (videoRef.value.currentTime === videoRef.value.duration) {
  //     const urlParams = new URLSearchParams(window.location.search);
  //     const videoParam = urlParams.get("video") || "1";
  //     const video = parseInt(videoParam, 10);

  //     if (index === video) {
  //       return;
  //     }

  //     const { path } = route;

  //     disabledNext.value = true;
  //     disabledBack.value = true;
  //     isButtonVisible.value = false;

  //     if (index > video) {
  //       const updatedQuery = { video: video + 1, to: index };
  //       router.push({ path, query: updatedQuery });
  //       const nextIndex = currentVideoIndex.value + 1;
  //       currentVideoIndex.value = nextIndex;
  //       index_temp.value = nextIndex;
  //       is_start_at_end.value = false;
  //       await initializeVideo();
  //     } else {
  //       const updatedQuery = { video: video, to: index };
  //       router.push({ path, query: updatedQuery });
  //       if (videoRef.value) {
  //         reverseInterval = setInterval(reverseVideo, 100);
  //       }
  //     }

  //     openStep.value = false;
  //   }
  // }
};

const handleStepNavigation = () => {
  openStep.value = true;
};

const handleCloseStep = () => {
  openStep.value = false;
};

watch(openStep, (value) => {
  if (value) {
    isStepNavigation.value = false;
  } else {
    isStepNavigation.value = true;
  }
});

watch(dataSequence, (val) => {
  if (!val) return;

  videosData.value.main = [
    {
      id: 1,
      video:
        import.meta.env.VITE_API_BASE_URL.replace("api", "") +
        val.document?.document_link,
      name: val.document?.document_name,
      top: 235,
      left: 545,
    },
  ];
});

watch(
  () => videos.value,
  (val) => {
    if (val && val.length > 0) {
      initializeFromURL();
    }
  },
  { immediate: false }
);

const initializeFromURL = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const videoParam = urlParams.get("video") || "1";
  const startParam = urlParams.get("start");
  const index = Math.max(
    0,
    Math.min(parseInt(videoParam, 10) - 1, videos.value.length - 1)
  );

  index_temp.value = index;
  is_start_at_end.value = startParam === "end";
  await initializeVideo();
};

onMounted(() => {
  titleHeader.value =
    route.params.menu === "ci"
      ? "Combustion Inspection"
      : route.params.menu === "ti"
      ? "Turbine Inspection"
      : route.params.menu === "mi"
      ? "Major Inspection"
      : "";

  disabledNext.value = true;
  disabledBack.value = true;
  isStepNavigation.value = true;

  window.addEventListener("popstate", initializeFromURL);
  eventBus.on("next", handleNext);
  eventBus.on("back", handleBack);
  eventBus.on("stepNavigation", handleStepNavigation);

  // initializeFromURL();
});

onUnmounted(() => {
  window.removeEventListener("popstate", initializeFromURL);
  eventBus.off("next", handleNext);
  eventBus.off("back", handleBack);
  eventBus.on("stepNavigation", handleStepNavigation);
  if (reverseInterval) {
    clearInterval(reverseInterval);
    reverseInterval = null;
  }
});
</script>

<template>
  <div class="scope-container">
    <div>
      <GuestSidebar />
    </div>
    <div
      v-if="isLoadingSequence"
      class="z-[100000000000] fixed top-0 right-0 bottom-0 left-0 bg-neutral-900 bg-opacity-50 flex justify-center items-center"
    >
      <Loading width="50" height="50" />
    </div>
    <div class="scope-video-container">
      <video
        id="video"
        ref="videoRef"
        preload="auto"
        muted
        playsinline
        class="scope-video"
        @ended="handleVideoEnd"
      ></video>
      <div v-for="(item, key) in videos" :key="key">
        <div
          v-if="
            isButtonVisible && currentVideoIndex === key && item.name !== ''
          "
          class="absolute"
          :style="{ top: `${item.top}px`, left: `${item.left}px` }"
        >
          <button class="button-part">
            {{ item.name }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <DialogRoot v-model:open="openStep">
    <DialogPortal>
      <DialogContent
        class="v-drawer-content"
        @interact-outside="() => (openStep = false)"
      >
        <VisuallyHidden>
          <DialogTitle />
          <DialogDescription />
        </VisuallyHidden>
        <div class="p-4">
          <div class="flex justify-start">
            <Icon
              name="double-arrow-right"
              class="text-[24px] text-neutral-50 cursor-pointer hover:text-cyan-500"
              @click="handleCloseStep"
            />
          </div>
          <p class="mt-6 text-2xl text-neutral-50 font-bold">
            Inspection Sequences:
          </p>
          <ul
            v-if="route.params.menu === 'ci'"
            class="mt-2 max-h-[calc(100vh-220px)] overflow-y-auto"
          >
            <p class="text-neutral-50 text-lg font-bold mt-1">Disassembly</p>
            <li
              v-for="(item, key) in videos.slice(0, 14)"
              :key="item.id"
              class="list-disc list-inside mt-1"
              :class="{ hidden: item.name === '' }"
              @click="handleJumpStep(item.id + 1)"
            >
              <a class="text-neutral-50 hover:text-cyan-500 cursor-pointer">
                {{ item.name }}
              </a>
            </li>

            <p class="text-neutral-50 text-lg font-bold mt-2">Assembly</p>
            <li
              v-for="(item, key) in videos.slice(15, 27)"
              :key="item.id"
              class="list-disc list-inside mt-1"
              :class="{ hidden: item.name === '' }"
              @click="handleJumpStep(item.id + 1)"
            >
              <a class="text-neutral-50 hover:text-cyan-500 cursor-pointer">
                {{ item.name }}
              </a>
            </li>
          </ul>
          <ul v-else class="mt-2 max-h-[calc(100vh-220px)] overflow-y-auto">
            <li
              v-for="(item, key) in videos"
              :key="item.id"
              class="list-disc list-inside mt-1"
              :class="{ hidden: item.name === '' }"
              @click="handleJumpStep(item.id + 1)"
            >
              <a class="text-neutral-50 hover:text-cyan-500 cursor-pointer">
                {{ item.name }}
              </a>
            </li>
          </ul>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style lang="sass" scoped>
.wrapper-bid
  @apply absolute top-[120px] left-10 z-[100]

.button-part
  @apply py-2 px-6 rounded bg-cyan-500 text-base text-neutral-50 shadow-lg shadow-neutral-700 hover:bg-yellow-500
</style>
