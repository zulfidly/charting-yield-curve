<script setup>
  import ChartDiv from './components/ChartDiv.vue'
  import TableSummary from './components/TableSummary.vue'
  import Notifier from './components/Notifier.vue'
  import { inject } from 'vue'

  const isNotify = inject('isNotify')

  function notifierMngr(msg) {
    isNotify.msg = msg
    isNotify.isShown = true
    setTimeout(()=> isNotify.isShown = false, 5000)
  }
</script>

<template>
  <Notifier :msg="isNotify.msg" />
  <header class="font-semibold">U.S Treasury Yield Curve Comparison</header>
  <ChartDiv @notifyMsg="(x)=> notifierMngr(x)"></ChartDiv>
  <TableSummary />
</template>


