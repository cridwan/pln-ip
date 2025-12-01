<script setup lang="ts">
import { reactive, ref, computed, watch } from "vue";
import { useRoute } from "vue-router";

import { Button, Modal, Select } from "@/components";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useInfiniteQuery, useMutation } from "@tanstack/vue-query";
import type { IPagination } from "@/types/GlobalType";

import { useTransactionStore } from "../stores/TransactionStore";
import type { FormCloneQcPlan, ResponseQcPlanInterface } from "../types/QcPlanType";

type OptionType = {
    label: string;
    value: string;
};

const props = defineProps({
    isAdditional: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(["success", "error"]);

const route = useRoute();
const transactionStore = useTransactionStore();
const is_loading_QcPlan = ref(false);
const options_QcPlan = ref<OptionType[]>([]);
const modelValue = defineModel<boolean>({ default: false });

const model = ref<FormCloneQcPlan>({
    project_uuid: "",
    uuid: ""
});
const v$_form = reactive(useVuelidate());
const rules = computed(() => {
    return {
        uuid: {
            required: helpers.withMessage(`This field is required`, required),
        },
    };
});

//--- GET QcPlan
const params_qc_plans = reactive({
    search: "",
    filter: "",
    filters: [],
    currentPage: 1,
    perPage: 10,
    ...({
        project_uuid: route.params.id_project
    }),
});
const {
    data: dataQcPlan,
    refetch: refetchQcPlan,
    fetchNextPage: fetchNextPageQcPlan,
    hasNextPage: hasNextPageQcPlan,
    isFetchingNextPage: isFetchingNextPageQcPlan,
} = useInfiniteQuery({
    queryKey: ["getQcPlanStdFormTransaction"],
    queryFn: async ({ pageParam = 1 }) => {
        try {
            const { data } = await transactionStore.getQcPlanSelect({
                ...params_qc_plans,
                currentPage: pageParam,
            });

            const response = data as IPagination<ResponseQcPlanInterface[]>;

            return response;
        } catch (error: any) {
            throw error.response;
        } finally {
            is_loading_QcPlan.value = false;
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

//--- CREATE QcPlan
const { mutate: createQcPlanStd, isPending: isLoadingCreate } = useMutation({
    mutationFn: async (payload: FormCloneQcPlan) => {
        return await transactionStore.cloneQcPlan(payload);
    },
    onSuccess: (data) => {
        modelValue.value = false;
        emit("success");
    },
    onError: (error) => {
        emit("error", error);
    },
});
//--- END

const timeout_QcPlan = ref(0);
const searchQcPlan = () => {
    clearTimeout(timeout_QcPlan.value);
    timeout_QcPlan.value = window.setTimeout(() => {
        is_loading_QcPlan.value = true;
        params_qc_plans.currentPage = 1;
        refetchQcPlan();
    }, 1000);
};
const scrollQcPlan = (e: Event) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLElement;
    if (
        scrollTop + clientHeight >= scrollHeight - 1 &&
        hasNextPageQcPlan.value &&
        !isFetchingNextPageQcPlan.value
    ) {
        fetchNextPageQcPlan();
    }
};

const handleSubmit = async () => {
    const isValid = await v$_form.value.$validate();

    if (!isValid) return;

    createQcPlanStd({
        project_uuid: route.params.id_project as string,
        uuid: model.value.uuid,
    });
};

const setValue = () => {
    model.value.uuid = "";
};

const resetValue = () => {
    model.value.uuid = "";
};

watch(modelValue, (value) => {
    if (!value) {
        setTimeout(() => {
            resetValue();
        }, 500);
    } else {
        resetValue();
    }
});

watch(
    [modelValue, dataQcPlan],
    ([_, newQcPlan]) => {
        const new_data: OptionType[] =
            newQcPlan?.pages
                .flatMap((page) => page?.data)
                ?.map((item) => {
                    return { value: item.uuid, label: item.name };
                }) || [];
        console.log(new_data)
        options_QcPlan.value = new_data;
    },
    { deep: true, immediate: true }
);

defineExpose({ refetchQcPlan })
</script>

<template>
    <Modal width="440" height="200" :showButtonClose="false" :title="'Tambah QcPlan'" v-model="modelValue">
        <form class="flex flex-col gap-4 max-h-[calc(100vh-200px)] overflow-y-auto mx-[-20px] px-5"
            @submit.prevent="handleSubmit">
            <Select v-model="model.uuid" v-model:model-search="params_qc_plans.search" label="QcPlan"
                options_label="label" options_value="value" :search="true" :loading="is_loading_QcPlan"
                :loading-next-page="isFetchingNextPageQcPlan" :rules="rules.uuid" :options="options_QcPlan"
                @scroll="scrollQcPlan" @search="searchQcPlan" />

            <div class="w-full flex items-center gap-4 mt-4">
                <Button text="Batal" class="w-full" variant="secondary" :disabled="isLoadingCreate"
                    @click="modelValue = false" />
                <Button type="submit" text="Simpan" class="w-full" color="blue" :disabled="isLoadingCreate"
                    :loading="isLoadingCreate" />
            </div>
        </form>
    </Modal>
</template>
