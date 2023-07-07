<script setup>
  import ChartDiv from './components/ChartDiv.vue'
  import TableSummary from './components/TableSummary.vue'
  import Notifier from './components/Notifier.vue'
  import IconGitHub from './components/IconGitHub.vue'
  import { inject } from 'vue'

  const isNotify = inject('isNotify')

  function notifierMngr(msg) {
    isNotify.msg = msg
    isNotify.isShown = true
    setTimeout(()=> isNotify.isShown = false, 4500)
  }
</script>

<template>
  <Notifier :msg="isNotify.msg" />
  
  <header class="font-semibold flex mb-2 gap-4 item-center">
    <IconGitHub />
    <a class="font-semibold" href='https://home.treasury.gov/' target="_blank" aria-label="visit U.S Treasury website">
      U.S Treasury Yield Curve Analysis <br /> 
      <span>(a coding practice)</span>
    </a>    
  </header>

  <ChartDiv @notifyMsg="(x)=> notifierMngr(x)"></ChartDiv>
  <TableSummary />
</template>


