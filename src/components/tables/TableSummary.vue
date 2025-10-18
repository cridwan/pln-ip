<script lang="ts" setup>
const props = defineProps({
    total_qty: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    total_price: {
        type: Number,
        required: true,
    }
})
</script>

<template>
    <table class="text-white">
        <tbody>
            <tr>
                <td class="font-bold">Total Quantity</td>
                <td class="font-bold">{{ props.total_qty.toLocaleString("id") }}</td>
            </tr>
            <tr>
                <td class="font-bold">Harga</td>
                <td class="font-bold">Rp {{ props.price.toLocaleString("id") }}</td>
            </tr>
            <tr>
                <td class="font-bold">Total Harga</td>
                <td class="font-bold">Rp {{ props.total_price.toLocaleString("id") }}</td>
            </tr>
        </tbody>
    </table>
</template>


<style lang="sass" scoped>
table
  @apply mt-7
  tbody
    tr
      @apply my-2
      td
        @apply bg-[rgb(47,85,151,0.6)] px-3 py-2
</style>