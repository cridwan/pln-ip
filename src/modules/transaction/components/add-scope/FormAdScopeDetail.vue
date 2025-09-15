<script setup lang="ts">
import { reactive, ref, computed, type PropType, watch } from "vue";

import { Button, Modal } from "@/components";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import {
    useInfiniteQuery,
    useMutation,
} from "@tanstack/vue-query";
import type { IPagination, IParams, ResponseDocumentInterface } from "@/types/GlobalType";
import type { FormScopeInterface } from "@/modules/transaction/types/ScopeType";
import { useMasterStore } from "@/modules/master/stores/MasterStore";
import type { ScopeInterface } from "@/modules/master/types/ScopeType";
import Select from "@/components/fields/Select.vue";
import { useRoute } from "vue-router";
import { useTransactionStore } from "@/modules/transaction/stores/TransactionStore";

type OptionType = {
    value: string;
    label: string;
};
const transactionStore = useTransactionStore();
const uploadProgress = ref<number>(0);
const modelUpload = ref<File | null>(null);
const documentValues = ref<ResponseDocumentInterface | null>(null);
const emit = defineEmits(["success", "error", "removeSucess", "refetchScope"]);
const is_loading_scope = ref(false);
const options_scope = ref<OptionType[]>([]);
const masterStore = useMasterStore();
const modelValue = defineModel<boolean>({ default: false });
const model_details = ref<{ name: string; id: string }[]>([
    { id: "0", name: "" },
]);

const model = ref<FormScopeInterface>({
    scope_standart_uuid: "",
    project_uuid: ""
});
const route = useRoute();
const v$_form = reactive(useVuelidate());
const rules = computed(() => {
    return {
        scope_standart_uuid: {
            required: helpers.withMessage(`This field is required`, required),
        },
    };
});

const handleSubmit = async () => {
    const isValid = await v$_form.value.$validate();

    if (!isValid) return;

    createScope({
        scope_standart_uuid: model.value.scope_standart_uuid,
        project_uuid: route.params.id_project as string,
    });
};

const setValue = () => {
    model.value.scope_standart_uuid = "";
};

const resetValue = () => {
    model.value.scope_standart_uuid = "";
    model_details.value = [{ name: "", id: "0" }];
    uploadProgress.value = 0;
};


// create documnet
const { mutate: createScope, isPending: isLoadingScope } = useMutation({
    mutationFn: async (payload: FormScopeInterface) => {
        return transactionStore.cloneScopeStandar(payload);
    },
    onSuccess: (data) => {
        modelValue.value = false;
        emit("success");
    },
    onError: (error) => {
        console.log(error);
        emit("error", error);
    },
});


watch(modelValue, (value) => {
    if (!value) {
        setTimeout(() => {
            resetValue();
        }, 500);
    } else {
        setValue()
    }
});

const handleChangeFile = (e: File) => {
    modelUpload.value = e;
}

const removeSuccess = () => {
    documentValues.value = null;
    emit('removeSucess');
}

//--- GET SCOPE
const params_scope = reactive<IParams & { from_transaction: boolean, additional_scope_uuid: string, from_add_scope: true, original_uuid: string }>({
    search: "",
    filter: "",
    filters: [],
    currentPage: 1,
    perPage: 10,
    from_transaction: true,
    additional_scope_uuid: route.params.id_scope as string,
    from_add_scope: true,
    original_uuid: route.query.original_uuid as string,
});
const {
    data: dataScope,
    refetch: refetchScope,
    fetchNextPage: fetchNextPageScope,
    hasNextPage: hasNextPageScope,
    isFetchingNextPage: isFetchingNextPageScope,
} = useInfiniteQuery({
    queryKey: ["getAdScopeTransactionForm"],
    enabled: !is_loading_scope.value,
    queryFn: async ({ pageParam = 1 }) => {
        try {
            const { data } = await masterStore.getScope({
                ...params_scope,
                currentPage: pageParam,
            });

            const response = data as IPagination<ScopeInterface[]>;

            return response;
        } catch (error: any) {
            throw error.response;
        } finally {
            is_loading_scope.value = false;
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


// scope
const timeout_scope = ref(0);
const searchScope = () => {
    clearTimeout(timeout_scope.value);
    timeout_scope.value = window.setTimeout(() => {
        is_loading_scope.value = true;
        params_scope.currentPage = 1;
        refetchScope();
    }, 1000);
};
const scrollScope = (e: Event) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLElement;
    if (
        scrollTop + clientHeight >= scrollHeight - 1 &&
        hasNextPageScope.value &&
        !isFetchingNextPageScope.value
    ) {
        fetchNextPageScope();
    }
};

watch(
    [modelValue, dataScope],
    ([newModel, newScope]) => {
        const new_data: OptionType[] =
            newScope?.pages
                .flatMap((page) => page?.data)
                ?.map((item) => {
                    return { value: item?.uuid, label: item?.name };
                }) || [];
        options_scope.value = new_data;
    },
    { deep: true, immediate: true }
);
</script>

<template>
    <Modal width="440" height="200" :showButtonClose="false" title="Tambah Scope" v-model="modelValue">
        <form class="flex flex-col gap-4 max-h-[calc(100vh-200px)] overflow-y-auto mx-[-20px] px-5"
            @submit.prevent="handleSubmit">
            <Select v-model="model.scope_standart_uuid" label="Scope" options_label="label" options_value="value"
                v-model:model-search="params_scope.search" :search="true" :loading="is_loading_scope"
                :loading-next-page="isFetchingNextPageScope" :rules="rules.scope_standart_uuid" :options="options_scope"
                @scroll="scrollScope" @search="searchScope" />

            <div class="w-full flex items-center gap-4 mt-4">
                <Button text="Batal" class="w-full" variant="secondary" :disabled="isLoadingScope"
                    @click="modelValue = isLoadingScope" />
                <Button type="submit" text="Simpan" class="w-full" color="blue" :disabled="isLoadingScope"
                    :loading="isLoadingScope" />
            </div>
        </form>
    </Modal>
</template>
