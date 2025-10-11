<script setup lang="ts">
import { reactive, ref, computed, type PropType, watch } from "vue";

import { Button, Select } from "@/components";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useInfiniteQuery, useQueryClient } from "@tanstack/vue-query";
import type { IPagination, IParams } from "@/types/GlobalType";
import { mergeArrays } from "@/helpers/global";

import { useMasterStore } from "@/modules/master/stores/MasterStore";
import type {
    ScopeAdditionalFilterInterface,
    ScopeInterface,
} from "@/modules/master/types/ScopeType";
import type { SubBidangInterface } from "@/modules/master/types/SubBidangType";
import type { BidangInterface } from "@/modules/master/types/BidangType";

type OptionType = {
    value: string;
    label: string;
};

const props = defineProps({
    selectedValue: {
        type: Object as PropType<ScopeInterface | null>,
    },
    loading: {
        type: Boolean,
    },
});

const emit = defineEmits(["success", "error", "filter", "resetFilter"]);

const masterStore = useMasterStore();

const queryClient = useQueryClient();
const modelValue = defineModel<boolean>({ default: false });
const is_loading_bidang = ref(false);
const options_bidang = ref<OptionType[]>([]);
const is_loading_sub_bidang = ref(false);
const options_sub_bidang = ref<OptionType[]>([]);

const model = ref<ScopeAdditionalFilterInterface>({
    bidang_uuid: "",
    sub_bidang_uuid: "",
});
const v$_form = reactive(useVuelidate());
const rules = computed(() => {
    return {
        sub_bidang_uuid: {
            required: helpers.withMessage(`This field is required`, required),
        },
        bidang_uuid: {
            required: helpers.withMessage(`This field is required`, required),
        },
    };
});

//--- GET BIDANG
const params_bidang = reactive<IParams>({
    search: "",
    filters: "",
    currentPage: 1,
    perPage: 10,
});
const {
    data: dataBidang,
    refetch: refetchBidang,
    fetchNextPage: fetchNextPageBidang,
    hasNextPage: hasNextPageBidang,
    isFetchingNextPage: isFetchingNextPageBidang,
} = useInfiniteQuery({
    queryKey: ["getBidangScope"],
    enabled: !props.selectedValue && !is_loading_bidang.value,
    queryFn: async ({ pageParam = 1 }) => {
        try {
            const { data } = await masterStore.getBidang({
                ...params_bidang,
                currentPage: pageParam,
            });

            const response = data.data as IPagination<BidangInterface[]>;

            return response;
        } catch (error: any) {
            throw error.response;
        } finally {
            is_loading_bidang.value = false;
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

//--- GET SUB BIDANG
const params_sub_bidang = reactive<IParams>({
    search: "",
    filters: [
        {
            group: "AND",
            operator: "EQ",
            column: "bidang_uuid",
            value: null,
        },
    ],
    currentPage: 1,
    perPage: 10,
});
const {
    data: dataSubBidang,
    refetch: refetchSubBidang,
    fetchNextPage: fetchNextPageSubBidang,
    hasNextPage: hasNextPageSubBidang,
    isFetchingNextPage: isFetchingNextPageSubBidang,
} = useInfiniteQuery({
    queryKey: ["getSubBidangScope"],
    enabled: !props.selectedValue && !is_loading_sub_bidang.value,
    queryFn: async ({ pageParam = 1 }) => {
        try {
            const { data } = await masterStore.getSubBidang({
                ...params_sub_bidang,
                currentPage: pageParam,
            });

            const response = data.data as IPagination<SubBidangInterface[]>;

            return response;
        } catch (error: any) {
            throw error.response;
        } finally {
            is_loading_sub_bidang.value = false;
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
    model.value.sub_bidang_uuid = props.selectedValue?.sub_bidang_uuid || "";
    model.value.bidang_uuid = props.selectedValue?.sub_bidang?.bidang_uuid || "";
};

const resetValue = () => {
    model.value = {
        sub_bidang_uuid: "",
        bidang_uuid: "",
    };
    emit("resetFilter");
};

// bidang
const timeout_bidang = ref(0);
const searchBidang = () => {
    clearTimeout(timeout_bidang.value);
    timeout_bidang.value = window.setTimeout(() => {
        is_loading_bidang.value = true;
        params_bidang.currentPage = 1;
        refetchBidang();
    }, 1000);
};
const scrollBidang = (e: Event) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLElement;
    if (
        scrollTop + clientHeight >= scrollHeight - 1 &&
        hasNextPageBidang.value &&
        !isFetchingNextPageBidang.value
    ) {
        fetchNextPageBidang();
    }
};
// end

// sub bidang
const timeout_sub_bidang = ref(0);
const searchSubBidang = () => {
    clearTimeout(timeout_sub_bidang.value);
    timeout_sub_bidang.value = window.setTimeout(() => {
        is_loading_sub_bidang.value = true;
        params_sub_bidang.currentPage = 1;
        refetchSubBidang();
    }, 1000);
};
const scrollSubBidang = (e: Event) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLElement;
    if (
        scrollTop + clientHeight >= scrollHeight - 1 &&
        hasNextPageSubBidang.value &&
        !isFetchingNextPageSubBidang.value
    ) {
        fetchNextPageSubBidang();
    }
};
// end

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

const selectBidang = (e: OptionType) => {
    queryClient.removeQueries({ queryKey: ["getSubBidangScope"] });
    model.value.sub_bidang_uuid = "";
    params_sub_bidang.filters = [
        {
            group: "AND",
            operator: "EQ",
            column: "bidang_uuid",
            value: e.value,
        },
    ];
    refetchSubBidang();
};

// bidang
watch(
    dataBidang,
    (newBidang) => {
        if (props.selectedValue) {
            const new_data: OptionType[] =
                newBidang?.pages
                    .flatMap((page) => page?.data)
                    ?.map((item) => {
                        return { value: item.uuid, label: item.name };
                    }) || [];
            options_bidang.value = mergeArrays(
                [
                    {
                        value: props.selectedValue?.sub_bidang?.bidang_uuid,
                        label: props.selectedValue?.sub_bidang?.bidang?.name,
                    },
                ],
                new_data.filter(
                    (item) => item.value !== props.selectedValue?.sub_bidang?.bidang_uuid
                )
            );
        } else {
            const new_data: OptionType[] =
                newBidang?.pages
                    .flatMap((page) => page?.data)
                    ?.map((item) => {
                        return { value: item.uuid, label: item.name };
                    }) || [];

            options_bidang.value = new_data;
        }
    },
    { deep: true, immediate: true }
);
// end bidang

// sub bidang
watch(
    dataSubBidang,
    (newSubBidang) => {
        if (props.selectedValue) {
            const new_data: OptionType[] =
                newSubBidang?.pages
                    .flatMap((page) => page?.data)
                    ?.map((item) => {
                        return { value: item.uuid, label: item.name };
                    }) || [];
            options_sub_bidang.value = mergeArrays(
                [
                    {
                        value: props.selectedValue?.sub_bidang_uuid,
                        label: props.selectedValue?.sub_bidang?.name,
                    },
                ],
                new_data.filter(
                    (item) => item.value !== props.selectedValue?.sub_bidang_uuid
                )
            );
        } else {
            const new_data: OptionType[] =
                newSubBidang?.pages
                    .flatMap((page) => page?.data)
                    ?.map((item) => {
                        return { value: item.uuid, label: item.name };
                    }) || [];

            options_sub_bidang.value = new_data;
        }
    },
    { deep: true, immediate: true }
);
// end sub bidang
</script>

<template>
    <div
        class="flex flex-col gap-4 max-h-[calc(100vh-200px)] overflow-y-auto mx-[-20px] p-5 bg-white shadow-md rounded-md">
        <span class="text-blue-950 font-semibold">Pilih Scope Standart</span>
        <form class="" @submit.prevent="handleSubmit">
            <Select v-model="model.bidang_uuid" label="Bidang" options_label="label" options_value="value"
                v-model:model-search="params_bidang.search" :search="true" :loading="is_loading_bidang"
                :loading-next-page="isFetchingNextPageBidang" :rules="rules.bidang_uuid" :options="options_bidang"
                @scroll="scrollBidang" @search="searchBidang" @select="selectBidang" />
            <Select v-model="model.sub_bidang_uuid" label="Sub Bidang" options_label="label" options_value="value"
                v-model:model-search="params_sub_bidang.search" :search="true" :loading="is_loading_sub_bidang"
                :loading-next-page="isFetchingNextPageSubBidang" :rules="rules.sub_bidang_uuid"
                :options="options_sub_bidang" @scroll="scrollSubBidang" @search="searchSubBidang" />

            <div class="w-full flex items-center gap-4 mt-4">
                <Button text="Reset" class="w-full" variant="secondary" :disabled="props.loading" @click="resetValue" />
                <Button type="submit" text="Terapkan" class="w-full" color="blue" :disabled="props.loading"
                    :loading="props.loading" />
            </div>
        </form>
    </div>
</template>
