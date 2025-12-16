<script setup lang="ts">
import { reactive, ref, computed, type PropType, watch } from "vue";

import { Button, Select } from "@/components";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useInfiniteQuery, useQueryClient } from "@tanstack/vue-query";
import type { IPagination, IParams } from "@/types/GlobalType";
import { mergeArrays } from "@/helpers/global";


import { useMasterStore } from "../stores/MasterStore";
import type { AreaInterface, AreaTypeModelCreateInterface } from "../types/AreaType";

type OptionType = {
    value: string;
    label: string;
};

const props = defineProps({
    selectedValue: {
        type: Object as PropType<AreaInterface | null>,
    },
    loading: {
        type: Boolean,
    },
});

const emit = defineEmits(["success", "error", "filter", "resetFilter"]);

const masterStore = useMasterStore();

const queryClient = useQueryClient();
const modelValue = defineModel<boolean>({ default: false });
const is_loading_area = ref(false);
const options_area = ref<OptionType[]>([]);

const model = ref<AreaTypeModelCreateInterface>({
    uuid: "",
});
const v$_form = reactive(useVuelidate());
const rules = computed(() => {
    return {
        uuid: {
            required: helpers.withMessage(`This field is required`, required),
        },
    };
});

//--- GET LOCATION
const params_area = reactive<IParams>({
    search: "",
    filters: "",
    currentPage: 1,
    perPage: 10,
});
const {
    data: dataArea,
    refetch: refetchArea,
    fetchNextPage: fetchNextPageArea,
    hasNextPage: hasNextPageArea,
    isFetchingNextPage: isFetchingNextPageArea,
} = useInfiniteQuery({
    queryKey: ["getLocationFilterInspection"],
    enabled: !props.selectedValue && !is_loading_area.value,
    queryFn: async ({ pageParam = 1 }) => {
        try {
            const { data } = await masterStore.getArea({
                ...params_area,
                currentPage: pageParam,
            });

            const response = data as IPagination<AreaInterface[]>;

            return response;
        } catch (error: any) {
            throw error.response;
        } finally {
            is_loading_area.value = false;
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

const handleSubmit = async () => {
    const isValid = await v$_form.value.$validate();

    if (!isValid) return;

    emit("filter", model.value);
};

const setValue = () => {
    model.value = {
        uuid: props?.selectedValue?.uuid || "",
    };
};

const resetValue = () => {
    model.value = {
        uuid: "",
    };
    refetchArea();
    emit("resetFilter");
};

const timeout_location = ref(0);
const searchLocation = () => {
    clearTimeout(timeout_location.value);
    timeout_location.value = window.setTimeout(() => {
        is_loading_area.value = true;
        params_area.currentPage = 1;
        refetchArea();
    }, 1000);
};
const scrollLocation = (e: Event) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLElement;
    if (
        scrollTop + clientHeight >= scrollHeight - 1 &&
        hasNextPageArea.value &&
        !isFetchingNextPageArea.value
    ) {
        fetchNextPageArea();
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

const selectLocation = (e: OptionType) => {
    // queryClient.removeQueries({ queryKey: ["getUnitFilterInspection"] });
    // queryClient.removeQueries({ queryKey: ["getMachineFilterInspection"] });
    model.value.uuid = e.value;
};

watch(
    [modelValue, dataArea],
    ([newModel, newArea]) => {
        if (props.selectedValue) {
            const new_data: OptionType[] =
                newArea?.pages
                    .flatMap((page) => page?.data)
                    ?.map((item) => {
                        return { value: item.uuid, label: item.name };
                    }) || [];

            options_area.value = mergeArrays(
                [
                    {
                        value: props.selectedValue?.uuid,
                        label: props.selectedValue?.name,
                    },
                ],
                new_data.filter(
                    (item) =>
                        item.value !== props.selectedValue?.uuid
                )
            );
        } else {
            const new_data: OptionType[] =
                newArea?.pages
                    .flatMap((page) => page?.data)
                    ?.map((item) => {
                        return { value: item.uuid, label: item.name };
                    }) || [];

            options_area.value = new_data;
        }
    },
    { deep: true, immediate: true }
);
</script>

<template>
    <div
        class="flex flex-col gap-4 max-h-[calc(100vh-200px)] overflow-y-auto mx-[-20px] p-5 bg-white shadow-md rounded-md">
        <span class="text-blue-950 font-semibold">Filter Sub Area</span>
        <form class="" @submit.prevent="handleSubmit">
            <Select v-model="model.uuid" label="Area" options_label="label" options_value="value"
                v-model:model-search="params_area.search" :search="true" :loading="is_loading_area"
                :loading-next-page="isFetchingNextPageArea" :rules="rules.uuid" :options="options_area"
                @scroll="scrollLocation" @search="searchLocation" @select="selectLocation" />

            <div class="w-full flex items-center gap-4 mt-4">
                <Button text="Reset" class="w-full" variant="secondary" :disabled="props.loading" @click="resetValue" />
                <Button type="submit" text="Terapkan" class="w-full" color="blue" :disabled="props.loading"
                    :loading="props.loading" />
            </div>
        </form>
    </div>
</template>
