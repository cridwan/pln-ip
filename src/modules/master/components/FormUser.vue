<script setup lang="ts">
import { reactive, ref, computed, type PropType, watch } from "vue";

import { Button, Input, Modal, Select } from "@/components";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useInfiniteQuery, useMutation } from "@tanstack/vue-query";
import { all_characters, email, mergeArrays } from "@/helpers/global";
import type { IPagination, IParams } from "@/types/GlobalType";

import type {
  UserCreateInterface,
  UserCreateModelInterface,
  UserInterface,
} from "../types/UserType";
import { useMasterStore } from "../stores/MasterStore";
import type { RoleInterface } from "../types/RoleType";

type OptionType = {
  value: string;
  label: string;
};

const props = defineProps({
  selectedValue: {
    type: Object as PropType<UserInterface | null>,
  },
});

const emit = defineEmits(["success", "error"]);

const masterStore = useMasterStore();

const modelValue = defineModel<boolean>({ default: false });
const is_loading_roles = ref(false);
const options_roles = ref<OptionType[]>([]);

const model = ref<UserCreateModelInterface>({
  name: "",
  email: "",
  roles: "",
  password: "",
});
const v$_form = reactive(useVuelidate());
const rules = computed(() => {
  return {
    name: {
      required: helpers.withMessage(`This field is required`, required),
    },
    email: {
      required: helpers.withMessage(`This field is required`, required),
    },
    roles: {
      required: helpers.withMessage(`This field is required`, required),
    },
    password: {
      required: helpers.withMessage(`This field is required`, () => {
        if (!props.selectedValue && model.value.password === "") {
          return false;
        } else {
          return true;
        }
      }),
    },
  };
});

//--- GET ROLES
const params_roles = reactive<IParams>({
  search: "",
  filters: "",
  currentPage: 1,
  perPage: 10,
});
const {
  data: dataRoles,
  refetch: refetchRoles,
  fetchNextPage: fetchNextPageRoles,
  hasNextPage: hasNextPageRoles,
  isFetchingNextPage: isFetchingNextPageRoles,
} = useInfiniteQuery({
  queryKey: ["getRolesUser"],
  enabled: !props.selectedValue && !is_loading_roles.value,
  queryFn: async ({ pageParam = 1 }) => {
    try {
      const { data } = await masterStore.getRole({
        ...params_roles,
        currentPage: pageParam,
      });

      const response = data.data as IPagination<RoleInterface[]>;

      return response;
    } catch (error: any) {
      throw error.response;
    } finally {
      is_loading_roles.value = false;
    }
  },
  refetchOnWindowFocus: false,
  getNextPageParam: (lastPage) => {
    if (!lastPage?.data?.length) return undefined;
    return lastPage.current_page + 1;
  },
  initialPageParam: 1,
});
//--- END

//--- CREATE USER
const { mutate: createUser, isPending: isLoadingCreate } = useMutation({
  mutationFn: async (payload: UserCreateInterface) => {
    return await masterStore.createUser(payload);
  },
  onSuccess: () => {
    modelValue.value = false;
    emit("success");
  },
  onError: (error) => {
    console.log(error);
    emit("error", error);
  },
});
//--- END

//--- UPDATE USER
const { mutate: updateUser, isPending: isLoadingUpdate } = useMutation({
  mutationFn: async ({
    id,
    payload,
  }: {
    id: number;
    payload: UserCreateInterface;
  }) => {
    return await masterStore.updateUser(id, payload);
  },
  onSuccess: async () => {
    modelValue.value = false;
    emit("success");
  },
  onError: (error) => {
    console.log(error);
    emit("error", error);
  },
});
//--- END

const handleSubmit = async () => {
  const isValid = await v$_form.value.$validate();

  if (!isValid) return;

  if (props.selectedValue) {
    updateUser({
      id: props.selectedValue?.id,
      payload: {
        email: model.value.email,
        name: model.value.name,
        roles: [model.value.roles],
        ...(model.value.password && { password: model.value.password }),
      },
    });
  } else {
    createUser({
      email: model.value.email,
      name: model.value.name,
      roles: [model.value.roles],
      password: model.value.password,
    });
  }
};

const setValue = () => {
  model.value = {
    name: props.selectedValue?.name || "",
    email: props.selectedValue?.email || "",
    roles: props.selectedValue?.roles?.[0]?.name || "",
    password: "",
  };
};

const resetValue = () => {
  model.value = {
    name: "",
    email: "",
    roles: "",
    password: "",
  };
};

const timeout_roles = ref(0);
const searchRoles = () => {
  clearTimeout(timeout_roles.value);
  timeout_roles.value = window.setTimeout(() => {
    is_loading_roles.value = true;
    params_roles.currentPage = 1;
    refetchRoles();
  }, 1000);
};
const scrollRoles = (e: Event) => {
  const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLElement;
  if (
    scrollTop + clientHeight >= scrollHeight - 1 &&
    hasNextPageRoles.value &&
    !isFetchingNextPageRoles.value
  ) {
    fetchNextPageRoles();
  }
};

watch(modelValue, (value) => {
  if (!value) {
    setTimeout(() => {
      resetValue();
    }, 500);
  } else {
    if (props.selectedValue) {
      setValue();
    } else {
      resetValue();
    }
  }
});

watch(
  [modelValue, dataRoles],
  ([_, newRoles]) => {
    if (props.selectedValue) {
      const new_data: OptionType[] =
        newRoles?.pages
          .flatMap((page) => page?.data)
          ?.map((item) => {
            return { value: item.name, label: item.name };
          }) || [];
      options_roles.value = mergeArrays(
        [
          {
            value: props.selectedValue?.roles?.[0]?.name,
            label: props.selectedValue?.roles?.[0]?.name,
          },
        ],
        new_data.filter(
          (item) => item.value !== props.selectedValue?.roles?.[0]?.name
        )
      );
    } else {
      const new_data: OptionType[] =
        newRoles?.pages
          .flatMap((page) => page?.data)
          ?.map((item) => {
            return { value: item.name, label: item.name };
          }) || [];

      options_roles.value = new_data;
    }
  },
  { deep: true, immediate: true }
);
</script>

<template>
  <Modal
    width="440"
    height="200"
    :showButtonClose="false"
    title="Tambah User"
    v-model="modelValue"
  >
    <form
      class="flex flex-col gap-4 max-h-[calc(100vh-200px)] overflow-y-auto mx-[-20px] px-5"
      @submit.prevent="handleSubmit"
    >
      <Input
        v-model="model.name"
        :rules="rules.name"
        :custom_symbols="all_characters"
        label="Nama"
      />
      <Input
        v-model="model.password"
        :rules="rules.password"
        :custom_symbols="all_characters"
        type="password"
        label="Password"
      />
      <Input
        v-model="model.email"
        :rules="rules.email"
        :custom_symbols="email"
        label="Email"
      />
      <Select
        v-model="model.roles"
        label="Role"
        options_label="label"
        options_value="value"
        v-model:model-search="params_roles.search"
        :search="true"
        :loading="is_loading_roles"
        :loading-next-page="isFetchingNextPageRoles"
        :rules="rules.roles"
        :options="options_roles"
        @scroll="scrollRoles"
        @search="searchRoles"
      />

      <div class="w-full flex items-center gap-4 mt-4">
        <Button
          text="Batal"
          class="w-full"
          variant="secondary"
          :disabled="isLoadingCreate || isLoadingUpdate"
          @click="modelValue = false"
        />
        <Button
          type="submit"
          text="Simpan"
          class="w-full"
          color="blue"
          :disabled="isLoadingCreate || isLoadingUpdate"
          :loading="isLoadingCreate || isLoadingUpdate"
        />
      </div>
    </form>
  </Modal>
</template>
