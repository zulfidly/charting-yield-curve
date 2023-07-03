<script setup>
    import { inject } from 'vue'
    const rawData = inject('rawData')
</script>

<template>
    <div class="h-auto overflow-scroll">
        <table class="table-auto w-full text-center border">
            <caption class="caption-top bg-red-200">Table: Year To Date (YTD) Summary Data</caption>
            <thead>
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