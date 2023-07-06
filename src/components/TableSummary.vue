<script setup>
    import { inject } from 'vue'
    import { onMounted } from 'vue';
    import { ref } from 'vue';
    import { fetchData } from '../main.js'
    import { useVirtualList } from '@vueuse/core';
    const rawData = inject('rawData')
    const iheight = ref(26)
    const tbodyref = ref(null)
    const { list, containerProps, wrapperProps } = useVirtualList(
        rawData,
        {
            itemHeight: iheight.value,
        },
    )

    onMounted(()=> {
        let yr = new Date().getFullYear().toString()
        let url = 'https://home.treasury.gov/resource-center/data-chart-center/interest-rates/TextView?type=daily_treasury_yield_curve&field_tdr_date_value='
        // fetchData('scrapeData', url+yr)
        // .then((resp)=> rawData.value = resp)
    })
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
    <div @scroll="viewtbodyref" v-bind="containerProps" style="height:500px;" class="mt-2 min-w-[inherit] rounded-md">
        <div class="fixed top-0 right-0 text-xs">{{ changeindicator }}</div>
        <table class="w-full table-auto text-center border border-[--color-border]">
            <caption class="caption-top bg-[--table-cap]">Summary Data (in %)</caption>    
            <tbody ref="tbodyref" v-bind="wrapperProps" >
                <tr class="sticky top-0 bg-rose-300 [&>*]:px-3 [&>*]:sm:px-11 bg-[var(--color-background-mute)]">
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
</template>