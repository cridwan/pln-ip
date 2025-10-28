<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { AxiosError } from "axios";

import { Button, Select, Toast } from "@/components";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/vue-query";
import type { IPagination, IParams } from "@/types/GlobalType";
import { useMasterStore } from "@/modules/master/stores/MasterStore";
import type { UserInterface } from "@/modules/master/types/UserType";
import { helpers, required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

import { useTransactionStore } from "../stores/TransactionStore";
import FormApproval from "../components/FormApproval.vue";
import type { ProjectInterface } from "../types/ProjectType";
import type { FormRequestApprovalInterface } from "../types/ApprovalType";

type OptionType = {
  value: number;
  label: string;
};
const v$_form = reactive(useVuelidate());
const transactionStore = useTransactionStore();
const toastRef = ref<InstanceType<typeof Toast> | null>(null);
const route = useRoute();
const open_form = ref<boolean>(false);
const is_loading_users = ref<boolean>(false);
const options_users = ref<OptionType[]>([]);
const masterStore = useMasterStore();
const model = ref<{ user_id: string }>({
  user_id: "",
});

const rules = computed(() => {
  return {
    user_id: {
      required: helpers.withMessage(`This field is required`, required),
    },
  };
});

const { data: dataProject, refetch: refetchProject } = useQuery({
  queryKey: ["getProjectTransactionAtApproval"],
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
// request approve project
const { isPending: isLoadingRequest, mutate: approveRequestProject } =
  useMutation({
    mutationFn: async (payload: FormRequestApprovalInterface) => {
      return await transactionStore.requestApproveProject(
        route.params.id_project as string,
        payload
      );
    },
    onSuccess: () => {
      toastRef.value?.showToast({
        title: "Success",
        description: "Request approval berhasil dikirim",
        type: "success",
      });
      model.value = {
        user_id: "",
      };
      setTimeout(() => {
        v$_form.value.$reset();
      }, 1);
      refetchProject();
    },
    onError: (err) => {
      let message = "Something went wrong";

      if (err instanceof AxiosError) {
        message = err.response?.data?.message || message;
      }

      toastRef.value?.showToast({
        title: "Terjadi Kesalahan",
        description: message,
        type: "error",
      });
      refetchProject();
    },
    retry: 0,
  });

//--- GET USER
const params_users = reactive<IParams>({
  search: "",
  filters: [
    {
      group: "AND",
      operator: "EQ",
      column: "roles.name",
      value: "approval",
    },
  ],
  currentPage: 1,
  perPage: 10,
});
const {
  data: dataUser,
  refetch: refetchUser,
  fetchNextPage: fetchNextPageUser,
  hasNextPage: hasNextPageUser,
  isFetchingNextPage: isFetchingNextPageUser,
} = useInfiniteQuery({
  queryKey: ["getBidangScopeRequestApproval"],
  queryFn: async ({ pageParam = 1 }) => {
    try {
      const { data } = await masterStore.getUser({
        ...params_users,
        currentPage: pageParam,
      });

      const response = data.data as IPagination<UserInterface[]>;

      return response;
    } catch (error: any) {
      throw error.response;
    } finally {
      is_loading_users.value = false;
    }
  },
  refetchOnWindowFocus: false,
  getNextPageParam: (lastPage) => {
    if (!lastPage?.data?.length) return undefined;
    return lastPage.current_page + 1;
  },
  initialPageParam: 1,
});

const timeout_users = ref(0);
const searchUser = () => {
  clearTimeout(timeout_users.value);
  timeout_users.value = window.setTimeout(() => {
    is_loading_users.value = true;
    params_users.currentPage = 1;
    refetchUser();
  }, 1000);
};
const scrollUser = (e: Event) => {
  const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLElement;
  if (
    scrollTop + clientHeight >= scrollHeight - 1 &&
    hasNextPageUser.value &&
    !isFetchingNextPageUser.value
  ) {
    fetchNextPageUser();
  }
};
//--- END

const handleRequestApprove = async () => {
  const isValid = await v$_form.value.$validate();

  if (!isValid) return;

  approveRequestProject({
    user_id: model.value.user_id,
    uri: `/${route.params?.id}/create/unit/${route.params?.id_unit}/${route.params?.id_machine}/${route.params.menu}/${route.params.id_project}/${route.params.id_inspection}/scope`,
  });
};

const handleSuccess = () => {
  toastRef.value?.showToast({
    title: "Success",
    description: "Saved successfully",
    type: "success",
  });
  refetchProject();
  open_form.value = false;
};

const handleError = (error: any) => {
  toastRef.value?.showToast({
    title: "Error",
    description: error?.response?.data?.message || "Something went wrong",
    type: "error",
  });
};

watch(
  dataUser,
  (newUser) => {
    const new_data: OptionType[] =
      newUser?.pages
        .flatMap((page) => page?.data)
        ?.map((item) => {
          return { value: item.id, label: item.name };
        }) || [];

    options_users.value = new_data;
  },
  { deep: true, immediate: true }
);
</script>

<template>
  <div
    class="w-full flex items-center justify-center bg-white p-4 shadow-md rounded-sm"
  >
    <div class="flex flex-col items-center gap-3">
      <h1 class="text-blue-950 font-semibold">Request Approve Project</h1>
      <p
        class="text-blue-950 tracking-wide font-normal text-lg text-center"
        v-if="dataProject?.status == 'pending'"
      >
        Silahkan pilih user untuk melakukan request approve project
        {{ dataProject?.name }}
      </p>
      <p
        class="text-blue-950 tracking-wide font-normal text-lg text-center"
        v-else
      >
        Project {{ dataProject?.name }} sudah di approve
      </p>
      <div class="w-full" v-show="dataProject?.status == 'pending'">
        <Select
          label="Pilih user approval"
          options_label="label"
          options_value="value"
          v-model="model.user_id"
          v-model:model-search="params_users.search"
          :search="true"
          :loading="is_loading_users"
          :loading-next-page="isFetchingNextPageUser"
          :rules="rules.user_id"
          :options="options_users"
          @scroll="scrollUser"
          @search="searchUser"
        />
      </div>

      <Button
        v-show="dataProject?.status == 'pending'"
        :text="
          dataProject?.status == 'pending' ? 'Request Approval' : 'Disable'
        "
        :color="dataProject?.status == 'pending' ? 'blue' : 'green'"
        :loading="isLoadingRequest"
        variant="primary"
        size="lg"
        icon_before="check-list"
        type="button"
        @click="handleRequestApprove"
      />
    </div>
  </div>
  <Toast ref="toastRef" />
  <FormApproval
    v-model="open_form"
    @success="handleSuccess"
    @error="handleError"
  />
</template>
<style lang="sass">
.table
  @apply w-full text-blue-950
</style>
