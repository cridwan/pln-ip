<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";

import { Input, Button, Icon } from "@/components";
import { useAuthStore } from "@/modules/auth/stores/AuthStore";
import useVuelidate from "@vuelidate/core";
import { email, helpers, required } from "@vuelidate/validators";
import { email as emailSymbol } from "@/helpers/global";
import { useMutation } from "@tanstack/vue-query";

import type { LoginInterface, LoginPayloadInterface } from "../types/AuthType";

const imgBg = new URL("@/assets/images/bg-login.png", import.meta.url).href;
const imgUrl = new URL("@/assets/images/logo.png", import.meta.url).href;

const authStore = useAuthStore();

const model = ref({
  email: "",
  password: "",
});

const v$_form = reactive(useVuelidate());
const router = useRouter();
const rules = computed(() => {
  return {
    email: {
      required: helpers.withMessage(`This field is required`, required),
      email: helpers.withMessage(`Please enter valid email address`, email),
    },
    password: {
      required: helpers.withMessage(`This field is required`, required),
    },
  };
});
const error_message = ref("");

const { mutate: login, isPending: isLoadingLogin } = useMutation({
  mutationFn: async (payload: LoginPayloadInterface) => {
    return await authStore.login(payload);
  },
  onSuccess: async (data) => {
    const response = data?.data?.data as LoginInterface;
    authStore.setToken(response.token);
    authStore.setUsers({
      email: response?.email,
      id: response?.id,
      name: response?.name,
      role: response?.roles?.[0]?.name,
    });

    if (response?.roles?.[0]?.name === "superuser") {
      router.push("/master/user");
    } else {
      router.push("/");
    }
  },
  onError: () => {
    error_message.value = "Invalid email or password";
  },
});

async function onSubmit() {
  const isValid = await v$_form.value.$validate();

  if (isValid && error_message.value.length === 0) {
    login(model.value);

    // const dummy = {
    //   access_token: "jbhj21f3hg12hv3h21",
    //   user: {
    //     name: "Superadmin",
    //     username: "Superadmin",
    //     email: "superadmin@gmail.com",
    //     id: "1",
    //     role: "superadmin",
    //   },
    // };

    // setTimeout(() => {
    //   if (
    //     model.value.email === dummy.user.email &&
    //     model.value.password === "password"
    //   ) {
    //     // is_loading.value = false;
    //     authStore.setToken(dummy.access_token);
    //     authStore.setUsers(dummy.user);

    //     if (dummy.user.role === "superadmin")
    //       return router.push("/master/location");

    //     router.push("/");
    //   } else {
    //     error_message.value = "Invalid email or password";
    //     // is_loading.value = false;
    //   }
    // }, 2000);
  }
}

watch(
  model,
  () => {
    error_message.value = "";
  },
  { deep: true }
);
</script>

<template>
  <div class="login-container" :style="{
    backgroundImage: `url(${imgBg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }">
    <div class="login-wrapper">
      <div class="login-card">
        <div class="login-card--wrapper">
          <div class="login-card--head">
            <img :src="imgUrl" />
            <h4>Hi, Welcome Back</h4>
          </div>
          <form @submit.prevent="onSubmit">
            <div class="form-wrapper">
              <Input id="email" type="email" prefix_icon="sms" placeholder="Enter your username" autocomplete="on"
                v-model="model.email" :rules="rules.email" :custom_symbols="emailSymbol"
                :status="error_message.length > 0 ? 'error' : 'default'" :status_message="error_message" />
              <Input id="passsword" type="password" prefix_icon="key" placeholder="Enter your password"
                autocomplete="on" is_password v-model="model.password" :rules="rules.password"
                :status="error_message.length > 0 ? 'error' : 'default'" :status_message="error_message" />
            </div>
            <p class="forgot-password">Forgot password?</p>
            <Button text="SIGN IN" type="submit" :loading="isLoadingLogin" :disabled="isLoadingLogin" />
            <p class="title-ubh">Unit Bisnis Pemeliharaan 2025</p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="sass">
.login-container
  @apply w-full h-full min-h-screen flex items-center justify-center
  .login-wrapper
    @apply flex justify-center gap-[190px] items-center mt-[-50px]
    .login-card
      @apply px-6 py-8 rounded-lg w-[468px] flex flex-col justify-center gap-[50px] bg-white shadow-xl
      &--wrapper
        @apply flex flex-col gap-10
      > img
        @apply h-[24px] self-start
      &--head
        @apply flex flex-col items-center gap-6
        > img
          @apply h-10
        > h4
          @apply text-cyan-500 text-left font-[900]
      form
        @apply flex flex-col
        .form-wrapper
          @apply flex flex-col gap-3
        .forgot-password
          @apply ml-auto text-sm font-semibold text-neutral-500 cursor-pointer hover:text-cyan-500 mt-2
        button
          @apply mt-8
        .title-ubh
          @apply text-sm text-neutral-500 font-medium mt-4
</style>
