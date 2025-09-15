<script setup lang="ts">
import { reactive, ref, computed, type PropType, watch } from "vue";
import { useRoute } from "vue-router";

import { Button, Modal, Select } from "@/components";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useInfiniteQuery, useMutation } from "@tanstack/vue-query";
import { mergeArrays } from "@/helpers/global";
import { useMasterStore } from "@/modules/master/stores/MasterStore";
import type { IPagination, IParams } from "@/types/GlobalType";
import type {
    PartStdCreateModelInterface,
    PartStdInterface,
} from "@/modules/master/types/PartStdType";

import type { FormPartCloneInterface } from "@/modules/transaction/types/PartStdType";
import { useTransactionStore } from "@/modules/transaction/stores/TransactionStore";

type OptionType = {
    label: string;
    value: string;
};

const props = defineProps({
    selectedValue: {
        type: Object as PropType<PartStdInterface | null>,
    },
    dataForm: {
        type: Object as PropType<PartStdCreateModelInterface | null>,
    },
});

const emit = defineEmits(["success", "error"]);

const route = useRoute();
const masterStore = useMasterStore();
const transactionStore = useTransactionStore();
const is_loading_part = ref(false);
const options_part = ref<OptionType[]>([]);
const modelValue = defineModel<boolean>({ default: false });

const model = ref<PartStdCreateModelInterface>({
    location_uuid: "",
    unit_uuid: "",
    machine_uuid: "",
    inspection_type_uuid: "",
    sub_bidang_uuid: "",
    bidang_uuid: "",
    scope_standart_uuid: "",
    equipment_uuid: "",
    activity_uuid: "",
    part_uuid: "",
    qty: "",
});
const v$_form = reactive(useVuelidate());
const rules = computed(() => {
    return {
        qty: {
            required: helpers.withMessage(`This field is required`, required),
        },
        part_uuid: {
            required: helpers.withMessage(`This field is required`, required),
        },
    };
});

//--- GET PART
const params_part = reactive<IParams & { from_transaction: boolean, additional_scope_uuid: string, from_add_scope: true, original_uuid: string }>({
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
    data: dataPart,
    refetch: refetchPart,
    fetchNextPage: fetchNextPagePart,
    hasNextPage: hasNextPagePart,
    isFetchingNextPage: isFetchingNextPagePart,
} = useInfiniteQuery({
    queryKey: ["getPartStdForm"],
    enabled: !props.selectedValue && !is_loading_part.value,
    queryFn: async ({ pageParam = 1 }) => {
        try {
            const { data } = await masterStore.getPartStd({
                ...params_part,
                currentPage: pageParam,
            });

            const response = data.data as IPagination<PartStdInterface[]>;

            return response;
        } catch (error: any) {
            throw error.response;
        } finally {
            is_loading_part.value = false;
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

//--- CREATE PART
const { mutate: createPartStd, isPending: isLoadingCreate } = useMutation({
    mutationFn: async (payload: FormPartCloneInterface) => {
        return await transactionStore.clonePartStd(payload);
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

const timeout_part = ref(0);
const searchPart = () => {
    clearTimeout(timeout_part.value);
    timeout_part.value = window.setTimeout(() => {
        is_loading_part.value = true;
        params_part.currentPage = 1;
        refetchPart();
    }, 1000);
};
const scrollPart = (e: Event) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLElement;
    if (
        scrollTop + clientHeight >= scrollHeight - 1 &&
        hasNextPagePart.value &&
        !isFetchingNextPagePart.value
    ) {
        fetchNextPagePart();
    }
};

const handleSubmit = async () => {
    const isValid = await v$_form.value.$validate();

    if (!isValid) return;

    if (props.selectedValue) {
        // updatePartStd({
        //   id: props.selectedValue.uuid,
        //   payload: {
        //     activity_uuid: model.value.activity_uuid,
        //     part_uuid: model.value.part_uuid,
        //   },
        // });
    } else {
        createPartStd({
            activity_uuid: props.dataForm?.activity_uuid as string,
            part_uuid: model.value.part_uuid,
        });
    }
};

const setValue = () => {
    model.value.part_uuid = "";
};

const resetValue = () => {
    model.value.part_uuid = "";
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

watch(
    [modelValue, dataPart],
    ([_, newPart]) => {
        if (props.selectedValue) {
            const new_data: OptionType[] =
                newPart?.pages
                    .flatMap((page) => page?.data)
                    ?.map((item) => {
                        return { value: item.uuid, label: item.part.name };
                    }) || [];
            options_part.value = mergeArrays(
                [
                    {
                        value: props.selectedValue?.part_uuid,
                        label: props.selectedValue?.part?.name,
                    },
                ],
                new_data.filter((item) => item.value !== props.selectedValue?.part_uuid)
            );
        } else {
            const new_data: OptionType[] =
                newPart?.pages
                    .flatMap((page) => page?.data)
                    ?.map((item) => {
                        return { value: item.uuid, label: item.part.name };
                    }) || [];
            options_part.value = new_data;
        }
    },
    { deep: true, immediate: true }
);
</script>

<template>
    <Modal width="440" height="200" :showButtonClose="false" :title="props.selectedValue ? 'Ubah Part' : 'Tambah Part'"
        v-model="modelValue">
        <form class="flex flex-col gap-4 max-h-[calc(100vh-200px)] overflow-y-auto mx-[-20px] px-5"
            @submit.prevent="handleSubmit">
            <Select v-model="model.part_uuid" v-model:model-search="params_part.search" label="Part"
                options_label="label" options_value="value" :search="true" :loading="is_loading_part"
                :loading-next-page="isFetchingNextPagePart" :rules="rules.part_uuid" :options="options_part"
                @scroll="scrollPart" @search="searchPart" />

            <div class="w-full flex items-center gap-4 mt-4">
                <Button text="Batal" class="w-full" variant="secondary" :disabled="isLoadingCreate"
                    @click="modelValue = false" />
                <Button type="submit" text="Simpan" class="w-full" color="blue" :disabled="isLoadingCreate"
                    :loading="isLoadingCreate" />
            </div>
        </form>
    </Modal>
</template>
