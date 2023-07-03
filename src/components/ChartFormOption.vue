<script setup>
    import { ref } from 'vue'
    import { computed } from 'vue'
    import { inject } from 'vue'
    const isFetching = inject('isFetching')

    const emiT = defineEmits(['userOptYear'])    
    const endYear = new Date().getFullYear()
    const startYear = 1990
    const arrYear = ref([])     // in numbers
    const selectYrFrom = ref(endYear.toString())
    const selectYrTo = ref(endYear.toString())
    const yearRange = ref([endYear.toString()])   
     
    for(let i = endYear; i>=startYear; i--) {
        arrYear.value.push(i)
    }

    const filteredOptionFrom = computed(()=> arrYear.value.filter((x, y, z)=> {
        return x.toString() <= selectYrTo.value
    }))
    const filteredOptionTo = computed(()=> arrYear.value.filter((x, y, z)=> {
        return x.toString() >= selectYrFrom.value
    }))

    function consolidateDataForCharting() {
        isFetching.value = true
        yearRange.value = []
        for(let i=Number(selectYrFrom.value); i<=Number(selectYrTo.value); i++) {
            yearRange.value.push(i.toString())
        }
        emiT('userOptYear', yearRange.value)
    }
</script>

<template>
    <div class="min-w-[inherit] p-2 border border-[--color-border] rounded-lg bg-[--color-background-soft]">
        <p class="text-center font-normal">Set charting range</p>
        <form class="flex gap-1">
            <section class="border border-[--color-border] basis-2/4 bg-[--color-background-mute] p-2 rounded-lg">
                <label class="font-light sm:mr-2" for="yearFrom">from year </label>
                <select class="rounded-md w-full bg-[--color-background]" id="yearFrom" name="yearFrom" v-model="selectYrFrom">
                    <option class="text-center" v-for="(yr, ind) in filteredOptionFrom" :value="yr" :key="'fr'+yr"> {{ yr }}</option>
                </select>
            </section>
            <section class="border border-[--color-border] basis-2/4 bg-[--color-background-mute] p-2 rounded-lg">
                <label class="font-light sm:mr-2" for="yearTo">to year </label>
                <select class="rounded-md w-full bg-[--color-background]" id="yearTo" name="yearTo" v-model="selectYrTo">
                    <option class="text-center" v-for="(yr, ind) in filteredOptionTo" :value="yr" :key="'to'+yr"> {{ yr }}</option>
                </select>
            </section>
        </form>
        <button class="relative flex justify-center items-center mt-3 py-1 bg-[--view-btn] rounded-lg w-full" @click="consolidateDataForCharting">
            <span class="tracking-wider">View Chart</span>
            <svg v-if="isFetching" class="absolute left-3/4 w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>

        </button>
    </div>
</template>