<script setup lang="ts">
import ProjectComponen from "@/components/monitoring/ProjectComponen.vue";
import { useInspectionStore } from "@/modules/inspection/stores/InspectionStore";
import type { ResponseProject } from "@/modules/inspection/types/InspectionType";
import type { ProjectCardInterface } from "@/types/GlobalType";
import { useQuery } from "@tanstack/vue-query";
import { ref } from "vue";

const scopeStore = useInspectionStore();
const entitiesProject = ref<ProjectCardInterface[]>([]);

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
          createdBy: item.generate_by?.user?.name || "",
          dateCreated: item.created_at,
          status: item.status == "pending" ? "Pending" : "Completed",
        };
      });

      return response;
    } catch (error: any) {
      console.log(error);
    }
  },
  refetchOnWindowFocus: false,
});
</script>

<template>
  <h1 class="text-blue-950 mb-10">Monitoring Project</h1>
  <div class="flex gap-4 w-full justify-evenly flex-wrap">
    <ProjectComponen
      v-for="project in entitiesProject"
      :key="project.name"
      :project="project"
      v-if="entitiesProject.length > 0"
    />
    <span v-else class="text-blue-950">Data tidak ditemukan</span>
  </div>
</template>
