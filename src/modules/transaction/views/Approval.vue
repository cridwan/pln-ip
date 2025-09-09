<script setup lang="ts">
import { useRoute } from "vue-router";

import { Button } from "@/components";
import { useMutation, useQuery } from "@tanstack/vue-query";

import { useTransactionStore } from "../stores/TransactionStore";
import type { ProjectInterface } from "../types/ProjectType";

const transactionStore = useTransactionStore();
const route = useRoute();

const {
  data: dataProject,
  isFetching: isLoadingProject,
  refetch: refetchProject,
} = useQuery({
  queryKey: ["getProjectTransaction"],
  queryFn: async () => {
    const { data } = await transactionStore.getProject(
      route.params.id_project as string
    );
    const response = data.data.data as ProjectInterface;

    return response;
  },
  retry: 0,
  refetchOnWindowFocus: false,
});

const { isPending: isLoadingApprove, mutate: approveProject } = useMutation({
  mutationKey: ["approveProjectTransaction"],
  mutationFn: async () => {
    return await transactionStore.approveProject(
      route.params.id_project as string
    );
  },
  onSuccess: () => {
    refetchProject();
  },
  retry: 0,
});

const handleApprove = () => {
  approveProject();
};
</script>

<template>
  <div
    class="w-full flex items-center justify-center bg-white p-4 shadow-md rounded-sm"
  >
    <div class="flex flex-col items-center gap-3">
      <h1 class="text-blue-950 font-semibold">Approve Project</h1>
      <p class="text-blue-950 tracking-wide font-normal text-lg">
        Silahkan tekan button dibawah ini untuk melakukan approve untuk project
        <span class="font-bold">{{ dataProject?.name }}</span>
      </p>

      <Button
        :text="
          dataProject?.status == 'pending'
            ? 'Approve'
            : 'Project sudah di approve'
        "
        variant="primary"
        color="blue"
        size="lg"
        icon_before="check-list"
        type="button"
        @click="handleApprove"
        :loading="isLoadingProject || isLoadingApprove"
        :disabled="dataProject?.status == 'approve'"
      />
    </div>
  </div>
</template>
