<template>
  <div>
    <ChartForm @userOptYear="(x)=> userWantsToViewChart(x)" />
    <header>U.S Treasury Yield Curve Comparison</header>
    <div v-show="isChartShowing" @click="isChartShowing=!isChartShowing" class="fixed top-0 left-0 w-screen h-screen" id="curve_chart" ref="gcchart" ></div>
  </div>
</template>

<script setup>
  import ChartForm from './ChartFormOption.vue'
  import { fetchData } from '../main.js'
  import { ref } from 'vue'
  import { onMounted } from 'vue'
  import { inject } from 'vue'
  const isChartShowing = ref(false)
  const isDataContinuityOK = ref(undefined)
  const chartData = inject('chartData')
  const rawData = inject('rawData')
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
      if(isChartShowing.value == false) return
      setChartDimension()
      displayChart()
    })
  }
  function displayChart() {
    isChartShowing.value = true
    google.charts.load('current', { 'packages': ['corechart'] });            
    google.charts.setOnLoadCallback(drawChart) 
  }
  function drawChart() {
    console.log('drawing chart');
    setChartDimension()
    var data = google.visualization.arrayToDataTable(chartData);
    var options = {
      title: "Treasury Yield Curve Differences",
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
  function buildChartingData() {
    rawData.value.forEach((obj, ind)=> {
      let TenyrTwoyr = (obj['10yr']-obj['2yr']).toFixed(3) * 1
      let TenyrThreemth = (obj['10yr']-obj['3mth']).toFixed(3) * 1
      let ddmmyyyy = Intl.DateTimeFormat('en-GB').format(new Date(obj.date))      
      chartData.push([ddmmyyyy, TenyrTwoyr, TenyrThreemth])
    })
    console.log('chartingData:', chartData);
  }
  function setChartDimension() { 
    dimension.innerChart.W = window.innerWidth * 0.75
    dimension.innerChart.H = window.innerHeight * 0.65
    dimension.innerChart.T = "auto"
    dimension.innerChart.L = "auto"
    dimension.outerChart.W = window.innerWidth
    dimension.outerChart.H = window.innerHeight
  }

  function userWantsToViewChart(arrYr) {
    isDataContinuityOK.value = false
    const endurl = 'https://home.treasury.gov/resource-center/data-chart-center/interest-rates/TextView?type=daily_treasury_yield_curve&field_tdr_date_value='
    let result = []
    let promises = []

    arrYr.forEach(function(yr, ind) {
      let endpoint = endurl + yr.toString()
      let promis = new Promise((resolve, reject)=> {
        resolve(fetchData('scrapeData', endpoint))
      })
      promises.push(promis)
    })
    Promise.all(promises)
      .then((resp)=> {
        isDataContinuityOK.value = true
        let temp = resp.flat()
        // console.log('all promises settled:', temp);
        rawData.value = temp
        buildChartingData()
        displayChart()
      })
      .catch((err)=> {
        isDataContinuityOK.value = false
        console.error('data discontinuity:', err)
    })
  }

</script>