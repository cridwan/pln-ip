import axios, { AxiosError } from "axios";
import { storeToRefs } from "pinia";

import { useAuthStore } from "@/modules/auth/stores/AuthStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

const onRefreshToken = async (): Promise<string> => {
  if (isRefreshing) {
    return refreshPromise!;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    const authStore = useAuthStore();
    const { refresh_token } = storeToRefs(authStore);

    try {
      const { data } = await api.post(
        `/auth/refresh-token`,
        {},
        {
          headers: {
            Authorization: `Bearer ${refresh_token.value}`,
          },
        }
      );

      const response = data?.data;

      await authStore.setToken(response.access_token);
      await authStore.setRefreshToken(response.refresh_token);

      return response.access_token;
    } catch (error) {
      authStore.logout();
      window.location.href = "/login";
      throw error;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

api.interceptors.response.use(
  async (response) => response,
  async (error) => {
    const err = error as AxiosError;
    console.log(err);
    const authStore = useAuthStore();

    if (err.response?.status === 401) {
      // try {
      //   const newAccessToken = await onRefreshToken();
      //   const originalRequest = err.config;
      //   if (!originalRequest?.headers) return;
      //   originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      //   return api.request(originalRequest);
      // } catch (refreshError) {
      //   return Promise.reject(refreshError);
      // }
      // authStore.logout();
      // window.location.href = "/login";
    } else if ((err.response?.data as any)?.message === "Unauthenticated.") {
      // authStore.logout();
      // window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export { api };
