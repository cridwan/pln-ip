<script setup lang="ts">
import { Breadcrumb } from '@/components';
import ProjectComponen from '@/components/monitoring/ProjectComponen.vue';
import { useInspectionStore } from '@/modules/inspection/stores/InspectionStore';
import type { ResponseProject } from '@/modules/inspection/types/InspectionType';
import type { ProjectCardInterface } from '@/types/GlobalType';
import { useQuery } from '@tanstack/vue-query';
import { ref } from 'vue';

import Home0 from "/videos/home/0-homepage.mp4";
import Home1 from "/videos/home/1-homepage.mp4";
import Home2 from "/videos/home/2-homepage.mp4";
const scopeStore = useInspectionStore();
const entitiesProject = ref<ProjectCardInterface[]>([])
const videos = [Home0, Home1, Home2];
const currentVideoIndex = ref<number | null>(null);
const videoRef = ref<HTMLVideoElement | null>(null);
const isVideoEnded = ref(false);
const isRewinding = ref(false);

const handleFirstVideoLoad = () => {
    if (currentVideoIndex.value === null && videoRef.value) {
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

const {
    data: dataProject,
    isFetching: isLoadingProject,
    refetch: refetchProject,
} = useQuery({
    queryKey: ["getMonitoringProjectMaster"],
    queryFn: async () => {
        try {
            const { data } = await scopeStore.getProject({
                search: "",
                filter: "",
            });
            const response = data.data as ResponseProject[];
            entitiesProject.value = response.map(function (item) {
                return {
                    name: item.name,
                    createdBy: 'Tailwind Css',
                    dateCreated: item.created_at,
                    status: item.status == 'pending' ? "Pending" : "Completed"
                }
            })

            return response;
        } catch (error: any) {
            console.log(error);
        }
    },
    refetchOnWindowFocus: false,
});
</script>

<template>
    <div class="scope-container">
        <div class="scope-breadcrumb">
            <Breadcrumb :items="[]" />
        </div>
        <div class="mt-24 px-4">
            <video ref="videoRef" :src="videos[currentVideoIndex === null ? 0 : currentVideoIndex]" class="scope-video"
                @loadedmetadata="handleFirstVideoLoad" @ended="handleVideoEnd" autoplay muted playsinline></video>
            <div class="scope-button-home">
                <div class="relative  w-full">
                    <h1 class="text-blue-950 mb-10 z-30">Monitoring Project</h1>
                </div>
                <div class="flex gap-4 w-full justify-evenly flex-wrap relative">
                    <ProjectComponen v-for="project in entitiesProject" :key="project.name" :project="project"
                        v-if="entitiesProject.length > 0" />
                    <span v-else class="absolute text-blue-950">Data tidak ditemukan</span>
                </div>
            </div>
        </div>
    </div>
</template>