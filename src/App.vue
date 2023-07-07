<script setup>
  import UserDevice from './components/UserDevice.vue'
  import ChartDiv from './components/ChartDiv.vue'
  import TableSummary from './components/TableSummary.vue'
  import Notifier from './components/Notifier.vue'
  import IconGitHub from './components/IconGitHub.vue'
  import { inject } from 'vue'
  const userDevice = inject('userDevice')
  const isNotify = inject('isNotify')

  function notifierMngr(msg) {
    isNotify.msg = msg
    isNotify.isShown = true
    setTimeout(()=> isNotify.isShown = false, 4500)
  }
</script>

<template>
  <Notifier :msg="isNotify.msg" />
  <UserDevice />  

  <div v-show="!userDevice.isMobileLandscape" class="px-4 pb-1 gap-4 flex justify-start items-center">
    <IconGitHub />
      <a class="font-semibold" href='https://home.treasury.gov/' target="_blank" aria-label="visit U.S Treasury website">
        U.S Treasury Yield Curve Analysis <br /> 
        <cite class="font-thin">
          this is a coding practice
        </cite>
      </a>  
  </div>

  <ChartDiv @notifyMsg="(x)=> notifierMngr(x)"></ChartDiv>
  <TableSummary />
</template>


