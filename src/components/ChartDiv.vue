<template>
  <div>
    <ChartForm @userOptYear="(x)=> userSubmission(x)" :disconnectBtn="isDataContinuityOK" />
    <div v-show="isChartShowing" class="fixed z-10 top-0 left-0 w-screen h-screen" id="curve_chart" ref="gcchart" ></div>
    <button v-if="isChartShowing" @click="isChartShowing=!isChartShowing" class=" z-20 fixed top-0 right-0 m-4 lg:m-8" >
      <ChartIconClose />
    </button>  
  </div>
</template>

<script setup>
  import ChartForm from './ChartOptionsForm.vue'
  import ChartIconClose from './ChartIconClose.vue'
  import { fetchData } from '../main.js'
  import { ref } from 'vue'
  import { onMounted } from 'vue'
  import { inject } from 'vue'
  const emiT = defineEmits(['notifyMsg'])
  const isChartShowing = ref(false)
  const isDataContinuityOK = inject('isDataContinuityOK')
  const chartData = inject('chartData')
  const rawData = inject('rawData')
  const isFetching = inject('isFetching')
  const gcchart = ref(null)
  var r = document.querySelector(':root')
  var rs = getComputedStyle(r)
  let txtClr = rs.getPropertyValue("--chart-text").trim()
  let color = {
    mainTitle: txtClr,
    legendTextColor: txtClr,
    xAxisLabels: txtClr,
    yAxisLabels: txtClr,
    chartAreaBG: rs.getPropertyValue("--chartarea-bg").trim(),
    chartBG: rs.getPropertyValue("--chart-bg").trim(),
  }
  let dimension = {
    innerChart: {
      W: undefined,
      H: undefined,
      L: undefined,
      T: undefined,
    },
    outerChart: {
      W: undefined,
      H: undefined,
    }
  }

  onMounted(()=> { addListener_resize() })
  function addListener_resize() {
    window.addEventListener('resize', ()=> {
      console.log('W:', window.innerWidth, 'H:', window.innerHeight);
      if(isChartShowing.value == false) return
      setChartDimension()
      displayChart()
    })
  }
  
  let scopedDataObj = {}
  function userSubmission(obj) {
    // isDataContinuityOK.value = true
    // if(obj['data'].value.length > 3) emiT('notifyMsg', 'Processing large amount of data at once may cause your device to be unresponsive')
    if(obj['data'].value.toString() == scopedDataObj.toString() && isDataContinuityOK.value == true) {   //skip fetch if same data is used
      isFetching.value = false
      if(obj.btn == 'viewChart') {    // use already fetched data
        buildChartingData(rawData.value)
        displayChart()
      }
    }
    else {
      scopedDataObj = [...obj['data'].value]    // make a copy
      const endurl = 'https://home.treasury.gov/resource-center/data-chart-center/interest-rates/TextView?type=daily_treasury_yield_curve&field_tdr_date_value='
      let promises = []
      scopedDataObj.forEach(function(yr, ind) {
          let endpoint = endurl + yr.toString()
          let promis = new Promise((resolve, reject)=> {
            let fetched = fetchData('scrapeData', endpoint)
            resolve(fetched)
          })

          promis.then((x) => {
            if(x.statusCode == 500) {
              isDataContinuityOK.value = false
              rawData.value = []
              emiT('notifyMsg', 'Data fetching error occured, \n try shorten the range (year) \n or try again. ')
            } else isDataContinuityOK.value = true
          })
          promises.push(promis)
        })
        console.log(promises);
        Promise.all(promises)
        .then((resp)=> {
          isFetching.value = false
          if(isDataContinuityOK.value == false) return
          if(isDataContinuityOK.value == true) rawData.value = resp.flat()
          // console.log(rawData.value);
          if(obj.btn == 'viewChart') {
            buildChartingData(rawData.value)
            displayChart()
          }
        })
        .catch((err)=> {
          isDataContinuityOK.value = false
          // emiT('notifyMsg', 'Inconsistent data continuity detected, \n try shorten the range (year) \n and try again. ')
          // console.error('data discontinuity:', err)
        })
    }
  }

  function displayChart() {
    isChartShowing.value = true
    google.charts.load('current', { 'packages': ['corechart'] });            
    google.charts.setOnLoadCallback(drawChart) 
  }
  function drawChart() {
    // console.log('drawing chart');
    setChartDimension()
    var data = google.visualization.arrayToDataTable(chartData.value);
    var options = {
      title: "U.S Treasury Yield Curve Difference",
      titlePosition: "out",
      titleTextStyle: {
          fontSize: 16,
          bold: true,
          color: color.mainTitle,
      },
      width: dimension.outerChart.W,
      height: dimension.outerChart.H,         
      backgroundColor: color.chartBG,
      chartArea: {
        top: dimension.innerChart.T,
        left: dimension.innerChart.L,
        width: dimension.innerChart.W,
        height: dimension.innerChart.H,
        backgroundColor: color.chartAreaBG
      },
      vAxis: {
        textPosition: "out",
        textStyle: {
          fontSize: 14,
          bold: true,
          color: color.yAxisLabels,
        },
      },
      hAxis: { 
        textPosition: "out",
        slantedText: true, 
        slantedTextAngle: 45,
        showTextEvery: 28,
        viewWindowMode: "pretty",
        textStyle: {
            fontSize: 14,
            color: color.xAxisLabels,
        },
      },
      legend: {
        position: "top",
        alignment: "end",
        textStyle: {
            color: color.legendTextColor,
            bold: true,
        },
      },
    };

    var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
    chart.draw(data, options);
  }
  function buildChartingData(arr) {
    // console.log('arr:', arr);
    chartData.value = [['Month', '10yr−2yr', '10yr−3mth']]
    arr.forEach((obj, ind)=> {
      let TenyrTwoyr = (obj['10yr']-obj['2yr']).toFixed(3) * 1
      let TenyrThreemth = (obj['10yr']-obj['3mth']).toFixed(3) * 1
      let ddmmyyyy = Intl.DateTimeFormat('en-GB').format(new Date(obj.date)) 
      if(!isNaN(TenyrTwoyr) && !isNaN(TenyrThreemth)) chartData.value.push([ddmmyyyy, TenyrTwoyr, TenyrThreemth])
    })
    // console.log('chartingData:', chartData.value);
  }
  function setChartDimension() { 
    dimension.innerChart.W = window.innerWidth * 0.75
    dimension.innerChart.H = window.innerHeight * 0.65
    dimension.innerChart.T = "auto"
    dimension.innerChart.L = "auto"
    dimension.outerChart.W = window.innerWidth
    dimension.outerChart.H = window.innerHeight
  }

</script>