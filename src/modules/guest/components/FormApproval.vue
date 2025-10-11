<script setup lang="ts">
import { reactive, ref, computed, type PropType, watch } from "vue";

import { Button, Input, Modal, Textarea } from "@/components";
import useVuelidate from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { useMutation } from "@tanstack/vue-query";
import { all_characters } from "@/helpers/global";
import { useTransactionStore } from "../stores/TransactionStore";
import type { FormApprovalInterface } from "../types/ApprovalType";
import { useRoute } from "vue-router";


const emit = defineEmits(["success", "error"]);
const route = useRoute();
const transactionStore = useTransactionStore();

const modelValue = defineModel<boolean>({ default: false });

const model = ref<FormApprovalInterface>({
    reason: "",
});
const v$_form = reactive(useVuelidate());
const rules = computed(() => {
    return {
        reason: {
            required: helpers.withMessage(`This field is required`, required),
        },
    };
});

const { isPending: isLoadingApprove, mutate: approveProject } = useMutation({
    mutationKey: ["approveProjectTransaction"],
    mutationFn: async (paylaod: FormApprovalInterface) => {
        return await transactionStore.approveProject(
            route.params.id_project as string, paylaod
        );
    },
    onSuccess: () => {
        emit('success');
    },
    onError: () => {
        emit('error');
    },
    retry: 0,
});
//--- END

const handleSubmit = async () => {
    const isValid = await v$_form.value.$validate();

    if (!isValid) return;

    approveProject({ reason: model.value.reason })
};

const setValue = () => {
    model.value = {
        reason: "",
    };
};

const resetValue = () => {
    model.value = {
        reason: "",
    };
};

watch(modelValue, (value) => {
    if (!value) {
        setTimeout(() => {
            resetValue();
        }, 500);
    }
});
</script>

<template>
    <Modal width="440" height="200" :showButtonClose="false" title="Unapproval Project" v-model="modelValue">
        <form class="flex flex-col gap-4 max-h-[calc(100vh-200px)] overflow-y-auto mx-[-20px] px-5"
            @submit.prevent="handleSubmit">
            <Textarea v-model="model.reason" :rules="rules.reason" :custom_symbols="all_characters"
                label="Tambahkan catatan" />

            <div class="w-full flex items-center gap-4 mt-4">
                <Button text="Batal" class="w-full" variant="secondary" :disabled="isLoadingApprove"
                    @click="modelValue = false" />
                <Button type="submit" text="Simpan" class="w-full" color="blue" :disabled="isLoadingApprove"
                    :loading="isLoadingApprove" />
            </div>
        </form>
    </Modal>
</template>
