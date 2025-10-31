<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
// import type { AxiosError } from "axios";

import Sidebar from "@/components/layouts/Sidebar.vue";
import { HeaderMain, Footer } from "@/components";
// import { useGlobalStore } from "@/stores/GlobalStore";
// import { useTransactionStore } from "@/modules/transaction/stores/TransactionStore";
// import type { TInspection } from "@/modules/inspection/types/InspectionType";
// import { useQuery } from "@tanstack/vue-query";

const imgUrl = new URL("@/assets/images/bg-main-page.jpg", import.meta.url)
  .href;

const page = ["blok", "unit"];

const route = useRoute();
// const globalStore = useGlobalStore();
// const transactionStore = useTransactionStore();
// const { InspectionType } = storeToRefs(globalStore);

// //--- GET DETAIL INSPECTION
// const {
//   data: dataDetailInspection,
//   isFetching: isLoadingDetailInspection,
//   refetch: refetchDetailInspection,
// } = useQuery({
//   queryKey: ["getDetailInspection"],
//   queryFn: async () => {
//     try {
//       const { data } = await transactionStore.getDetailInspection(
//         route.params?.id_inspection as string
//       );

//       const response = data?.data as TInspection;

//       InspectionType.value = response;

//       return response;
//     } catch (error: any) {
//       const err = error as AxiosError;
//       throw err.response;
//     }
//   },
//   refetchOnWindowFocus: false,
// });
// //--- END
</script>

<template>
  <div class="layout-main" :style="{
    backgroundImage: `url(${imgUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }">
    <header>
      <HeaderMain />
    </header>
    <main>
      <Sidebar />
      <div class="layout-main--content">
        <slot />
      </div>
    </main>
    <footer v-if="page.includes((route?.name || '') as string)">
      <Footer />
    </footer>
  </div>
</template>

<style lang="sass">
.layout-main
  @apply fixed max-h-screen overflow-y-auto w-full h-full min-h-screen bg-transparent flex flex-col z-[1]
  > header
    @apply fixed h-[80px] w-full z-[9999]
  > main
    @apply h-full w-full flex-1 relative
  > footer
    @apply fixed bottom-0 w-full z-[9999]
  &--content
    @apply pl-[280px] pr-5 pt-[80px] pb-2
</style>
