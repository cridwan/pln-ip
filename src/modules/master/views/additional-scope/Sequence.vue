<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import type { AxiosError } from "axios";

import { Button, Icon, ModalDelete, Table, Toast } from "@/components";
import { useMutation, useQuery } from "@tanstack/vue-query";
import type { IPagination } from "@/types/GlobalType";

import { useMasterStore } from "../../stores/MasterStore";
import type { SequenceInterface } from "../../types/SequenceTypes";
import FormHse from "../../components/FormHse.vue";
import { ColumnHse } from "../../constants/HseConstant";
import FormSequence from "../../components/FormSequence.vue";
import { ColumnSequence } from "../../constants/SequenceConstant";
import { useRoute } from "vue-router";
import FormAdSequence from "../../components/FormAdSequence.vue";

const masterStore = useMasterStore();
const route = useRoute();
const total_item = ref(0);
const params = reactive({
    search: "",
    filter: "",
    filters: [
        {
            group: "AND",
            operator: "EQ",
            column: "additional_scope_uuid",
            value: route.params?.id,
        }
    ],
    currentPage: 1,
    perPage: 10,
});
const open_form = ref(false);
const open_delete = ref(false);
const selected_item = ref<SequenceInterface | null>(null);
const toastRef = ref<InstanceType<typeof Toast> | null>(null);
const timeout = ref(0);

//--- GET HSE
const {
    data: dataSequence,
    isFetching: isLoadingSequence,
    refetch: refetchSequence,
} = useQuery({
    queryKey: ["getSequence"],
    queryFn: async () => {
        try {
            const { data } = await masterStore.getSequence(params);
            const response = data.data as IPagination<SequenceInterface[]>;

            total_item.value = response.total;

            return response;
        } catch (error: any) {
            const err = error as AxiosError;
            throw err.response;
        }
    },
    refetchOnWindowFocus: false,
});
//--- END

//--- DELETE SUBBIDANG
const { mutate: deleteSequence, isPending: isLoadingDelete } = useMutation({
    mutationFn: async (id: string) => {
        return await masterStore.deleteSequence(id);
    },
    onSuccess: () => {
        toastRef.value?.showToast({
            title: "Success",
            description: "Deleted successfully",
            type: "success",
        });
        open_delete.value = false;
        refetchSequence();
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

const pagination = computed(() => {
    return {
        totalItems: total_item.value,
        itemsPerPage: params.perPage,
        currentPage: params.currentPage,
    };
});

const changePage = (e: number) => {
    params.currentPage = e;
    refetchSequence();
};

const changeLimit = (e: string) => {
    params.perPage = parseInt(e);
    params.currentPage = 1;
    refetchSequence();
};

const searchTable = () => {
    clearTimeout(timeout.value);
    timeout.value = window.setTimeout(() => {
        params.currentPage = 1;
        refetchSequence();
    }, 1000);
};

const handleSuccess = () => {
    toastRef.value?.showToast({
        title: "Success",
        description: "Saved successfully",
        type: "success",
    });
    params.currentPage = 1;
    refetchSequence();
};

const handleError = (error: any) => {
    toastRef.value?.showToast({
        title: "Error",
        description: error?.response?.data?.message || "Something went wrong",
        type: "error",
    });
};

const handleCreate = () => {
    selected_item.value = null;
    open_form.value = true;
};

const handleUpdate = (item: SequenceInterface) => {
    selected_item.value = item;
    open_form.value = true;
};

const handleDelete = (item: SequenceInterface) => {
    selected_item.value = item;
    open_delete.value = true;
};

const onDelete = () => {
    deleteSequence(selected_item.value?.uuid as string);
};
</script>

<template>
    <Toast ref="toastRef" />
    <ModalDelete v-model="open_delete" :title="selected_item?.name" :loading="isLoadingDelete" @delete="onDelete" />

    <div class="relative w-full">
        <Button icon_only="plus" class="absolute right-0" size="sm" rounded="full" color="blue" @click="handleCreate" />

        <Table label-create="Sub Bidang" :columns="ColumnSequence" :entities="dataSequence?.data || []"
            :loading="isLoadingSequence" :pagination="pagination" :is-create="false"
            v-model:model-search="params.search" @change-page="changePage" @change-limit="changeLimit"
            @search="searchTable">
            <template #column_action="{ entity }">
                <div class="flex items-center justify-center gap-4">
                    <Icon name="pencil" class="icon-action-table" @click="handleUpdate(entity)" />
                    <Icon name="trash" class="icon-action-table" @click="handleDelete(entity)" />
                </div>
            </template>
            <template #column_inspection_type="{ entity }">
                <p class="text-base text-neutral-50 text-center">
                    <!-- {{ entity.inspection_type?.name }} -->
                    {{ '' }}
                </p>
            </template>
        </Table>

        <FormAdSequence v-model="open_form" :selected-value="selected_item" @success="handleSuccess"
            @error="handleError" />
    </div>
</template>

<style lang="sass"></style>
