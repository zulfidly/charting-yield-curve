<script setup>
    import { ref } from 'vue'
    import { computed } from 'vue'
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
        yearRange.value = []
        for(let i=Number(selectYrFrom.value); i<=Number(selectYrTo.value); i++) {
            yearRange.value.push(i.toString())
        }
        emiT('userOptYear', yearRange.value)
    }
</script>

<template>
    <div>
        <p>Get chart duration year span {{ selectYrFrom }} {{ selectYrTo }}</p>
        <form>
            <label for="yearFrom">From year </label>
            <select id="yearFrom" name="yearFrom" v-model="selectYrFrom">
                <option v-for="(yr, ind) in filteredOptionFrom" :value="yr" :key="'fr'+yr"> {{ yr }}</option>
            </select>

            <label for="yearTo">To year </label>
            <select id="yearTo" name="yearTo" v-model="selectYrTo">
                <option v-for="(yr, ind) in filteredOptionTo" :value="yr" :key="'to'+yr"> {{ yr }}</option>
            </select>
        </form>
        <button class="bg-green-300 rounded-lg px-2" @click="consolidateDataForCharting">View Chart</button>
    </div>
</template>