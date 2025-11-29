<script setup lang="ts">
import { computed, reactive, ref, watch, type PropType } from "vue";
import type { AxiosError } from "axios";
import { Table, Icon } from "@/components";
import { ColumnsEquipment } from "@/modules/master/constants/EquipmentConstant";
import type { EquipmentInterface } from "@/modules/transaction/types/EquipmentType";
import { useQuery } from "@tanstack/vue-query";
import type { IPagination } from "@/types/GlobalType";

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
const masterStore = useMasterStore();
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
const selected_item = ref<EquipmentInterface | null>(null);
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

const handleDetail = (item: EquipmentInterface) => {
    selected_item.value = item;
    open_detail.value = true;
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
        <Table :columns="ColumnsEquipment" :entities="entity || []" :pagination="pagination" :loading="isLoading"
            :is-create="false" :is-search="false" :is-action="true" @change-page="changePage"
            @change-limit="changeLimit" :is_logging="false">
            <template #column_action="{ entity: element }">
                <div class="flex items-center justify-center gap-4">
                    <Icon name="eye" class="icon-action-table" @click="handleDetail(element)" />
                </div>
            </template>
            <template #column_scope_standart="{ entity: element }">
                <p class="text-base text-neutral-50 text-left">
                    {{ element.scope_standart?.name }}
                </p>
            </template>
        </Table>
    </div>

    <ModalActivity :is-additional="props.isAdditional" v-model="open_detail" :id="selected_item?.uuid" />
</template>
