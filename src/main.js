import './assets/base.css'

import { createApp } from 'vue'
import App from './App.vue'
import { ref } from 'vue'
import { reactive } from 'vue'
const chartData = ref([['Month', '10yr−2yr', '10yr−3mth']])
const rawData = ref(undefined)
const isFetching = ref(false)
const isNotify = reactive({
    msg: undefined,
    isShown: false,
});
const app2 = createApp(App)
app2.provide(/* key */ 'chartData', /* value */ chartData)
app2.provide(/* key */ 'rawData', /* value */ rawData)
app2.provide(/* key */ 'isFetching', /* value */ isFetching)
app2.provide(/* key */ 'isNotify', /* value */ isNotify)
app2.mount('#app')

  // by year = 'https://home.treasury.gov/resource-center/data-chart-center/interest-rates/TextView?type=daily_treasury_yield_curve&field_tdr_date_value=2023'
  // by month = 'https://home.treasury.gov/resource-center/data-chart-center/interest-rates/TextView?type=daily_treasury_yield_curve&field_tdr_date_value_month=202306'

export async function fetchData(fu, endpoint) {
    return await fetch(endpoint)
      .then((response) => response.text())
      .then((data) => { return funcLib[fu](data) })
      .catch((err)=> {
        console.log('fetchERROR:', err)
        return { statusCode: 500, error: JSON.stringify({ error: err}) }
      })
    //   .finally(()=> { 
    //       return {
    //           body: JSON.stringify({msg:'finally promise settled'})
    //       }
    //   })
    }  
    const funcLib = {
        scrapeData : function(data) {
            return structurePerDayObj(
                getRowsFromTable(stringSlicer(data, '<tbody>', '</tbody>'))
            )   
        }
    }
    
    function stringSlicer(string, startMarker, endMarker) {
    if(typeof string == 'string') { 
        let str = string.toString()
        let start = string.indexOf(startMarker)       // remoce whitespaces at both start and end of string
        let end = string.indexOf(endMarker) + endMarker.length
        str = string.slice(start, end)
        str = str.replace(/\s/ig, '')  // remove all whitespace in between
        str = str.trim()
        return str
    } 
    else if(string instanceof Array) {
        console.log('Not a string, but an Array:', string);
        return 'arraY'
    }
    else if( string instanceof Object) {
        console.log('Not a string, but an Object');
        return 'objecT'
    }
    }

    function findQTYofRows(str) {
    let qty = str.match(/<\/tr>/ig)
    return qty.length
    }

    function getRowsFromTable(string) {
        let balstr = string.toString()
        let temp = []
        let qtyOfRows = findQTYofRows(stringSlicer(string, '<tbody>', '</tbody>'))
        console.log('qtyOfRows: ', qtyOfRows);
        for(let i=0; i< qtyOfRows; i++) {
            let obj = { 'rowData' : stringSlicer(balstr, '<tr', '</tr>') }      
            temp.push(obj)
            balstr = balstr.slice(balstr.indexOf('</tr>')+5, balstr.length+1)
            // console.log(balstr);
        }
        return temp
    }

    function structurePerDayObj(arr) {
        let tempArr = []
        arr.forEach((entry, ind)=> {
            let dayObj = {
                'date': getCellData('time', entry.rowData),
                '1mth': getCellData('1month', entry.rowData),
                '2mth': getCellData('2month', entry.rowData),
                '3mth': getCellData('3month', entry.rowData),
                '4mth': getCellData('4month', entry.rowData),
                '6mth': getCellData('6month', entry.rowData),
                '1yr': getCellData('1year', entry.rowData),
                '2yr': getCellData('2year', entry.rowData),
                '3yr': getCellData('3year', entry.rowData),
                '5yr': getCellData('5year', entry.rowData),
                '7yr': getCellData('7year', entry.rowData),
                '10yr': getCellData('10year', entry.rowData),
                '20yr': getCellData('20year', entry.rowData),
                '30yr': getCellData('30year', entry.rowData),
            }
        tempArr.push(dayObj)
        })  // forEach loop
        // console.log(tempArr);
        // rawData.value = tempArr 
        // console.log(rawData.value);
        return tempArr
    } 

    function getCellData(tag, str) {
        if(tag=='time') {
            let marker = '</time>'
            let x = str.slice( str.indexOf(marker)-10, str.indexOf(marker) )
            return x
        }
        else if(tag=='1month') {
            let marker = '<tdclass="bc1monthviews-fieldviews-field-field-bc-1month"headers="view-field-bc-1month-table-column">'
            let x = str.indexOf(marker)
            let y = str.slice(marker.length + x, marker.length + x+8)
            let z = y.replace(/[<td/>]/ig, '')
            return z        
        }
        else if(tag=='2month') {
            let marker = '<tdclass="bc2monthviews-fieldviews-field-field-bc-2month"headers="view-field-bc-2month-table-column">'
            let x = str.indexOf(marker)
            let y = str.slice(marker.length + x, marker.length + x+8)
            let z = y.replace(/[<td/>]/ig, '')
            return z        
        }
        else if(tag=='3month') {
            let marker = '<tdclass="bc3monthviews-fieldviews-field-field-bc-3month"headers="view-field-bc-3month-table-column">'
            let x = str.indexOf(marker)
            let y = str.slice(marker.length + x, marker.length + x+8)
            let z = y.replace(/[<td/>]/ig, '')
            return z        
        }
        else if(tag=='4month') {
            let marker = '<tdclass="bc4monthviews-fieldviews-field-field-bc-4month"headers="view-field-bc-4month-table-column">'
            let x = str.indexOf(marker)
            let y = str.slice(marker.length + x, marker.length + x+8)
            let z = y.replace(/[<td/>]/ig, '')
            return z        
        }
        else if(tag=='6month') {
            let marker = '<tdheaders="view-field-bc-6month-table-column"class="views-fieldviews-field-field-bc-6month">'
            let x = str.indexOf(marker)
            let y = str.slice(marker.length + x, marker.length + x+8)
            let z = y.replace(/[<td/>]/ig, '')
            return z        
        }
        else if(tag=='1year') {
            let marker = '<tdheaders="view-field-bc-1year-table-column"class="views-fieldviews-field-field-bc-1year">'
            let x = str.indexOf(marker)
            let y = str.slice(marker.length + x, marker.length + x+8)
            let z = y.replace(/[<td/>]/ig, '')
            return z        
        }
        else if(tag=='2year') {
            let marker = '<tdheaders="view-field-bc-2year-table-column"class="views-fieldviews-field-field-bc-2year">'
            let x = str.indexOf(marker)
            let y = str.slice(marker.length + x, marker.length + x+8)
            let z = y.replace(/[<td/>]/ig, '')
            return z        
        }
        else if(tag=='3year') {
            let marker = '<tdclass="bc3monthviews-fieldviews-field-field-bc-3year"headers="view-field-bc-3year-table-column">'
            let x = str.indexOf(marker)
            let y = str.slice(marker.length + x, marker.length + x+8)
            let z = y.replace(/[<td/>]/ig, '')
            return z        
        }
        else if(tag=='5year') {
            let marker = '<tdheaders="view-field-bc-5year-table-column"class="views-fieldviews-field-field-bc-5year">'
            let x = str.indexOf(marker)
            let y = str.slice(marker.length + x, marker.length + x+8)
            let z = y.replace(/[<td/>]/ig, '')
            return z        
        }
        else if(tag=='7year') {
            let marker = '<tdheaders="view-field-bc-7year-table-column"class="views-fieldviews-field-field-bc-7year">'
            let x = str.indexOf(marker)
            let y = str.slice(marker.length + x, marker.length + x+8)
            let z = y.replace(/[<td/>]/ig, '')
            return z        
        }
        else if(tag=='10year') {
            let marker = '<tdheaders="view-field-bc-10year-table-column"class="views-fieldviews-field-field-bc-10year">'
            let x = str.indexOf(marker)
            let y = str.slice(marker.length + x, marker.length + x+8)
            let z = y.replace(/[<td/>]/ig, '')
            return z        
        }
        else if(tag=='20year') {
            let marker = '<tdclass="bc20yearviews-fieldviews-field-field-bc-20year"headers="view-field-bc-20year-table-column">'
            let x = str.indexOf(marker)
            let y = str.slice(marker.length + x, marker.length + x+8)
            let z = y.replace(/[<td/>]/ig, '')
            return z        
        }
        else if(tag=='30year') {
            let marker = '<tdclass="bc30yearviews-fieldviews-field-field-bc-30year"headers="view-field-bc-30year-table-column">'
            let x = str.indexOf(marker)
            let y = str.slice(marker.length + x, marker.length + x+8)
            let z = y.replace(/[<td/>]/ig, '')
            return z        
        }
        else {
            return 'invalid'
        }
    }
