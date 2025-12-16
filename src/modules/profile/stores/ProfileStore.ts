import type { StorageLike } from "pinia-plugin-persistedstate";
import { defineStore } from "pinia";

import { encryptStorage } from "@/utils/storage";
import { api } from "@/api/axios";

import type { UpdateProfileInterface } from "../types/ProfileType";

export const useProfileStore = defineStore(
  "profile",
  () => {
    const getProfile = async () => {
      return await api
        .get(`/auth/me`)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    const updateProfile = async (payload: UpdateProfileInterface) => {
      return await api
        .put(`/auth/profile`, payload)
        .then((resp) => {
          return Promise.resolve(resp);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    };

    return {
      getProfile,
      updateProfile,
    };
  },
  {
    persist: {
      storage: encryptStorage as StorageLike,
      pick: [],
    },
  }
);
