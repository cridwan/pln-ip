import type { StorageLike } from "pinia-plugin-persistedstate";
import { defineStore } from "pinia";
import { ref } from "vue";
import { encryptStorage } from "@/utils/storage";
import type { ResponseProject } from "@/modules/inspection/types/InspectionType";

export const useProjectStore = defineStore(
    "project",
    () => {
        const projects = ref<ResponseProject | null>(null);

        function setProject(project: ResponseProject) {
            projects.value = project
        }

        function clearProject() {
            projects.value = null;
        }
        return {
            projects,
            setProject,
            clearProject,
        };
    },
    {
        persist: {
            storage: encryptStorage as StorageLike,
            pick: ["projects"],
        },
    }
);
