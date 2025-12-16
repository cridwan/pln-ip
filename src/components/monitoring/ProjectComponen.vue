<template>
  <div
    :class="[
      'project-card',
      'bg-white',
      'rounded-xl',
      'shadow-lg',
      'p-6',
      'max-w-sm',
      'w-full',
      'relative',
      'overflow-hidden',
      'transform',
      'hover:scale-[1.02]',
      'transition',
      'duration-300',
      'ease-in-out',
      statusBorderClass, // Border kiri yang sesuai status
    ]"
  >
    <div
      :class="[
        'absolute',
        'top-4',
        'right-4',
        'w-3',
        'h-3',
        'rounded-full',
        'ring-2',
        'ring-white',
        statusBgClass,
      ]"
      aria-label="Status indicator"
    ></div>

    <div class="card-content">
      <h3
        class="text-xl font-bold text-blue-950 mb-4 border-b pb-3 border-blue-50"
      >
        {{ project.name }}
      </h3>

      <div class="space-y-3">
        <div class="flex justify-between items-center text-sm">
          <span class="font-medium text-gray-500">Status:</span>
          <span
            :class="[
              'font-semibold',
              statusTextColorClass,
              'px-2',
              'py-0.5',
              'rounded-full',
              'bg-opacity-10',
              statusBgClass,
            ]"
          >
            {{ project.status }}
          </span>
        </div>

        <div
          class="flex justify-between items-center text-sm border-t pt-3 border-gray-100"
        >
          <span class="font-medium text-gray-500">Dibuat oleh:</span>
          <span class="font-semibold text-gray-700">{{
            project.createdBy
          }}</span>
        </div>

        <div class="flex justify-between items-center text-sm">
          <span class="font-medium text-gray-500">Tanggal dibuat:</span>
          <span class="font-semibold text-gray-700">{{ formattedDate }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProjectCardInterface } from "@/types/GlobalType";
import { computed, type PropType } from "vue";

const props = defineProps({
  project: {
    type: Object as PropType<ProjectCardInterface>,
    required: true,
  },
});

console.log("project", props.project);

// Menghitung format tanggal
const formattedDate = computed(() => {
  try {
    return new Date(props.project.dateCreated).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (e) {
    return props.project.dateCreated;
  }
});

// Fungsi untuk mendapatkan kelas status
const getStatusClasses = (status) => {
  const s = status.toLowerCase().replace(/\s/g, "");
  if (s.includes("completed")) {
    return {
      bg: "bg-green-500",
      text: "text-green-700",
      border: "border-l-4 border-green-500",
    };
  }
  if (s.includes("inprogress")) {
    return {
      bg: "bg-blue-600",
      text: "text-blue-700",
      border: "border-l-4 border-blue-600",
    };
  }
  if (s.includes("pending")) {
    return {
      bg: "bg-yellow-500",
      text: "text-yellow-700",
      border: "border-l-4 border-yellow-500",
    };
  }
  if (s.includes("cancelled")) {
    return {
      bg: "bg-red-500",
      text: "text-red-700",
      border: "border-l-4 border-red-500",
    };
  }
  // Default untuk status tidak dikenal
  return {
    bg: "bg-gray-500",
    text: "text-gray-700",
    border: "border-l-4 border-gray-500",
  };
};

// Kelas yang dihitung untuk styling status
const statusClasses = computed(() => getStatusClasses(props.project.status));
const statusBgClass = computed(() => statusClasses.value.bg);
const statusTextColorClass = computed(() => statusClasses.value.text);
const statusBorderClass = computed(() => statusClasses.value.border);
</script>

<style scoped>
/* Anda dapat menambahkan gaya kustom di sini jika diperlukan, 
   tetapi sebagian besar styling sudah ditangani oleh Tailwind. */
.project-card {
  /* Mengatasi shadow pada transform */
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
</style>
