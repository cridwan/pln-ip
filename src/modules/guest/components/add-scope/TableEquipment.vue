<script setup lang="ts">
import { computed, reactive, ref, watch, type PropType } from "vue";
import type { AxiosError } from "axios";
import { storeToRefs } from "pinia";

import { Table, Toast, Icon, ModalDelete, Button } from "@/components";
import { ColumnsEquipment } from "@/modules/master/constants/EquipmentConstant";
import type { EquipmentInterface } from "@/modules/transaction/types/EquipmentType";
import type { EquipmentCreateInterface } from "@/modules/master/types/EquipmentType";
import { useQuery, useMutation } from "@tanstack/vue-query";
import type { IPagination } from "@/types/GlobalType";
import { useAuthStore } from "@/modules/auth/stores/AuthStore";

import FormEquipment from "../../components/FormEquipment.vue";
import { useTransactionStore } from "../../stores/TransactionStore";

import { useMasterStore } from "@/modules/master/stores/MasterStore";
import ModalActivity from "./ModalActivity.vue";

const props = defineProps({
    open: {
        type: Boolean,
        default: false,
    },
    id: {
        type: String,
        default: "",
    },
    entity: {
        type: Array as PropType<EquipmentInterface[]>,
        default: () => [],
    },
    statusApproval: {
        type: String,
        default: "approve",
    },
    isAction: {
        type: Boolean,
        default: true,
    },
    isAdditional: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(["getData"]);

const transactionStore = useTransactionStore();
const masterStore = useMasterStore();
const authStore = useAuthStore();
const { access_token } = storeToRefs(authStore);
const toastRef = ref<InstanceType<typeof Toast> | null>(null);
const total_item = ref(0);
const params = reactive({
    search: "",
    filter: "",
    filters: [
        {
            group: "AND",
            operator: "EQ",
            column: "scope_standart_uuid",
            value: "",
        },
    ],
    currentPage: 1,
    perPage: 10,
});
const open_form = ref(false);
const dataForm = ref<EquipmentCreateInterface | null>(null);
const selected_item = ref<EquipmentInterface | null>(null);
const open_delete = ref(false);
const open_detail = ref(false);

//--- GET EQUIPMENT
const { refetch: refetchEquipment, isFetching: isLoading } = useQuery({
    queryKey: [`getEquipmentGuestDetail${props.id}`],
    queryFn: async () => {
        try {
            const { data, config } = await masterStore.getEquipment(params, '/add-scope/detail');
            const response = data.data as IPagination<EquipmentInterface[]>;

            total_item.value = response.total;

            const id = config?.params?.filters?.[0]?.value;
            emit("getData", id, response.data);

            return response;
        } catch (error: any) {
            const err = error as AxiosError;
            throw err.response;
        }
    },
    retry: 0,
    enabled: false,
    refetchOnWindowFocus: false,
});
//--- END

//--- DELETE EQUIPMENT
const { mutate: deleteEquipment, isPending: isLoadingDelete } = useMutation({
    mutationFn: async (id: string) => {
        return await transactionStore.deleteEquipment(id);
    },
    onSuccess: () => {
        toastRef.value?.showToast({
            title: "Success",
            description: "Deleted successfully",
            type: "success",
        });
        open_delete.value = false;
        refetchEquipment();
    },
    onError: (error: any) => {
        console.log(error);
        toastRef.value?.showToast({
            title: "Error",
            description: error?.response?.data?.message || "Something went wrong",
            type: "error",
        });
    },
    retry: 0,
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
    refetchEquipment();
};

const changeLimit = (e: string) => {
    params.perPage = parseInt(e);
    params.currentPage = 1;
    refetchEquipment();
};

const handleCreate = () => {
    dataForm.value = {
        name: "",
        scope_standart_uuid: props.id,
    };
    selected_item.value = null;
    open_form.value = true;
};

const handleDetail = (item: EquipmentInterface) => {
    selected_item.value = item;
    open_detail.value = true;
};

const handleDelete = (item: EquipmentInterface) => {
    selected_item.value = item;
    open_delete.value = true;
};

const onDelete = () => {
    deleteEquipment(selected_item.value?.uuid as string);
};

const handleSuccess = () => {
    toastRef.value?.showToast({
        title: "Success",
        description: "Saved successfully",
        type: "success",
    });
    params.currentPage = 1;
    refetchEquipment();
};

const handleError = (error: any) => {
    toastRef.value?.showToast({
        title: "Error",
        description: error?.response?.data?.message || "Something went wrong",
        type: "error",
    });
};

const handleRemoveSuccess = () => {
    refetchEquipment();
};

watch(
    () => props.open,
    (value) => {
        if (value === true) {
            params.filters[0].value = props.id;
            params.currentPage = 1;
            refetchEquipment();
        }
    },
    { immediate: true, deep: true }
);
</script>

<template>
    <div class="flex flex-col">
        <div v-if="statusApproval !== 'approve' && access_token" class="flex justify-end">
            <Button icon_only="plus" size="sm" rounded="full" color="blue" @click="handleCreate" />
        </div>
        <Table :columns="ColumnsEquipment" :entities="entity || []" :pagination="pagination" :loading="isLoading"
            :is-create="false" :is-search="false" :is-action="true" @change-page="changePage"
            @change-limit="changeLimit">
            <template #column_action="{ entity: element }">
                <div class="flex items-center justify-center gap-4">
                    <Icon name="eye" class="icon-action-table" @click="handleDetail(element)" />
                    <Icon name="trash" class="icon-action-table" @click="handleDelete(element)" v-if="
                        props.isAction && statusApproval !== 'approve' && access_token
                    " />
                </div>
            </template>
            <template #column_scope_standart="{ entity: element }">
                <p class="text-base text-neutral-50 text-left">
                    {{ element.scope_standart?.name }}
                </p>
            </template>
        </Table>
    </div>

    <FormEquipment v-model="open_form" :data-form="dataForm" :selected-value="selected_item" @success="handleSuccess"
        @error="handleError" @removeSucess="handleRemoveSuccess" />

    <ModalDelete v-model="open_delete" :title="selected_item?.name" :loading="isLoadingDelete" @delete="onDelete" />

    <ModalActivity :is-additional="props.isAdditional" v-model="open_detail" :id="selected_item?.uuid"
        :status-approval="statusApproval" />
    <Toast ref="toastRef" />
</template>
