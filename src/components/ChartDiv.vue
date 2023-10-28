<template>
  <div class="mb-2 sm:mb-0 lg:mb-4">
    <ChartForm @userOptYear="(x)=> userSubmission(x)" :disconnectBtn="appStates.isDataContinuityOK" />
    <div v-if="appStates.isChartShowing" class="fixed z-10 top-0 left-0 w-screen h-screen transition-all duration-300" id="curve_chart" ref="gcchart" ></div>
    <button v-if="appStates.isChartShowing" @click="appStates.isChartShowing=false" class=" z-20 fixed top-0 right-0 m-4 lg:m-8" >
      <ChartIconClose />
    </button>  
  </div>
</template>

<script setup>
  import ChartForm from './ChartOptionsForm.vue'
  import ChartIconClose from './ChartIconClose.vue'
  import { fetchData } from '../main.js'
  import { ref } from 'vue'
  import { watch } from 'vue'
  import { inject } from 'vue'
  const emiT = defineEmits(['notifyMsg'])
  const appStates = inject('appStates')
  const userDevice = inject('userDevice')
  const gcchart = ref(null)
  const chartType = ref(undefined)
  let color = {}
  function getChartColor() {
    var r = document.querySelector(':root')
    var rs = getComputedStyle(r)
    let txtClr = rs.getPropertyValue("--chart-text").trim()
    color = {
      mainTitle: txtClr,
      legendTextColor: txtClr,
      xAxisLabels: txtClr,
      yAxisLabels: txtClr,
      chartAreaBG: rs.getPropertyValue("--chartarea-bg").trim(),
      chartBG: rs.getPropertyValue("--chart-bg").trim(),
    }
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
  window.matchMedia("(prefers-color-scheme:dark)").addEventListener("change", () => {
    if(userDevice.isChartShowing) displayChart()
  })
  watch(      // redraw chart if device is rotated, to fit the screen's W & H
    userDevice,
    ()=> {
      if(appStates.isChartShowing == false) return
      else {
        setChartDimension()
        displayChart()
      }
    }
  )
  
  let scopedDataObj = {}
  function userSubmission(obj) {
    if(obj['data'].value.toString() == scopedDataObj.toString() && (appStates.isDataContinuityOK == true)) {   //skip fetch if same data is used
      appStates.isFetching = false
      chartType.value = obj.btn
      buildChartingData(appStates.rawData, obj.btn)
      displayChart()
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
          promises.push(promis)
        })
        Promise.all(promises)
        .then((resp)=> {
          appStates.isFetching = false
          appStates.isDataContinuityOK = true
          resp.forEach((obj, ind)=> {
            if(obj.statusCode == 500) {
              appStates.isDataContinuityOK = false
              emiT('notifyMsg', 'The server rejected request for data, \n try shorten the range (year) \n or try again. ')
            }
          })
          if(appStates.isDataContinuityOK == true) {
            appStates.rawData = resp.flat()
            buildChartingData(appStates.rawData, obj.btn)
          }
          else {
            appStates.rawData = []
            return
          }
          if(obj.btn === 'viewDifferentialChart' || obj.btn === 'viewStandardChart') {
              displayChart()
          }
        })
        .catch((err)=> {
          appStates.isDataContinuityOK = false
        })
    }
  }

  function displayChart() {
    appStates.isChartShowing = true
    google.charts.load('current', { 'packages': ['corechart'] });            
    google.charts.setOnLoadCallback(drawChart) 
  }
  function drawChart() {
    getChartColor()
    setChartDimension()
    var data = google.visualization.arrayToDataTable(appStates.chartData);
    var options = {
      title: chartType.value === 'viewDifferentialChart' ? 
      'U.S Treasury Yield Curve Difference' :
      'U.S Treasury Yield Standard Charts',
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
    var chart = new google.visualization.LineChart(gcchart.value);
    chart.draw(data, options);
  }

  function buildChartingData(arr, btn) {
    if(btn === 'viewDifferentialChart') {
      appStates.chartData = [['Month', '10yr−2yr', '10yr−3mth']]
      arr.forEach((obj, ind)=> {
        let TenyrTwoyr = (obj['10yr']-obj['2yr']).toFixed(3) * 1
        let TenyrThreemth = (obj['10yr']-obj['3mth']).toFixed(3) * 1
        let ddmmyyyy = Intl.DateTimeFormat('en-GB').format(new Date(obj.date)) 
        if(typeof TenyrTwoyr === 'number' && typeof TenyrThreemth === 'number') {
          if(isNaN(TenyrTwoyr) || isNaN(TenyrThreemth)) return
          else appStates.chartData.push([ddmmyyyy, TenyrTwoyr, TenyrThreemth])
        }
        else return
      })
    }
    else if(btn === 'viewStandardChart') {
      appStates.chartData = []
      arr.forEach((obj, ind)=> {
        let threeMth = Number(obj['3mth']).toFixed(3) * 1
        let twoYr = Number(obj['2yr']).toFixed(3) * 1
        let tenYr = Number(obj['10yr']).toFixed(3) * 1
        let ddmmyyyy = Intl.DateTimeFormat('en-GB').format(new Date(obj.date)) 
        if(typeof threeMth === 'number' && typeof twoYr === 'number' && typeof tenYr === 'number') {
          if(isNaN(threeMth) || isNaN(twoYr) || isNaN(tenYr)) return
          else appStates.chartData.push([ddmmyyyy, threeMth, twoYr, tenYr])
        }
        else return
      })
      appStates.chartData.unshift(['Month', '3 month', '2 Year', '10 Year'])
    }
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