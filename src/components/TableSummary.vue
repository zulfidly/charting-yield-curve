<script setup>
    import { inject } from 'vue'
    import { fetchData } from '../main.js'
    import { onMounted } from 'vue';
    const rawData = inject('rawData')

    onMounted(()=> {
        let yr = new Date().getFullYear().toString()
        let url = 'https://home.treasury.gov/resource-center/data-chart-center/interest-rates/TextView?type=daily_treasury_yield_curve&field_tdr_date_value='
        // fetchData('scrapeData', url+yr)
        // .then((resp)=> rawData.value = resp)
    })
</script>

<template>
    <div class="mt-2 min-w-[inherit] h-[75svh] overflow-scroll rounded-md">
        <table class="table-auto w-full text-center border border-[--color-border]">
            <caption class="caption-top bg-[--table-cap]">Summary Data (%)</caption>
            <thead class="sticky top-0">
                <tr class="[&>*]:p-1 bg-[var(--color-background-mute)]">
                    <th>Date</th>
                    <th>10 yr</th>
                    <th>2 yr</th>
                    <th>3 mth</th>
                    <th>10yr-2yr</th>
                    <th>10yr-3mth</th>
                </tr>
            </thead>
    
            <tbody>
                <tr v-for="(item, ind) in rawData" :key="'row'+ind" class="[&>*]:even:bg-[var(--color-background-mute)]">
                    <td>{{ Intl.DateTimeFormat('en-GB').format(new Date(item.date)) }}</td>
                    <td>{{ item['10yr'] }}</td>
                    <td>{{ item['2yr'] }}</td>
                    <td>{{ item['3mth'] }}</td>
                    <td>{{ (item['10yr'] - item['2yr']).toFixed(2) }}</td>
                    <td>{{ (item['10yr'] - item['3mth']).toFixed(2) }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>