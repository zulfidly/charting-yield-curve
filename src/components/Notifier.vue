<script setup>
    import { inject } from 'vue'
    const isNotify = inject('isNotify')
    defineProps({
        msg: {
            type: String,
            default: 'initialised'
        }
    })

    const card = {
        init: ['fixed z-10 m-3 left-1/2 -translate-x-1/2 w-11/12 py-4 px-12 text-center bg-orange-300 rounded-xl text-xl tracking-wider text-[var(--vt-c-indigo)] transition-all duration-700'],
        show: ['opacity-100 top-0'],
        hide: ['opacity-0 -top-full'],
    }
</script>

<template>
    <p :class="[card.init, isNotify.isShown?card.show:card.hide]" >
        {{ msg }}
    </p>
</template>