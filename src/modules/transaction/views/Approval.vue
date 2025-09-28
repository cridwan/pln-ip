<script setup lang="ts">
import { useRoute } from "vue-router";

import { Button, Toast } from "@/components";
import { useMutation, useQuery } from "@tanstack/vue-query";

import { useTransactionStore } from "../stores/TransactionStore";
import type { ProjectInterface } from "../types/ProjectType";
import FormApproval from "../components/FormApproval.vue";
import { ref } from "vue";

const transactionStore = useTransactionStore();
const toastRef = ref<InstanceType<typeof Toast> | null>(null);
const route = useRoute();
const open_form = ref<boolean>(false)

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
      route.params.id_project as string, {}
    );
  },
  onSuccess: () => {
    refetchProject();
  },
  retry: 0,
});

const handleApprove = () => {
  if (dataProject.value?.status == 'pending') {
    approveProject();
  } else {
    open_form.value = true
  }
};


const handleSuccess = () => {
  toastRef.value?.showToast({
    title: "Success",
    description: "Saved successfully",
    type: "success",
  });
  refetchProject();
  open_form.value = false
};

const handleError = (error: any) => {
  toastRef.value?.showToast({
    title: "Error",
    description: error?.response?.data?.message || "Something went wrong",
    type: "error",
  });
};
</script>

<template>
  <div class="w-full flex items-center justify-center bg-white p-4 shadow-md rounded-sm">
    <div class="flex flex-col items-center gap-3">
      <h1 class="text-blue-950 font-semibold">Approve Project</h1>
      <p class="text-blue-950 tracking-wide font-normal text-lg text-center">
        Silahkan tekan button dibawah ini untuk melakukan approve/unapprove
      </p>
      <div class="w-full">
        <table class="table">
          <tbody>
            <tr>
              <td class="font-bold">Nama Project</td>
              <td>:</td>
              <td>{{ dataProject?.name }}</td>
            </tr>
            <tr>
              <td class="font-bold">Jenis Inspeksi</td>
              <td>:</td>
              <td>{{ dataProject?.inspection_type?.name ?? '-' }}</td>
            </tr>
            <tr>
              <td class="font-bold">Status</td>
              <td>:</td>
              <td>{{ dataProject?.status == 'pending' && dataProject.unapproved_at != null ? 'UNAPPROVED' :
                dataProject?.status?.toUpperCase() }}</td>
            </tr>
            <tr>
              <td class="font-bold">Approved At</td>
              <td>:</td>
              <td>{{ dataProject?.approved_at }}</td>
            </tr>
            <tr>
              <td class="font-bold">UnApproved At</td>
              <td>:</td>
              <td>{{ dataProject?.unapproved_at }}</td>
            </tr>
            <tr>
              <td class="font-bold">Approve By</td>
              <td>:</td>
              <td>{{ dataProject?.approved_by_user?.name ?? '-' }}</td>
            </tr>
            <tr>
              <td class="font-bold">Reason</td>
              <td>:</td>
              <td>{{ dataProject?.reason ?? '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Button :text="dataProject?.status == 'pending'
        ? 'Approve'
        : 'UnApprove'
        " variant="primary" :color="dataProject?.status == 'pending' ? 'blue' : 'green'" size="lg"
        icon_before="check-list" type="button" @click="handleApprove" :loading="isLoadingProject || isLoadingApprove" />
    </div>
  </div>
  <Toast ref="toastRef" />
  <FormApproval v-model="open_form" @success="handleSuccess" @error="handleError" />
</template>
<style lang="sass">
.table 
    @apply w-full text-blue-950
</style>