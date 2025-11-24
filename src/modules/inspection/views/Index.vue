<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { AxiosError } from "axios";
import { storeToRefs } from "pinia";

import Home0 from "/videos/home/0-homepage.mp4";
import Home1 from "/videos/home/1-homepage.mp4";
import Home2 from "/videos/home/2-homepage.mp4";

import { useGlobalStore } from "@/stores/GlobalStore";
import {
  Breadcrumb,
  Input,
  Button,
  Toast,
  Icon,
  ModalDelete,
} from "@/components";
import type { BreadcrumbType } from "@/components/navigations/Breadcrumb.vue";
import eventBus from "@/utils/eventBus";
import { useMutation, useQuery } from "@tanstack/vue-query";
import type { IPagination } from "@/types/GlobalType";
import type { MachineInterface } from "@/modules/master/types/MachineType";
import type { InspectionTypeInterface } from "@/modules/master/types/InspectionType";
import { useMasterStore } from "@/modules/master/stores/MasterStore";

import { useInspectionStore } from "../stores/InspectionStore";
import type {
  ResponseProject,
  TCreateGenerate,
  TInspection,
} from "../types/InspectionType";
import { useAuthStore } from "@/modules/auth/stores/AuthStore";
import { UserEnum } from "@/modules/auth/types/AuthType";

const videos = [Home0, Home1, Home2];

const masterStore = useMasterStore();
const authStore = useAuthStore();
const scopeStore = useInspectionStore();
const toastRef = ref<InstanceType<typeof Toast> | null>(null);
const router = useRouter();
const route = useRoute();
const globalStore = useGlobalStore();
const {
  disabledBack,
  disabledNext,
  isAddScope,
  isFinish,
  isRemoveNext,
  isStepNavigation,
} = storeToRefs(globalStore);
const breadcrumb = ref<BreadcrumbType[]>([]);
const scopeSelected = ref("");

const currentVideoIndex = ref<number | null>(null);
const videoRef = ref<HTMLVideoElement | null>(null);
const isVideoEnded = ref(false);
const isRewinding = ref(false);
let rewindInterval: ReturnType<typeof setInterval> | null = null;

const model = ref("");
const inspection_selected = ref("");
const open_search = ref(false);
const open_delete = ref(false);
const selected_item = ref<ResponseProject | null>(null);

//--- DELETE ACTIVITY
const { mutate: deleteActivity, isPending: isLoadingDelete } = useMutation({
  mutationFn: async (id: string) => {
    return await scopeStore.deleteProject(id);
  },
  onSuccess: () => {
    toastRef.value?.showToast({
      title: "Success",
      description: "Deleted successfully",
      type: "success",
    });
    open_delete.value = false;
    refetchProject();
  },
  onError: (error: any) => {
    console.log(error);
    toastRef.value?.showToast({
      title: "Error",
      description: error?.response?.data?.message || "Something went wrong",
      type: "error",
    });
  },
});
//--- END

//--- GET MACHINE
const {
  data: dataMachine,
  isFetching: isLoadingMachine,
  refetch: refetchMachine,
} = useQuery({
  queryKey: ["getMachine"],
  queryFn: async () => {
    try {
      const { data } = await masterStore.getMachine({
        search: "",
        filter: `unit_uuid,${route.params?.id_unit}`,
        currentPage: 1,
        perPage: 1,
      });
      const response = data.data as IPagination<MachineInterface[]>;

      return response;
    } catch (error: any) {
      const err = error as AxiosError;
      throw err.response;
    }
  },
  refetchOnWindowFocus: false,
});
//--- END

//--- GET INSPECTION TYPE
const {
  data: dataInspectionType,
  isFetching: isLoadingInspectionType,
  refetch: refetchInspectionType,
} = useQuery({
  queryKey: ["getInspectionType"],
  queryFn: async () => {
    try {
      const { data } = await scopeStore.getInspection({
        search: "",
        filter: `machine_uuid,${route.params?.id_machine}`,
        currentPage: 1,
        perPage: 100000,
      });
      const response = data.data as IPagination<InspectionTypeInterface[]>;

      const order = [
        "Combustion Inspection",
        "Turbine Inspection",
        "Turbin Inspection",
        "Major Inspection",
      ];
      const sorted_data = response.data.sort(
        (a, b) => order.indexOf(a.name) - order.indexOf(b.name)
      );

      const new_arr = {
        ...response,
        data: sorted_data,
      };

      const sequence = route.query?.sequence;
      if (sequence) {
        const find_item = new_arr.data.findIndex(
          (item) => item.uuid === sequence
        );

        if (find_item !== -1) {
          currentVideoIndex.value = find_item;
          scopeSelected.value = new_arr.data[find_item].uuid;
          videoRef.value?.load();
        }
      }

      return new_arr;
    } catch (error: any) {
      const err = error as AxiosError;
      throw err.response;
    }
  },
  refetchOnWindowFocus: false,
});
//--- END

//--- CREATE GENERATE
const { mutate: generate, isPending: isLoadingGenerate } = useMutation({
  mutationFn: async (payload: TCreateGenerate) => {
    return await scopeStore.generate(payload);
  },
  onSuccess: (data) => {
    const find_item = dataInspectionType.value?.data.find(
      (item) => item.uuid === scopeSelected.value
    );
    const inspection = find_item?.name.toLowerCase();
    router.push({
      path: `/${route.params?.id}/create/unit/${route.params?.id_unit}/${route.params?.id_machine}/${inspection_selected.value}/${data?.data?.data?.uuid}/${scopeSelected.value}/scope`,
      query: {
        inspection
      }
    });
  },
  onError: (error: any) => {
    console.log(error);
    toastRef.value?.showToast({
      title: "Error",
      description: error?.response?.data?.message || "Something went wrong",
      type: "error",
    });
  },
});
//--- END

//--- GET PROJECT
const {
  data: dataProject,
  isFetching: isLoadingProject,
  refetch: refetchProject,
} = useQuery({
  queryKey: ["getProject"],
  queryFn: async () => {
    try {
      const { data } = await scopeStore.getProject({
        search: model.value,
        filter: `inspection_type_uuid,${scopeSelected.value}`,
      });
      const response = data.data as ResponseProject[];

      return response;
    } catch (error: any) {
      const err = error as AxiosError;
      throw err.response;
    }
  },
  enabled: false,
  refetchOnWindowFocus: false,
});
//--- END

watch(dataMachine, (value) => {
  breadcrumb.value = [
    // {
    //   name: `UBP ${value?.[0]?.unit?.name}`,
    //   as_link: false,
    //   url: "",
    // },
    // {
    //   name: value?.[0]?.name || "",
    //   as_link: false,
    //   url: "",
    // },
    {
      name: "Scope Overhaul",
      as_link: false,
      url: "",
    },
  ];
  // titleHeader.value = convertToOriginalFormat(route.params.id_unit as string);
});

watch(
  [dataMachine, dataInspectionType],
  ([valueMachine, valueInspection]) => {
    const sequence = route.query?.sequence;
    if (valueMachine && valueInspection && sequence) {
      const find_item = valueInspection?.data?.find(
        (item) => item.uuid === sequence
      );
      if (find_item) {
        model.value = `${find_item.name} ${dataMachine?.value?.data?.[0]?.name}`;
      }
    }
  },
  { immediate: true }
);

const handleFirstVideoLoad = () => {
  if (currentVideoIndex.value === null && videoRef.value) {
    videoRef.value.pause();
  }
};

const handleVideoEnd = () => {
  isVideoEnded.value = true;
  if (isRewinding.value) {
    isRewinding.value = false;
    videoRef.value?.pause();
  }
};

const handleMouseOver = async (section: number) => {
  if (scopeSelected.value !== "") return;

  if (rewindInterval) {
    clearInterval(rewindInterval);
  }

  if (currentVideoIndex.value !== section) {
    currentVideoIndex.value = section;

    if (videoRef.value) {
      try {
        videoRef.value.src = videos[currentVideoIndex.value];
        await videoRef.value.load();

        if (videoRef.value.readyState >= 3) {
          await videoRef.value.play();
        } else {
          videoRef.value.addEventListener(
            "canplay",
            async () => {
              await videoRef.value?.play();
            },
            { once: true }
          );
        }
      } catch (err) {
        console.error("Error playing video:", err);
      }
    }
  } else {
    if (videoRef.value) {
      await videoRef.value.play();
    }
  }

  isRewinding.value = false;
};

const handleMouseLeave = () => {
  if (videoRef.value && scopeSelected.value === "") {
    isRewinding.value = true;
    rewindInterval = setInterval(() => {
      if (videoRef.value) {
        videoRef.value.currentTime -= 0.1;
        if (videoRef.value.currentTime <= 0) {
          clearInterval(rewindInterval || undefined);
          videoRef.value.pause();
        }
      }
    }, 30);
  }
};

const onDelete = () => {
  deleteActivity(selected_item.value?.uuid as string);
};

const selectInspection = (item: TInspection) => {
  if (authStore.users && authStore.users.role === UserEnum.GUEST) {
    router.push(`/${route.params?.id}/guest/${route.params?.id_unit}/${route.params?.id_machine}/${item.name}/undefined/${item.uuid}/scope`)
  } else {
    toScope(item);
  }
  // if (authStore.users && authStore.users.role == "planner") {
  //   toScope(item);
  // } else {
  //   // TODO handle not planner
  //   // console.log('role not planner')
  //   toScope(item);
  // }
};

const toScope = (url: TInspection) => {
  router.replace({
    path: route.path,
    query: { ...route.query, sequence: url.uuid },
  });

  model.value = `${url.name} ${dataMachine?.value?.data?.[0]?.name}`;

  if (scopeSelected.value !== "" && url.uuid !== scopeSelected.value) {
    isRewinding.value = true;
    rewindInterval = setInterval(async () => {
      if (videoRef.value) {
        videoRef.value.currentTime -= 0.1;
        if (videoRef.value.currentTime <= 0) {
          clearInterval(rewindInterval || undefined);

          const findIndex = dataInspectionType?.value?.data?.findIndex(
            (item) => item.uuid === url.uuid
          );
          currentVideoIndex.value = findIndex as number;
          if (videoRef.value) {
            try {
              videoRef.value.src = videos[currentVideoIndex.value];
              await videoRef.value.load();

              if (videoRef.value.readyState >= 3) {
                await videoRef.value.play();
              } else {
                videoRef.value.addEventListener(
                  "canplay",
                  async () => {
                    await videoRef.value?.play();
                  },
                  { once: true }
                );
              }
            } catch (err) {
              console.error("Error playing video:", err);
            }
          }
        }
      }
    }, 30);
  }

  scopeSelected.value = url.uuid;
};

const handleBack = () => {
  router.push(`/${route.params.id}/create/unit`);
};

const searchScope = () => {
  open_search.value = true;
  const find_item = dataInspectionType.value?.data.find(
    (item) => item.uuid === scopeSelected.value
  );
  const inspection = find_item?.name.toLowerCase();
  inspection_selected.value =
    inspection === "combustion inspection"
      ? "ci"
      : inspection === "turbine inspection" ||
        inspection === "turbin inspection"
        ? "ti"
        : "mi";
  refetchProject();
};

const generateScope = () => {
  open_search.value = false;
  const find_item = dataInspectionType.value?.data.find(
    (item) => item.uuid === scopeSelected.value
  );
  const inspection = find_item?.name.toLowerCase();
  inspection_selected.value =
    inspection === "combustion inspection"
      ? "ci"
      : inspection === "turbine inspection" ||
        inspection === "turbin inspection"
        ? "ti"
        : "mi";

  const payload: TCreateGenerate = {
    name: model.value,
    inspection_type_uuid: scopeSelected.value,
    link: "",
  };
  generate(payload);
  // router.push(
  //   `/${route.params?.id}/create/unit/${route.params?.id_unit}/${scopeSelected.value}/scope-mekanik`
  // );
};

const toTransaction = (uuid: string) => {
  const find_item = dataInspectionType.value?.data.find(
    (item) => item.uuid === scopeSelected.value
  );
  const inspection = find_item?.name.toLowerCase();
  router.push(
    {
      path: `/${route.params?.id}/create/unit/${route.params?.id_unit}/${route.params?.id_machine}/${inspection_selected.value}/${uuid}/${scopeSelected.value}/scope`,
      query: {
        inspection
      }
    }
  );
};

onMounted(() => {
  disabledBack.value = false;
  disabledNext.value = true;
  isAddScope.value = false;
  isFinish.value = false;
  isRemoveNext.value = false;
  isStepNavigation.value = false;
  eventBus.on("back", handleBack);

  window.addEventListener("click", (e) => {
    let isButtonClicked = false;

    [1, 2, 3].forEach((_, key) => {
      const button = document.getElementById(`button-home-${key}`);
      if (button?.contains(e.target as Node)) {
        isButtonClicked = true;
        open_search.value = false;
      }
    });

    const scopeMenu = document.getElementById("scope-menu");
    const isContainsScopeMenu = scopeMenu?.contains(e.target as Node);

    if (!isButtonClicked && !isContainsScopeMenu) {
      scopeSelected.value = "";
      router.push(`${route.fullPath}`);
      handleMouseLeave();
    }
  });
});

onUnmounted(() => {
  eventBus.off("back", handleBack);
});

const toDelete = (item: ResponseProject) => {
  selected_item.value = item;
  open_delete.value = true;
};
</script>

<template>
  <Toast ref="toastRef" />
  <div class="scope-container">
    <div class="scope-breadcrumb">
      <Breadcrumb :items="breadcrumb" />
    </div>
    <div class="scope-video-container">
      <video ref="videoRef" :src="videos[currentVideoIndex === null ? 0 : currentVideoIndex]" class="scope-video"
        @loadedmetadata="handleFirstVideoLoad" @ended="handleVideoEnd" autoplay muted playsinline></video>
      <div class="scope-button-home">
        <button v-for="(item, key) in dataInspectionType?.data" :id="`button-home-${key}`" :key="key"
          :class="{ 'scope-button-home--active': scopeSelected === item.uuid }" @mouseover="handleMouseOver(key)"
          @mouseleave="handleMouseLeave" @click="selectInspection(item)">
          {{ item.name }}
        </button>
      </div>
      <div v-show="scopeSelected" id="scope-menu" class="scope-button-menus">
        <div class="w-[450px] relative">
          <Input rounded="full" v-model="model" />
          <div v-if="open_search"
            class="absolute top-11 right-0 left-0 bg-neutral-950 bg-opacity-50 rounded-xl py-3 text-sm text-neutral-50">
            <p v-if="isLoadingProject" class="w-full text-center">Loading...</p>
            <p v-if="!isLoadingProject && (dataProject || []).length === 0" class="w-full text-center">
              Not Found Data
            </p>
            <p v-else-if="!isLoadingProject && (dataProject || []).length > 0" v-for="(item, key) in dataProject"
              :key="key" class="px-4 hover:text-neutral-200 py-1 flex justify-between">
              <span class="cursor-pointer" @click="toTransaction(item.uuid)">{{
                item.name
                }}</span>
              <Icon v-if="item.status != 'approve' && authStore.users?.role !== 'approval'" name="trash"
                class="cursor-pointer" @click="toDelete(item)" />
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <Button text="Search" color="blue" rounded="full" class="!px-6" :disabled="isLoadingGenerate"
            @click="searchScope" />
          <Button text="Generate" color="blue" rounded="full" class="!px-6" :disabled="isLoadingGenerate"
            :loading="isLoadingGenerate" @click="generateScope" />
        </div>
      </div>
    </div>
  </div>

  <ModalDelete v-model="open_delete" :title="selected_item?.name" :loading="isLoadingDelete" @delete="onDelete" />
</template>

<style lang="sass">
.scope-button-home
  @apply absolute z-[11] flex flex-col gap-2 left-[260px] top-[257px] text-center text-sm text-neutral-50 font-bold
  > button
    @apply bg-buttonGray py-2 w-[200px] rounded shadow-md shadow-neutral-950
    &:hover
      @apply bg-cyan-500
  &--active
    @apply bg-cyan-500 !important

.scope-button-menus
  @apply flex text-sm text-neutral-50 fixed z-[9999] top-[80px] right-10 items-center gap-4
</style>
