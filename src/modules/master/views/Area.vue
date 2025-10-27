<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import { AxiosError } from "axios";

import {
    Breadcrumb,
    Button,
    Icon,
    ModalDelete,
    Table,
    Toast,
} from "@/components";
import { useMutation, useQuery } from "@tanstack/vue-query";
import type { IPagination } from "@/types/GlobalType";
import type { BreadcrumbType } from "@/components/navigations/Breadcrumb.vue";

import { useMasterStore } from "../stores/MasterStore";
import ButtonGroup from "../components/ButtonGroup.vue";
import type { AreaInterface } from "../types/AreaType";
import FormArea from "../components/FormArea.vue";
import { ColumnsArea } from "../constants/AreaConstant";

const masterStore = useMasterStore();
const total_item = ref(0);
const params = reactive({
    search: "",
    filter: "",
    currentPage: 1,
    perPage: 10,
});
const open_form = ref(false);
const open_delete = ref(false);
const selected_item = ref<AreaInterface | null>(null);
const toastRef = ref<InstanceType<typeof Toast> | null>(null);
const timeout = ref(0);
const breadcrumb = ref<BreadcrumbType[]>([]);

//--- GET AREA
const {
    data: dataArea,
    isFetching: isLoadingArea,
    refetch: refetchArea,
} = useQuery({
    queryKey: ["getAreaMaster"],
    queryFn: async () => {
        try {
            const { data } = await masterStore.getArea(params);
            const response = data as IPagination<AreaInterface[]>;

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

//--- DELETE AREA
const { mutate: deleteArea, isPending: isLoadingDelete } = useMutation({
    mutationFn: async (id: string) => {
        return await masterStore.deleteArea(id);
    },
    onSuccess: () => {
        toastRef.value?.showToast({
            title: "Success",
            description: "Deleted successfully",
            type: "success",
        });
        open_delete.value = false;
        refetchArea();
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

//--- DOWNLOAD
const { mutate: downloadArea, isPending: isLoadingDownload } = useMutation({
    mutationFn: async () => {
        return await masterStore.downloadArea();
    },
    onSuccess: () => { },
    onError: (error) => {
        console.log(error);
    },
});
//--- END

//--- DOWNLOAD TEMPLATE
const { mutate: templateArea, isPending: isLoadingTemplate } = useMutation({
    mutationFn: async () => {
        return await masterStore.templateArea();
    },
    onSuccess: () => { },
    onError: (error) => {
        console.log(error);
    },
});
//--- END

//--- IMPORT
const { mutate: importArea, isPending: isLoadingImport } = useMutation({
    mutationFn: async (payload: File) => {
        return await masterStore.importArea(payload);
    },
    onSuccess: () => {
        toastRef.value?.showToast({
            title: "Success",
            description: "Import successfully",
            type: "success",
        });
        refetchArea();
    },
    onError: (error) => {
        let message = "Something went wrong";

        if (error instanceof AxiosError) {
            message = error?.response?.data?.message || "Something went wrong";
        }

        toastRef.value?.showToast({
            title: "Error",
            description: message,
            type: "error",
        });

        refetchArea();
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
    refetchArea();
};

const changeLimit = (e: string) => {
    params.perPage = parseInt(e);
    params.currentPage = 1;
    refetchArea();
};

const searchTable = () => {
    clearTimeout(timeout.value);
    timeout.value = window.setTimeout(() => {
        params.currentPage = 1;
        refetchArea();
    }, 1000);
};

const handleSuccess = () => {
    toastRef.value?.showToast({
        title: "Success",
        description: "Saved successfully",
        type: "success",
    });
    params.currentPage = 1;
    refetchArea();
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

const handleUpdate = (item: AreaInterface) => {
    selected_item.value = item;
    open_form.value = true;
};

const handleDelete = (item: AreaInterface) => {
    selected_item.value = item;
    open_delete.value = true;
};

const onDelete = () => {
    deleteArea(selected_item.value?.uuid as string);
};

const handleDownload = () => {
    downloadArea();
};

const handleExportTemplate = () => {
    templateArea();
};

const handleImport = (file: File) => {
    importArea(file);
};

onMounted(() => {
    breadcrumb.value = [
        {
            name: "Main Menu",
            as_link: false,
            url: "",
        },
        {
            name: "Master Data",
            as_link: false,
            url: "",
        },
        {
            name: "Area",
            as_link: false,
            url: "",
        },
    ];
});
</script>

<template>
    <Breadcrumb :items="breadcrumb" />
    <div class="relative w-full mt-6">
        <div class="flex items-center gap-2 absolute right-0">
            <!-- <Button text="Import" rounded="full" color="blue" />
      <Button text="Download" rounded="full" color="blue" />
      <Button text="Export Template" rounded="full" color="blue" /> -->
            <ButtonGroup :loading-import="isLoadingImport" :loading-download="isLoadingDownload"
                :loading-template="isLoadingTemplate" @download="handleDownload" @template="handleExportTemplate"
                @import="handleImport" />
            <Button icon_only="plus" size="sm" rounded="full" color="blue" @click="handleCreate" />
        </div>

        <Table label-create="Area" :columns="ColumnsArea" :entities="dataArea?.data || []" :loading="isLoadingArea"
            :pagination="pagination" :is-create="false" v-model:model-search="params.search" @change-page="changePage"
            @change-limit="changeLimit" @search="searchTable">
            <template #column_action="{ entity }">
                <div class="flex items-center justify-center gap-4">
                    <Icon name="pencil" class="icon-action-table" @click="handleUpdate(entity)" />
                    <Icon name="trash" class="icon-action-table" @click="handleDelete(entity)" />
                </div>
            </template>
        </Table>

        <FormArea v-model="open_form" :selected-value="selected_item" @success="handleSuccess" @error="handleError" />
    </div>

    <Toast ref="toastRef" />
    <ModalDelete v-model="open_delete" :title="selected_item?.name" :loading="isLoadingDelete" @delete="onDelete" />
</template>

<style lang="sass"></style>
