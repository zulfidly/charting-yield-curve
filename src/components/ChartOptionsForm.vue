<script setup>
    import { ref } from 'vue'
    import { computed } from 'vue'
    import { inject } from 'vue'
    defineProps({
        disconnectBtn: {
            type: Boolean,
            default: true
        }
    })
    const emiT = defineEmits(['userOptYear'])  
    const appStates = inject('appStates')
    const userDevice = inject('userDevice')
    const endYear = new Date().getFullYear()
    const startYear = 1990
    const arrYear = ref([])     // in numbers
    const selectYrFrom = ref(endYear.toString())
    const selectYrTo = ref(endYear.toString())
    const yearRange = ref([endYear.toString()])       

    for(let i = endYear; i>=startYear; i--) { arrYear.value.push(i) }

    const filteredOptionFrom = computed(()=> arrYear.value.filter((x, y, z)=> {
        return x.toString() <= selectYrTo.value
    }))
    const filteredOptionTo = computed(()=> arrYear.value.filter((x, y, z)=> {
        return x.toString() >= selectYrFrom.value
    }))

    function submitUserOptions(type) {
        appStates.isFetching = true
        yearRange.value = []
        for(let i=Number(selectYrFrom.value); i<=Number(selectYrTo.value); i++) {
            yearRange.value.push(i.toString())
        }
        emiT('userOptYear', {data: yearRange, btn: type })
    }
</script>

<template>
    <div v-show="!userDevice.isMobileLandscape" class="w-full p-2 sm:p-3 border border-[--color-border] rounded-lg bg-[--color-background-soft]">
        <form class="flex gap-1 sm:gap-3">
            <section class="basis-1/2 border border-[--color-border] bg-[--color-background-mute] p-2 rounded-lg">
                <label class="font-normal w-20 text-center italic sm:mr-2" for="yearFrom">fr</label>
                <select class="w-11/12 rounded-md bg-[--color-background]" id="yearFrom" name="yearFrom" v-model="selectYrFrom">
                    <option class="text-center" v-for="(yr, ind) in filteredOptionFrom" :value="yr" :key="'fr'+yr"> {{ yr }}</option>
                </select>
            </section>
            <p class="text-center font-normal">Set data range</p>
            <section class="basis-1/2 border border-[--color-border] bg-[--color-background-mute] p-2 rounded-lg">
                <label class="font-normal w-20 text-center italic sm:mr-2" for="yearTo">to</label>
                <select class="w-11/12 rounded-md bg-[--color-background]" id="yearTo" name="yearTo" v-model="selectYrTo">
                    <option class="text-center" v-for="(yr, ind) in filteredOptionTo" :value="yr" :key="'to'+yr"> {{ yr }}</option>
                </select>
            </section>
        </form>

        <section class="flex gap-1 sm:gap-3">
            <button class="flex gap-4 justify-center items-center mt-3 py-1 bg-[--view-btn] rounded-lg w-full"
                @click="submitUserOptions('viewTable')">
                <span class="tracking-wider">View Table</span>
                <svg v-if="!appStates.isFetching" class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5" />
                </svg>
                <svg v-if="appStates.isFetching" class="w-6 h-6 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
            </button>

            <button :disabled="!disconnectBtn" :class="[!disconnectBtn?'opacity-0':'opacity-100 bg-[--view-btn]']" class="flex gap-4 justify-center items-center mt-3 py-1 rounded-lg w-full"
                @click="submitUserOptions('viewDifferentialChart')">
                <span class="tracking-wider">Differential Charts</span>
                <svg v-if="!appStates.isChartShowing" class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
                </svg>
                <svg v-if="appStates.isChartShowing" class="w-6 h-6 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
            </button>

            <button :disabled="!disconnectBtn" :class="[!disconnectBtn?'opacity-0':'opacity-100 bg-[--view-btn]']" class="flex gap-4 justify-center items-center mt-3 py-1 rounded-lg w-full"
                @click="submitUserOptions('viewStandardChart')">
                <span class="tracking-wider">Standard Charts</span>
                <svg v-if="!appStates.isChartShowing" class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
                </svg>
                <svg v-if="appStates.isChartShowing" class="w-6 h-6 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
            </button>
        </section>
    </div>
</template>