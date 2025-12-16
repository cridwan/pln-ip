<script setup lang="ts">
import { ref, type PropType } from 'vue'
import {
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuRoot,
    DropdownMenuTrigger,
} from 'radix-vue'
import { useRouter } from 'vue-router';
import type { NotificationInterface } from '@/types/GlobalType';
import { dateFormatId } from '@/helpers/global';
import { useMasterStore } from '@/modules/master/stores/MasterStore';
import { useMutation } from '@tanstack/vue-query';

const props = defineProps({
    dataNotification: {
        type: Array as PropType<NotificationInterface[]>,
    }
});

const masterStore = useMasterStore();
const toggleState = ref(false);
const router = useRouter();

// read notification
const { isPending: isLoadingReadNotification, mutate: readNotification } = useMutation({
    mutationFn: async (uuid: string) => {
        return await masterStore.notificationMarkAsRead(uuid);
    },
    onSuccess: (data) => {
        const notification = data.data as NotificationInterface;
        if (notification.uri) {
            router.push(notification.uri);
        }
    },
    onError: (error) => {
        console.log(error);
    },
    retry: 0,
});

function handleClick(notification: NotificationInterface) {
    // eslint-disable-next-line no-alert
    // router.push(notification.uri)
    readNotification(notification.uuid);
}
</script>

<template>
    <DropdownMenuRoot v-model:open="toggleState">
        <DropdownMenuTrigger class="inline-flex items-center justify-center" aria-label="Customise options">
            <slot />
        </DropdownMenuTrigger>

        <DropdownMenuPortal class="bg-white z-20">
            <DropdownMenuContent
                class="min-w-[300px] relative z-20 max-w-[300px] outline-none bg-white rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
                :side-offset="5">
                <DropdownMenuItem :value="notification.uuid" v-for="notification in props.dataNotification"
                    v-if="props.dataNotification && props.dataNotification?.length > 0"
                    class="group text-[13px] py-3 hover:border cursor-pointer text-blue-950 leading-none text-grass11 rounded-[3px] flex items-center px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1"
                    @click="handleClick(notification)">
                    <div class="w-full flex flex-col gap-2">
                        <div class="flex flex-col gap-1">
                            <span class="font-bold text-[14px]">{{ notification.title }}</span>
                            <div
                                class="text-[11px] text-mauve11 group-data-[highlighted]:text-blue-950 group-data-[disabled]:text-mauve8">
                                {{ dateFormatId(notification.created_at) }}
                            </div>
                        </div>
                        <span class="text-[11px]">{{ notification.body }}</span>
                    </div>
                </DropdownMenuItem>
                <DropdownMenuItem value="Not Found" v-else
                    class="group text-[13px] py-3 hover:border cursor-pointer text-blue-950 leading-none text-grass11 rounded-[3px] flex items-center px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1">
                    <span>Tidak ada notifikasi</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenuPortal>
    </DropdownMenuRoot>
</template>