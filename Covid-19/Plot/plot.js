// Retrieve CSV data
d3.csv("https://data.humdata.org/hxlproxy/api/data-preview.csv?url=https%3A%2F%2Fraw.githubusercontent.com%2FCSSEGISandData%2FCOVID-19%2Fmaster%2Fcsse_covid_19_data%2Fcsse_covid_19_time_series%2Ftime_series_covid19_confirmed_global.csv&filename=time_series_covid19_confirmed_global.csv").then(function(fulldata) {
  buildPlot(fulldata)
});

// Create empty arrays
var initialdates = [];
var mymontharray = [];
var mydayarray = [];

// Parse desired months/days
function buildPlot(fulldata) {
    console.log(fulldata);
    console.log(fulldata.columns);
    dayArray = [];
    caseArray = [];
    diffArray = [];
    pctArray = [];
    for (i =0; i < fulldata.length; i++) {
      if (i == 225)
      {
        console.log(fulldata[i]);
        console.log("columns:");
        console.log(Object.keys(fulldata[i]));
        for (j = 4; j < fulldata.columns.length; j++)
        {
          dayArray.push(fulldata.columns[j]);
          caseArray.push(fulldata[i][fulldata.columns[j]]);
          if (j == 4)
          {
            diffArray.push(fulldata[i][fulldata.columns[j]]);
            pctArray.push(0);
          }
          else
          {
            diffArray.push(fulldata[i][fulldata.columns[j]] - fulldata[i][fulldata.columns[j-1]]);
            pctArray.push(100 * (fulldata[i][fulldata.columns[j]] / fulldata[i][fulldata.columns[j-1]] - 1) );
          }
        }
      }
    }
    console.log("dayArray:");
    console.log(dayArray);
    console.log("caseArray:");
    console.log(caseArray);
    console.log("diffArray:");
    console.log(diffArray);
    console.log("pctArray");
    console.log(pctArray);
  
    // Set x and y arrays
    var barx = [dayArray, dayArray, dayArray];
    var bary = [caseArray, diffArray, pctArray];

    function makeTrace(i) {
      return {
        x: barx[i],
        y: bary[i],
        type: 'line',
        visible: i === 0,
      };
    }

    var updatemenus = [{
      y: 1,
      yanchor: 'top',
      buttons: [{
      method: 'restyle',
      args: ['visible', [true, false, false]],
      label: 'Total confirmed cases by day'
      }, {
        method: 'restyle',
        args: ['visible', [false, true, false]],
        label: 'New cases by day'
      }, {
        method: 'restyle',
        args: ['visible', [false, false, true]],
        label: 'Percent change by day'
      }]

    }]

    var data = [0, 1, 2].map(makeTrace)

    var layout = {
      updatemenus: updatemenus,
      title: "Confirmed cases by day",
      yaxis: { title: "Confirmed cases" }
    } 

    Plotly.plot('lineplot', data, layout);
    
}