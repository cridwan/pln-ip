<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import { convertToKebabCase } from "@/helpers/global";

import Section1 from "/videos/add-scope/1-exhaust.mp4";
import Section2 from "/videos/add-scope/2-turbine.mp4";
import Section3 from "/videos/add-scope/3-combustion.mp4";
import Section4 from "/videos/add-scope/4-compressor.mp4";
import Section5 from "/videos/add-scope/5-inlet.mp4";
import Section6 from "/videos/add-scope/6-generator.mp4";

const videos = [Section1, Section2, Section3, Section4, Section5, Section6];
const section = [
  "Exhaust Section",
  "Turbine Section",
  "Combustion Section",
  "Compressor Section",
  "Inlet Section",
  "Generator Section",
];

const router = useRouter();
const route = useRoute();

const currentVideoIndex = ref(0);
const videoRef = ref<HTMLVideoElement | null>(null);
const isVideoEnded = ref(false);
const isRewinding = ref(false);
let rewindInterval: ReturnType<typeof setInterval> | null = null;

const handleFirstVideoLoad = () => {
  if (currentVideoIndex.value === 0 && videoRef.value) {
    videoRef.value.pause();
  }
};

const handleVideoEnd = () => {
  isVideoEnded.value = true;
  if (isRewinding.value) {
    isRewinding.value = false;
    videoRef.value?.pause();
  }
};

const handleMouseOver = async (section: number) => {
  if (rewindInterval) {
    clearInterval(rewindInterval);
  }

  if (currentVideoIndex.value !== section) {
    currentVideoIndex.value = section;

    if (videoRef.value) {
      try {
        videoRef.value.src = videos[currentVideoIndex.value];
        await videoRef.value.load();

        if (videoRef.value.readyState >= 3) {
          await videoRef.value.play();
        } else {
          videoRef.value.addEventListener(
            "canplay",
            async () => {
              await videoRef.value?.play();
            },
            { once: true }
          );
        }
      } catch (err) {
        console.error("Error playing video:", err);
      }
    }
  } else {
    if (videoRef.value) {
      await videoRef.value.play();
    }
  }

  isRewinding.value = false;
};

const handleMouseLeave = () => {
  if (videoRef.value) {
    isRewinding.value = true;
    rewindInterval = setInterval(() => {
      if (videoRef.value) {
        videoRef.value.currentTime -= 0.1;
        if (videoRef.value.currentTime <= 0) {
          clearInterval(rewindInterval || undefined);
          videoRef.value.pause();
        }
      }
    }, 30);
  }
};

const toSection = (name: string) => {
  router.push(
    `/${route.params.id}/create/unit/${route.params?.id_unit}/${
      route.params?.id_machine
    }/${route?.params?.menu}/${route?.params?.id_project}/${
      route?.params?.id_inspection
    }/add-scope-squences/${convertToKebabCase(name)}`
  );
};
</script>

<template>
  <div class="fixed top-0 right-0 bottom-0 left-0 z-[1] bg-white">
    <div class="scope-container">
      <div class="scope-video-container">
        <video
          ref="videoRef"
          :src="videos[currentVideoIndex]"
          class="scope-video"
          @loadedmetadata="handleFirstVideoLoad"
          @ended="handleVideoEnd"
          autoplay
          muted
          playsinline
        ></video>
        <div class="add-scope-ci">
          <button
            v-for="(item, key) in section"
            :key="key"
            @mouseover="handleMouseOver(key)"
            @mouseleave="handleMouseLeave"
            @click="toSection(item)"
          >
            {{ item }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="sass">
.add-scope-ci
  @apply absolute z-[11] top-[285px] left-[450px] flex
  > button
    @apply px-6 py-2 bg-buttonGray w-[210px] mr-[-22px] h-[inherit] text-base text-neutral-50
    clip-path: polygon(13% 0, 100% 0, 87% 100%, 0% 100%)
    &:hover
      @apply bg-cyan-500
</style>
