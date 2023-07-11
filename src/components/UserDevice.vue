<template></template>
<script setup>
    import { onMounted } from 'vue'
    import { inject } from 'vue'
    import { computed } from 'vue'
    const userDevice = inject('userDevice')

    const formF = computed(()=> {
        if(userDevice.orientation=='portrait-primary' || userDevice.orientation=='portrait-secondary') {
            let ratio = window.screen.width / window.screen.height
            if(window.screen.height < 1024) {     // entering hand-held devices
                if      (ratio < 0.5) return 'Smartphone'
                else if (0.5 <= ratio && ratio < 1) return 'Tablet'
                else return 'unknown1'
            }
            else {    // if height > 1024px in portrait i.e: vertical LED screen
                return 'Desktop|Laptop'
            }
        }
        else if(userDevice.orientation=='landscape-primary' || userDevice.orientation=='landscape-secondary') {
            if(window.screen.width < 1024) {
                let ratio = window.screen.height / window.screen.width
                if      (ratio < 0.5) return 'Smartphone'
                else if (0.5 <= ratio && ratio < 1) return 'Tablet'
                else return 'unknown2'
            }
            else {    // if width > 1024px in landscape i.e: laptops or normal horizontal desktop screens 
                return 'Desktop|Laptop'
            }
        }
        else return 'unknown3'
    })
    const isMobLscape = computed(()=> {
        if(
            (userDevice.formFactor=='Smartphone' || userDevice.formFactor=='Tablet') && (userDevice.orientation=='landscape-primary'||userDevice.orientation=='landscape-secondary')
        ) return true
        else return false
    })

    window.addEventListener('resize', ()=> {
        // console.log('W:', window.innerWidth, 'H:', window.innerHeight);
        userDevice.scrW = window.innerWidth
        userDevice.scrH = window.innerHeight
        userDevice.ratioWH = (window.screen.width / window.screen.height).toFixed(2)
        userDevice.orientation = window.screen.orientation.type
        userDevice.formFactor = formF.value
        userDevice.isMobileLandscape = isMobLscape.value        
        // console.log(isMobLscape.value); 
    })

    onMounted(()=> {
        userDevice.scrW = window.innerWidth
        userDevice.scrH = window.innerHeight
        userDevice.orientation = window.screen.orientation.type
        userDevice.ratioWH = (window.screen.width / window.screen.height).toFixed(2),
        userDevice.formFactor = formF.value
        userDevice.isMobileLandscape = isMobLscape.value 
    })

</script>