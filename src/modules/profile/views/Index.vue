<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import {
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from "radix-vue";
import type { AxiosError } from "axios";

import { all_characters, email as emailSymbol } from "@/helpers/global";
import { Button, Input, Loading } from "@/components";
import useVuelidate from "@vuelidate/core";
import { email, helpers, required } from "@vuelidate/validators";
import { useMutation, useQuery } from "@tanstack/vue-query";

import { useProfileStore } from "../stores/ProfileStore";
import type {
  ProfileInterface,
  UpdateProfileInterface,
} from "../types/ProfileType";

const model = ref({
  name: "",
  email: "",
  new_password: "",
  confirm_password: "",
});
const v$_form = reactive(useVuelidate());
const rules = computed(() => {
  return {
    name: {
      required: helpers.withMessage(`This field is required`, required),
    },
    email: {
      required: helpers.withMessage(`This field is required`, required),
      email: helpers.withMessage(`Please enter valid email address`, email),
    },
    new_password: {
      required: helpers.withMessage(`This field is required`, required),
      minLength: helpers.withMessage(
        `Password must be at least 8 characters`,
        (value: string) => value?.length >= 8
      ),
    },
    confirm_password: {
      required: helpers.withMessage(`This field is required`, required),
      sameAsPassword: helpers.withMessage(
        `Passwords do not match`,
        (value: string) => value === model.value.new_password
      ),
    },
  };
});
const router = useRouter();
const profileStore = useProfileStore();
const model_tab = ref("tab1");

//--- GET PROFILE
const {
  data: dataProfile,
  isFetching: isLoadingProfile,
  refetch: refetchProfile,
} = useQuery({
  queryKey: ["getProfileMaster"],
  queryFn: async () => {
    try {
      const { data } = await profileStore.getProfile();
      const response = data.data as ProfileInterface;

      console.log("AAA", response);

      model.value.name = response.name;
      model.value.email = response.email;

      return response;
    } catch (error: any) {
      const err = error as AxiosError;
      throw err.response;
    }
  },
  refetchOnWindowFocus: false,
  enabled: true,
  gcTime: 0,
});
//--- END

//--- UPDATE PROFILE
const { mutate: updateProfile, isPending: isLoadingUpdate } = useMutation({
  mutationFn: async ({ payload }: { payload: UpdateProfileInterface }) => {
    return await profileStore.updateProfile(payload);
  },
  onSuccess: async () => {
    refetchProfile();
    model_tab.value = "tab1";
  },
  onError: (error) => {
    console.log("error", error);
  },
});
//--- END

async function onSubmit() {
  const isValid = await v$_form.value.$validate();

  if (isValid) {
    updateProfile({
      payload: {
        name: model.value.name,
        email: model.value.email,
        ...(model.value.new_password && {
          password: model.value.confirm_password,
        }),
      },
    });
  }
}
</script>

<template>
  <div class="flex items-center justify-center">
    <TabsRoot
      class="flex flex-col w-full sm:w-[300px] shadow-[0_2px_10px_rgba(0,0,0,.2)]"
      v-model="model_tab"
    >
      <TabsList
        class="relative shrink-0 flex border-b border-[rgb(219_216_224/1)]"
        aria-label="Manage your account"
      >
        <TabsIndicator
          class="absolute px-8 left-0 h-[2px] bottom-0 w-[--radix-tabs-indicator-size] translate-x-[--radix-tabs-indicator-position] rounded-full transition-[width,transform] duration-300"
        >
          <div class="bg-[rgb(101_186_116/1)] w-full h-full" />
        </TabsIndicator>
        <TabsTrigger
          class="bg-white px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none text-neutral-950 select-none rounded-tl-md hover:text-[rgb(42_126_59/1)] data-[state=active]:text-[rgb(42_126_59/1)] outline-none cursor-default focus-visible:relative focus-visible:shadow-[0_0_0_2px] focus-visible:shadow-black"
          value="tab1"
        >
          Informasi
        </TabsTrigger>
        <TabsTrigger
          class="bg-white px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] leading-none text-neutral-950 select-none rounded-tr-md hover:text-[rgb(42_126_59/1)] data-[state=active]:text-[rgb(42_126_59/1)] outline-none cursor-default focus-visible:relative focus-visible:shadow-[0_0_0_2px] focus-visible:shadow-black"
          value="tab2"
        >
          Edit
        </TabsTrigger>
      </TabsList>
      <TabsContent
        class="grow p-5 bg-white rounded-b-md outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
        value="tab1"
      >
        <div
          v-if="isLoadingProfile"
          class="py-10 flex items-center justify-center"
        >
          <Loading />
        </div>
        <div v-else class="flex flex-col gap-4">
          <div class="flex flex-col text-neutral-950">
            <p class="text-sm">Nama</p>
            <p class="text-base font-bold">{{ dataProfile?.name }}</p>
          </div>
          <div class="flex flex-col text-neutral-950">
            <p class="text-sm">Email</p>
            <p class="text-base font-bold">{{ dataProfile?.email }}</p>
          </div>
          <div class="flex flex-col text-neutral-950">
            <p class="text-sm">Password</p>
            <p class="text-base font-bold">******</p>
          </div>
        </div>
      </TabsContent>
      <TabsContent
        class="grow p-5 bg-white rounded-b-md outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
        value="tab2"
      >
        <form @submit.prevent="onSubmit" class="flex flex-col gap-4">
          <Input
            id="nama"
            placeholder="Enter your name"
            autocomplete="on"
            label="Nama"
            v-model="model.name"
            :rules="rules.name"
            :custom_symbols="all_characters"
          />
          <Input
            id="email"
            type="email"
            placeholder="Enter your username"
            autocomplete="on"
            label="Email"
            v-model="model.email"
            :rules="rules.email"
            :custom_symbols="emailSymbol"
          />
          <Input
            id="new-passsword"
            type="password"
            placeholder="Enter your new password"
            autocomplete="on"
            label="New Password"
            is_password
            v-model="model.new_password"
            :rules="rules.new_password"
          />
          <Input
            id="confirm-passsword"
            type="password"
            placeholder="Enter your confirm password"
            autocomplete="on"
            label="Confirm Password"
            is_password
            v-model="model.confirm_password"
            :rules="rules.confirm_password"
          />

          <Button
            text="Simpan"
            type="submit"
            class="mt-2 !w-fit ml-auto"
            :loading="isLoadingUpdate"
          />
        </form>
      </TabsContent>
    </TabsRoot>
  </div>
</template>
