<script setup>
    import { inject } from 'vue'
    import { ref } from 'vue';
    import { useVirtualList } from '@vueuse/core';
    const rawData = inject('rawData')
    const isDataContinuityOK = inject('isDataContinuityOK')
    const iheight = ref(26)
    const tbodyref = ref(null)
    const { list, containerProps, wrapperProps } = useVirtualList(
        rawData,
        {
            itemHeight: iheight.value,
        },
    )

    const changeindicator = ref('init')
    function viewtbodyref() {
        let getLastRenderedDate = tbodyref.value.lastElementChild.firstElementChild.textContent
        let getNumberOfRenderedList = tbodyref.value.childElementCount
        changeindicator.value = '[' + getNumberOfRenderedList + ']: ' + tbodyref.value.lastElementChild.firstElementChild.textContent
    }
</script>

<style scoped>
    tbody { display: inline-block; }
</style>

<template>
    <div class="flex flex-col mt-2 w-full rounded-md">
        <div class="fixed bottom-0 right-0 text-xs">{{ changeindicator }}</div>
        <div class="text-center mx-auto" @scroll="viewtbodyref" v-bind="containerProps" style="height:500px;">
            <p class="bg-[--table-cap]">Summary Data (in %)</p> 
            <div class="inline-block w-full" ref="tbodyref" v-bind="wrapperProps">
                <section class="table-row sticky top-0 bg-rose-300 [&>*]:px-2  [&>*]:lg:px-20 bg-[var(--color-background-mute)]">
                    <p class="table-cell">Date</p>
                    <p class="table-cell">10yr</p>
                    <p class="table-cell">2yr</p>
                    <p class="table-cell">3mth</p>
                    <p class="table-cell">10yr-2yr</p>
                    <p class="table-cell">10yr-3mth</p>
                </section>
                <section v-if="isDataContinuityOK" v-for="(item, ind) in list" :style="'height:'+iheight+'px;'" :key="'row'+ind" class="table-row [&>*]:sm:px-10 [&>*]:even:bg-[var(--color-background-mute)]">
                    <p class="table-cell">{{ Intl.DateTimeFormat('en-GB').format(new Date(item.data.date)) }}</p>
                    <p class="table-cell">{{ item.data['10yr'] }}</p>
                    <p class="table-cell">{{ item.data['2yr'] }}</p>
                    <p class="table-cell">{{ item.data['3mth'] }}</p>
                    <p class="table-cell">{{ (item.data['10yr'] - item.data['2yr']).toFixed(2) }}</p>
                    <p class="table-cell">{{ (item.data['10yr'] - item.data['3mth']).toFixed(2) }}</p>
                </section>
            </div>
        </div>
    </div>
</template>
<!-- <template>
    <div @scroll="viewtbodyref" v-bind="containerProps" style="height:500px;" class="mt-2 min-w-[inherit] rounded-md">
        <div class="fixed top-0 right-0 text-xs">{{ changeindicator }}</div>
        <table class="w-full table-auto text-center">
            <caption class="caption-top bg-[--table-cap]">Summary Data (in %)</caption>    
            <tbody ref="tbodyref" v-bind="wrapperProps" >
                <tr class="w-screen sticky top-0 bg-rose-300 [&>*]:px-3 [&>*]:sm:px-11 bg-[var(--color-background-mute)]">
                    <td>Date</td>
                    <td>10yr</td>
                    <td>2yr</td>
                    <td>3mth</td>
                    <td>10yr-2yr</td>
                    <td>10yr-3mth</td>
                </tr>
                <tr v-for="(item, ind) in list" :style="'height:'+iheight+'px;'" :key="'row'+ind" class="[&>*]:even:bg-[var(--color-background-mute)]">
                    <td>{{ Intl.DateTimeFormat('en-GB').format(new Date(item.data.date)) }}</td>
                    <td>{{ item.data['10yr'] }}</td>
                    <td>{{ item.data['2yr'] }}</td>
                    <td>{{ item.data['3mth'] }}</td>
                    <td>{{ (item.data['10yr'] - item.data['2yr']).toFixed(2) }}</td>
                    <td>{{ (item.data['10yr'] - item.data['3mth']).toFixed(2) }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template> -->