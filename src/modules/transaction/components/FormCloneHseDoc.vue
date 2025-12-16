<script setup lang="ts">
import { reactive, ref, computed, watch } from "vue";
import { useRoute } from "vue-router";

import { Button, Modal, Select } from "@/components";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useInfiniteQuery, useMutation } from "@tanstack/vue-query";
import type { IPagination } from "@/types/GlobalType";

import { useTransactionStore } from "../stores/TransactionStore";
import type { FormCloneHseDoc } from "../types/HseType";
import type { ResponseHseDocInterface } from "../types/HseDocType";

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
const is_loading_HseDoc = ref(false);
const options_HseDoc = ref<OptionType[]>([]);
const modelValue = defineModel<boolean>({ default: false });

const model = ref<FormCloneHseDoc>({
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

//--- GET HseDoc
const params_hse_doc = reactive({
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
    data: dataHseDoc,
    refetch: refetchHseDoc,
    fetchNextPage: fetchNextPageHseDoc,
    hasNextPage: hasNextPageHseDoc,
    isFetchingNextPage: isFetchingNextPageHseDoc,
} = useInfiniteQuery({
    queryKey: ["getHseDocStdFormTransaction"],
    queryFn: async ({ pageParam = 1 }) => {
        try {
            const { data } = await transactionStore.getHseSelect({
                ...params_hse_doc,
                currentPage: pageParam,
            });

            const response = data as IPagination<ResponseHseDocInterface[]>;

            return response;
        } catch (error: any) {
            throw error.response;
        } finally {
            is_loading_HseDoc.value = false;
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

//--- CREATE HseDoc
const { mutate: createHseDocStd, isPending: isLoadingCreate } = useMutation({
    mutationFn: async (payload: FormCloneHseDoc) => {
        return await transactionStore.cloneHse(payload);
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

const timeout_HseDoc = ref(0);
const searchHseDoc = () => {
    clearTimeout(timeout_HseDoc.value);
    timeout_HseDoc.value = window.setTimeout(() => {
        is_loading_HseDoc.value = true;
        params_hse_doc.currentPage = 1;
        refetchHseDoc();
    }, 1000);
};
const scrollHseDoc = (e: Event) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLElement;
    if (
        scrollTop + clientHeight >= scrollHeight - 1 &&
        hasNextPageHseDoc.value &&
        !isFetchingNextPageHseDoc.value
    ) {
        fetchNextPageHseDoc();
    }
};

const handleSubmit = async () => {
    const isValid = await v$_form.value.$validate();

    if (!isValid) return;

    createHseDocStd({
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
    [modelValue, dataHseDoc],
    ([_, newHseDoc]) => {
        const new_data: OptionType[] =
            newHseDoc?.pages
                .flatMap((page) => page?.data)
                ?.map((item) => {
                    return { value: item.uuid, label: item.name };
                }) || [];
        console.log(new_data)
        options_HseDoc.value = new_data;
    },
    { deep: true, immediate: true }
);

defineExpose({ refetchHseDoc })
</script>

<template>
    <Modal width="440" height="200" :showButtonClose="false" :title="'Tambah HseDoc'" v-model="modelValue">
        <form class="flex flex-col gap-4 max-h-[calc(100vh-200px)] overflow-y-auto mx-[-20px] px-5"
            @submit.prevent="handleSubmit">
            <Select v-model="model.uuid" v-model:model-search="params_hse_doc.search" label="HseDoc"
                options_label="label" options_value="value" :search="true" :loading="is_loading_HseDoc"
                :loading-next-page="isFetchingNextPageHseDoc" :rules="rules.uuid" :options="options_HseDoc"
                @scroll="scrollHseDoc" @search="searchHseDoc" />

            <div class="w-full flex items-center gap-4 mt-4">
                <Button text="Batal" class="w-full" variant="secondary" :disabled="isLoadingCreate"
                    @click="modelValue = false" />
                <Button type="submit" text="Simpan" class="w-full" color="blue" :disabled="isLoadingCreate"
                    :loading="isLoadingCreate" />
            </div>
        </form>
    </Modal>
</template>
